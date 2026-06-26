<script>
  export let members = [];
  export let routeMarkers = [];
  export let selfMemberId = '';

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const toPoint = (coords, bounds) => {
    if (!coords || !bounds) return null;
    const lonSpan = Math.max(0.001, bounds.maxLon - bounds.minLon);
    const latSpan = Math.max(0.001, bounds.maxLat - bounds.minLat);
    const x = 8 + ((coords.longitude - bounds.minLon) / lonSpan) * 84;
    const y = 92 - ((coords.latitude - bounds.minLat) / latSpan) * 84;

    return {
      x: clamp(x, 4, 96),
      y: clamp(y, 4, 96)
    };
  };

  $: normalizedMembers = (Array.isArray(members) ? members : []).filter((member) => member?.coords);
  $: normalizedMarkers = Array.isArray(routeMarkers) ? routeMarkers : [];
  $: geoPool = [
    ...normalizedMembers.map((member) => member.coords),
    ...normalizedMarkers.map((marker) => marker.coords)
  ];

  $: bounds = geoPool.length
    ? {
        minLat: Math.min(...geoPool.map((p) => p.latitude)) - 0.01,
        maxLat: Math.max(...geoPool.map((p) => p.latitude)) + 0.01,
        minLon: Math.min(...geoPool.map((p) => p.longitude)) - 0.01,
        maxLon: Math.max(...geoPool.map((p) => p.longitude)) + 0.01
      }
    : null;

  $: memberDots = normalizedMembers
    .map((member) => {
      const point = toPoint(member.coords, bounds);
      if (!point) return null;
      return {
        ...member,
        point,
        isSelf: member.id === selfMemberId
      };
    })
    .filter(Boolean);

  $: markerDots = normalizedMarkers
    .map((marker) => {
      const point = toPoint(marker.coords, bounds);
      if (!point) return null;
      return { ...marker, point };
    })
    .filter(Boolean);
</script>

<section class="live-map" aria-label="Live Tracking Karte">
  <header>
    <h3>Live Tracking</h3>
    <p>{memberDots.length} Mitglieder mit aktiver Position</p>
  </header>

  {#if bounds && (memberDots.length > 0 || markerDots.length > 0)}
    <svg viewBox="0 0 100 100" role="img" aria-label="Karte mit Live Positionen">
      <rect x="2" y="2" width="96" height="96" rx="9" class="ground" />

      {#each markerDots as marker}
        <g>
          <rect x={marker.point.x - 1.2} y={marker.point.y - 1.2} width="2.4" height="2.4" class="poi" />
        </g>
      {/each}

      {#each memberDots as member}
        <g>
          <circle
            cx={member.point.x}
            cy={member.point.y}
            r={member.isSelf ? '2.2' : '1.7'}
            class={member.isSelf ? 'self' : 'member'}
          />
          <text x={member.point.x + 1.6} y={member.point.y - 1.2}>{member.name}</text>
        </g>
      {/each}
    </svg>
  {:else}
    <p class="empty">Noch keine Live-Positionen verfügbar.</p>
  {/if}
</section>

<style>
  .live-map {
    border-radius: 0.9rem;
    border: 1px solid #c9aa82;
    background: linear-gradient(160deg, rgba(246, 235, 219, 0.98), rgba(233, 212, 186, 0.98));
    padding: 0.85rem;
    display: grid;
    gap: 0.6rem;
  }

  header {
    display: grid;
    gap: 0.2rem;
  }

  h3,
  p {
    margin: 0;
  }

  p {
    font-size: 0.85rem;
    color: #7c6243;
  }

  svg {
    width: 100%;
    height: auto;
    border-radius: 0.7rem;
    display: block;
  }

  .ground {
    fill: rgba(251, 245, 234, 0.95);
    stroke: #d5ba95;
    stroke-width: 0.5;
  }

  .poi {
    fill: #af7a43;
    stroke: #6f4a27;
    stroke-width: 0.3;
  }

  .member {
    fill: #497046;
    stroke: #294228;
    stroke-width: 0.35;
  }

  .self {
    fill: #c86f3d;
    stroke: #713617;
    stroke-width: 0.4;
  }

  text {
    font-size: 2.8px;
    fill: #4f3a25;
    font-weight: 700;
  }

  .empty {
    border: 1px dashed #cfb38c;
    border-radius: 0.7rem;
    padding: 0.65rem;
    background: rgba(251, 245, 236, 0.92);
  }
</style>