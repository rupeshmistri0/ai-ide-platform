# Centralized Configuration System Implementation Plan

This plan establishes a unified, strongly-typed configuration system across the monorepo for **Next.js 15 (`apps/web`)**, **Electron (`apps/desktop`)**, and **FastAPI (`apps/api`)** with `.env` variable validation, environment detection (`development`, `production`, `test`), and type-safe config accessors.

## User Review Required

> [!IMPORTANT]
> - **Unified `.env.example` Template**: Single authoritative template at the workspace root defining API URLs, WebSocket endpoints, JWT secrets, database connection strings, and application defaults.
> - **TypeScript Config Engine (`@ai-ide/core`)**: Centralized TypeScript configuration engine in `packages/core/src/config/` providing validated, strongly-typed config objects to both Next.js and Electron.
> - **FastAPI Pydantic v2 Config**: Synchronized Pydantic v2 `BaseSettings` module in `apps/api/app/core/config.py` matching environment variable definitions.

---

## 🏗️ Centralized Config Architecture

```
                               ┌──────────────────────────────────┐
                               │     Workspace Root .env /        │
                               │   .env.development / .env.example│
                               └────────────────┬─────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         │                                      │                                      │
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│  Next.js 15 Web  │                  │ Electron Desktop │                  │ FastAPI Backend  │
│    (apps/web)    │                  │  (apps/desktop)  │                  │    (apps/api)    │
└────────┬─────────┘                  └────────┬─────────┘                  └────────┬─────────┘
         │                                     │                                     │
         ▼                                     ▼                                     ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│ @ai-ide/core     │                  │ @ai-ide/core     │                  │ Pydantic v2      │
│ AppConfig Engine │                  │ AppConfig Engine │                  │ BaseSettings     │
└──────────────────┘                  └──────────────────┘                  └──────────────────┘
```

---

## ⚡ Configuration Component Specifications

### 1. Environment Templates (`.env.example` & `.env.development`)
- Root workspace `.env.example` defining:
  - `NODE_ENV`: `development` | `production` | `test`
  - `NEXT_PUBLIC_API_URL`: `http://localhost:8000/api/v1`
  - `NEXT_PUBLIC_WS_URL`: `ws://localhost:8000/api/v1/ws`
  - `NEXT_PUBLIC_APP_NAME`: `Enterprise AI IDE Platform`
  - `DESKTOP_DEV_SERVER_URL`: `http://localhost:3000`
  - `DATABASE_URL`: `sqlite+aiosqlite:///./enterprise_ai_ide.db`
  - `SECRET_KEY`: `09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7`

### 2. `@ai-ide/core` Config Engine (`packages/core/src/config/`)
- `env.ts`: Environment detection helpers (`isDev`, `isProd`, `isTest`, `isBrowser`, `isServer`).
- `config.ts`: Strongly-typed `AppConfig` interface and `getConfig()` provider reading `process.env` with fallback defaults for Next.js and Electron.

### 3. Next.js Config Helper (`apps/web/src/lib/config.ts`)
- Re-exports `appConfig`, `isDev`, `isProd`, and client-side safe public variables (`NEXT_PUBLIC_*`).

### 4. Electron Config Adapter (`apps/desktop/src/main/config/env.ts`)
- Adapter consuming `@ai-ide/core` `appConfig` for Electron BrowserWindow dimensions, dev server URL polling, and preload script paths.

### 5. FastAPI Pydantic v2 Settings (`apps/api/app/core/config.py`)
- `Settings(BaseSettings)` module reading `.env` with strict validation, CORS origins list, and database connection strings.

---

## 📋 Proposed Changes

### Workspace Environment Templates
#### [NEW] [.env.example](file:///d:/mysoft/ai-ide-platform/.env.example)
#### [NEW] [.env.development](file:///d:/mysoft/ai-ide-platform/.env.development)

### Shared Core Package (`packages/core`)
#### [NEW] [packages/core/src/config/env.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/config/env.ts)
#### [NEW] [packages/core/src/config/config.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/config/config.ts)
#### [NEW] [packages/core/src/config/index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/config/index.ts)
#### [MODIFY] [packages/core/src/index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/index.ts)

### Next.js & Electron Integration
#### [NEW] [apps/web/src/lib/config.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/config.ts)
#### [MODIFY] [apps/desktop/src/main/config/env.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/config/env.ts)

### FastAPI Backend (`apps/api`)
#### [MODIFY] [apps/api/app/core/config.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/core/config.py)

---

## 🔍 Verification Plan

### Automated Checks
- Run TypeScript type check across monorepo: `pnpm --filter web-app typecheck` and `npx tsc` in `apps/desktop`.
- Verify FastAPI Pydantic config compilation: `python -m py_compile app/core/config.py`.

### Manual Verification
- Test environment detection (`development` vs `production`).
- Verify Next.js, Electron, and FastAPI load matching environment variables.
