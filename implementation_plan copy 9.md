# Structured Logging System Implementation Plan

This plan outlines the architecture and implementation steps to build a unified, structured logging system for both **FastAPI** (backend) and **Next.js** (frontend/server side).

---

## Technical Specifications

### FastAPI (Python)
- **Log Levels**: Support `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
- **Structured (JSON) Logging**: Logs will be structured JSON containing `timestamp`, `level`, `message`, `logger`, `file`, `line`, and any contextual `extra` fields (such as `correlation_id`).
- **File Logging**: Direct output to `logs/api.log` with size-based log rotation (`RotatingFileHandler`).
- **Console Logging**: Color-coded, highly readable output for development; JSON structured logging for production.
- **Contextual Correlation ID**: Use python's `contextvars` to automatically inject the HTTP request `correlation_id` into all logs triggered within the request lifecycle.

### Next.js & Electron (TypeScript in `@ai-ide/core`)
- **Log Levels**: Support `debug`, `info`, `warn`, `error`.
- **Structured (JSON) Logging**: JSON formatted logs containing `timestamp`, `level`, `message`, and dynamic `metadata` objects.
- **Environment Aware**:
  - **Node.js (Next.js Server Side & Electron Main)**: Writes logs to both console and `logs/app.log` utilizing Node's `fs` and path modules.
  - **Browser (Next.js Client Side)**: Safely fallbacks to `console` logging only (suppressing file system calls to avoid browser exceptions).
- **Console Formatting**: Clean, colored console logs in development; structured JSON logs in production.

---

## Proposed Changes

### FastAPI Backend

#### [MODIFY] [logging.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/core/logging.py)
- Refactor the logger configuration to use a custom `JSONFormatter` and standard `StreamHandler` + `RotatingFileHandler`.
- Implement `contextvars` correlation ID injection.

#### [MODIFY] [correlation.py](file:///d:/mysoft/api-ide-platform/apps/api/app/middleware/correlation.py)
- Set the current correlation ID in the context variable at the start of the request, and clear it upon completion.

---

### `@ai-ide/core` Shared Package

#### [NEW] [logger.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/logger.ts)
- Create a cross-platform `StructuredLogger` class with log level thresholds, metadata formatting, and conditional Node.js file system logging.

#### [MODIFY] [index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/index.ts)
- Export the `StructuredLogger` and global helper instances.

---

### Next.js Web App

#### [MODIFY] [config.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/config.ts)
- Expose `LOG_LEVEL` environment variable support.

---

## Verification Plan

### Automated Tests
- Run Backend Python validation: `python -c "from app.core.logging import logger; logger.info('Hello World', extra={'foo': 'bar'})"`
- Run TypeScript validation: `pnpm --filter web-app typecheck`
- Run Next.js production build: `pnpm --filter web-app build`

### Manual Verification
- Trigger endpoints (e.g. `/health`) and check that `logs/api.log` is generated containing structured logs with the request correlation IDs.
- Import the logger in Next.js pages/server files, log actions, and verify console and `logs/app.log` files are created.
