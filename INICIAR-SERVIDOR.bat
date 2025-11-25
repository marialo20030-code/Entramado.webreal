@echo off
chcp 65001 >nul
title Servidor Vite - Iniciando...
color 0A
cls

cd /d "%~dp0"

echo ========================================
echo   INICIANDO SERVIDOR DE DESARROLLO
echo ========================================
echo.

echo [1] Cerrando procesos anteriores...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo [2] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo    ERROR: Node.js no encontrado
    echo    Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo    OK

echo [3] Verificando dependencias...
if not exist "node_modules" (
    echo    Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo    ERROR al instalar dependencias
        pause
        exit /b 1
    )
)
echo    OK

echo.
echo ========================================
echo   SERVIDOR INICIANDO...
echo   URL: http://localhost:5173
echo ========================================
echo.
echo   Espera a ver: "Local: http://localhost:5173"
echo   Luego abre tu navegador en esa URL
echo.
echo   Presiona Ctrl+C para detener
echo.

npm run dev

pause



