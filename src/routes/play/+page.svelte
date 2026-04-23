<script lang="ts">
	import { onMount } from 'svelte';
	import { gameStore } from '$lib/stores/gameStore.svelte';
	import { i18n } from '$lib/stores/langStore';

	import GameMenu from '$lib/components/GameMenu.svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameClock from '$lib/components/GameClock.svelte';
	import MoveLog from '$lib/components/MoveLog.svelte';
	import PostGame from '$lib/components/PostGame.svelte';

	let { data } = $props<{ data: { user: { id: string; email: string; display_name: string } } }>();

	onMount(() => {
		gameStore.displayName = data.user.display_name;
		gameStore.userId = data.user.id;
	});
</script>

<div class="app">
	<div class="main-col">
		<div class="status-bar">
			<span class="status-text">{$i18n[gameStore.statusKey]}</span>
			{#if gameStore.hasExported}
				<span class="badge">Saved ✓</span>
			{/if}
		</div>

		{#if gameStore.currentPhase === 'MENU'}
			<GameMenu />
		{:else}
			<GameClock />

			{#key gameStore.activeMatchNumber}
				<GameBoard />
			{/key}

			{#if gameStore.currentPhase === 'TERMINATED'}
				<PostGame />
			{:else}
				<button class="abort-btn" onclick={() => gameStore.goToMenu()}>
				    {$i18n.play_abort}
				</button>
			{/if}
		{/if}
	</div>

	{#if gameStore.currentPhase !== 'MENU'}
		<MoveLog />
	{/if}
</div>

<style>
	:global(*), :global(*::before), :global(*::after) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		font-family: 'Noto Sans', 'Segoe UI', Arial, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		background: #161512;
		color: #bababa;
		-webkit-font-smoothing: antialiased;
	}
	.app {
	    display: flex;
	    gap: 24px;
	    padding: 24px;
	    min-height: fit-content;
	    justify-content: center;
	    align-items: flex-start;
	}
	.main-col { width: 450px; flex-shrink: 0; }
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 28px;
		margin-bottom: 10px;
	}
	.status-text { font-size: .93rem; font-weight: 600; color: #d4d4d4; }
	.badge {
		background: #629924;
		color: #fff;
		padding: 2px 10px;
		border-radius: 20px;
		font-size: .72rem;
		font-weight: 700;
		letter-spacing: .04em;
	}
	.abort-btn {
		display: block;
		width: 100%;
		margin-top: 12px;
		padding: 10px;
		background: #1c1b18;
		color: #666;
		border: 1px solid rgba(255,255,255,.07);
		border-radius: 4px;
		font-size: .85rem;
		cursor: pointer;
		transition: color .15s, background .15s;
	}
	.abort-btn:hover { background: #262421; color: #bababa; }
</style>
