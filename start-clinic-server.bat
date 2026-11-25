@echo off
title Richard Smile Salem Medical Center - Clinic Hub Server
cd /d "%~dp0"
echo Starting Richard Smile Salem Medical Center Local Clinic Server...
echo Keep this window open while staff devices are connected on Wi-Fi.
echo.
node server.js
pause
