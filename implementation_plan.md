# Next.js 15 Enterprise Scalable Architecture Implementation Plan

This plan establishes a production-grade, domain-driven enterprise architecture for the Next.js 15 App Router application in `apps/web`.

## User Review Required

> [!IMPORTANT]
> - **Next.js 15 & React 19 Upgrade**: `apps/web/package.json` will be updated to Next.js 15 with App Router, React 19 (or 18.3 compatible), TanStack Query v5, Zustand v5, and Lucide React icons.
> - **Enterprise Architecture**: Domain-driven feature modularity (`src/features/*`) paired with atomic UI primitives (`src/components/ui/*`), centralized Zustand state management, and TanStack Query key factories.

---

## Key Features & Architecture Breakdown

### 1. Technology & Design Tokens Setup
- Next.js 15 App Router + TypeScript strict typing
- TailwindCSS design system with custom CSS variables for dark/light themes, sleek glassmorphic surfaces, dynamic color tokens, and smooth micro-animations.
- Full set of shadcn/ui primitives (`Button`, `Input`, `Card`, `Dialog`, `DropdownMenu`, `Avatar`, `Badge`, `Tabs`, `Select`, `Switch`, `Separator`, `Tooltip`, `ScrollArea`, `Skeleton`).

### 2. State Management & Data Fetching Layer
- **Zustand Stores** (`src/stores/`):
  - `useAuthStore`: Authenticated user, session state, login/logout handlers.
  - `useWorkspaceStore`: Active workspace, projects list, active project filters, task selection.
  - `useChatStore`: Active conversation thread, message list, selected AI model (Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o, DeepSeek-R1), streaming state, artifact drawer state.
  - `useUIStore`: Sidebar collapsed state, dark/light theme state, dynamic breadcrumb titles, active modals.
- **TanStack Query** (`src/lib/query-client.ts`, `src/hooks/`):
  - Standardized Query Client Provider with caching, retry strategies, and query key factories (`authKeys`, `workspaceKeys`, `chatKeys`, `dashboardKeys`).

### 3. Application Layout & Navigation System (`src/components/layout/`)
- Collapsible Enterprise Sidebar with active route highlighting, badging, keyboard shortcuts, and compact mode.
- Top Header Navbar with dynamic Breadcrumbs, Global Command Search (`Ctrl+K`), AI Quick Trigger, Notifications popover, Theme toggle button, and User Profile menu.
- Responsive Mobile Drawer navigation (`Sheet` overlay) for seamless mobile responsiveness.

### 4. Domain Feature Modules (`src/features/`)

#### A. Authentication (`src/features/auth/`)
- **Login Page** (`app/(auth)/login/page.tsx`): Form validation, remember me, password visibility toggle, mock social auth providers.
- **Register Page** (`app/(auth)/register/page.tsx`): Name, email, password strength indicator, terms acceptance.
- **Forgot Password Page** (`app/(auth)/forgot-password/page.tsx`): Password reset request & email confirmation flow.

#### B. Executive Dashboard (`src/features/dashboard/`)
- Key Metric Stats Cards (Active Projects, AI Tokens Consumed, API Latency, Team Members) with trend indicators.
- Interactive Visual Analytics Chart component (Mock SVG/CSS chart with timeline filters).
- Recent Projects Activity Table with search, status filters, and action dropdowns.
- Quick Actions Panel (New Project, Invite Team, Launch AI Assistant).

#### C. Collaborative Workspace (`src/features/workspace/`)
- Workspace Switcher dropdown (Enterprise, Personal, Team Staging).
- Task / Project Kanban Board & List View switcher with status columns (Backlog, In Progress, Code Review, Done).
- Interactive Task Detail Modal with task assignment, priority tags, and activity comments.

#### D. Comprehensive Settings (`src/features/settings/`)
- Tabbed Settings Layout:
  - **Profile Settings**: Avatar upload, personal info, time zone, bio.
  - **Team & Permissions**: Member list, role assignments (Admin, Developer, Viewer), pending invites.
  - **Security & 2FA**: Password updates, 2FA toggle, active session revocation.
  - **Billing & Usage**: Plan status (Enterprise Pro), usage quotas, billing history table.
  - **AI & API Configuration**: Model provider selection, default temperature slider, API Key inputs.

#### E. Next-Gen AI Chat (`src/features/ai-chat/`)
- AI Model Selector Dropdown (Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o, DeepSeek-R1).
- Conversation Sidebar with search, pinned chats, and history grouped by date.
- Dynamic Suggested Prompt Chips for rapid initiation.
- Interactive Message Thread with user prompts, AI responses, code syntax highlighting, copy snippets, and live typing stream simulator.
- Side Artifact / Code Preview Drawer for rendering generated code, documentation, or charts side-by-side with the chat.

---

## Proposed Changes

