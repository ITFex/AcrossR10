# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

ENV HOST=0.0.0.0
ENV PORT=3000
ENV DB_PATH=/data/progress.db
VOLUME /data
EXPOSE 3000

CMD ["node", "build"]
