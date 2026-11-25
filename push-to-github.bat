@echo off
setlocal
title Push Richard Smile Salem Medical Center to GitHub
cd /d "%~dp0"

echo ==============================================================
echo   Push Project Changes to GitHub
echo ==============================================================
echo.

where git >nul 2>nul
if errorlevel 1 goto :no_git

if exist ".git" goto :ask_commit

echo Git repository not initialized yet. Setting up now...
git init
git branch -M main
echo.
set "REPO_URL="
set /p "REPO_URL=Paste your GitHub Repository URL and press Enter: "
if "%REPO_URL%"=="" goto :no_url
git remote add origin "%REPO_URL%"

:ask_commit
echo.
set "COMMIT_MSG=Update clinic EMR"
set /p "COMMIT_MSG=Enter commit message (or press Enter for default): "

echo.
echo Staging files...
git add .

echo Committing changes...
git commit -m "%COMMIT_MSG%"

echo Pushing to GitHub...
git push -u origin HEAD

echo.
echo ==============================================================
echo   Done! Check the output above to confirm the push succeeded.
echo ==============================================================
pause
exit /b 0

:no_git
echo [ERROR] Git is not installed on this computer.
echo Please install Git from https://git-scm.com/downloads and try again.
pause
exit /b 1

:no_url
echo [ERROR] No repository URL was entered.
pause
exit /b 1
