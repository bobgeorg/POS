@echo off
echo ================================
echo Database Restore Utility
echo ================================
echo.
echo Available backups:
echo.
dir /b backups
echo.
set /p BACKUP_FOLDER="Enter backup folder name: "

if not exist "backups\%BACKUP_FOLDER%" (
    echo.
    echo Error: Backup folder not found!
    pause
    exit /b
)

echo.
echo WARNING: This will replace current database!
set /p CONFIRM="Are you sure? (yes/no): "

if /i not "%CONFIRM%"=="yes" (
    echo Restore cancelled.
    pause
    exit /b
)

echo.
echo Restoring database...
mongorestore --db restaurant-pos --drop "backups\%BACKUP_FOLDER%\restaurant-pos"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo Restore completed successfully!
    echo ================================
) else (
    echo.
    echo ================================
    echo Restore failed!
    echo ================================
)

echo.
pause
