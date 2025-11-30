@echo off
chcp 65001 >nul
echo ========================================
echo   Verificando configuracion del proyecto
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo    [X] Node.js NO encontrado
    echo    Por favor instala Node.js desde https://nodejs.org
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    [OK] Node.js encontrado: %NODE_VERSION%
)

echo.
echo [2/5] Verificando npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo    [X] npm NO encontrado
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    [OK] npm encontrado: %NPM_VERSION%
)

echo.
echo [3/5] Verificando dependencias...
if not exist "node_modules" (
    echo    [X] node_modules no existe
    echo    Ejecuta: npm install
) else (
    echo    [OK] node_modules existe
)

echo.
echo [4/5] Verificando archivos del proyecto...
if exist "package.json" (
    echo    [OK] package.json existe
) else (
    echo    [X] package.json NO existe
)

if exist "vite.config.ts" (
    echo    [OK] vite.config.ts existe
) else (
    echo    [X] vite.config.ts NO existe
)

if exist "src\main.tsx" (
    echo    [OK] src\main.tsx existe
) else (
    echo    [X] src\main.tsx NO existe
)

echo.
echo [5/5] Verificando puerto 5173...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo    [ADVERTENCIA] El puerto 5173 esta en uso
    echo    Puede que el servidor ya este corriendo
) else (
    echo    [OK] El puerto 5173 esta disponible
)

echo.
echo ========================================
echo   Verificacion completada
echo ========================================
echo.
pause



