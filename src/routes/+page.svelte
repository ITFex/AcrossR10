<script>
  import { base } from '$app/paths';
  import { messages } from '$lib/i18n/index.js';
  import {
    elevLine,
    elevFill,
    elevGrid,
    elevLabels,
    elevStats,
  } from '$lib/elevProfile.js';

  /** @type {import('./$types').PageData} */
  let { data } = $props();

  let openFaq = $state(null);

  function toggleFaq(i) {
    openFaq = openFaq === i ? null : i;
  }
</script>

<!-- ═══════════════════════════════════════════ HERO -->
<section class="hero" id="top">
  <div class="hero-inner">
    <p class="hero-eyebrow">{$messages.hero.eyebrow}</p>
    <h1>{$messages.hero.title}</h1>
    <p class="hero-sub">{$messages.hero.sub}</p>
    <div class="hero-ctas">
      <a href="#gpx" class="btn-primary">{$messages.hero.ctaGpx}</a>
      <a href="#faq" class="btn-ghost">{$messages.hero.ctaFaq}</a>
    </div>
    <div class="hero-stats">
      {#each $messages.stats as s}
        <div class="stat">
          <span class="stat-val">{s.value}</span>
          <span class="stat-label">{s.label}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ BESTENLISTE-TEASER -->
<section class="section" id="leaderboard">
  <div class="container narrow">
    <h2>{$messages.leaderboardTeaser.heading}</h2>
    <p class="section-intro center">{$messages.leaderboardTeaser.intro}</p>
    {#if data.leaderboardTop.length === 0}
      <p class="lb-teaser-empty">{$messages.leaderboardTeaser.empty}</p>
    {:else}
      <div class="lb-teaser-top">
        {#each data.leaderboardTop as rider, i}
          <div class="lb-teaser-card" class:champion={rider.done >= 10}>
            <span class="lb-teaser-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <div class="lb-teaser-body">
              <span class="lb-teaser-name">{rider.name}</span>
              <span class="lb-teaser-count">{rider.done}/10</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    <a href="{base}/leaderboard" class="btn-primary lb-teaser-cta">{$messages.leaderboardTeaser.cta}</a>
  </div>
</section>

<!-- ═══════════════════════════════════════════ ÜBER DAS EVENT -->
<section class="section" id="event">
  <div class="container">
    <h2>{$messages.event.heading}</h2>
    <div class="prose">
      {#each $messages.event.body as para}
        <p>{para}</p>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ STRECKE / GPX -->
<section class="section section-dark" id="gpx">
  <div class="container">
    <h2>{$messages.route.heading}</h2>
    <div class="route-grid">
      <div class="route-info">
        <div class="route-meta-grid">
          {#each $messages.route.meta as m}
            <div class="route-meta-item">
              <span class="meta-icon">{m.icon}</span>
              <span class="meta-val">{m.value}</span>
              <span class="meta-key">{m.label}</span>
            </div>
          {/each}
        </div>
        <p class="route-desc">{$messages.route.desc}</p>
        <a href="{base}/gpx/acrossr10-rennsteig.gpx" download class="btn-primary gpx-btn">
          ↓ {$messages.route.download}
        </a>
        <p class="gpx-hint">{$messages.route.downloadHint}</p>
      </div>

      <div class="elevation-card">
        <p class="elev-title">{$messages.route.elevTitle}</p>
        <svg viewBox="0 0 500 120" class="elev-svg" aria-hidden="true">
          <!-- background grid (300/500/700/900 m) -->
          {#each Object.entries(elevGrid) as [m, y] (m)}
            <line x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" stroke-width="1" />
            <text x="2" y={y - 2} fill="#94a3b8" font-size="8">{m} m</text>
          {/each}
          <!-- elevation profile (real GPX track) -->
          <defs>
            <linearGradient id="elev-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f97316" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#f97316" stop-opacity="0.05" />
            </linearGradient>
          </defs>
          <path d={elevFill} fill="url(#elev-grad)" />
          <path d={elevLine} fill="none" stroke="#f97316" stroke-width="2" stroke-linejoin="round" />
          <!-- location labels -->
          {#each elevLabels as loc (loc.name)}
            <text
              x={loc.x}
              y="108"
              fill="#64748b"
              font-size="9"
              text-anchor={loc.x < 10 ? 'start' : loc.x > 490 ? 'end' : 'middle'}
            >{loc.name}</text>
          {/each}
          <!-- stats -->
          <text x="500" y="118" fill="#94a3b8" font-size="8" text-anchor="end"
            >{elevStats.totalKm} km · {elevStats.minEle}–{elevStats.maxEle} m</text
          >
        </svg>
        <div class="segment-list">
          {#each $messages.route.segments as seg}
            <div class="segment">
              <span class="seg-name">{seg.name}</span>
              <span class="seg-km">{seg.km}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ REGION -->
<section class="section" id="region">
  <div class="container">
    <h2>{$messages.region.heading}</h2>
    <p class="section-intro">{$messages.region.intro}</p>
    <div class="region-grid">
      {#each $messages.region.cards as card}
        <div class="region-card">
          <span class="region-icon">{card.icon}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ FAQ -->
<section class="section section-dark" id="faq">
  <div class="container">
    <h2>{$messages.faq.heading}</h2>
    <p class="section-intro">{$messages.faq.intro}</p>
    <div class="faq-list">
      {#each $messages.faq.items as item, i}
        <div class="faq-item" class:open={openFaq === i}>
          <button class="faq-q" onclick={() => toggleFaq(i)} aria-expanded={openFaq === i}>
            <span>{item.q}</span>
            <span class="faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
          </button>
          {#if openFaq === i}
            <div class="faq-a">{item.a}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ ANMELDUNG / KONTAKT -->
<section class="section" id="contact">
  <div class="container narrow">
    <h2>{$messages.contact.heading}</h2>
    <p class="section-intro">{$messages.contact.body}</p>
    <a href="mailto:{$messages.contact.email}" class="btn-primary">{$messages.contact.cta}</a>
  </div>
</section>

<!-- ═══════════════════════════════════════════ FOOTER -->
<footer>
  <p>{$messages.footer.copy}</p>
  <p class="footer-links">
    <a href="#top">{$messages.footer.toTop}</a>
  </p>
</footer>

<style>
  /* ── layout ── */
  .container {
    max-width: 72rem;
    margin-inline: auto;
    padding-inline: 1.25rem;
  }
  .container.narrow { max-width: 48rem; }
  .section { padding: 5rem 0; }
  .section-dark { background: #0f172a; }
  .section-intro {
    color: #94a3b8;
    max-width: 56ch;
    margin: 0 0 2.5rem;
  }
  .section-intro.center { margin-inline: auto; }
  #leaderboard { text-align: center; }

  /* ── leaderboard teaser ── */
  .lb-teaser-empty {
    color: #64748b;
    font-size: .95rem;
    margin: 0 auto 2rem;
    max-width: 40ch;
  }
  .lb-teaser-top {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }
  .lb-teaser-card {
    display: flex;
    align-items: center;
    gap: .75rem;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: .75rem;
    padding: .9rem 1.25rem;
    min-width: 12rem;
  }
  .lb-teaser-card.champion { border-color: #f97316; }
  .lb-teaser-rank { font-size: 1.5rem; }
  .lb-teaser-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .lb-teaser-name {
    color: #f1f5f9;
    font-weight: 700;
    font-size: .95rem;
  }
  .lb-teaser-count {
    color: #f97316;
    font-weight: 800;
    font-size: .85rem;
  }
  .lb-teaser-cta { margin-top: 0; }

  /* ── hero ── */
  .hero {
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,.18) 0%, transparent 70%),
      #0a0f1e;
    padding: 7rem 1.25rem 5rem;
    text-align: center;
  }
  .hero-inner { max-width: 56rem; margin-inline: auto; }
  .hero-eyebrow {
    font-size: .8rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #f97316;
    margin: 0 0 1rem;
  }
  .hero h1 {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1.25rem;
    background: linear-gradient(135deg, #fff 30%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 1.1rem;
    color: #94a3b8;
    max-width: 48ch;
    margin: 0 auto 2.5rem;
  }
  .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem; }

  .hero-stats {
    display: flex;
    gap: 2.5rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: 2rem;
    border: 1px solid #1e293b;
    border-radius: 1rem;
    background: rgba(15,23,42,.6);
  }
  .stat { text-align: center; }
  .stat-val { display: block; font-size: 2rem; font-weight: 800; color: #f97316; line-height: 1; }
  .stat-label { display: block; font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .08em; margin-top: .25rem; }

  /* ── buttons ── */
  .btn-primary {
    display: inline-block;
    background: #f97316;
    color: #0a0f1e;
    font-weight: 700;
    font-size: .9rem;
    padding: .75rem 1.75rem;
    border-radius: .5rem;
    text-decoration: none;
    transition: background 150ms ease, transform 100ms ease;
  }
  .btn-primary:hover { background: #fb923c; transform: translateY(-1px); }
  .btn-ghost {
    display: inline-block;
    border: 1.5px solid #334155;
    color: #94a3b8;
    font-weight: 600;
    font-size: .9rem;
    padding: .75rem 1.75rem;
    border-radius: .5rem;
    text-decoration: none;
    transition: border-color 150ms ease, color 150ms ease;
  }
  .btn-ghost:hover { border-color: #64748b; color: #e2e8f0; }

  /* ── headings ── */
  h2 {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 800;
    margin: 0 0 1.25rem;
    color: #f1f5f9;
  }
  h3 { font-size: 1rem; font-weight: 700; margin: 0 0 .5rem; color: #f1f5f9; }

  /* ── prose ── */
  .prose { max-width: 68ch; }
  .prose p { color: #94a3b8; margin: 0 0 1rem; }

  /* ── route ── */
  .route-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }
  @media (max-width: 700px) { .route-grid { grid-template-columns: 1fr; } }

  .route-meta-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .route-meta-item {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: .75rem;
    padding: .875rem 1rem;
    display: flex;
    flex-direction: column;
    gap: .2rem;
  }
  .meta-icon { font-size: 1.4rem; }
  .meta-val { font-size: 1.25rem; font-weight: 800; color: #f97316; line-height: 1; }
  .meta-key { font-size: .7rem; color: #64748b; text-transform: uppercase; letter-spacing: .07em; }
  .route-desc { color: #94a3b8; margin: 0 0 1.5rem; }
  .gpx-btn { margin-bottom: .5rem; }
  .gpx-hint { font-size: .75rem; color: #475569; margin: 0; }

  .elevation-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 1.25rem;
  }
  .elev-title { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #64748b; margin: 0 0 .75rem; }
  .elev-svg { width: 100%; height: auto; display: block; margin-bottom: 1rem; }
  .segment-list { display: flex; flex-direction: column; gap: .35rem; }
  .segment { display: flex; justify-content: space-between; font-size: .8rem; }
  .seg-name { color: #94a3b8; }
  .seg-km { color: #f97316; font-weight: 700; }

  /* ── region ── */
  .region-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.25rem;
  }
  .region-card {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 1rem;
    padding: 1.5rem;
    transition: border-color 150ms ease;
  }
  .region-card:hover { border-color: #f97316; }
  .region-icon { font-size: 2rem; display: block; margin-bottom: .75rem; }
  .region-card p { color: #94a3b8; font-size: .9rem; margin: 0; }

  /* ── faq ── */
  .faq-list { display: flex; flex-direction: column; gap: .75rem; max-width: 60rem; }
  .faq-item {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: .75rem;
    overflow: hidden;
    transition: border-color 150ms ease;
  }
  .faq-item.open { border-color: #f97316; }
  .faq-q {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: #f1f5f9;
    font-size: .95rem;
    font-weight: 600;
    padding: 1rem 1.25rem;
    cursor: pointer;
    text-align: left;
    gap: 1rem;
  }
  .faq-q:hover { color: #f97316; }
  .faq-arrow { font-size: .7rem; color: #64748b; flex-shrink: 0; }
  .faq-a {
    padding: 0 1.25rem 1rem;
    color: #94a3b8;
    font-size: .9rem;
    line-height: 1.7;
  }

  /* ── contact ── */
  #contact { text-align: center; }
  #contact .section-intro { margin-inline: auto; }

  /* ── footer ── */
  footer {
    background: #020617;
    padding: 2rem 1.25rem;
    text-align: center;
    color: #334155;
    font-size: .8rem;
  }
  footer p { margin: .25rem 0; }
  .footer-links a { color: #475569; text-decoration: none; }
  .footer-links a:hover { color: #94a3b8; }
</style>
