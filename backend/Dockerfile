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

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod --dangerously-allow-all-builds

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache wget

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/ || exit 1

CMD ["node", "dist/main.js"]
