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

## Supabase LiveTracking Setup

1. Install dependencies

	npm install

2. Configure environment variables

	Copy .env.example to .env and set:

	PUBLIC_SUPABASE_URL
	PUBLIC_SUPABASE_ANON_KEY

3. Create database table and policies

	Run the SQL from supabase/member_locations.sql in your Supabase SQL editor.

4. Enable Realtime for the table

	In Supabase Dashboard: Database -> Replication -> enable public.member_locations.

5. Start app

	npm run dev

The check-in page sends GPS heartbeat updates to Supabase. The members page subscribes to realtime changes and shows live member positions.

## Validation

```sh
npm run check
```

## Build

```sh
npm run build
```

You can preview the production build with `npm run preview`.
