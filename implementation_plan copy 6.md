# Shared TypeScript Interfaces for AI IDE Platform Implementation Plan

This plan designs a modular, reusable, and type-safe TypeScript domain model in `@ai-ide/core` (`packages/core/src/types/`) covering User Profiles, Workspaces, Projects & Tasks, Settings, AI Models & Conversations, and Standardized API Responses.

## User Review Required

> [!IMPORTANT]
> - **Monorepo Centralization**: Interfaces are authored in `@ai-ide/core` (`packages/core/src/types/`) and re-exported in `apps/web` and `apps/desktop` for 100% type consistency across fullstack React, Next.js 15, Electron, and API payloads.
> - **Generics & Extensibility**: Standardized `ApiResponse<T>`, `PaginatedResponse<T>`, and `PaginatedQuery` wrappers to simplify TanStack Query data fetching and API responses.
> - **JSON Preference Schemas**: Strongly-typed `EditorSettings`, `AISettings`, and `NotificationSettings` matching PostgreSQL/FastAPI `JSONB` DB columns.

---

## 🏗️ Domain Interfaces & Type Hierarchy

```
packages/core/src/types/
├── user.ts          # User, UserRole, UserCreateDTO, UserUpdateDTO
├── project.ts       # Project, ProjectStatus, Task, TaskStatus, TaskPriority
├── setting.ts       # UserSettings, EditorSettings, AISettings, NotificationSettings, Theme
├── workspace.ts     # Workspace, WorkspaceMember, WorkspaceRole, WorkspacePlan
├── api.ts           # ApiResponse<T>, PaginatedResponse<T>, AuthTokenResponse, ApiErrorDetail
├── ai.ts            # AIModel, ChatMessage, ChatConversation, TokenUsage
└── index.ts         # Aggregated barrel export
```

---

## 📋 Interface Specifications

### 1. `user.ts`
- `UserRole`: `'owner' | 'admin' | 'member' | 'viewer'`
- `User`: `id: string`, `email: string`, `fullName?: string`, `avatarUrl?: string`, `role: UserRole`, `isActive: boolean`, `isSuperuser: boolean`, `emailVerified: boolean`, `createdAt: string`, `updatedAt?: string`
- `UserCreateDTO`, `UserUpdateDTO`

### 2. `setting.ts`
- `ThemeMode`: `'dark' | 'light' | 'system'`
- `EditorSettings`: `fontSize: number`, `tabSize: number`, `formatOnSave: boolean`, `vimMode: boolean`, `wordWrap: 'on' | 'off' | 'wordWrapColumn'`, `fontFamily: string`, `lineNumbers: 'on' | 'off' | 'relative'`
- `AISettings`: `defaultModel: string`, `temperature: number`, `topP: number`, `streamResponses: boolean`, `systemPrompt: string`, `maxTokens: number`, `autoSuggest: boolean`
- `NotificationSettings`: `emailAlerts: boolean`, `securityAlerts: boolean`, `productUpdates: boolean`
- `UserSettings`: `id: string`, `userId: string`, `theme: ThemeMode`, `editorSettings: EditorSettings`, `aiSettings: AISettings`, `notificationSettings: NotificationSettings`, `updatedAt: string`

### 3. `workspace.ts`
- `WorkspacePlan`: `'free' | 'pro' | 'enterprise'`
- `WorkspaceRole`: `'owner' | 'admin' | 'developer' | 'viewer'`
- `Workspace`: `id: string`, `name: string`, `slug: string`, `logoUrl?: string`, `plan: WorkspacePlan`, `ownerId: string`, `membersCount: number`, `projectsCount: number`, `createdAt: string`
- `WorkspaceMember`: `id: string`, `workspaceId: string`, `user: User`, `role: WorkspaceRole`, `joinedAt: string`

### 4. `project.ts`
- `ProjectStatus`: `'active' | 'archived' | 'draft' | 'deleted'`
- `TaskStatus`: `'backlog' | 'in_progress' | 'in_review' | 'completed'`
- `TaskPriority`: `'low' | 'medium' | 'high' | 'urgent'`
- `Project`: `id: string`, `workspaceId?: string`, `ownerId: string`, `name: string`, `slug: string`, `description?: string`, `repositoryUrl?: string`, `programmingLanguage?: string`, `status: ProjectStatus`, `progress: number`, `tasksCount: number`, `completedTasksCount: number`, `createdAt: string`, `updatedAt: string`
- `Task`: `id: string`, `projectId: string`, `title: string`, `description?: string`, `status: TaskStatus`, `priority: TaskPriority`, `assignee?: User`, `tags: string[]`, `dueDate?: string`, `createdAt: string`

### 5. `api.ts`
- `ApiResponse<T>`: `success: boolean`, `data: T`, `message?: string`, `timestamp: string`
- `PaginatedResponse<T>`: `items: T[]`, `total: number`, `page: number`, `pageSize: number`, `totalPages: number`, `hasMore: boolean`
- `PaginatedQuery`: `page?: number`, `pageSize?: number`, `search?: string`, `sortBy?: string`, `sortOrder?: 'asc' | 'desc'`
- `AuthTokenResponse`: `access_token: string`, `refresh_token: string`, `token_type: string`, `expires_in: number`
- `ApiErrorDetail`: `message: string`, `code?: string`, `detail?: string | Record<string, any>`, `status: number`

---

## 📋 Proposed Changes

### Core Package (`packages/core`)
#### [NEW] [packages/core/src/types/user.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/user.ts)
#### [NEW] [packages/core/src/types/setting.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/setting.ts)
#### [NEW] [packages/core/src/types/workspace.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/workspace.ts)
#### [NEW] [packages/core/src/types/project.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/project.ts)
#### [NEW] [packages/core/src/types/api.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/api.ts)
#### [NEW] [packages/core/src/types/ai.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/ai.ts)
#### [NEW] [packages/core/src/types/index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/types/index.ts)
#### [MODIFY] [packages/core/src/index.ts](file:///d:/mysoft/ai-ide-platform/packages/core/src/index.ts)

### Next.js & Desktop Apps
#### [MODIFY] [apps/web/src/types/index.ts](file:///d:/mysoft/ai-ide-platform/apps/web/src/types/index.ts)
#### [MODIFY] [apps/desktop/src/shared/types.ts](file:///d:/mysoft/ai-ide-platform/apps/desktop/src/shared/types.ts)

---

## 🔍 Verification Plan

### Automated Checks
- Run TypeScript type checks across monorepo: `pnpm --filter web-app typecheck` and `pnpm --filter desktop-app build`.

### Manual Verification
- Verify interface exports, type safety, and autocomplete in web and desktop apps.
