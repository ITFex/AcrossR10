<script>
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { locale, messages } from '$lib/i18n/index.js';
  import { slide } from 'svelte/transition';
  import { fadeIn } from '$lib/actions/fadeIn.js';
  import {
    elevLine,
    elevFill,
    elevGrid,
    elevLabels,
    elevStats,
  } from '$lib/elevProfile.js';
  import RouteMap from '$lib/components/RouteMap.svelte';

  /** @type {import('./$types').PageData} */
  let { data } = $props();

  // ── FAQ accordion ──────────────────────────────────────────────
  let openFaq = $state(null);
  function toggleFaq(i) {
    openFaq = openFaq === i ? null : i;
  }

  // ── GPX button shake ──────────────────────────────────────────
  let gpxShakeKey = $state(0);
  function shakeGpx() {
    gpxShakeKey += 1;
  }

  // ── Count-up for hero stats ───────────────────────────────────
  /**
   * Parse the numeric value out of a stat string like "130 km", "3.400 hm", "10×", "~900 m".
   * Returns { prefix, num, suffixSpace, suffix, formatLocale, grouped } where num is an integer.
   * @param {string} raw
   */
  function parseStat(raw) {
    const m = raw.match(/^([^0-9]*)([0-9][0-9.,]*)(\s*)(.*)$/);
    if (!m) return { prefix: '', num: 0, suffixSpace: '', suffix: raw, formatLocale: undefined, grouped: false };
    const isDotGrouped = /^\d{1,3}(?:\.\d{3})+$/.test(m[2]);
    const isCommaGrouped = /^\d{1,3}(?:,\d{3})+$/.test(m[2]);
    const grouped = isDotGrouped || isCommaGrouped;
    const formatLocale = isDotGrouped ? 'de-DE' : (isCommaGrouped ? 'en-US' : undefined);
    const numStr = m[2].replace(/[.,]/g, '');
    return {
      prefix: m[1],
      num: parseInt(numStr, 10),
      suffixSpace: m[3],
      suffix: m[4],
      formatLocale,
      grouped,
    };
  }

  // Display values start at 0, get updated by count-up
  let statDisplays = $state($messages.stats.map(() => '0'));
  let statsStarted = $state(false);

  /**
   * Svelte action that fires count-up once when element enters viewport.
   * @param {HTMLElement} node
   */
  function countUp(node) {
    if (!browser) return {};
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || statsStarted) return;
        statsStarted = true;
        observer.disconnect();
        const duration = 1400; // ms
        const start = performance.now();
        const parsed = $messages.stats.map((s) => parseStat(s.value));
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
          statDisplays = parsed.map(({ prefix, num, suffixSpace, suffix, formatLocale, grouped }) => {
            const cur = Math.round(ease * num);
            const fmt = grouped ? cur.toLocaleString(formatLocale) : String(cur);
            return `${prefix}${fmt}${suffixSpace}${suffix}`;
          });
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return { destroy() { observer.disconnect(); } };
  }

  // ── Countdown ─────────────────────────────────────────────────
  /** @type {{ days: number, hours: number, minutes: number, seconds: number, over: boolean }} */
  let countdown = $state({ days: 0, hours: 0, minutes: 0, seconds: 0, over: false });

  function updateCountdown() {
    const target = new Date($messages.countdown.eventDate).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
      return;
    }
    const s = Math.floor(diff / 1000);
    countdown = {
      days:    Math.floor(s / 86400),
      hours:   Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      over: false,
    };
  }

  if (browser) {
    $effect(() => {
      updateCountdown();
      const cdInterval = setInterval(updateCountdown, 1000);
      return () => clearInterval(cdInterval);
    });
  }

  // ── Elevation profile tooltip ─────────────────────────────────
  /**
   * Parse "M x,y L x,y L x,y …" path into array of {x, y} objects.
   * @param {string} d
   * @returns {{ x: number, y: number }[]}
   */
  function parseElevPoints(d) {
    return [...d.matchAll(/[ML]\s*([\d.]+),([\d.]+)/g)].map((m) => ({
      x: parseFloat(m[1]),
      y: parseFloat(m[2]),
    }));
  }

  const elevPoints = parseElevPoints(elevLine);
  // SVG viewBox: 0 0 500 120; elevation mapped: y=110 is minEle, y=10 roughly is maxEle
  // Formula derived from gen-elev-profile: y = 110 - (ele - minEle) / (maxEle - minEle) * 100
  function svgYtoEle(y) {
    return Math.round(elevStats.minEle + (110 - y) / 100 * (elevStats.maxEle - elevStats.minEle));
  }
  function svgXtoKm(x) {
    return (x / 500 * elevStats.totalKm).toLocaleString($locale === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  /** @type {SVGSVGElement | null} */
  let elevSvg = $state(null);
  let tooltip = $state({ visible: false, x: 0, y: 0, km: '0', ele: 0 });

  /** @param {PointerEvent} e */
  function onElevPointerMove(e) {
    if (!elevSvg) return;
    const rect = elevSvg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 500;
    // find closest point
    let closest = elevPoints[0];
    let minDist = Math.abs(elevPoints[0].x - svgX);
    for (const p of elevPoints) {
      const d = Math.abs(p.x - svgX);
      if (d < minDist) { minDist = d; closest = p; }
    }
    tooltip = {
      visible: true,
      x: (closest.x / 500) * 100, // percent of SVG width
      y: closest.y,
      km: svgXtoKm(closest.x),
      ele: svgYtoEle(closest.y),
    };
  }

  function onElevPointerLeave() {
    tooltip = { ...tooltip, visible: false };
  }
</script>

<!-- ═══════════════════════════════════════════ HERO -->
<section class="hero" id="top">
  <div class="hero-inner">
    <p class="hero-eyebrow" use:fadeIn>{$messages.hero.eyebrow}</p>
    <h1 use:fadeIn={{ delay: 80 }}>{$messages.hero.title}</h1>
    <p class="hero-sub" use:fadeIn={{ delay: 160 }}>{$messages.hero.sub}</p>
    <div class="hero-ctas" use:fadeIn={{ delay: 240 }}>
      <a href="#gpx" class="btn-primary btn-pulse">{$messages.hero.ctaGpx}</a>
      <a href="#faq" class="btn-ghost">{$messages.hero.ctaFaq}</a>
    </div>
    <div class="hero-stats" use:countUp>
      {#each $messages.stats as s, i}
        <div class="stat">
          <span class="stat-val">{statsStarted ? statDisplays[i] : s.value}</span>
          <span class="stat-label">{s.label}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ COUNTDOWN -->
<div class="countdown-bar" use:fadeIn>
  <span class="cd-heading">{$messages.countdown.heading}:</span>
  {#if countdown.over}
    <span class="cd-over">{$messages.countdown.over}</span>
  {:else}
    <div class="cd-units">
      <div class="cd-unit"><span class="cd-num">{countdown.days}</span><span class="cd-label">{$messages.countdown.days}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">{String(countdown.hours).padStart(2,'0')}</span><span class="cd-label">{$messages.countdown.hours}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">{String(countdown.minutes).padStart(2,'0')}</span><span class="cd-label">{$messages.countdown.minutes}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">{String(countdown.seconds).padStart(2,'0')}</span><span class="cd-label">{$messages.countdown.seconds}</span></div>
    </div>
  {/if}
</div>

<!-- ═══════════════════════════════════════════ BESTENLISTE-TEASER -->
<section class="section" id="leaderboard">
  <div class="container narrow">
    <h2 use:fadeIn>{$messages.leaderboardTeaser.heading}</h2>
    <p class="section-intro center" use:fadeIn={{ delay: 60 }}>{$messages.leaderboardTeaser.intro}</p>
    {#if data.leaderboardTop.length === 0}
      <p class="lb-teaser-empty" use:fadeIn={{ delay: 120 }}>{$messages.leaderboardTeaser.empty}</p>
    {:else}
      <div class="lb-teaser-top">
        {#each data.leaderboardTop as rider, i}
          <div class="lb-teaser-card" class:champion={rider.done >= 10} use:fadeIn={{ delay: i * 80 }}>
            <span class="lb-teaser-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <div class="lb-teaser-body">
              <span class="lb-teaser-name">{rider.name}</span>
              <div class="lb-progress-wrap">
                <div class="lb-progress-bar" style="--pct: {(rider.done / 10) * 100}%"></div>
              </div>
              <span class="lb-teaser-count">{rider.done}/10</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    <a href="{base}/leaderboard" class="btn-primary lb-teaser-cta" use:fadeIn={{ delay: 160 }}>{$messages.leaderboardTeaser.cta}</a>
  </div>
</section>

<!-- ═══════════════════════════════════════════ ÜBER DAS EVENT -->
<section class="section" id="event">
  <div class="container">
    <h2 use:fadeIn>{$messages.event.heading}</h2>
    <div class="prose">
      {#each $messages.event.body as para, i}
        <p use:fadeIn={{ delay: i * 80 }}>{para}</p>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ STRECKE / GPX -->
<section class="section section-dark" id="gpx">
  <div class="container">
    <h2 use:fadeIn>{$messages.route.heading}</h2>

    <!-- Interaktive Karte (Leaflet + OSM, nur client-side) -->
    {#if browser}
      <div class="route-map-wrap">
        <RouteMap
          locale={$locale}
          checkpointNames={$messages.route.checkpoints ?? []}
        />
      </div>
    {:else}
      <div class="map-placeholder">🗺️ {$messages.route.mapLoading}</div>
    {/if}
    <div class="route-grid">
      <div class="route-info" use:fadeIn={{ delay: 80 }}>
        <div class="route-meta-grid">
          {#each $messages.route.meta as m, i}
            <div class="route-meta-item" use:fadeIn={{ delay: i * 60 }}>
              <span class="meta-icon">{m.icon}</span>
              <span class="meta-val">{m.value}</span>
              <span class="meta-key">{m.label}</span>
            </div>
          {/each}
        </div>
        <p class="route-desc" use:fadeIn={{ delay: 200 }}>{$messages.route.desc}</p>
        {#key gpxShakeKey}
        <a
          href="{base}/gpx/acrossr10-rennsteig.gpx"
          download
          class="btn-primary gpx-btn"
          class:shake={gpxShakeKey > 0}
          onclick={shakeGpx}
        >
          ↓ {$messages.route.download}
        </a>
        {/key}
        <p class="gpx-hint">{$messages.route.downloadHint}</p>
      </div>

      <div class="elevation-card" use:fadeIn={{ delay: 120 }}>
        <p class="elev-title">{$messages.route.elevTitle}</p>
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <svg
          bind:this={elevSvg}
          viewBox="0 0 500 120"
          class="elev-svg"
          aria-label={$messages.route.elevTitle}
          role="img"
          onpointermove={onElevPointerMove}
          onpointerleave={onElevPointerLeave}
        >
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
          <!-- tooltip cursor -->
          {#if tooltip.visible}
            <line
              x1={tooltip.x / 100 * 500}
              y1="10"
              x2={tooltip.x / 100 * 500}
              y2="110"
              stroke="#f97316"
              stroke-width="1"
              stroke-dasharray="3 2"
              opacity="0.8"
            />
            <circle
              cx={tooltip.x / 100 * 500}
              cy={tooltip.y}
              r="3"
              fill="#f97316"
            />
          {/if}
        </svg>
        <!-- floating tooltip label -->
        {#if tooltip.visible}
          <div class="elev-tooltip" style="left: clamp(0px, calc({tooltip.x}% - 3rem), calc(100% - 6rem))">
            <span class="elev-tt-km">{tooltip.km} km</span>
            <span class="elev-tt-ele">{tooltip.ele} m</span>
          </div>
        {/if}
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
    <h2 use:fadeIn>{$messages.region.heading}</h2>
    <p class="section-intro" use:fadeIn={{ delay: 60 }}>{$messages.region.intro}</p>
    <div class="region-grid">
      {#each $messages.region.cards as card, i}
        <div class="region-card" use:fadeIn={{ delay: i * 60 }}>
          <span class="region-icon">{card.icon}</span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ NEWS (CMS) -->
<section class="section section-dark" id="news">
  <div class="container">
    <h2 use:fadeIn>{$messages.news.heading}</h2>
    <p class="section-intro" use:fadeIn={{ delay: 60 }}>{$messages.news.intro}</p>
    {#if data.cms.news[$locale].length === 0}
      <p class="cms-empty">{$messages.news.empty}</p>
    {:else}
      <div class="news-grid">
        {#each data.cms.news[$locale] as item, i (item.id)}
          <article class="news-card" use:fadeIn={{ delay: i * 70 }}>
            {#if item.imageUrl}
              <img class="news-img" src={item.imageUrl} alt={item.title} loading="lazy" />
            {/if}
            <div class="news-body">
              {#if item.date}
                <time class="news-date" datetime={item.date}>{item.date.slice(0, 10)}</time>
              {/if}
              <h3>{item.title}</h3>
              {#if item.teaser}
                <p class="news-teaser">{item.teaser}</p>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- ═══════════════════════════════════════════ HIGHLIGHTS (CMS) -->
{#if data.cms.highlights[$locale].length > 0}
<section class="section" id="highlights">
  <div class="container">
    <h2 use:fadeIn>{$messages.highlights.heading}</h2>
    <p class="section-intro" use:fadeIn={{ delay: 60 }}>{$messages.highlights.intro}</p>
    <div class="highlights-grid">
      {#each data.cms.highlights[$locale] as h, i (h.id)}
        <div class="highlight-card" use:fadeIn={{ delay: i * 70 }}>
          {#if h.imageUrl}
            <img class="highlight-img" src={h.imageUrl} alt={h.title} loading="lazy" />
          {/if}
          <h3>{h.title}</h3>
          {#if h.text}
            <p>{h.text}</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
{/if}

<!-- ═══════════════════════════════════════════ FAQ -->
<section class="section section-dark" id="faq">
  <div class="container">
    <h2 use:fadeIn>{$messages.faq.heading}</h2>
    <p class="section-intro" use:fadeIn={{ delay: 60 }}>{$messages.faq.intro}</p>
    <div class="faq-list">
      {#each $messages.faq.items as item, i}
        <div class="faq-item" class:open={openFaq === i} use:fadeIn={{ delay: i * 40 }}>
          <button class="faq-q" onclick={() => toggleFaq(i)} aria-expanded={openFaq === i}>
            <span>{item.q}</span>
            <span class="faq-arrow" class:rotated={openFaq === i}>▼</span>
          </button>
          {#if openFaq === i}
            <div class="faq-a" transition:slide={{ duration: 250 }}>{item.a}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════ ANMELDUNG / KONTAKT -->
<section class="section" id="contact">
  <div class="container narrow">
    <h2 use:fadeIn>{$messages.contact.heading}</h2>
    <p class="section-intro" use:fadeIn={{ delay: 60 }}>{$messages.contact.body}</p>
    <a href="mailto:{$messages.contact.email}" class="btn-primary btn-bounce" use:fadeIn={{ delay: 120 }}>{$messages.contact.cta}</a>
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

  /* ── countdown bar ── */
  .countdown-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    background: #0d1526;
    border-top: 1px solid #1e293b;
    border-bottom: 1px solid #1e293b;
    padding: .75rem 1.25rem;
  }
  .cd-heading {
    font-size: .72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #64748b;
  }
  .cd-units {
    display: flex;
    align-items: center;
    gap: .5rem;
  }
  .cd-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 2.5rem;
  }
  .cd-num {
    font-size: 1.25rem;
    font-weight: 800;
    color: #f97316;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cd-label {
    font-size: .6rem;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: .07em;
    margin-top: .1rem;
  }
  .cd-sep {
    color: #334155;
    font-size: 1.25rem;
    font-weight: 800;
    padding-bottom: 1rem;
  }
  .cd-over { color: #f97316; font-weight: 700; font-size: .9rem; }

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
    transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
  }
  .lb-teaser-card:hover {
    border-color: #f97316;
    box-shadow: 0 0 16px rgba(249,115,22,.18);
    transform: translateY(-2px);
  }
  .lb-teaser-card.champion { border-color: #f97316; }
  .lb-teaser-rank { font-size: 1.5rem; }
  .lb-teaser-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
  }
  .lb-teaser-name {
    color: #f1f5f9;
    font-weight: 700;
    font-size: .95rem;
  }
  .lb-progress-wrap {
    width: 100%;
    height: 4px;
    background: #334155;
    border-radius: 2px;
    margin: .35rem 0 .2rem;
    overflow: hidden;
  }
  .lb-progress-bar {
    height: 100%;
    width: var(--pct, 0%);
    background: #f97316;
    border-radius: 2px;
    transition: width 1s ease 0.3s;
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
  .stat-val { display: block; font-size: 2rem; font-weight: 800; color: #f97316; line-height: 1; font-variant-numeric: tabular-nums; }
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

  /* pulse animation on hero CTA – 3 iterations then stops */
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(249,115,22,.55); }
    60%  { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
    100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
  }
  .btn-pulse {
    animation: pulse-ring 1.6s ease-out 0.8s 3;
  }

  /* shake animation for GPX download */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-4px); }
    40%       { transform: translateX(4px); }
    60%       { transform: translateX(-3px); }
    80%       { transform: translateX(3px); }
  }
  .shake { animation: shake 0.45s ease; }

  /* bounce animation for contact CTA */
  @keyframes bounce-up {
    0%, 100% { transform: translateY(0); }
    40%       { transform: translateY(-5px); }
    70%       { transform: translateY(-2px); }
  }
  .btn-bounce:hover { animation: bounce-up 0.4s ease; }

  @media (prefers-reduced-motion: reduce) {
    .btn-pulse,
    .shake,
    .btn-bounce:hover {
      animation: none !important;
    }
  }

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
  .route-map-wrap {
    margin-bottom: 2rem;
  }
  .map-placeholder {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e293b;
    border-radius: 12px;
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 2rem;
  }
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
    transition: border-color 150ms ease, transform 150ms ease;
  }
  .route-meta-item:hover { border-color: #f97316; transform: translateY(-2px); }
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
    position: relative;
  }
  .elev-title { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #64748b; margin: 0 0 .75rem; }
  .elev-svg {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: .25rem;
    cursor: crosshair;
  }
  /* elevation tooltip */
  .elev-tooltip {
    position: absolute;
    top: 3.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(15,23,42,.92);
    border: 1px solid #f97316;
    border-radius: .375rem;
    padding: .25rem .5rem;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
  }
  .elev-tt-km { font-size: .7rem; color: #94a3b8; }
  .elev-tt-ele { font-size: .8rem; font-weight: 700; color: #f97316; }
  .segment-list { display: flex; flex-direction: column; gap: .35rem; margin-top: 1rem; }
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
    transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  }
  .region-card:hover {
    border-color: #f97316;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
  }
  .region-icon { font-size: 2rem; display: block; margin-bottom: .75rem; }
  .region-card p { color: #94a3b8; font-size: .9rem; margin: 0; }

  /* ── news (CMS) ── */
  .cms-empty {
    color: #64748b;
    font-size: .95rem;
    max-width: 52ch;
  }
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: 1.25rem;
  }
  .news-card {
    display: flex;
    flex-direction: column;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: .75rem;
    overflow: hidden;
    transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  }
  .news-card:hover {
    border-color: #f97316;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
  }
  .news-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }
  .news-body { padding: 1rem 1.25rem 1.25rem; }
  .news-date {
    display: block;
    font-size: .72rem;
    color: #64748b;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-bottom: .35rem;
  }
  .news-teaser { color: #94a3b8; font-size: .88rem; margin: .35rem 0 0; line-height: 1.6; }

  /* ── highlights (CMS) ── */
  .highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.25rem;
  }
  .highlight-card {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 1rem;
    padding: 1.5rem;
    overflow: hidden;
    transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  }
  .highlight-card:hover {
    border-color: #f97316;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
  }
  .highlight-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: .5rem;
    display: block;
    margin-bottom: 1rem;
  }
  .highlight-card p { color: #94a3b8; font-size: .9rem; margin: 0; }

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
  .faq-arrow {
    font-size: .7rem;
    color: #64748b;
    flex-shrink: 0;
    transition: transform 250ms ease;
  }
  .faq-arrow.rotated { transform: rotate(180deg); color: #f97316; }
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
