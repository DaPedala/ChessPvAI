<script lang="ts">
    import { gameStore } from '$lib/stores/gameStore.svelte';
    import { CATEGORY_COLOR } from '$lib/utils/moveCategories';
    import { i18n } from '$lib/stores/langStore';

    const GLYPH: Record<string, string> = {
        best: '!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??',
    };
</script>

<div class="log-col">
    <div class="log-header">
        <span class="log-title">{$i18n.log_title}</span>
        <span class="log-match">Match #{gameStore.activeMatchNumber}</span>
    </div>

    {#if gameStore.selectedMoveIndex !== null}
        <div class="replay-bar">
            <button
                class="replay-nav"
                disabled={gameStore.selectedMoveIndex === 0}
                onclick={() => gameStore.selectMove(gameStore.selectedMoveIndex! - 1)}
            >‹</button>

            <span class="replay-label">
                Move {gameStore.selectedMoveIndex + 1} {$i18n.log_move_of} {gameStore.moveHistoryJSON.length}
            </span>

            <button
                class="replay-nav"
                disabled={gameStore.selectedMoveIndex === gameStore.moveHistoryJSON.length - 1}
                onclick={() => gameStore.selectMove(gameStore.selectedMoveIndex! + 1)}
            >›</button>

            <button class="replay-live" onclick={() => gameStore.selectMove(gameStore.selectedMoveIndex!)}>
                {$i18n.log_live}
            </button>
        </div>
    {/if}

    <div class="log-scroll">
        {#each gameStore.moveHistoryJSON as record, i}
            <button
                class="log-row"
                class:selected={gameStore.selectedMoveIndex === i}
                onclick={() => gameStore.selectMove(i)}
                title="View position after {record.san}"
            >
                <span class="log-num">{i + 1}.</span>
                <span class="log-san">{record.san}</span>

                {#if GLYPH[record.category]}
                    <span class="log-glyph" style="color:{CATEGORY_COLOR[record.category]}">
                        {GLYPH[record.category]}
                    </span>
                {/if}

                <span class="log-cat" style="color:{CATEGORY_COLOR[record.category]}">
                    {record.category}
                </span>

                <span class="log-eval">
                    {record.evalCp > 0 ? '+' : ''}{(record.evalCp / 100).toFixed(2)}
                </span>
            </button>
        {/each}

        {#if gameStore.moveHistoryJSON.length === 0}
            <p class="log-empty">{$i18n.log_empty}</p>
        {/if}
    </div>
</div>

<style>
	.log-col { width: 260px; border-left: 1px solid rgba(255,255,255,.1); padding-left: 16px; animation: slideIn .25s ease; flex-shrink: 0; }
	@keyframes slideIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }

	.log-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
	.log-title  { font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #d4d4d4; }
	.log-match  { font-size: .72rem; color: #555; }

	/* ── Replay nav bar ────────────────────────────────────── */
	.replay-bar {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #1c1b18;
		border: 1px solid rgba(255,255,255,.1);
		border-radius: 4px;
		padding: 6px 8px;
		margin-bottom: 8px;
	}
	.replay-nav {
		background: #262421;
		border: 1px solid rgba(255,255,255,.1);
		color: #bababa;
		width: 26px; height: 26px;
		border-radius: 3px;
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		display: flex; align-items: center; justify-content: center;
		transition: background .12s;
		flex-shrink: 0;
	}
	.replay-nav:hover:not(:disabled) { background: #629924; color: #fff; border-color: #508020; }
	.replay-nav:disabled { opacity: .3; cursor: default; }
	.replay-label { flex: 1; text-align: center; font-size: .78rem; color: #bababa; font-family: monospace; }
	.replay-live {
		background: transparent;
		border: 1px solid rgba(255,255,255,.15);
		color: #7f7f7f;
		border-radius: 3px;
		padding: 3px 7px;
		font-size: .72rem;
		cursor: pointer;
		transition: color .12s, border-color .12s;
		flex-shrink: 0;
	}
	.replay-live:hover { color: #d4d4d4; border-color: rgba(255,255,255,.35); }

	/* ── Move rows ─────────────────────────────────────────── */
	.log-scroll { height: 480px; overflow-y: auto; }

	.log-row {
		display: flex;
		align-items: baseline;
		gap: 5px;
		padding: 6px 4px;
		border-bottom: 1px solid #1c1b18;
		border-radius: 3px;
		font-family: monospace;
		font-size: .86rem;
		width: 100%;
		background: transparent;
		border-left: 2px solid transparent;
		color: inherit;
		cursor: pointer;
		text-align: left;
		transition: background .1s, border-left-color .1s;
	}
	.log-row:hover    { background: #1c1b18; }
	.log-row.selected {
		background: #1e2a14;                  /* dark green tint — lichess review style */
		border-left-color: #629924;
	}

	.log-num   { color: #444; width: 22px; flex-shrink: 0; }
	.log-san   { font-weight: 700; color: #d4d4d4; }
	.log-glyph { font-weight: 900; font-size: .92rem; }
	.log-cat   { font-size: .76rem; flex: 1; text-transform: capitalize; }
	.log-eval  { color: #666; font-size: .76rem; margin-left: auto; }

	.log-empty { color: #444; font-size: .85rem; margin-top: 24px; text-align: center; }
</style>
