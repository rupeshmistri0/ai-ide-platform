# Reusable TypeScript Axios API Client Implementation Plan

This plan establishes a enterprise-grade, reusable TypeScript HTTP client using **Axios** in `apps/web/src/lib/http-client.ts` with Request/Response Interceptors, Automatic Concurrent JWT Refresh Queueing, Typed API Error handling, and Token Management utilities.

## User Review Required

> [!IMPORTANT]
> - **Concurrent Token Refresh Queue**: Automatically intercepts 401 Unauthorized responses, queues simultaneous failed requests, executes a single `POST /auth/refresh` call, updates stored access tokens, and replays all queued requests seamlessly.
> - **Type-Safe Generic Client**: Exports strongly-typed wrapper functions (`get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`) returning `Promise<T>`.
> - **Token Storage Utilities**: Safe SSR-compatible token manager supporting `localStorage` / cookie storage with automatic login redirection on expired refresh sessions.

---

## ⚡ Axios Architecture & JWT Refresh Queue Flow

```
                      ┌────────────────────────┐
                      │    HTTP Request        │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │  Request Interceptor   │
                      │  Attach Bearer Token   │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │    API Server Call     │
                      └───────────┬────────────┘
                                  │
             ┌────────────────────┴────────────────────┐
             │                                         │
       Success (200 OK)                          401 Unauthorized
             │                                         │
             ▼                                         ▼
      Return Data <T>                      Is refreshing in progress?
                                            ┌──────────┴──────────┐
                                            │ YES                 │ NO
                                            ▼                     ▼
                                    Push to Queue        Set isRefreshing=True
                                    (await promise)      Call POST /auth/refresh
                                                                  │
                                                        ┌─────────┴─────────┐
                                                        │ OK                │ FAIL
                                                        ▼                   ▼
                                                  Replay Queue      Clear Tokens
                                                  & Original        Redirect /login
```

---

## 📋 Proposed Changes

### Next.js Web App (`apps/web`)
#### [NEW] [apps/web/src/lib/http-client.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/http-client.ts)
#### [NEW] [apps/web/src/lib/token-storage.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/token-storage.ts)
#### [MODIFY] [apps/web/src/lib/api-client.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/api-client.ts)

### Core Shared Package (`packages/core`)
#### [NEW] [packages/core/src/http-client.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/http-client.ts)
#### [MODIFY] [packages/core/src/index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/index.ts)

---

## 🔍 Verification Plan

### Automated Checks
- Run TypeScript type checks: `npx tsc --noEmit` in `apps/web` and `packages/core`.

### Manual Verification
- Test request interception (Bearer token insertion).
- Test token refresh queueing on simulated 401 responses.
- Test typed error extraction (`ApiError`).
