import { Chess } from 'chess.js';
import type { GamePhase, EvaluatedMove, LastConfig } from '$lib/types';
import { categorizeMove } from '$lib/utils/moveCategories';
import { exportGame } from '$lib/utils/exportService';

/** Returns ISO-8601 timestamp in local time with correct UTC offset. */
function localISOString(): string {
	const now    = new Date();
	const offset = -now.getTimezoneOffset();
	const sign   = offset >= 0 ? '+' : '-';
	const pad    = (n: number) => String(Math.abs(n)).padStart(2, '0');
	const hh     = pad(Math.floor(Math.abs(offset) / 60));
	const mm     = pad(Math.abs(offset) % 60);
	const local  = new Date(now.getTime() + offset * 60000);
	return local.toISOString().replace('Z', `${sign}${hh}:${mm}`);
}

class GameStore {
	game = new Chess();

	currentPhase  = $state<GamePhase>('MENU');
	statusText    = $state('Awaiting Configuration');

	moveHistoryJSON   = $state<EvaluatedMove[]>([]);
	previousEval      = $state(0);
	hasExported       = $state(false);

	/** Index of the move being previewed in the log, or null = live position. */
	selectedMoveIndex = $state<number | null>(null);

	sessionUsername   = $state('Player1');
	matchCounter      = $state(1);
	activeMatchNumber = $state(1);
	activeChessType   = $state('Unknown');
	lastConfig        = $state<LastConfig>({ base: 0, inc: 0, type: '' });

	playerTime    = $state(0);
	aiTime        = $state(0);
	timeIncrement = $state(0);
	isPlayerTurn  = $state(true);
	aiSkillLevel  = $state(20);

	private timerInterval: ReturnType<typeof setInterval> | null = null;

	startGame(base: number, inc: number, type: string) {
		if (!this.sessionUsername.trim()) {
			alert('Identity required before starting a game.');
			return;
		}
		this.lastConfig        = { base, inc, type };
		this.activeMatchNumber = this.matchCounter;
		this.playerTime        = base;
		this.aiTime            = base;
		this.timeIncrement     = inc;
		this.activeChessType   = type;
		this.currentPhase      = 'PLAYING';
		this.statusText        = `Your turn  ·  AI Level ${this.aiSkillLevel}`;
	}

	startClock() {
		if (this.timerInterval) return;   // idempotent — only start once
		this.timerInterval = setInterval(() => {
			if (this.currentPhase === 'TERMINATED') { this.stopClock(); return; }
			if (this.isPlayerTurn) {
				this.playerTime--;
				if (this.playerTime <= 0) this.handleTermination('Timeout: AI Wins');
			} else {
				this.aiTime--;
				if (this.aiTime <= 0) this.handleTermination('Timeout: Player Wins');
			}
		}, 1000);
	}

	stopClock() {
		if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
	}

	handleTermination(reason: string) {
		this.statusText   = reason;
		this.currentPhase = 'TERMINATED';
		this.stopClock();
		this.triggerAutoExport();
	}

	updateStatus() {
		if (this.game.isGameOver()) {
			if      (this.game.isCheckmate()) this.handleTermination('Checkmate!');
			else if (this.game.isDraw())      this.handleTermination('Draw!');
			else                              this.handleTermination('Game Over');
		} else {
			this.statusText = this.isPlayerTurn ? 'Your turn' : 'AI is thinking…';
		}
	}

	recordPlayerMove(san: string, rawEval: number) {
		// Capture FEN after the move has already been applied to this.game
		const fen = this.game.fen();

		const perspectiveEval = this.game.turn() === 'b' ? -rawEval : rawEval;
		const cpl = Math.max(0, this.previousEval - perspectiveEval);
		const { category, value } = categorizeMove(cpl);

		this.moveHistoryJSON.push({ san, fen, category, value, evalCp: perspectiveEval });
		this.previousEval = perspectiveEval;

		// Always stay on live position while game is in progress
		this.selectedMoveIndex = null;
	}

	/**
	 * Called by MoveLog when user clicks a move row.
	 * Clicking the already-selected move deselects (returns to live board).
	 */
	selectMove(index: number) {
		if (this.selectedMoveIndex === index) {
			// Deselect → return to live → resume clock
			this.selectedMoveIndex = null;
			if (this.currentPhase === 'PLAYING') {
				this.startClock();
				this.statusText = this.isPlayerTurn ? 'Your turn' : 'AI is thinking…';
			}
		} else {
			// Enter replay → pause clock
			this.selectedMoveIndex = index;
			this.stopClock();
			if (this.currentPhase === 'PLAYING') {
				this.statusText = `Reviewing move ${index + 1} — paused`;
			}
		}
	}

	/** FEN to display — either the selected historical position or the live board. */
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
        const file = await exportGame(
            {
                session_id:         crypto.randomUUID(),
                username:           this.sessionUsername.trim(),
                match_number:       this.activeMatchNumber,
                chess_type:         this.activeChessType,
                time_base:          this.lastConfig.base,           // ← ADD
                time_increment_sec: this.lastConfig.inc,            // ← ADD
                ai_skill_level:     this.aiSkillLevel,
                timestamp:          localISOString(),
                moves_count:        this.moveHistoryJSON.length,
                termination_reason: this.statusText,
                time_control:       `${this.playerTime} base | ${this.timeIncrement} inc`
            },
            this.moveHistoryJSON
        );	
			console.log(`[ETL SUCCESS]: /data/${file}`);
			this.matchCounter++;
		} catch (e) {
			console.error('[ETL FATAL]:', e);
			this.hasExported = false;
		}
	}

	clearBoardState() {
		this.game.reset();
		this.moveHistoryJSON  = [];
		this.previousEval     = 0;
		this.hasExported      = false;
		this.isPlayerTurn     = true;
		this.selectedMoveIndex = null;
		this.stopClock();
	}

	executeRematch() {
		this.clearBoardState();
		this.startGame(this.lastConfig.base, this.lastConfig.inc, this.lastConfig.type);
	}

	goToMenu() {
		this.clearBoardState();
		this.currentPhase = 'MENU';
		this.statusText   = 'Awaiting Configuration';
	}
}

export const gameStore = new GameStore();
