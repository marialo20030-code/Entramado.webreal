@echo off
REM Script optimizado para iniciar el servidor rápidamente sin errores
chcp 65001 >nul
title Servidor Vite - Inicio Rápido
color 0A
cls

cd /d "%~dp0"

echo ========================================
echo   INICIANDO SERVIDOR (VERSION OPTIMIZADA)
echo ========================================
echo.

REM Paso 1: Cerrar procesos Node que puedan estar bloqueando el puerto
echo [1/3] Liberando recursos...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5173"') do (
    taskkill /F /PID %%a >nul 2>&1
)
REM También cerramos cualquier proceso node.exe que pueda estar bloqueando
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Paso 2: Verificaciones rápidas
echo [2/3] Verificando entorno...
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo    [ERROR] Node.js no encontrado
    echo    Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo    Instalando dependencias...
    call npm install --silent
    if %errorlevel% neq 0 (
        color 0C
        echo    [ERROR] No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

REM Paso 3: Iniciar servidor
echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo   SERVIDOR LISTO EN SEGUNDOS
echo ========================================
echo.
echo   URL: http://localhost:5173
echo   También: http://127.0.0.1:5173
echo.
echo   Espera a ver: "Local: http://localhost:5173"
echo   Presiona Ctrl+C para detener
echo.
echo ========================================
echo.

REM Usar start para abrir el navegador automáticamente después de 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

REM Iniciar el servidor
call npm run dev

REM Si el servidor se cierra, mostrar mensaje
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] El servidor se detuvo inesperadamente
    echo Verifica los mensajes de error arriba
    pause
)



