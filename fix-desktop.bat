@echo off
setlocal EnableDelayedExpansion
title AI IDE Desktop Auto Fix

cd /d "%~dp0"

echo ============================================
echo      AI IDE Desktop Auto Repair
echo ============================================
echo.

:: Check desktop app exists
if not exist "apps\desktop" (
    echo ERROR: apps\desktop not found.
    pause
    exit /b 1
)

echo [1/8] Cleaning previous build...
if exist "apps\desktop\dist" (
    rmdir /S /Q "apps\desktop\dist"
)

echo.
echo [2/8] Installing dependencies...
call pnpm install

if errorlevel 1 (
    echo.
    echo ERROR: pnpm install failed.
    pause
    exit /b 1
)

echo.
echo [3/8] Building Desktop App...

pushd apps\desktop

call pnpm exec tsc

if errorlevel 1 (
    echo.
    echo ============================================
    echo TypeScript compilation failed.
    echo ============================================
    popd
    pause
    exit /b 1
)

echo.
echo [4/8] Searching for generated main.js...

set MAINFILE=

for /R %%F in (main.js) do (
    echo Found: %%F
    set MAINFILE=%%F
)

if defined MAINFILE (
    echo.
    echo SUCCESS: !MAINFILE!

    if not exist "dist" mkdir dist

    if /I NOT "!MAINFILE!"=="%CD%\dist\main.js" (
        copy /Y "!MAINFILE!" "dist\main.js" >nul
    )

) else (
    echo.
    echo ============================================
    echo ERROR: main.js was NOT generated.
    echo ============================================
    echo.
    echo Checking project structure...
    echo.

    dir
    echo.
    if exist src (
        echo ---- src ----
        dir src
    )

    if exist electron (
        echo ---- electron ----
        dir electron
    )

    echo.
    echo No compiled main.js found.
    popd
    pause
    exit /b 1
)

echo.
echo [5/8] Checking package.json...

if not exist package.json (
    echo package.json missing.
    popd
    pause
    exit /b
)

echo.
echo [6/8] Starting Electron...

call pnpm exec electron .

popd

echo.
echo ============================================
echo Done.
echo ============================================
pause