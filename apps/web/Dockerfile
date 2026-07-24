FROM node:18-alpine AS base

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/core/package.json ./packages/core/
COPY packages/tsconfig/package.json ./packages/tsconfig/

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter web-app build

EXPOSE 3000
CMD ["pnpm", "--filter", "web-app", "start"]
