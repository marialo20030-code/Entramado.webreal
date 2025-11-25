@echo off
chcp 65001 >nul
title Test del Servidor
color 0E
cls

echo ========================================
echo   DIAGNÓSTICO DEL SERVIDOR
echo ========================================
echo.

echo [1] Verificando procesos de Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo    Node.js está corriendo
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo    Node.js NO está corriendo
)
echo.

echo [2] Verificando puerto 5173...
netstat -ano | findstr :5173
if %errorlevel% equ 0 (
    echo    Puerto 5173 está en uso
) else (
    echo    Puerto 5173 NO está en uso
)
echo.

echo [3] Probando conexión a localhost:5173...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo    Conexión exitosa
) else (
    echo    No se puede conectar (esto es normal si el servidor no está corriendo)
)
echo.

echo [4] Verificando Node.js instalado...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo    Node.js encontrado:
    node --version
) else (
    echo    Node.js NO encontrado
)
echo.

echo [5] Verificando npm instalado...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo    npm encontrado:
    npm --version
) else (
    echo    npm NO encontrado
)
echo.

echo ========================================
echo   FIN DEL DIAGNÓSTICO
echo ========================================
echo.
pause

