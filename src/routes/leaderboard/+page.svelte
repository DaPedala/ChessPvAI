<script lang="ts">
    import { onMount } from 'svelte';
    import { i18n } from '$lib/stores/langStore';

    interface LeaderboardRow {
        username: string;
        games_played: number;
        avg_moves: number;
        wins: number;
        win_rate: number;
        min_skill: number;
        max_skill: number;
    }

    let rows    = $state<LeaderboardRow[]>([]);
    let loading = $state(true);

    onMount(async () => {
        const res = await fetch('/api/leaderboard');
        rows    = await res.json();
        loading = false;
    });

    function medal(i: number) {
        return ['🥇','🥈','🥉'][i] ?? '';
    }
</script>

<svelte:head>
    <title>{$i18n.lb_title} — ChessPvAI</title>
</svelte:head>

<div class="page">
    <div class="header">
        <a href="/" class="back">{$i18n.lb_back}</a>
        <h1 class="title">{$i18n.lb_title}</h1>
        <p class="subtitle">{$i18n.lb_subtitle}</p>
    </div>

    {#if loading}
        <p class="empty">{$i18n.lb_loading}</p>
    {:else if rows.length === 0}
        <p class="empty">{$i18n.lb_empty}</p>
    {:else}
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>{$i18n.lb_rank}</th>
                        <th>{$i18n.lb_player}</th>
                        <th>{$i18n.lb_games}</th>
                        <th>{$i18n.lb_wins}</th>
                        <th>{$i18n.lb_winrate}</th>
                        <th>{$i18n.lb_avgmoves}</th>
                        <th>{$i18n.lb_skill}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each rows as row, i}
                        <tr class:top={i < 3}>
                            <td class="rank">{medal(i) || i + 1}</td>
                            <td class="username">{row.username}</td>
                            <td>{row.games_played}</td>
                            <td>{row.wins}</td>
                            <td>
                                <span class="wr-bar-wrap">
                                    <span class="wr-bar" style="width:{row.win_rate}%"></span>
                                    <span class="wr-label">{row.win_rate}%</span>
                                </span>
                            </td>
                            <td class="mono">{row.avg_moves}</td>
                            <td class="mono">{row.min_skill}–{row.max_skill}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .page { max-width: 860px; margin: 0 auto; padding: 48px clamp(16px, 4vw, 48px) 80px; }

    .header { margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
    .back { font-family: var(--mono); font-size: .78rem; color: var(--accent); }
    .back:hover { text-decoration: underline; }

    .title {
        font-family: var(--serif); font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 900; color: var(--text-top); margin: 12px 0 8px;
    }
    .subtitle { font-size: .88rem; color: var(--text-dim); font-family: var(--mono); }

    .empty { text-align: center; color: var(--text-dim); margin-top: 80px; font-family: var(--mono); }

    .table-wrap {
        overflow-x: auto; border: 1px solid var(--border);
        border-radius: 4px; background: var(--bg2);
    }

    table { width: 100%; border-collapse: collapse; }
    thead tr { border-bottom: 1px solid var(--border); background: var(--bg3); }

    th {
        font-family: var(--mono); font-size: .68rem;
        letter-spacing: .12em; text-transform: uppercase;
        color: var(--text-dim); padding: 14px 16px;
        text-align: left; font-weight: 500;
    }

    td {
        padding: 14px 16px; font-size: .88rem; color: var(--text);
        border-bottom: 1px solid rgba(255,255,255,.04);
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg3); }
    tr.top .username { color: var(--text-top); font-weight: 600; }

    .rank { font-family: var(--mono); color: var(--text-dim); width: 48px; font-size: 1rem; }
    .username { font-family: var(--serif); font-size: 1rem; color: var(--text-top); }
    .mono { font-family: var(--mono); color: var(--text-dim); }

    .wr-bar-wrap { display: flex; align-items: center; gap: 10px; }
    .wr-bar {
        display: inline-block; height: 6px; background: var(--accent);
        border-radius: 3px; min-width: 4px; max-width: 120px; transition: width .4s ease;
    }
    .wr-label { font-family: var(--mono); font-size: .82rem; color: var(--accent); }
</style>