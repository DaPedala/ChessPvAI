<script lang="ts">
    import { onMount } from 'svelte';
    import { i18n } from '$lib/stores/langStore';

    let visible      = $state(false);
    let statsVisible = $state(false);
    let statsEl: HTMLElement;

    const features = $derived([
        { icon: '♟', title: $i18n.feat_1_title, desc: $i18n.feat_1_desc },
        { icon: '⊕', title: $i18n.feat_2_title, desc: $i18n.feat_2_desc },
        { icon: '⏱', title: $i18n.feat_3_title, desc: $i18n.feat_3_desc },
        { icon: '↗', title: $i18n.feat_4_title, desc: $i18n.feat_4_desc },
    ]);

    const steps = $derived([
        { n: '01', title: $i18n.step_1_title, desc: $i18n.step_1_desc },
        { n: '02', title: $i18n.step_2_title, desc: $i18n.step_2_desc },
        { n: '03', title: $i18n.step_3_title, desc: $i18n.step_3_desc },
    ]);

    onMount(() => {
        requestAnimationFrame(() => { visible = true; });
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) statsVisible = true; },
            { threshold: 0.3 }
        );
        if (statsEl) observer.observe(statsEl);
        return () => observer.disconnect();
    });

    function animateCount(target: number, el: HTMLElement, suffix = '') {
        let start = 0;
        const step = Math.ceil(target / 60);
        const tick = () => {
            start = Math.min(start + step, target);
            el.textContent = start.toLocaleString() + suffix;
            if (start < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    let countEls: HTMLElement[] = [];
    const statTargets  = [2400, 12, 6];
    const statSuffixes = ['+', '', '+'];

    $effect(() => {
        if (statsVisible) {
            countEls.forEach((el, i) => {
                if (el) animateCount(statTargets[i], el, statSuffixes[i]);
            });
        }
    });
</script>

<svelte:head>
    <title>ChessPvAI — Play. Analyse. Improve.</title>
</svelte:head>

<section class="hero">
    <div class="board-grid" aria-hidden="true">
        {#each Array(64) as _, i}
            <div class="cell" class:dark={(Math.floor(i / 8) + i) % 2 === 1}></div>
        {/each}
    </div>

    <div class="hero-content" class:hero-visible={visible}>
        <p class="hero-kicker">{$i18n.hero_kicker}</p>
        <h1 class="hero-title">
            {$i18n.hero_title_1}<br />
            <em>{$i18n.hero_title_2}</em><br />
            {$i18n.hero_title_3}
        </h1>
        <p class="hero-sub">{$i18n.hero_sub}</p>
        <div class="hero-actions">
            <a href="/play" class="btn-primary">{$i18n.hero_btn_play}</a>
            <a href="#features" class="btn-ghost">{$i18n.hero_btn_feat}</a>
        </div>
    </div>
</section>

<section class="stats-band" bind:this={statsEl}>
    <div class="stat">
        <span class="stat-num" bind:this={countEls[0]}>0</span>
        <span class="stat-label">{$i18n.stat_rating}</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
        <span class="stat-num" bind:this={countEls[1]}>0</span>
        <span class="stat-label">{$i18n.stat_controls}</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat">
        <span class="stat-num" bind:this={countEls[2]}>0</span>
        <span class="stat-label">{$i18n.stat_cats}</span>
    </div>
</section>

<section class="features" id="features">
    <div class="section-header">
        <p class="section-tag">{$i18n.sec_features}</p>
        <h2 class="section-title">{$i18n.sec_feat_h}</h2>
    </div>
    <div class="features-grid">
        {#each features as f, i}
            <article class="feature-card" style="--delay:{i * 80}ms">
                <span class="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
            </article>
        {/each}
    </div>
</section>

<section class="how" id="how">
    <div class="section-header">
        <p class="section-tag">{$i18n.sec_how}</p>
        <h2 class="section-title">{$i18n.sec_how_h}</h2>
    </div>
    <div class="steps">
        {#each steps as s, i}
            <div class="step">
                <span class="step-num">{s.n}</span>
                <div class="step-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                </div>
                {#if i < steps.length - 1}
                    <span class="step-arrow">→</span>
                {/if}
            </div>
        {/each}
    </div>
</section>

<section class="about" id="about">
    <div class="about-inner">
        <p class="section-tag">{$i18n.sec_about}</p>
        <blockquote class="about-quote">"{$i18n.about_quote}"</blockquote>
        <div class="about-body">
            <p>{@html $i18n.about_p1}</p>
            <p>{$i18n.about_p2}</p>
        </div>
        <a href="/play" class="btn-primary">{$i18n.about_btn}</a>
    </div>
</section>

<style>
    .section-tag {
        font-family: var(--mono); font-size: .72rem;
        letter-spacing: .2em; color: var(--accent); margin-bottom: 12px;
    }
    .section-title {
        font-family: var(--serif); font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 700; color: var(--text-top); line-height: 1.1;
    }
    .section-header { margin-bottom: 56px; }

    .btn-primary {
        display: inline-block; background: var(--accent); color: #fff;
        font-family: var(--mono); font-weight: 700; font-size: .9rem;
        letter-spacing: .06em; padding: 14px 32px; border-radius: 2px;
        border: 1px solid var(--accent-h); transition: background .15s, transform .1s;
    }
    .btn-primary:hover { background: var(--accent-h); transform: translateY(-1px); }

    .btn-ghost {
        display: inline-block; color: var(--text-dim); font-family: var(--mono);
        font-size: .85rem; border-bottom: 1px solid var(--border);
        padding-bottom: 2px; transition: color .15s, border-color .15s;
    }
    .btn-ghost:hover { color: var(--text); border-color: var(--text-dim); }

    .hero {
        min-height: calc(100vh - var(--nav-h));
        display: flex; align-items: center; justify-content: center;
        padding: 80px clamp(24px, 5vw, 80px);
        position: relative; overflow: hidden; text-align: center;
    }

    .board-grid {
        position: absolute; inset: 0;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        opacity: .03; pointer-events: none;
    }
    .cell { width: 100%; height: 100%; }
    .cell.dark { background: #fff; }

    .hero::after {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse 70% 80% at 50% 50%, transparent 0%, #0e0d0b 80%);
        pointer-events: none;
    }

    .hero-content {
        position: relative; z-index: 2; max-width: 700px;
        opacity: 0; transform: translateY(24px);
        transition: opacity .8s .1s, transform .8s .1s;
    }
    .hero-content.hero-visible { opacity: 1; transform: none; }

    .hero-kicker {
        font-family: var(--mono); font-size: .72rem;
        letter-spacing: .18em; color: var(--accent);
        margin-bottom: 24px; text-transform: uppercase;
    }

    .hero-title {
        font-family: var(--serif);
        font-size: clamp(3.5rem, 8vw, 6.5rem);
        font-weight: 900; line-height: 1.0;
        color: var(--text-top); margin-bottom: 28px;
    }
    .hero-title em { font-style: italic; color: var(--gold); }

    .hero-sub {
        font-size: 1.05rem; color: var(--text-dim);
        line-height: 1.7; max-width: 520px;
        margin: 0 auto 40px;
    }

    .hero-actions { display: flex; align-items: center; justify-content: center; gap: 28px; flex-wrap: wrap; }

    .stats-band {
        display: flex; align-items: center; justify-content: center;
        border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        background: var(--bg2); padding: 48px 0;
    }
    .stat {
        flex: 1; max-width: 260px;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .stat-num {
        font-family: var(--serif); font-size: 3.5rem;
        font-weight: 900; color: var(--accent); line-height: 1;
    }
    .stat-label {
        font-family: var(--mono); font-size: .72rem;
        letter-spacing: .12em; color: var(--text-dim); text-transform: uppercase;
    }
    .stat-divider { width: 1px; height: 64px; background: var(--border); flex-shrink: 0; }

    .features {
        padding: 120px clamp(24px, 5vw, 80px);
        max-width: 1200px; margin: 0 auto;
    }
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2px;
    }
    .feature-card {
        background: var(--bg2); border: 1px solid var(--border);
        padding: 36px 32px;
        transition: border-color .2s, background .2s;
        animation: fadeUp .6s both;
        animation-delay: var(--delay, 0ms);
    }
    .feature-card:hover { border-color: rgba(98,153,36,.4); background: var(--bg3); }
    .feature-icon { display: block; font-size: 2rem; margin-bottom: 20px; opacity: .7; }
    .feature-card h3 {
        font-family: var(--serif); font-size: 1.25rem;
        color: var(--text-top); margin-bottom: 10px;
    }
    .feature-card p { font-size: .9rem; color: var(--text-dim); line-height: 1.65; }

    .how {
        padding: 120px clamp(24px, 5vw, 80px);
        background: var(--bg2);
        border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    }
    .steps { display: flex; align-items: flex-start; flex-wrap: wrap; }
    .step {
        flex: 1; min-width: 220px;
        display: flex; align-items: flex-start; gap: 20px;
        padding: 0 40px 0 0;
    }
    .step-num {
        font-family: var(--mono); font-size: 2.5rem; font-weight: 700;
        color: var(--accent); opacity: .3; line-height: 1; flex-shrink: 0;
    }
    .step-body h3 {
        font-family: var(--serif); font-size: 1.3rem;
        color: var(--text-top); margin-bottom: 8px; margin-top: 4px;
    }
    .step-body p { font-size: .88rem; color: var(--text-dim); line-height: 1.65; }
    .step-arrow {
        font-family: var(--mono); font-size: 1.5rem;
        color: var(--text-dim); opacity: .3;
        align-self: center; padding: 0 8px; flex-shrink: 0;
    }

    .about {
        padding: 140px clamp(24px, 5vw, 80px);
        max-width: 780px; margin: 0 auto;
    }
    .about-quote {
        font-family: var(--serif); font-style: italic;
        font-size: clamp(1.4rem, 3vw, 2rem);
        color: var(--gold); line-height: 1.4;
        border-left: 3px solid var(--accent);
        padding-left: 28px; margin: 24px 0 40px;
    }
    .about-body p {
        font-size: .97rem; line-height: 1.75;
        color: var(--text-dim); margin-bottom: 16px;
    }
    .about-body :global(strong) { color: var(--text); }
    .about .btn-primary { margin-top: 40px; }

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
        .steps { flex-direction: column; gap: 40px; }
        .step-arrow { display: none; }
        .step { padding: 0; }
    }
    @media (max-width: 480px) {
        .stats-band { flex-direction: column; gap: 40px; }
        .stat-divider { width: 60px; height: 1px; }
    }
</style>