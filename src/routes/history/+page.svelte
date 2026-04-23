<script lang="ts">
    import { onMount } from 'svelte';
    import { Chess } from 'chess.js';
    import { CATEGORY_COLOR } from '$lib/utils/moveCategories';
    import { i18n } from '$lib/stores/langStore';
	import { formatTime } from '$lib/utils/timeFormat';

	// ── Types ─────────────────────────────────────────────────────────────────
	interface Move {
		san: string;
		fen: string;
		category: string;
		value: number;
		evalCp: number;
	}
	interface GameMeta {
		session_id: string;
		username: string;
		match_number: number;
		chess_type: string;
		time_base: number;
		time_increment_sec: number;
		ai_skill_level: number;
		timestamp: string;
		moves_count: number;
		termination_reason: string;
		time_control: string;
	}
	interface Game { metadata: GameMeta; data: Move[]; }

	const GLYPH: Record<string, string> = {
		best: '!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??',
	};

	// ── State ─────────────────────────────────────────────────────────────────
	let games        = $state<Game[]>([]);
	let selected     = $state<Game | null>(null);
	let reviewIndex  = $state<number | null>(null);
	let loading      = $state(true);
	let board: any;

	// ── avgCPL ────────────────────────────────────────────────────────────────
	function avgCPL(moves: Move[]): number {
		if (!moves.length) return 0;
		let total = 0;
		for (let i = 0; i < moves.length; i++) {
			const prev = i === 0 ? 0 : moves[i - 1].evalCp;
			total += Math.max(0, prev - moves[i].evalCp);
		}
		return Math.round(total / moves.length);
	}

	function cplOf(moves: Move[], i: number): number {
		const prev = i === 0 ? 0 : moves[i - 1].evalCp;
		return Math.max(0, prev - moves[i].evalCp);
	}

	// ── Time control formatter ────────────────────────────────────────────────
	function formatTimeControl(meta: GameMeta): string {
		if (meta.time_base == null) return meta.time_control ?? meta.chess_type;
		const baseMin = meta.time_base / 60;
		const baseStr = Number.isInteger(baseMin) ? String(baseMin) : baseMin.toFixed(1);
		return `${baseStr}+${meta.time_increment_sec}`;
	}

	// ── Board helpers ─────────────────────────────────────────────────────────
	function initBoard() {
		if (typeof window === 'undefined' || !(window as any).Chessboard) return;
		if (board) { board.destroy(); board = null; }

		board = (window as any).Chessboard('review-board', {
			draggable:  false,
			position:   'start',
			pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
		});
	}

	function applyCheckHighlight(fen: string) {
		document.querySelectorAll('#review-board .hl-check')
			.forEach(el => el.classList.remove('hl-check'));

		const pos = new Chess(fen);
		if (!pos.inCheck()) return;

		const turn = pos.turn();
		pos.board().forEach((rank, r) => {
			rank.forEach((piece, c) => {
				if (piece?.type === 'k' && piece.color === turn) {
					const sq = `${String.fromCharCode(97 + c)}${8 - r}`;
					document.querySelector(`#review-board .square-${sq}`)?.classList.add('hl-check');
				}
			});
		});
	}

	function showPosition(fen: string) {
		if (!board) return;
		board.position(fen, false);
		setTimeout(() => applyCheckHighlight(fen), 60);
	}

	// ── Game selection ────────────────────────────────────────────────────────
	async function selectGame(game: Game) {
		selected    = game;
		reviewIndex = null;

		await new Promise(r => setTimeout(r, 50));
		initBoard();
		showPosition('start');
	}

	function selectMove(i: number) {
		if (!selected) return;
		reviewIndex = reviewIndex === i ? null : i;
		const fen = reviewIndex !== null
			? selected.data[reviewIndex].fen
			: 'start';
		showPosition(fen);
	}

	function stepMove(delta: number) {
		if (!selected) return;
		const next = (reviewIndex ?? -1) + delta;
		if (next >= 0 && next < selected.data.length) selectMove(next);
	}

	function closeReview() {
		selected = null;
		reviewIndex = null;
		if (board) { board.destroy(); board = null; }
	}

	// ── Load games ────────────────────────────────────────────────────────────
	onMount(async () => {
		const res = await fetch('/api/export');
		games   = await res.json();
		loading = false;
	});
</script>

