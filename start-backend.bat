@echo off
REM ROSAgo Backend Startup Script
REM This script handles all cleanup and startup tasks for a clean backend start

cls
echo ========================================
echo ROSAgo Backend Startup Script
echo ========================================

REM Step 1: Kill any existing Node processes
echo.
echo [1/4] Killing existing Node processes...
taskkill /IM node.exe /F 2>nul
timeout /t 2 /nobreak
echo √ Processes cleaned up

REM Step 2: Clear Prisma cache
echo.
echo [2/4] Clearing Prisma cache...
set PRISMA_CACHE=c:\Users\user\Desktop\qoder ROSAgo\rosago\backend\node_modules\.prisma
if exist "%PRISMA_CACHE%" (
    rmdir /s /q "%PRISMA_CACHE%" 2>nul
)
echo √ Prisma cache cleared

REM Step 3: Regenerate Prisma client
echo.
echo [3/4] Regenerating Prisma client...
cd /d "c:\Users\user\Desktop\qoder ROSAgo\rosago\backend"
call npx prisma generate
echo √ Prisma client regenerated

REM Step 4: Start dev server
echo.
echo [4/4] Starting backend in development mode...
echo ========================================
call npm run start:dev
pause
