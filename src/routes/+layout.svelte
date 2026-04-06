<script lang="ts">
    import { page } from '$app/state';
    import favicon from '$lib/assets/favicon.svg';
    import { lang, i18n } from '$lib/stores/langStore';
    import type { Lang } from '$lib/lang';

    let { children } = $props();

    const navLinks = $derived([
        { href: '/#features',   label: $i18n.nav_features },
        { href: '/#how',        label: $i18n.nav_how },
        { href: '/#about',      label: $i18n.nav_about },
        { href: '/history',     label: $i18n.nav_history },
        { href: '/leaderboard', label: $i18n.nav_leaderboard },
    ]);

    const isPlay = $derived(page.url.pathname.startsWith('/play'));

    function setLang(e: Event) {
        lang.set((e.target as HTMLSelectElement).value as Lang);
    }
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
</svelte:head>

<header class="nav">
    <a href="/" class="nav-logo">
        <span class="logo-icon">♔</span>
        <span class="logo-text">CHESS<em>PvAI</em></span>
    </a>

    {#if !isPlay}
        <nav class="nav-links">
            {#each navLinks as link}
                <a href={link.href}>{link.label}</a>
            {/each}
        </nav>
    {/if}

    <select class="lang-select" value={$lang} onchange={setLang}>
        <option value="en">🇬🇧 English</option>
        <option value="ro">🇷🇴 Română</option>
    </select>

    <a href={isPlay ? '/' : '/play'} class="nav-cta">
        {isPlay ? $i18n.nav_home : $i18n.nav_play}
    </a>
</header>

<div class="page-body">
    {@render children()}
</div>

<footer class="footer">
    <span class="footer-logo">♔ ChessPvAI</span>
    <span class="footer-copy">{$i18n.footer_built}</span>
    <a href="https://github.com/DaPedala/ChessPvAI" class="footer-link" target="_blank" rel="noopener noreferrer">
		Github →
	</a>
</footer>

<style>
    :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
    :global(html) { scroll-behavior: smooth; }
    :global(body) {
        background: #0e0d0b;
        color: #c8c4bc;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 1rem;
        line-height: 1.6;
        overflow-x: hidden;
    }
    :global(a) { text-decoration: none; color: inherit; }

    :global(:root) {
        --bg:       #0e0d0b;
        --bg2:      #161512;
        --bg3:      #1e1d1a;
        --border:   rgba(255,255,255,.08);
        --accent:   #629924;
        --accent-h: #7bb82e;
        --gold:     #c9a84c;
        --text:     #c8c4bc;
        --text-dim: #6b6760;
        --text-top: #f0ece4;
        --serif:    'Playfair Display', Georgia, serif;
        --mono:     'IBM Plex Mono', monospace;
        --sans:     'IBM Plex Sans', sans-serif;
        --nav-h:    64px;
    }

    .nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        display: flex; align-items: center; gap: 40px;
        padding: 0 clamp(24px, 5vw, 80px);
        height: var(--nav-h);
        background: rgba(14,13,11,.88);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
    }

    .nav-logo {
        display: flex; align-items: center; gap: 10px;
        font-family: var(--mono); font-weight: 700;
        font-size: .9rem; letter-spacing: .1em;
        color: var(--text-top);
    }
    .logo-icon { font-size: 1.3rem; color: var(--accent); }
    .logo-text em { font-style: normal; color: var(--accent); }

    .nav-links { display: flex; gap: 28px; margin-left: auto; }
    .nav-links a {
        font-size: .82rem; font-family: var(--mono); letter-spacing: .05em;
        color: var(--text-dim); transition: color .15s;
    }
    .nav-links a:hover { color: var(--text); }

    .lang-select {
        font-family: var(--mono); font-size: .78rem;
        background: var(--bg2); color: var(--text);
        border: 1px solid var(--border); border-radius: 2px;
        padding: 6px 10px; cursor: pointer;
        transition: border-color .15s;
        appearance: none;
    }
    .lang-select:hover { border-color: var(--accent); }

    .nav-cta {
        font-family: var(--mono); font-size: .82rem; font-weight: 700;
        color: var(--accent); letter-spacing: .05em;
        border: 1px solid rgba(98,153,36,.35);
        padding: 7px 18px; border-radius: 2px;
        transition: background .15s, color .15s;
    }
    .nav-cta:hover { background: var(--accent); color: #fff; }

    .page-body {
        padding-top: var(--nav-h);
        min-height: calc(100vh - var(--nav-h));
    }

    .footer {
        display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
        padding: 28px clamp(24px, 5vw, 80px);
        border-top: 1px solid var(--border);
        font-family: var(--mono); font-size: .75rem; color: var(--text-dim);
    }
    .footer-logo { color: var(--text); font-weight: 700; margin-right: auto; }
    .footer-link { color: var(--accent); }
    .footer-link:hover { text-decoration: underline; }

    @media (max-width: 900px) {
        .nav-links { display: none; }
    }
</style>