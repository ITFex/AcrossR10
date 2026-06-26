import { writable } from 'svelte/store';

const STORAGE_KEY = 'acrossr10.leaderboard.v1';

const defaultState = {
  riders: []
};

function normalizeState(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.riders)) {
    return defaultState;
  }

  return {
    riders: value.riders
      .filter((item) => item && item.name)
      .map((item) => ({
        name: String(item.name),
        totalPoints: Number(item.totalPoints) || 0,
        totalCheckIns: Number(item.totalCheckIns) || 0,
        uniquePois: Number(item.uniquePois) || 0,
        lastCheckInAt: item.lastCheckInAt || null,
        visitedPoiIds: Array.isArray(item.visitedPoiIds) ? item.visitedPoiIds : []
      }))
  };
}

function loadState() {
  if (typeof localStorage === 'undefined') {
    return defaultState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return normalizeState(JSON.parse(raw));
  } catch {
    return defaultState;
  }
}

function saveState(state) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors to keep check-in flow running.
  }
}

function sortRiders(riders) {
  return [...riders].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.totalCheckIns !== a.totalCheckIns) return b.totalCheckIns - a.totalCheckIns;
    return String(a.name).localeCompare(String(b.name), 'de');
  });
}

function createLeaderboardStore() {
  const { subscribe, set, update } = writable(defaultState);

  return {
    subscribe,
    initialize() {
      set(loadState());
    },
    addCheckIn({ riderName, poiId, distance, timestamp }) {
      update((state) => {
        const trimmedName = String(riderName || '').trim();
        if (!trimmedName) return state;

        const riders = [...state.riders];
        const idx = riders.findIndex(
          (rider) => rider.name.toLowerCase() === trimmedName.toLowerCase()
        );

        const points = Math.max(10, 100 - Math.min(90, Math.round(distance || 0)));
        const nowIso = new Date(timestamp || Date.now()).toISOString();

        if (idx === -1) {
          riders.push({
            name: trimmedName,
            totalPoints: points,
            totalCheckIns: 1,
            uniquePois: 1,
            lastCheckInAt: nowIso,
            visitedPoiIds: [poiId]
          });
        } else {
          const current = riders[idx];
          const visited = new Set(current.visitedPoiIds || []);
          visited.add(poiId);

          riders[idx] = {
            ...current,
            name: trimmedName,
            totalPoints: current.totalPoints + points,
            totalCheckIns: current.totalCheckIns + 1,
            uniquePois: visited.size,
            lastCheckInAt: nowIso,
            visitedPoiIds: [...visited]
          };
        }

        const nextState = { riders: sortRiders(riders) };
        saveState(nextState);
        return nextState;
      });
    }
  };
}

const leaderboard = createLeaderboardStore();

export default leaderboard;
