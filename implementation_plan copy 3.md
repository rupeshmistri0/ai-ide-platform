# Enterprise PostgreSQL Schema & SQLAlchemy 2.0 Models Implementation Plan

This plan establishes a scalable, production-ready PostgreSQL database schema and SQLAlchemy 2.0 ORM models for the AI IDE Platform in `apps/api/app/db/models/`.

## User Review Required

> [!IMPORTANT]
> - **Native PostgreSQL UUIDs**: Every table uses UUID v4 primary keys (`uuid.UUID` mapped via `sqlalchemy.dialects.postgresql.UUID` with `uuid.uuid4` defaults).
> - **JSONB Extensions**: Flexible metadata and settings stored via `JSONB` for future schema evolution (Editor preferences, AI model parameters, project environment configs).
> - **Future Enterprise Scalability**: Includes Multi-tenant Workspaces, Workspace Memberships (RBAC), AI Conversations & Messages with token usage metrics, API Key management, and Security Audit Logs.

---

## 🗄️ PostgreSQL Schema & Entity Relationship Overview

```
                               ┌─────────────────┐
                               │      Users      │
                               └────────┬────────┘
                                        │
         ┌──────────────────┬───────────┼───────────┬──────────────────┐
         │ 1:1              │ 1:N       │ 1:N       │ 1:N              │ 1:N
┌────────┴───────┐ ┌────────┴──────┐ ┌──┴───────┐ ┌─┴────────────┐ ┌───┴───────────┐
│ User Settings  │ │ User Sessions │ │ API Keys  │ │ Audit Logs   │ │  Workspaces   │
└────────────────┘ └───────────────┘ └───────────┘ └──────────────┘ └───────┬───────┘
                                                                            │ 1:N
                                                                  ┌─────────┴─────────┐
                                                                  │     Projects      │
                                                                  └─────────┬─────────┘
                                                                            │ 1:N
                                                                  ┌─────────┴─────────┐
                                                                  │ AI Conversations  │
                                                                  └─────────┬─────────┘
                                                                            │ 1:N
                                                                  ┌─────────┴─────────┐
                                                                  │    AI Messages    │
                                                                  └───────────────────┘
```

---

## 🗃️ Detailed Database Table Specifications

### 1. `users` Table
- `id` (UUID, PK)
- `email` (VARCHAR(255), Unique, Indexed)
- `hashed_password` (VARCHAR(255))
- `full_name` (VARCHAR(255))
- `avatar_url` (VARCHAR(512), Nullable)
- `role` (VARCHAR(50), Default 'member')
- `is_active` (BOOLEAN, Default True)
- `is_superuser` (BOOLEAN, Default False)
- `email_verified` (BOOLEAN, Default False)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 2. `user_settings` Table (1:1 with `users`)
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `users.id`, Unique)
- `theme` (VARCHAR(20), Default 'dark')
- `editor_settings` (JSONB: font_size, tab_size, format_on_save, vim_mode, keybindings)
- `ai_settings` (JSONB: default_model, temperature, top_p, stream_responses, system_prompt)
- `notification_settings` (JSONB: email_alerts, security_alerts)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 3. `user_sessions` Table (1:N with `users`)
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `users.id`)
- `token_hash` (VARCHAR(255), Indexed)
- `ip_address` (VARCHAR(45))
- `user_agent` (TEXT)
- `device_name` (VARCHAR(255))
- `is_revoked` (BOOLEAN, Default False)
- `expires_at` (TIMESTAMPTZ)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 4. `workspaces` Table & `workspace_members` (Multi-Tenancy & RBAC)
- `workspaces`: `id`, `name`, `slug`, `plan` ('free', 'pro', 'enterprise'), `owner_id` (FK), `created_at`, `updated_at`
- `workspace_members`: `id`, `workspace_id` (FK), `user_id` (FK), `role` ('owner', 'admin', 'developer', 'viewer'), `joined_at`

### 5. `projects` Table (1:N with `users` / `workspaces`)
- `id` (UUID, PK)
- `workspace_id` (UUID, FK -> `workspaces.id`, Nullable)
- `owner_id` (UUID, FK -> `users.id`)
- `name` (VARCHAR(255), Indexed)
- `slug` (VARCHAR(255), Indexed)
- `description` (TEXT)
- `repository_url` (VARCHAR(512))
- `programming_language` (VARCHAR(50))
- `status` (VARCHAR(50), Default 'active')
- `environment_config` (JSONB)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 6. `ai_conversations` & `ai_messages` Tables (AI History & Metrics)
- `ai_conversations`: `id`, `project_id` (FK), `user_id` (FK), `title`, `model_id`, `is_pinned`, `created_at`, `updated_at`
- `ai_messages`: `id`, `conversation_id` (FK), `role` ('user', 'assistant', 'system'), `content`, `prompt_tokens`, `completion_tokens`, `code_snippet` (JSONB), `created_at`

---

## 📋 Proposed Code Changes

### SQLAlchemy ORM Models Modular Hierarchy
#### [MODIFY] [apps/api/app/db/base.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/base.py)
#### [MODIFY] [apps/api/app/db/models/user.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/user.py)
#### [NEW] [apps/api/app/db/models/setting.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/setting.py)
#### [NEW] [apps/api/app/db/models/session.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/session.py)
#### [MODIFY] [apps/api/app/db/models/project.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/project.py)
#### [NEW] [apps/api/app/db/models/workspace.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/workspace.py)
#### [NEW] [apps/api/app/db/models/ai_chat.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/ai_chat.py)
#### [NEW] [apps/api/app/db/models/__init__.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/db/models/__init__.py)

---

## 🔍 Verification Plan

### Automated Checks
- Run Python syntax compilation: `python -m py_compile app/db/models/__init__.py`.
- Verify SQLAlchemy 2.0 metadata creation with `Base.metadata.create_all`.

### Manual Verification
- Verify table names, UUID foreign keys, constraints, and relationships.
