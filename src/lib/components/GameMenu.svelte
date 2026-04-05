<script lang="ts">
    import { gameStore } from '$lib/stores/gameStore.svelte';
    import { TIME_CONTROLS } from '$lib/constants';

    let showCustomForm   = $state(false);
    let customMinutes    = $state(10);
    let customIncSeconds = $state(0);
    let selectedSide     = $state<'w' | 'b' | 'random'>('w');

    function handleTimeControl(base: number, inc: number, type: string) {
        if (base === -1) { showCustomForm = true; return; }
        gameStore.startGame(base, inc, type, selectedSide);
    }

    function startCustomGame() {
        gameStore.startGame(customMinutes * 60, customIncSeconds, 'Custom', selectedSide);
        showCustomForm = false;
    }
</script>

<div class="menu-container">
    <div class="config-section">
        <label for="username" class="field-label">Username</label>
        <input type="text" id="username" bind:value={gameStore.sessionUsername} class="text-input" placeholder="Enter your username…" />
    </div>

    <div class="config-section">
        <label for="skillLevel" class="field-label">
            AI Strength
            <span class="skill-value">
                {gameStore.aiSkillLevel === 20 ? 'Maximum' : gameStore.aiSkillLevel === 0 ? 'Beginner' : `Level ${gameStore.aiSkillLevel}`}
            </span>
        </label>
        <input type="range" id="skillLevel" min="0" max="20" bind:value={gameStore.aiSkillLevel} class="range-slider" />
    </div>

    <div class="config-section">
        <label class="field-label">Play as</label>
        <div class="side-picker">
            <button class="side-btn" class:active={selectedSide === 'w'} onclick={() => selectedSide = 'w'}>White</button>
            <button class="side-btn" class:active={selectedSide === 'random'} onclick={() => selectedSide = 'random'}>Random</button>
            <button class="side-btn" class:active={selectedSide === 'b'} onclick={() => selectedSide = 'b'}>Black</button>
        </div>
    </div>

    {#if !showCustomForm}
        <div class="tc-grid">
            {#each TIME_CONTROLS as tc}
                <button class="tc-btn" onclick={() => handleTimeControl(tc.base, tc.inc, tc.type)}>
                    <span class="tc-label">{tc.label}</span>
                    <span class="tc-type">{tc.type}</span>
                </button>
            {/each}
        </div>
    {:else}
        <div class="custom-form">
            <p class="custom-title">Custom time control</p>
            <div class="input-group">
                <label for="customMin">Minutes per side</label>
                <input type="number" id="customMin" min="1" max="180" bind:value={customMinutes} />
            </div>
            <div class="input-group">
                <label for="customInc">Increment (seconds)</label>
                <input type="number" id="customInc" min="0" max="180" bind:value={customIncSeconds} />
            </div>
            <div class="form-actions">
                <button class="btn btn-secondary" onclick={() => showCustomForm = false}>Cancel</button>
                <button class="btn btn-primary" onclick={startCustomGame}>Start game</button>
            </div>
        </div>
    {/if}
</div>

<style>
    :root {
        --c-bg: #161512; --c-bg-2: #262421; --c-bg-3: #1c1b18;
        --c-border: rgba(255,255,255,.1);
        --c-font: #bababa; --c-font-dim: #7f7f7f; --c-font-top: #d4d4d4;
        --c-accent: #629924; --c-accent-h: #508020;
    }
    .menu-container { background: var(--c-bg-2); border: 1px solid var(--c-border); border-radius: 6px; padding: 20px; }
    .config-section { margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--c-border); }
    .field-label { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--c-font-dim); }
    .side-picker { display: flex; gap: 4px; background: var(--c-bg-3); padding: 4px; border-radius: 4px; }
    .side-btn { flex: 1; padding: 8px; background: transparent; border: none; border-radius: 3px; color: var(--c-font-dim); font-size: .8rem; font-weight: 700; cursor: pointer; transition: all .1s; }
    .side-btn.active { background: var(--c-bg-2); color: var(--c-accent); box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
    .skill-value { color: var(--c-accent); font-weight: 700; text-transform: none; letter-spacing: 0; font-size: .88rem; }
    .text-input { width: 100%; padding: 9px 12px; background: var(--c-bg-3); border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-font-top); font-family: monospace; font-size: .95rem; box-sizing: border-box; outline: none; transition: border-color .15s; }
    .text-input:focus { border-color: var(--c-accent); }
    .range-slider { width: 100%; cursor: pointer; accent-color: var(--c-accent); }
    .tc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .tc-btn { background: var(--c-bg-3); color: var(--c-font); border: 1px solid transparent; border-radius: 4px; padding: 14px 4px 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; box-shadow: 0 2px 0 rgba(0,0,0,.45); transition: background .12s, border-color .12s, color .12s; }
    .tc-btn:hover { background: var(--c-accent); border-color: var(--c-accent-h); color: #fff; }
    .tc-btn:active { transform: translateY(2px); box-shadow: none; }
    .tc-label { font-size: 1.35rem; font-weight: 700; line-height: 1; }
    .tc-type  { font-size: .72rem; opacity: .65; text-transform: capitalize; }
    .custom-form { background: var(--c-bg-3); border-radius: 4px; padding: 18px; }
    .custom-title { margin: 0 0 16px; font-weight: 700; color: var(--c-font-top); font-size: 1rem; }
    .input-group { margin-bottom: 14px; }
    .input-group label { display: block; margin-bottom: 5px; color: var(--c-font-dim); font-size: .83rem; }
    .input-group input { width: 100%; padding: 9px 12px; background: var(--c-bg-2); border: 1px solid var(--c-border); border-radius: 4px; color: var(--c-font-top); font-family: monospace; font-size: 1.05rem; box-sizing: border-box; outline: none; transition: border-color .15s; }
    .input-group input:focus { border-color: var(--c-accent); }
    .form-actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn { flex: 1; padding: 11px; border-radius: 4px; border: 1px solid transparent; font-weight: 700; font-size: .9rem; cursor: pointer; transition: background .15s; }
    .btn-primary { background: var(--c-accent); color: #fff; border-color: var(--c-accent-h); }
    .btn-primary:hover { background: var(--c-accent-h); }
    .btn-secondary { background: var(--c-bg-2); color: var(--c-font); border-color: var(--c-border); }
    .btn-secondary:hover { background: #3a3733; color: var(--c-font-top); }
</style>
