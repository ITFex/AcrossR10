import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const SELF_ID_KEY = 'acrossr10.member-self-id';
const HEARTBEAT_MS = 5000;
const SNAPSHOT_MS = 5000;
const SNAPSHOT_LOOKBACK_MINUTES = 15;
const API_BASE = '/api/member-locations';

const defaultState = {
  members: [],
  ready: false,
  error: null,
  backend: 'postgres'
};

const normalizeMember = (entry = {}, source = 'remote') => {
  const latitude = Number(entry?.latitude ?? entry?.coords?.latitude);
  const longitude = Number(entry?.longitude ?? entry?.coords?.longitude);
  const accuracy = Number(entry?.accuracy);
  const lastSeen = entry.last_seen || entry.lastSeen || new Date().toISOString();

  return {
    id: String(entry.member_id || entry.id || ''),
    name: String(entry.name || 'Unbekannt'),
    status: String(entry.status || 'active'),
    coords:
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? {
            latitude,
            longitude
          }
        : null,
    accuracy: Number.isFinite(accuracy) ? Math.max(1, Math.round(accuracy)) : null,
    lastSeen,
    source: String(entry.source || source)
  };
};

const getSelfId = () => {
  if (!browser) return 'server';

  const existing = localStorage.getItem(SELF_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `member-${Date.now()}-${Math.round(Math.random() * 1000)}`;

  localStorage.setItem(SELF_ID_KEY, generated);
  return generated;
};

const isFresh = (isoDate, thresholdMs = 90_000) => {
  const ts = new Date(isoDate).getTime();
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts <= thresholdMs;
};

function createMemberTrackingStore() {
  const { subscribe, update, set } = writable(defaultState);
  let started = false;
  let selfId = null;
  let lastHeartbeatAt = 0;
  let pollTimer = null;

  const patchState = (patch) => {
    update((state) => ({
      ...state,
      ...patch,
      members: patch.members || state.members
    }));
  };

  const applyMemberPatch = (payload, source = 'remote') => {
    const normalized = normalizeMember(payload, source);
    if (!normalized.id) return;

    update((state) => {
      const idx = state.members.findIndex((member) => member.id === normalized.id);
      const members = [...state.members];

      if (idx === -1) {
        members.push(normalized);
      } else {
        members[idx] = {
          ...members[idx],
          ...normalized,
          coords: normalized.coords || members[idx].coords,
          accuracy: normalized.accuracy ?? members[idx].accuracy
        };
      }

      return {
        ...state,
        members: members
          .filter((member) => isFresh(member.lastSeen, 15 * 60_000))
          .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
      };
    });
  };

  const publishSelfState = async ({ name, coords, accuracy, status = 'active', force = false }) => {
    const trimmedName = String(name || '').trim();

    if (!trimmedName) return;

    const now = Date.now();
    if (!force && now - lastHeartbeatAt < HEARTBEAT_MS) return;
    lastHeartbeatAt = now;

    const latitude = Number(coords?.latitude);
    const longitude = Number(coords?.longitude);

    const payload = {
      member_id: selfId,
      name: trimmedName,
      status,
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
      accuracy: Number.isFinite(Number(accuracy)) ? Math.round(Number(accuracy)) : null,
      last_seen: new Date().toISOString(),
      source: 'web'
    };

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      patchState({ error: body.error || `Database write failed (${response.status}).` });
      return;
    }

    const body = await response.json();

    patchState({ error: null });
    applyMemberPatch(body.member || payload, 'self');
  };

  const loadSnapshot = async () => {
    const response = await fetch(`${API_BASE}?sinceMinutes=${SNAPSHOT_LOOKBACK_MINUTES}`);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      patchState({ ready: true, error: body.error || `Database read failed (${response.status}).` });
      return;
    }

    const body = await response.json();

    const members = (body.members || [])
      .map((row) => normalizeMember(row, 'remote'))
      .filter((member) => member.id)
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

    patchState({ members, ready: true, error: null });
  };

  const startPolling = () => {
    if (!browser || pollTimer) return;
    pollTimer = window.setInterval(() => {
      loadSnapshot().catch(() => {
        // Ignore transient polling errors; latest error is handled in loadSnapshot.
      });
    }, SNAPSHOT_MS);
  };

  const stopPolling = () => {
    if (!pollTimer) return;
    clearInterval(pollTimer);
    pollTimer = null;
  };

  return {
    subscribe,
    getSelfId() {
      if (!selfId) selfId = getSelfId();
      return selfId;
    },
    async initialize() {
      if (!browser) return;

      if (!selfId) selfId = getSelfId();
      if (started) return;
      started = true;

      await loadSnapshot();
      startPolling();
    },
    stop() {
      stopPolling();
      started = false;
    },
    async setSelfProfile({ name, status = 'active' }) {
      const trimmedName = String(name || '').trim();
      if (!trimmedName) return;

      if (!selfId) selfId = getSelfId();

      update((state) => {
        const existing = state.members.find((member) => member.id === selfId);
        if (!existing) return state;

        return {
          ...state,
          members: state.members.map((member) =>
            member.id === selfId ? { ...member, name: trimmedName, status } : member
          )
        };
      });
    },
    async updateSelfLocation({ name, coords, accuracy }) {
      const trimmedName = String(name || '').trim();
      if (!trimmedName || !coords) return;

      if (!selfId) selfId = getSelfId();
      await publishSelfState({
        name: trimmedName,
        coords,
        accuracy,
        status: 'active'
      });
    },
    async markSelfInactive({ name, coords, accuracy }) {
      const trimmedName = String(name || '').trim();
      if (!trimmedName) return;

      if (!selfId) selfId = getSelfId();
      await publishSelfState({
        name: trimmedName,
        coords,
        accuracy,
        status: 'inactive',
        force: true
      });
    }
  };
}

const memberTracking = createMemberTrackingStore();

export default memberTracking;