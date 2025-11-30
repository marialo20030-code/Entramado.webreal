@echo off
chcp 65001 >nul
title Limpiando y Reiniciando Servidor
color 0E

echo ========================================
echo   Limpiando procesos anteriores...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Cerrando procesos de Node.js en puerto 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 2^>nul') do (
    echo    Cerrando proceso PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo [3/4] Verificando que el puerto este libre...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo    [ADVERTENCIA] El puerto aun esta en uso
    echo    Intentando cerrar procesos de nuevo...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
) else (
    echo    [OK] Puerto 5173 libre
)

echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo   Servidor iniciando...
echo   Abre http://localhost:5173
echo ========================================
echo.

call npm run dev

pause



