@echo off
echo === Redis Upgrade Script ===
echo.

echo Step 1: Stopping old Redis service...
net stop Redis
echo.

echo Step 2: Unregistering old Redis service...
sc delete Redis
echo.

echo Step 3: Installing new Redis 7.4.1 service...
cd /d C:\Redis-7.4.1
redis-server.exe --service-install redis.windows-service.conf --loglevel verbose
echo.

echo Step 4: Starting new Redis service...
net start Redis
echo.

echo Step 5: Checking Redis version...
redis-cli.exe INFO SERVER | findstr "redis_version"
echo.

echo ===================================
echo Redis 7.4.1 installed successfully!
echo ===================================
pause
