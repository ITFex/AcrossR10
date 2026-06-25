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

## Validation

```sh
npm run check
```

## Build

```sh
npm run build
```

You can preview the production build with `npm run preview`.
