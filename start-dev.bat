@echo off
chcp 65001 >nul
title Servidor de Desarrollo - Vite
color 0A

:START
cls
echo ========================================
echo   Servidor de Desarrollo Vite
echo   Auto-reinicio activado
echo ========================================
echo.

cd /d "%~dp0"

echo [%time%] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    pause
    exit /b 1
)

echo [%time%] Verificando dependencias...
if not exist "node_modules" (
    echo [%time%] Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo [%time%] Liberando puerto 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [%time%] Iniciando servidor...
echo.
echo ========================================
echo   Servidor corriendo en:
echo   http://localhost:5173
echo ========================================
echo.
echo Presiona Ctrl+C para detener
echo El servidor se reiniciara automaticamente si se cae
echo.

call npm run dev

echo.
echo [%time%] El servidor se detuvo. Reiniciando en 3 segundos...
timeout /t 3 /nobreak >nul
goto START
