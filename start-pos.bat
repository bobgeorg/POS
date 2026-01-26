@echo off
echo ================================
echo Restaurant POS System
echo ================================
echo.
echo Starting MongoDB...
net start MongoDB

echo.
echo Checking configuration...
cd /d "%~dp0"

REM Check if HTTPS is enabled in .env file
set USE_HTTPS=false
set PORT=5000
set HTTPS_PORT=5443

if exist .env (
    for /f "tokens=1,2 delims==" %%a in ('findstr /i "USE_HTTPS" .env') do (
        set USE_HTTPS=%%b
    )
    for /f "tokens=1,2 delims==" %%a in ('findstr /i "^HTTPS_PORT" .env') do (
        set HTTPS_PORT=%%b
    )
    for /f "tokens=1,2 delims==" %%a in ('findstr /i "^PORT" .env') do (
        set PORT=%%b
    )
)

REM Determine protocol and port
if /i "%USE_HTTPS%"=="true" (
    set PROTOCOL=https
    set SERVER_PORT=%HTTPS_PORT%
    echo HTTPS mode enabled - Port %HTTPS_PORT%
) else (
    set PROTOCOL=http
    set SERVER_PORT=%PORT%
    echo HTTP mode enabled - Port %PORT%
)

echo.
echo Starting POS Server...
start "POS Browser" %PROTOCOL%://localhost:%SERVER_PORT%
npm start

echo.
echo POS System is shutting down...
pause
