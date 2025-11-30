@echo off
chcp 65001 >nul
title Servidor Vite - Inicio Simple
color 0B

cd /d "%~dp0"

echo Liberando puerto 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Iniciando servidor...
echo Abre http://localhost:5173 en tu navegador
echo.

npm run dev

pause



