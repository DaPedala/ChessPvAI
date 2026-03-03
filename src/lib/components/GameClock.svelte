<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore.svelte';
	import { formatTime } from '$lib/utils/timeFormat';
</script>

<div class="clock-bar">
	<div class="clock-side" class:active={gameStore.isPlayerTurn}>
		<span class="clock-name">{gameStore.sessionUsername}</span>
		<span class="clock-time">{formatTime(gameStore.playerTime)}</span>
	</div>
	<span class="vs">vs</span>
	<div class="clock-side clock-right" class:active={!gameStore.isPlayerTurn}>
		<span class="clock-name">Engine</span>
		<span class="clock-time">{formatTime(gameStore.aiTime)}</span>
	</div>
</div>

<style>
	.clock-bar { display: flex; align-items: center; background: #262421; border: 1px solid rgba(255,255,255,.1); border-radius: 4px; padding: 10px 14px; margin-bottom: 8px; font-family: monospace; }
	.clock-side { flex: 1; display: flex; flex-direction: column; gap: 1px; opacity: .3; transition: opacity .2s; }
	.clock-side.active { opacity: 1; }
	.clock-right { align-items: flex-end; }
	.clock-name { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: #bababa; }
	.clock-time { font-size: 1.5rem; font-weight: 700; color: #9f9f9f; letter-spacing: .02em; }
	.clock-side.active .clock-time { color: #fff; }
	.vs { font-size: .7rem; color: #3a3733; padding: 0 12px; user-select: none; }
</style>