<div class="page">

	<!-- ── Header ──────────────────────────────────────────────────────────── -->
	<div class="header">
		<a href="/" class="back">{$i18n.hist_back}</a>
		<h1 class="title">{$i18n.hist_title}</h1>
	</div>

	{#if loading}
		<p class="empty">$i18n.hist_loading</p>

	{:else if !selected}
		<!-- ── Game list ──────────────────────────────────────────────────── -->
		{#if games.length === 0}
			<p class="empty">{$i18n.hist_empty}</p>
		{:else}
			<div class="game-list">
				{#each games as g}
					{@const cpl = avgCPL(g.data)}
					<button class="game-card" onclick={() => selectGame(g)}>
						<div class="card-top">
							<span class="card-user">{g.metadata.username}</span>
							<span class="card-match">Match #{g.metadata.match_number}</span>
							<span class="card-result" class:win={g.metadata.termination_reason === 'status_timeout_player'} class:loss={g.metadata.termination_reason === 'status_timeout_ai' || g.metadata.termination_reason === 'status_checkmate'}>
								{($i18n as Record<string,string>)[g.metadata.termination_reason] ?? g.metadata.termination_reason}
							</span>
						</div>
						<div class="card-meta">
							<span>{g.metadata.chess_type}</span>
							<span>·</span>
							<span class="tc-badge">{formatTimeControl(g.metadata)}</span>
							<span>·</span>
							<span>Skill {g.metadata.ai_skill_level}</span>
							<span>·</span>
							<span>{g.data.length} moves</span>
							<span>·</span>
							<span class="cpl" class:cpl-good={cpl < 60} class:cpl-mid={cpl >= 60 && cpl < 150} class:cpl-bad={cpl >= 150}>
								avgCPL {cpl}
							</span>
						</div>
						<div class="card-ts">{new Date(g.metadata.timestamp).toLocaleString()}</div>
					</button>
				{/each}
			</div>
		{/if}

	{:else}
		<!-- ── Review mode ────────────────────────────────────────────────── -->
		<div class="review">

			<!-- Board column -->
			<div class="review-left">
				<div class="review-header">
					<button class="back-btn" onclick={closeReview}>{$i18n.hist_all}</button>
					<span class="review-title">
						{selected.metadata.username} · Match #{selected.metadata.match_number} · {selected.metadata.chess_type} · {formatTimeControl(selected.metadata)}
					</span>
				</div>

				<div id="review-board" class="review-board"></div>

				<!-- Nav bar -->
				<div class="nav-bar">
					<button class="nav-btn" disabled={reviewIndex === null || reviewIndex === 0} onclick={() => stepMove(-1)}>‹</button>

					<span class="nav-label">
						{#if reviewIndex !== null}
							Move {reviewIndex + 1} of {selected.data.length}
							— <strong>{selected.data[reviewIndex].san}</strong>
						{:else}
							{$i18n.hist_start}
						{/if}
					</span>

					<button class="nav-btn" disabled={reviewIndex === selected.data.length - 1} onclick={() => stepMove(1)}>›</button>
				</div>

				<!-- Game summary -->
				<div class="summary">
					<div class="summary-row">
						<span class="summary-label">{$i18n.hist_result}</span>
						<span class="summary-val">{($i18n as Record<string,string>)[selected.metadata.termination_reason] ?? selected.metadata.termination_reason}</span>
					</div>
					<div class="summary-row">
					    <span class="summary-label">{$i18n.hist_time}</span>
					    <span class="summary-val">
					        {formatTime(selected.metadata.time_base)} + {selected.metadata.time_increment_sec}s
					    </span>
					</div>
					<div class="summary-row">
						<span class="summary-label">avgCPL</span>
						<span class="summary-val">{avgCPL(selected.data)}</span>
					</div>
					<div class="summary-row">
						<span class="summary-label">{$i18n.hist_moves}</span>
						<span class="summary-val">{selected.data.length}</span>
					</div>
					<div class="summary-row">
						<span class="summary-label">{$i18n.hist_played}</span>
						<span class="summary-val">{new Date(selected.metadata.timestamp).toLocaleString()}</span>
					</div>
				</div>
			</div>

			<!-- Move log column -->
			<div class="review-right">
				<div class="log-header">
					<span class="log-title">{$i18n.hist_analysis}</span>
					<span class="log-cpl">avgCPL {avgCPL(selected.data)}</span>
				</div>

				<div class="log-scroll">
					{#each selected.data as move, i}
						{@const cpl = cplOf(selected.data, i)}
						<button
							class="log-row"
							class:selected={reviewIndex === i}
							onclick={() => selectMove(i)}
						>
							<span class="log-num">{i + 1}.</span>
							<span class="log-san">{move.san}</span>

							{#if GLYPH[move.category]}
								<span class="log-glyph" style="color:{(CATEGORY_COLOR as Record<string,string>)[move.category]}">{GLYPH[move.category]}</span>
							{/if}

							<span class="log-cat" style="color:{(CATEGORY_COLOR as Record<string,string>)[move.category]}">{move.category}</span>

							<span class="log-eval">{move.evalCp > 0 ? '+' : ''}{(move.evalCp / 100).toFixed(2)}</span>

							<span class="log-cpl-cell" title="Centipawn loss for this move">−{cpl}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* ── Lichess palette ────────────────────────────────────── */
	:global(body) { margin: 0; font-family: 'Noto Sans', 'Segoe UI', Arial, sans-serif; font-size: 14px; background: #161512; color: #bababa; -webkit-font-smoothing: antialiased; }
	:global(*, *::before, *::after) { box-sizing: border-box; }

	.page { padding: 24px; max-width: 900px; margin: 0 auto; }

	/* ── Header ─────────────────────────────────────────────── */
	.header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,.1); padding-bottom: 16px; }
	.back   { color: #629924; font-size: .85rem; text-decoration: none; }
	.back:hover { text-decoration: underline; }
	.title  { margin: 0; font-size: 1.3rem; font-weight: 700; color: #d4d4d4; }

	.empty  { color: #555; text-align: center; margin-top: 60px; }

	/* ── Game list ───────────────────────────────────────────── */
	.game-list { display: flex; flex-direction: column; gap: 8px; }

	.game-card {
		background: #262421;
		border: 1px solid rgba(255,255,255,.08);
		border-radius: 5px;
		padding: 14px 16px;
		cursor: pointer;
		text-align: left;
		transition: border-color .15s, background .15s;
		width: 100%;
	}
	.game-card:hover { border-color: #629924; background: #2a2825; }

	.card-top  { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
	.card-user { font-weight: 700; color: #d4d4d4; font-size: .95rem; }
	.card-match { color: #555; font-size: .8rem; }
	.card-result { margin-left: auto; font-size: .82rem; font-weight: 600; color: #bababa; }
	.card-result.win  { color: #629924; }
	.card-result.loss { color: #cc1900; }

	.card-meta { display: flex; gap: 8px; font-size: .78rem; color: #666; margin-bottom: 4px; }
	.card-ts   { font-size: .72rem; color: #444; font-family: monospace; }

	.tc-badge { font-family: monospace; color: #bababa; }

	.cpl      { font-family: monospace; }
	.cpl-good { color: #629924; }
	.cpl-mid  { color: #e6a01a; }
	.cpl-bad  { color: #cc1900; }

	/* ── Review layout ───────────────────────────────────────── */
	.review { display: flex; gap: 24px; align-items: flex-start; }

	/* ── Board column ────────────────────────────────────────── */
	.review-left { flex-shrink: 0; width: 420px; }

	.review-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
	.back-btn {
		background: none; border: 1px solid rgba(255,255,255,.1);
		color: #629924; border-radius: 4px; padding: 4px 10px;
		font-size: .8rem; cursor: pointer; transition: background .12s;
	}
	.back-btn:hover { background: #1c1b18; }
	.review-title { font-size: .82rem; color: #7f7f7f; }

	.review-board { width: 420px; border: 1px solid rgba(255,255,255,.08); border-radius: 2px; margin-bottom: 10px; }

	/* ── Nav bar ─────────────────────────────────────────────── */
	.nav-bar { display: flex; align-items: center; gap: 8px; background: #262421; border: 1px solid rgba(255,255,255,.1); border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; }
	.nav-btn {
		background: #1c1b18; border: 1px solid rgba(255,255,255,.1);
		color: #bababa; width: 28px; height: 28px;
		border-radius: 3px; cursor: pointer; font-size: 1.1rem;
		display: flex; align-items: center; justify-content: center;
		transition: background .12s;
	}
	.nav-btn:hover:not(:disabled) { background: #629924; color: #fff; border-color: #508020; }
	.nav-btn:disabled { opacity: .25; cursor: default; }
	.nav-label { flex: 1; text-align: center; font-size: .82rem; color: #bababa; font-family: monospace; }

	/* ── Summary box ─────────────────────────────────────────── */
	.summary { background: #1c1b18; border: 1px solid rgba(255,255,255,.08); border-radius: 4px; padding: 12px 14px; }
	.summary-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,.05); font-size: .83rem; }
	.summary-row:last-child { border-bottom: none; }
	.summary-label { color: #666; }
	.summary-val   { color: #d4d4d4; font-family: monospace; }

	/* ── Move log column ─────────────────────────────────────── */
	.review-right { flex: 1; border-left: 1px solid rgba(255,255,255,.1); padding-left: 16px; }

	.log-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
	.log-title  { font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #d4d4d4; }
	.log-cpl    { font-size: .72rem; color: #555; font-family: monospace; }

	.log-scroll { height: 560px; overflow-y: auto; }

	.log-row {
		display: flex; align-items: baseline; gap: 5px;
		padding: 6px 4px; border-bottom: 1px solid #1c1b18;
		border-left: 2px solid transparent; border-radius: 3px;
		font-family: monospace; font-size: .86rem;
		width: 100%; background: transparent; color: inherit;
		cursor: pointer; text-align: left;
		transition: background .1s, border-left-color .1s;
	}
	.log-row:hover    { background: #1c1b18; }
	.log-row.selected { background: #1e2a14; border-left-color: #629924; }

	.log-num      { color: #444; width: 22px; flex-shrink: 0; }
	.log-san      { font-weight: 700; color: #d4d4d4; min-width: 44px; }
	.log-glyph    { font-weight: 900; font-size: .92rem; }
	.log-cat      { font-size: .76rem; flex: 1; text-transform: capitalize; }
	.log-eval     { color: #666; font-size: .76rem; }
	.log-cpl-cell { color: #444; font-size: .72rem; margin-left: 4px; }

	/* ── King in check ───────────────────────────────────────── */
	:global(#review-board .hl-check) {
		background: radial-gradient(ellipse at center,
			rgba(255,0,0,.9) 0%, rgba(204,0,0,.7) 40%, rgba(180,0,0,0) 70%
		) !important;
	}
	:global(#review-board [class^="square-"], #review-board [class*=" square-"]) {
		position: relative;
	}
</style>
