# Build stage
# NOTE: node:22.17.0-alpine (npm 10.9.2) ist exakt die Version, mit der der
# package-lock.json generiert wurde – npm ci bricht sonst mit Sync-Fehlern ab.
FROM node:22.17.0-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage (Next.js standalone output)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static
RUN mkdir -p /media && chown nextjs:nodejs /media

USER nextjs
VOLUME /media
EXPOSE 3000
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
