# AcrossR10

A SvelteKit-based mobile geofencing check-in app for cyclists.

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm

## Development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The app starts location tracking on load and enables check-in when the current position is within range of configured POIs.

## Local PostgreSQL LiveTracking Setup

1. Install dependencies

	npm install

2. Start local PostgreSQL in Docker (external port `5437`)

	docker compose up -d

3. Configure environment variables

	Copy .env.example to .env and set:

	DATABASE_URL
	MEMBER_ACCESS_CODE
	ADMIN_ACCESS_CODE
	AUTH_SESSION_SECRET

4. Database schema bootstrap

	The table is initialized automatically from:
	docker/postgres/init/001_member_locations.sql

5. Start app

	npm run dev

The check-in page sends GPS heartbeat updates to a SvelteKit API endpoint backed by local PostgreSQL. The members page refreshes live positions via periodic snapshot polling.

## New API Endpoints (Sprint)

- `GET /api/health` database connectivity check
- `GET /api/pois` active POIs for check-in map/geofence
- `POST /api/checkins` server-side check-in validation + point calculation
- `GET /api/leaderboard` aggregated all-time ranking
- `GET/POST /api/member-locations` live member snapshot + heartbeat upsert

## Auth & Roles (Step 1)

- Session-based auth via signed HttpOnly cookie
- Access codes:
	- `MEMBER_ACCESS_CODE` -> role `member`
	- `ADMIN_ACCESS_CODE` -> role `admin`
- Protected endpoints:
	- `GET/POST /api/member-locations`
	- `POST /api/checkins`
	- `GET /api/leaderboard`

## Important When Updating DB Init SQL

If you already created the PostgreSQL volume and changed files under `docker/postgres/init`, run:

```sh
docker compose down -v
docker compose up -d
```

This recreates the local DB and reapplies the initialization SQL.

## Docker Commands

```sh
# Start PostgreSQL container (port 5437 exposed)
docker compose up -d

# Stop container
docker compose down

# Stop and remove DB volume (destructive)
docker compose down -v
```

## Validation

```sh
npm run check
```

## Build

```sh
npm run build
```

You can preview the production build with `npm run preview`.