### Configuration & Root Package
#### [MODIFY] [apps/web/package.json](file:///d:/mysoft/ai-ide-platform/apps/web/package.json)
#### [NEW] [apps/web/tailwind.config.ts](file:///d:/mysoft/ai-ide-platform/apps/web/tailwind.config.ts)
#### [NEW] [apps/web/postcss.config.mjs](file:///d:/mysoft/ai-ide-platform/apps/web/postcss.config.mjs)
#### [MODIFY] [apps/web/src/app/globals.css](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/globals.css)

### Core Shared Infrastructure
#### [NEW] [apps/web/src/types/index.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/types/index.ts)
#### [NEW] [apps/web/src/lib/utils.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/utils.ts)
#### [NEW] [apps/web/src/lib/query-client.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/query-client.ts)
#### [NEW] [apps/web/src/lib/api-client.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/lib/api-client.ts)
#### [NEW] [apps/web/src/providers/app-providers.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/providers/app-providers.tsx)

### Zustand Stores
#### [NEW] [apps/web/src/stores/use-auth-store.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/stores/use-auth-store.ts)
#### [NEW] [apps/web/src/stores/use-workspace-store.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/stores/use-workspace-store.ts)
#### [NEW] [apps/web/src/stores/use-chat-store.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/stores/use-chat-store.ts)
#### [NEW] [apps/web/src/stores/use-ui-store.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/stores/use-ui-store.ts)

### Atomic shadcn/ui Components & Layout
#### [NEW] [apps/web/src/components/ui/button.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/button.tsx)
#### [NEW] [apps/web/src/components/ui/input.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/input.tsx)
#### [NEW] [apps/web/src/components/ui/card.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/card.tsx)
#### [NEW] [apps/web/src/components/ui/badge.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/badge.tsx)
#### [NEW] [apps/web/src/components/ui/avatar.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/avatar.tsx)
#### [NEW] [apps/web/src/components/ui/dialog.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/dialog.tsx)
#### [NEW] [apps/web/src/components/ui/dropdown-menu.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/dropdown-menu.tsx)
#### [NEW] [apps/web/src/components/ui/tabs.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/tabs.tsx)
#### [NEW] [apps/web/src/components/ui/select.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/select.tsx)
#### [NEW] [apps/web/src/components/ui/switch.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/ui/switch.tsx)
#### [NEW] [apps/web/src/components/layout/sidebar.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/layout/sidebar.tsx)
#### [NEW] [apps/web/src/components/layout/header.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/layout/header.tsx)
#### [NEW] [apps/web/src/components/layout/breadcrumbs.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/layout/breadcrumbs.tsx)

### Feature Modules
#### [NEW] [apps/web/src/features/auth/...](file:///d:/mysoft/ai-ide-platform/apps/web/src/features/auth)
#### [NEW] [apps/web/src/features/dashboard/...](file:///d:/mysoft/ai-ide-platform/apps/web/src/features/dashboard)
#### [NEW] [apps/web/src/features/workspace/...](file:///d:/mysoft/ai-ide-platform/apps/web/src/features/workspace)
#### [NEW] [apps/web/src/features/settings/...](file:///d:/mysoft/ai-ide-platform/apps/web/src/features/settings)
#### [NEW] [apps/web/src/features/ai-chat/...](file:///d:/mysoft/ai-ide-platform/apps/web/src/features/ai-chat)

### App Router Pages & Layouts
#### [MODIFY] [apps/web/src/app/layout.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/layout.tsx)
#### [MODIFY] [apps/web/src/app/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/page.tsx)
#### [NEW] [apps/web/src/app/(auth)/layout.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(auth\)/layout.tsx)
#### [NEW] [apps/web/src/app/(auth)/login/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(auth\)/login/page.tsx)
#### [NEW] [apps/web/src/app/(auth)/register/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(auth\)/register/page.tsx)
#### [NEW] [apps/web/src/app/(auth)/forgot-password/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(auth\)/forgot-password/page.tsx)
#### [NEW] [apps/web/src/app/(dashboard)/layout.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(dashboard\)/layout.tsx)
#### [NEW] [apps/web/src/app/(dashboard)/dashboard/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(dashboard\)/dashboard/page.tsx)
#### [NEW] [apps/web/src/app/(dashboard)/workspace/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(dashboard\)/workspace/page.tsx)
#### [NEW] [apps/web/src/app/(dashboard)/settings/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(dashboard\)/settings/page.tsx)
#### [NEW] [apps/web/src/app/(dashboard)/ai-chat/page.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/\(dashboard\)/ai-chat/page.tsx)

---

## Verification Plan

### Automated Checks
- Verify TypeScript compilation without errors: `npx tsc --noEmit`
- Verify Next.js build compilation: `npm run build` or `pnpm build`

### Manual Verification
- Test Authentication routing (Login -> Dashboard, Register -> Dashboard, Forgot Password).
- Test Dashboard statistics, interactivity, and activity table filters.
- Test Workspace switcher and Task Kanban drag/status updating.
- Test Settings tabs (Profile, Team, Security, Billing, AI config).
- Test AI Chat streaming simulation, model selection, prompt template selection, and artifact preview drawer toggle.
- Verify full layout responsiveness across Mobile, Tablet, and Desktop viewport sizes.
