FROM oven/bun:latest AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build
RUN bun build src/lib/db/migrate.ts --target bun --outdir ./.output

FROM base AS runner
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle ./drizzle
RUN mkdir -p /app/data && chown -R bun:bun /app/data

USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "sh", "-c", "bun .output/migrate.js && bun --bun .output/server/index.mjs" ]