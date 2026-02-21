@echo off
echo ================================
echo Restaurant POS System
 echo Client Build
 echo ================================
 echo.
 cd /d "%~dp0"

 echo Building client...
 npm run build-client

 echo.
 echo Client build finished.
 pause
