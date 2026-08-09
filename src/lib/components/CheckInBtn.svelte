<script>
  import { createEventDispatcher } from 'svelte';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  export let userLocation = null;
  export let pois = [];
  export let threshold = 50;
  export let activeLabel = '\u2014';
  export let inactiveLabel = '\u2014';
  export let formatDistanceLabel = (distance) => `${Math.round(distance)}m`;

  const dispatch = createEventDispatcher();

  let nearestPoi = null;
  let distanceToNearest = Infinity;
  let isActive = false;
  let wasActive = false;
  let buttonLabel = inactiveLabel;
  const normalizeCoordinates = (poi) => ({
    latitude: poi?.latitude ?? poi?.lat,
    longitude: poi?.longitude ?? poi?.lng ?? poi?.lon
  });

  $: {
    nearestPoi = null;
    distanceToNearest = Infinity;

    if (userLocation && Array.isArray(pois)) {
      for (const poi of pois) {
        const candidate = normalizeCoordinates(poi);
        const distance = haversineDistanceMeters(userLocation, candidate);

        if (distance < distanceToNearest) {
          distanceToNearest = distance;
          nearestPoi = poi;
        }
      }
    }
  }

  $: isActive = Number.isFinite(distanceToNearest) && distanceToNearest <= threshold;
  $: buttonLabel = isActive
    ? activeLabel
    : Number.isFinite(distanceToNearest)
      ? formatDistanceLabel(distanceToNearest)
      : inactiveLabel;

  $: if (isActive !== wasActive) {
    if (isActive && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(120);
    }
    wasActive = isActive;
  }

  const handleClick = () => {
    if (!isActive || !nearestPoi) return;

    dispatch('checkin', {
      poi: nearestPoi,
      distance: distanceToNearest,
      userLocation
    });
  };
</script>

<button class:active={isActive} disabled={!isActive} on:click={handleClick}>
  {buttonLabel}
</button>

<style>
  button {
    width: 100%;
    min-height: 56px;
    padding: 0.75rem 1rem;
    border: 0;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
    color: #f8fafc;
    background: #334155;
    cursor: not-allowed;
    transition: transform 120ms ease, background-color 120ms ease;
  }

  button.active {
    background: #15803d;
    cursor: pointer;
  }

  button.active:active {
    transform: scale(0.98);
  }
</style>
