@echo off
echo ================================
echo Restaurant POS System (HTTPS)
echo ================================
echo.
echo Starting MongoDB...
net start MongoDB

echo.
echo Starting POS Server with HTTPS...
cd /d "%~dp0"

REM Set HTTPS environment variable for this session
set USE_HTTPS=true

REM Get port from .env if exists
set HTTPS_PORT=5443
if exist .env (
    for /f "tokens=1,2 delims==" %%a in ('findstr /i "^HTTPS_PORT" .env') do (
        set HTTPS_PORT=%%b
    )
)

echo HTTPS mode enabled - Port %HTTPS_PORT%
echo.
echo Opening browser...
start "POS Browser" https://localhost:%HTTPS_PORT%

echo Starting server...
npm run start-https

echo.
echo POS System is shutting down...
pause
