FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
ENV npm_config_dangerously_allow_all_builds=true
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache wget \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
