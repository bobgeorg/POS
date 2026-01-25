@echo off
echo ================================
echo Database Backup Utility
echo ================================
echo.

REM Create backup directory with date
set BACKUP_DIR=%~dp0backups\%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

echo Creating backup in: %BACKUP_DIR%
echo.

REM Create backup
mongodump --db restaurant-pos --out "%BACKUP_DIR%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo Backup completed successfully!
    echo ================================
    echo Location: %BACKUP_DIR%
) else (
    echo.
    echo ================================
    echo Backup failed!
    echo ================================
    echo Please check if MongoDB is running
)

echo.
pause
