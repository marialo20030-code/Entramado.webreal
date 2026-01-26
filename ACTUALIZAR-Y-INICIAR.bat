@echo off
echo ========================================
echo   ACTUALIZANDO PROYECTO ENTRAMADO
echo ========================================
echo.

echo [1/4] Actualizando codigo desde GitHub...
git pull origin main
if errorlevel 1 (
    echo ERROR: No se pudo actualizar desde GitHub
    pause
    exit /b 1
)
echo.

echo [2/4] Verificando archivo .env...
if not exist .env (
    echo El archivo .env no existe. Creandolo desde .env.example...
    copy .env.example .env >nul
    echo.
    echo IMPORTANTE: Abre el archivo .env y completa las credenciales de Supabase
    echo.
    pause
) else (
    echo El archivo .env ya existe. Continuando...
)
echo.

echo [3/4] Instalando/Actualizando dependencias...
call npm install
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)
echo.

echo [4/4] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo   Servidor iniciado!
echo   Abre: http://localhost:5173
echo ========================================
echo.
call npm run dev
