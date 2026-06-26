CREATE TABLE IF NOT EXISTS public.member_locations (
  member_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accuracy INTEGER,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL DEFAULT 'web'
);

CREATE INDEX IF NOT EXISTS idx_member_locations_last_seen
  ON public.member_locations (last_seen DESC);

CREATE TABLE IF NOT EXISTS public.pois (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geofence_radius_meters INTEGER NOT NULL DEFAULT 50,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checkins (
  id BIGSERIAL PRIMARY KEY,
  rider_name TEXT NOT NULL,
  poi_id BIGINT NOT NULL REFERENCES public.pois(id) ON DELETE RESTRICT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy INTEGER,
  distance_meters INTEGER NOT NULL,
  points INTEGER NOT NULL,
  inside_geofence BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkins_rider_created_at
  ON public.checkins (rider_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checkins_created_at
  ON public.checkins (created_at DESC);

INSERT INTO public.pois (name, latitude, longitude, geofence_radius_meters)
SELECT 'Rastplatz Nord', 50.6932, 10.7311, 50
WHERE NOT EXISTS (SELECT 1 FROM public.pois WHERE name = 'Rastplatz Nord');

INSERT INTO public.pois (name, latitude, longitude, geofence_radius_meters)
SELECT 'Fahrradstation Süd', 50.6334, 10.7583, 50
WHERE NOT EXISTS (SELECT 1 FROM public.pois WHERE name = 'Fahrradstation Süd');

INSERT INTO public.pois (name, latitude, longitude, geofence_radius_meters)
SELECT 'Aussichtspunkt West', 50.6821, 10.6997, 50
WHERE NOT EXISTS (SELECT 1 FROM public.pois WHERE name = 'Aussichtspunkt West');
