# ROSAgo Backend Startup Script
# This script handles all cleanup and startup tasks for a clean backend start

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ROSAgo Backend Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Kill any existing Node processes
Write-Host "`n[1/4] Killing existing Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "OK: Processes cleaned up" -ForegroundColor Green

# Step 2: Clear Prisma cache
Write-Host "`n[2/4] Clearing Prisma cache..." -ForegroundColor Yellow
$prismaCache = "c:\Users\user\Desktop\qoder ROSAgo\rosago\backend\node_modules\.prisma"
if (Test-Path $prismaCache) {
    Remove-Item $prismaCache -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "OK: Prisma cache cleared" -ForegroundColor Green

# Step 3: Regenerate Prisma client
Write-Host "`n[3/4] Regenerating Prisma client..." -ForegroundColor Yellow
cd "c:\Users\user\Desktop\qoder ROSAgo\rosago\backend"
npx prisma generate
Write-Host "OK: Prisma client regenerated" -ForegroundColor Green

# Step 4: Start dev server
Write-Host "`n[4/4] Starting backend in development mode..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
npm run start:dev
