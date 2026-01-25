@echo off
echo ================================
echo Restaurant POS System
echo ================================
echo.
echo Starting MongoDB...
net start MongoDB

echo.
echo Starting POS Server...
cd /d "%~dp0"
start "POS Browser" http://localhost:5000
npm start

echo.
echo POS System is shutting down...
pause
