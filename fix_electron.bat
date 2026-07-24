@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo   Fixing Electron Binary Installation for PNPM
echo ===================================================

cd /d "%~dp0"

echo [1/4] Ensuring pnpm script execution is enabled...
call pnpm config set ignore-scripts false

echo [2/4] Rebuilding Electron via pnpm...
call pnpm --filter desktop-app rebuild electron

echo [3/4] Running Electron installer script directly...
if exist "node_modules\.pnpm\electron@25.9.8\node_modules\electron\install.js" (
    node "node_modules\.pnpm\electron@25.9.8\node_modules\electron\install.js"
) else (
    echo Searching for install.js dynamically...
    for /f "delims=" %%i in ('dir /s /b install.js 2^>nul ^| findstr /i "electron"') do (
        echo Running %%i
        node "%%i"
    )
)

echo [4/4] Verifying Electron binary path...
set "FOUND_ELECTRON=0"
for /f "delims=" %%i in ('dir /s /b electron.exe 2^>nul') do (
    echo [SUCCESS] Found Electron executable at: %%i
    set "FOUND_ELECTRON=1"
)

if "%FOUND_ELECTRON%"=="0" (
    echo [WARNING] electron.exe not found automatically. Force reinstalling electron package...
    call pnpm --filter desktop-app add -D electron@25.9.8 --force
    node "node_modules\.pnpm\electron@25.9.8\node_modules\electron\install.js"
)

echo ===================================================
echo   Electron fix completed! Now run: pnpm dev
echo ===================================================
pause
