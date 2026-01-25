@echo off
echo ================================
echo Restaurant POS - Quick Setup
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)
echo [OK] Node.js is installed

REM Check MongoDB
mongo --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB command not found
    echo Please make sure MongoDB is installed and running
) else (
    echo [OK] MongoDB is installed
)

echo.
echo ================================
echo Installing Dependencies
echo ================================
echo.

echo Installing server dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install server dependencies
    pause
    exit /b
)

echo.
echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install client dependencies
    pause
    exit /b
)
cd ..

echo.
echo ================================
echo Initializing Configuration
echo ================================
call npm run init-config
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to initialize config (MongoDB might not be running)
)

echo.
echo ================================
echo Building Client Application
echo ================================
call npm run build-client
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build client
    pause
    exit /b
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application, run:
echo   start-pos.bat
echo.
echo Or manually run:
echo   npm start
echo.
echo The app will be available at:
echo   http://localhost:5000
echo.
pause
