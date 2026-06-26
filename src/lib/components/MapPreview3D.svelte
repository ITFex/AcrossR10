<script>
  export let title = '3D Streckenprofil';
  export let points = [];

  const normalizePoint = (point, idx) => ({
    x: Number.isFinite(Number(point?.x)) ? Number(point.x) : idx,
    y: Number.isFinite(Number(point?.y)) ? Number(point.y) : 0,
    elevation: Number.isFinite(Number(point?.elevation)) ? Number(point.elevation) : 0,
    label: point?.label || `Abschnitt ${idx + 1}`
  });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  $: normalized = Array.isArray(points) && points.length > 1 ? points.map(normalizePoint) : [];
  $: xMin = normalized.length ? Math.min(...normalized.map((p) => p.x)) : 0;
  $: xMax = normalized.length ? Math.max(...normalized.map((p) => p.x)) : 1;
  $: yMin = normalized.length ? Math.min(...normalized.map((p) => p.y)) : 0;
  $: yMax = normalized.length ? Math.max(...normalized.map((p) => p.y)) : 1;
  $: zMin = normalized.length ? Math.min(...normalized.map((p) => p.elevation)) : 0;
  $: zMax = normalized.length ? Math.max(...normalized.map((p) => p.elevation)) : 1;

  const isoProject = (point) => {
    const xRange = Math.max(1, xMax - xMin);
    const yRange = Math.max(1, yMax - yMin);
    const zRange = Math.max(1, zMax - zMin);

    const nx = (point.x - xMin) / xRange;
    const ny = (point.y - yMin) / yRange;
    const nz = (point.elevation - zMin) / zRange;

    const px = 24 + nx * 60 - ny * 18;
    const py = 74 - nx * 18 - ny * 8 - nz * 26;
    return { x: clamp(px, 4, 96), y: clamp(py, 6, 96), nz };
  };

  $: projected = normalized.map(isoProject);
  $: path = projected.map((p) => `${p.x},${p.y}`).join(' ');

  $: segments = projected.slice(1).map((point, idx) => {
    const start = projected[idx];
    const zDelta = normalized[idx + 1].elevation - normalized[idx].elevation;
    const cls = zDelta > 5 ? 'rise' : zDelta < -5 ? 'drop' : 'flat';
    return { start, point, cls };
  });
</script>

<section class="map3d-shell" aria-label={title}>
  <div class="map3d-head">
    <h3>{title}</h3>
    <p>Isometrische Vorschau mit simulierten Höhenverläufen.</p>
  </div>

  {#if projected.length > 1}
    <svg viewBox="0 0 100 100" role="img" aria-label="3D Streckenprofil">
      <defs>
        <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c88b45" />
          <stop offset="100%" stop-color="#7d5f37" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="96" height="96" rx="8" class="plane" />

      {#each segments as segment}
        <line
          x1={segment.start.x}
          y1={segment.start.y}
          x2={segment.point.x}
          y2={segment.point.y}
          class={`segment ${segment.cls}`}
        />
      {/each}

      <polyline points={path} class="route" />

      {#each projected as point, idx}
        <g>
          <circle cx={point.x} cy={point.y} r="1.2" class="dot" />
          {#if idx === 0 || idx === projected.length - 1}
            <text x={point.x + 1.6} y={point.y - 1.2} class="label">
              {idx === 0 ? 'Start' : 'Ziel'}
            </text>
          {/if}
        </g>
      {/each}
    </svg>
  {:else}
    <p class="empty">Keine Streckendaten verfügbar.</p>
  {/if}
</section>

<style>
  .map3d-shell {
    border-radius: 0.9rem;
    border: 1px solid #c9aa82;
    background: linear-gradient(160deg, rgba(247, 236, 220, 0.98), rgba(236, 216, 191, 0.98));
    padding: 0.85rem;
    display: grid;
    gap: 0.65rem;
  }

  .map3d-head {
    display: grid;
    gap: 0.2rem;
  }

  h3,
  p {
    margin: 0;
  }

  p {
    color: #7c6243;
    font-size: 0.86rem;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 0.7rem;
    overflow: hidden;
  }

  .plane {
    fill: rgba(251, 244, 233, 0.94);
    stroke: #d7bc98;
    stroke-width: 0.5;
  }

  .route {
    fill: none;
    stroke: url(#routeGlow);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .segment {
    stroke-width: 1;
    opacity: 0.7;
  }

  .segment.rise {
    stroke: #4e7f4b;
  }

  .segment.drop {
    stroke: #975945;
  }

  .segment.flat {
    stroke: #8f744f;
  }

  .dot {
    fill: #fff7ea;
    stroke: #8f6537;
    stroke-width: 0.6;
  }

  .label {
    font-size: 3px;
    font-weight: 700;
    fill: #6a5033;
  }

  .empty {
    border-radius: 0.7rem;
    border: 1px dashed #cfb28b;
    background: rgba(250, 243, 233, 0.9);
    padding: 0.65rem;
  }
</style>