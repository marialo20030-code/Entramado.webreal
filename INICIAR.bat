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
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo    ERROR: Node.js no encontrado
    echo    Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo    Node.js: 
node --version

echo [3] Verificando dependencias...
if not exist "node_modules" (
    echo    Instalando dependencias (esto puede tardar unos minutos)...
    call npm install
    if %errorlevel% neq 0 (
        echo    ERROR al instalar dependencias
        pause
        exit /b 1
    )
)
echo    Dependencias OK

echo.
echo ========================================
echo   INICIANDO SERVIDOR...
echo ========================================
echo.
echo   Espera a ver este mensaje:
echo   "Local:   http://localhost:5173/"
echo.
echo   Luego abre tu navegador en:
echo   http://localhost:5173
echo.
echo   IMPORTANTE: NO CIERRES ESTA VENTANA
echo   Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ERROR: El servidor no pudo iniciar
    echo Verifica los mensajes de error arriba
    pause
    exit /b 1
)

pause
