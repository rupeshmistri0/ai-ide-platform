# Enterprise Electron Application Architecture Implementation Plan

This plan establishes a secure, modular, enterprise-grade Electron application architecture in `apps/desktop` that loads and integrates with the Next.js 15 App Router frontend (`apps/web`).

## User Review Required

> [!IMPORTANT]
> - **Dual Mode Engine**:
>   - **Development Mode**: Electron boots and automatically polls/waits for the Next.js 15 dev server at `http://localhost:3000`. Once connected, HMR and live reloading work out of the box.
>   - **Production Mode**: Electron securely loads the exported Next.js static build (`apps/web/out`) or local static server protocol.
> - **Security & Sandboxing**: `contextIsolation: true`, `nodeIntegration: false`, and strict channel-whitelisted `contextBridge` (`window.electronAPI`).

---

## 🛠️ Architecture & Enterprise Directory Layout

```
apps/desktop/
├── src/
│   ├── main/                        # Electron Main Process Modules
│   │   ├── config/
│   │   │   └── env.ts               # Dev vs Prod URL, port & window configuration
│   │   ├── handlers/                # Domain-driven IPC Event Handlers
│   │   │   ├── app-handler.ts       # App version, system metrics & info
│   │   │   ├── window-handler.ts    # Minimize, maximize, close, fullscreen controls
│   │   │   └── dialog-handler.ts    # Native open/save file dialogs & notifications
│   │   ├── window/
│   │   │   └── window-manager.ts    # BrowserWindow lifecycle & state manager
│   │   └── index.ts                 # Main process bootstrapper & event loop
│   ├── preload/                     # Electron Preload Script
│   │   └── index.ts                 # Secure contextBridge API exposure (window.electronAPI)
│   └── shared/                      # Shared Contracts & Constants
│       ├── channels.ts              # Strongly-typed IPC Channel ENUMs
│       └── types.ts                 # Inter-process DTOs & Global Window Type Declaration
├── package.json                     # Scripts for dev (concurrent dev server) & build
└── tsconfig.json                    # TypeScript compiler setup
```

---

## 🔒 IPC Bridge API Surface (`window.electronAPI`)

| API Function | Channel | Description |
| :--- | :--- | :--- |
| `getSystemInfo()` | `system:get-info` | Returns OS platform, arch, total memory, and Electron version |
| `showNotification(title, body)` | `dialog:notify` | Dispatches native OS toast notifications |
| `openFileDialog(options)` | `dialog:open-file` | Opens native file selection modal and returns file paths |
| `minimizeWindow()` | `window:minimize` | Minimizes current window |
| `maximizeWindow()` | `window:maximize` | Toggles window maximize / restore |
| `closeWindow()` | `window:close` | Closes active window |
| `onSystemEvent(callback)` | `system:event` | Realtime push listener from main process to renderer |

---

## 📋 Proposed File Changes

### Desktop App Package & Configurations
#### [MODIFY] [apps/desktop/package.json](file:///d:/mysoft/ai-ide-platform/apps/desktop/package.json)
#### [MODIFY] [apps/desktop/tsconfig.json](file:///d:/mysoft/ai-ide-platform/apps/desktop/tsconfig.json)

### Shared IPC Contracts
#### [NEW] [apps/desktop/src/shared/channels.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/shared/channels.ts)
#### [NEW] [apps/desktop/src/shared/types.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/shared/types.ts)

### Preload Script (Secure Bridge)
#### [MODIFY] [apps/desktop/src/preload/index.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/preload/index.ts)

### Main Process Core
#### [NEW] [apps/desktop/src/main/config/env.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/config/env.ts)
#### [NEW] [apps/desktop/src/main/window/window-manager.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/window/window-manager.ts)
#### [NEW] [apps/desktop/src/main/handlers/app-handler.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/handlers/app-handler.ts)
#### [NEW] [apps/desktop/src/main/handlers/window-handler.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/handlers/window-handler.ts)
#### [NEW] [apps/desktop/src/main/handlers/dialog-handler.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/handlers/dialog-handler.ts)
#### [NEW] [apps/desktop/src/main/index.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/main/index.ts)

---

## 🔍 Verification Plan

### Automated Checks
- Run TypeScript compilation check for desktop app: `npx tsc --noEmit` in `apps/desktop`.
- Verify IPC channel type alignment and contract declarations.

### Manual Verification
- Test Electron window launch in Development mode against `http://localhost:3000`.
- Verify secure IPC bridge functionality (`window.electronAPI.getSystemInfo()`, window controls, native notifications).
