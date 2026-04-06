<script lang="ts">
    import { gameStore } from '$lib/stores/gameStore.svelte';
    import { i18n } from '$lib/stores/langStore';
</script>

<div class="post-game">
    <button class="btn btn-primary" onclick={() => gameStore.executeRematch()}>
        {$i18n.pg_rematch} <span class="sub">#{gameStore.matchCounter}</span>
    </button>
    <button class="btn btn-secondary" onclick={() => gameStore.goToMenu()}>
        {$i18n.pg_new_game}
    </button>
</div>

<style>
	.post-game { display: flex; gap: 8px; margin-top: 14px; }
	.btn { flex: 1; padding: 11px; border-radius: 4px; border: 1px solid transparent; font-weight: 700; font-size: .9rem; cursor: pointer; transition: background .15s; }
	.btn-primary { background: #629924; color: #fff; border-color: #508020; }
	.btn-primary:hover { background: #508020; }
	.btn-secondary { background: #262421; color: #bababa; border-color: rgba(255,255,255,.1); }
	.btn-secondary:hover { background: #3a3733; color: #d4d4d4; }
	.sub { opacity: .6; font-weight: 400; }
</style>
