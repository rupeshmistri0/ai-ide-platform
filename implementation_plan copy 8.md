# Theme Management System Implementation Plan

This plan details how to add a robust theme management system supporting Light Mode, Dark Mode, and System Theme preferences with persistent settings (using local storage via `next-themes`) and hydration-safety (preventing Flash of Unstyled Content / FOUC).

---

## User Review Required

> [!NOTE]
> We will use `next-themes` to manage active classes on the `<html>` element. Since the existing CSS defines dark mode variables in `:root` and light mode variables in `.light`, we will map `dark` to `"dark"` (which defaults back to `:root`) and `light` to `"light"`. This avoids having to refactor the entire `globals.css` color scheme.

---

## Proposed Changes

### Next.js Web App

#### [NEW] [theme-provider.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/providers/theme-provider.tsx)
- Create a client component wrapping `next-themes`' `ThemeProvider` with hydration safety and proper CSS class mappings (`light` and `dark`).

#### [MODIFY] [app-providers.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/providers/app-providers.tsx)
- Wrap application providers with the new `ThemeProvider`.

#### [MODIFY] [layout.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/app/layout.tsx)
- Remove hardcoded `className="dark"` from the `<html>` tag to allow the theme provider to inject the active class dynamically.
- Add `suppressHydrationWarning` on `<html>` as recommended by `next-themes` to prevent hydration mismatches from server-side rendering of the initial class.

#### [MODIFY] [theme-toggle.tsx](file:///d:/mysoft/ai-ide-platform/apps/web/src/components/layout/theme-toggle.tsx)
- Update `ThemeToggle` to utilize `useTheme` from `next-themes`.
- Create a modern, interactive dropdown menu allowing users to select **Light**, **Dark**, or **System** theme explicitly.

#### [MODIFY] [package.json](file:///d:/mysoft/ai-ide-platform/apps/web/package.json)
- Add `next-themes` dependency to the web app project.

---

## Verification Plan

### Automated Tests
- Run typechecking: `pnpm --filter web-app typecheck`
- Run local development build check: `pnpm --filter web-app build`

### Manual Verification
- Verify theme updates instantly without any page reload.
- Verify persistence: set to Light, reload page, ensure no flash of dark theme occurs.
- Verify System theme option syncs correctly with the operating system preference.
