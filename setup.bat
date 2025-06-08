@echo off
echo Starting Blood Donation System Setup...
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File """%~dp0setup-project.ps1"""' -Verb RunAs}"
pause 