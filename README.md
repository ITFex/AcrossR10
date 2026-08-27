# AcrossR10

A SvelteKit-based mobile geofencing check-in app for cyclists.

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm
- Docker & Docker Compose (for running the full stack)

## Development

### Without Docker (app only)

Copy `.env.example` to `.env` and fill in the values, then install dependencies and start the dev server:

```sh
cp .env.example .env
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The app starts location tracking on load and enables check-in when the current position is within range of configured POIs.

### With Docker Compose (full stack)

The compose stack includes:
- **postgres** – PostgreSQL database for Keycloak
- **keycloak** – Keycloak identity provider (port 8080)
- **app** – SvelteKit application (port 3000)

```sh
cp .env.example .env
# Edit .env and set AUTH_SECRET, KEYCLOAK_SECRET, and secure passwords

docker compose up -d
```

#### Keycloak setup (first run)

1. Open the Keycloak admin console at <http://localhost:8080>
2. Log in with the admin credentials from your `.env` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`)
3. Create a new realm called `acrossr10`
4. Inside the realm, create a client:
   - **Client ID**: `acrossr10-app`
   - **Client authentication**: enabled (Confidential)
   - **Standard flow**: enabled
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
5. Under the client's **Credentials** tab, copy the **Client Secret** into `KEYCLOAK_SECRET` in `.env`
6. To allow self-registration, go to **Realm settings → Login** and enable **User registration**
7. Restart the app container: `docker compose restart app`

The `KEYCLOAK_ISSUER` should be `http://keycloak:8080/realms/acrossr10` when running inside Docker Compose, or `http://localhost:8080/realms/acrossr10` for local dev.

## Validation

```sh
npm run check
```

## Build

```sh
npm run build
```

You can preview the production build with `npm run preview`.
