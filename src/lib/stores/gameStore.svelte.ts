import { Chess } from 'chess.js';
import type { GamePhase, EvaluatedMove, LastConfig, ChessColor } from '$lib/types';
import { categorizeMove } from '$lib/utils/moveCategories';
import { exportGame } from '$lib/utils/exportService';

import { t } from '$lib/lang';

function localISOString(): string {
	const now = new Date();
	const offset = -now.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
	const hh = pad(Math.floor(Math.abs(offset) / 60));
	const mm = pad(Math.abs(offset) % 60);
	const local = new Date(now.getTime() + offset * 60000);
	return local.toISOString().replace('Z', `${sign}${hh}:${mm}`);
}

class GameStore {
	game = new Chess();
	currentPhase = $state<GamePhase>('MENU');
	statusKey = $state<keyof typeof t.en>('status_awaiting');
	moveHistoryJSON = $state<EvaluatedMove[]>([]);

	// Always White-centric. Starts at ~20cp (White's opening advantage)
	previousEval = $state(20);

	hasExported = $state(false);
	selectedMoveIndex = $state<number | null>(null);

	// Set from the play page server load — identifies the logged-in user
	displayName = $state('');
	userId = $state('');

	matchCounter = $state(1);
	activeMatchNumber = $state(1);
	activeChessType = $state('Unknown');
	lastConfig = $state<LastConfig>({ base: 0, inc: 0, type: '' });

	playerTime = $state(0);
	aiTime = $state(0);
	timeIncrement = $state(0);
	isPlayerTurn = $state(true);
	playerColor = $state<ChessColor>('w');
	aiSkillLevel = $state(20);

	private timerInterval: ReturnType<typeof setInterval> | null = null;

	startGame(base: number, inc: number, type: string, color: ChessColor | 'random' = 'w') {
		this.playerColor = color === 'random' ? (Math.random() > 0.5 ? 'w' : 'b') : color;
		this.lastConfig = { base, inc, type };
		this.activeMatchNumber = this.matchCounter;
		this.playerTime = base;
		this.aiTime = base;
		this.timeIncrement = inc;
		this.activeChessType = type;
		this.currentPhase = 'PLAYING';
		this.isPlayerTurn = (this.playerColor === 'w');
		this.statusKey = this.isPlayerTurn ? 'status_your_turn' : 'status_ai_thinking';
		this.previousEval = 20;
	}

	startClock() {
		if (this.timerInterval) return;
		this.timerInterval = setInterval(() => {
			if (this.currentPhase === 'TERMINATED') { this.stopClock(); return; }
			if (this.isPlayerTurn) {
				this.playerTime--;
				if (this.playerTime <= 0) this.handleTermination('status_timeout_ai');
			} else {
				this.aiTime--;
				if (this.aiTime <= 0) this.handleTermination('status_timeout_player');
			}
		}, 1000);
	}

	stopClock() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}
	}

	handleTermination(key: keyof typeof t.en) {
		this.statusKey = key;
		this.currentPhase = 'TERMINATED';
		this.stopClock();
		this.triggerAutoExport();
	}

	updateStatus() {
		if (this.game.isGameOver()) {
			if (this.game.isCheckmate()) this.handleTermination('status_checkmate');
			else if (this.game.isDraw()) this.handleTermination('status_draw');
			else this.handleTermination('status_game_over');
		} else {
			this.statusKey = this.isPlayerTurn ? 'status_your_turn' : 'status_ai_thinking';
		}
	}

	recordPlayerMove(san: string, currentEvalWhite: number) {
		// Since .move() was already called on the chess object,
		// the color who JUST moved is the opposite of the current turn.
		const movedColor = this.game.turn() === 'w' ? 'b' : 'w';

		// Categorize using the delta between previous state and current state
		const { category, value } = categorizeMove(currentEvalWhite, this.previousEval, movedColor);

		this.moveHistoryJSON.push({
			san,
			fen: this.game.fen(),
			category,
			value,
			evalCp: currentEvalWhite
		});

		this.previousEval = currentEvalWhite;
		this.selectedMoveIndex = null;
	}

	selectMove(index: number) {
		if (this.selectedMoveIndex === index) {
			this.selectedMoveIndex = null;
			if (this.currentPhase === 'PLAYING') this.startClock();
		} else {
			this.selectedMoveIndex = index;
			this.stopClock();
		}
	}

	get displayFen(): string {
		if (this.selectedMoveIndex !== null && this.moveHistoryJSON[this.selectedMoveIndex]) {
			return this.moveHistoryJSON[this.selectedMoveIndex].fen;
		}
		return this.game.fen();
	}

	async triggerAutoExport() {
		if (this.hasExported || this.moveHistoryJSON.length === 0) return;
		this.hasExported = true;
		try {
			await exportGame(
				{
					session_id: crypto.randomUUID(),
					match_number: this.activeMatchNumber,
					chess_type: this.activeChessType,
					time_base: this.lastConfig.base,
					time_increment_sec: this.lastConfig.inc,
					ai_skill_level: this.aiSkillLevel,
					timestamp: localISOString(),
					moves_count: this.moveHistoryJSON.length,
					termination_reason: this.statusKey,
					time_control: `${this.lastConfig.base/60}+${this.lastConfig.inc}`
				},
				this.moveHistoryJSON
			);
			this.matchCounter++;
		} catch (e) {
			console.error('[ETL FATAL]:', e);
			this.hasExported = false;
		}
	}

	clearBoardState() {
		this.game.reset();
		this.moveHistoryJSON = [];
		this.previousEval = 20;
		this.hasExported = false;
		this.selectedMoveIndex = null;
		this.stopClock();
	}

	executeRematch() {
		const oldColor = this.playerColor;
		const config = { ...this.lastConfig };
		this.clearBoardState();
		this.startGame(config.base, config.inc, config.type, oldColor === 'w' ? 'b' : 'w');
	}

	goToMenu() {
		this.clearBoardState();
		this.currentPhase = 'MENU';
		this.statusKey = 'status_awaiting';
	}
}

export const gameStore = new GameStore();
