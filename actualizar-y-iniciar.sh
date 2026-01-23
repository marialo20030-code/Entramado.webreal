#!/bin/bash

echo "========================================"
echo "  ACTUALIZANDO PROYECTO ENTRAMADO"
echo "========================================"
echo ""

echo "[1/4] Actualizando código desde GitHub..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo actualizar desde GitHub"
    exit 1
fi
echo ""

echo "[2/4] Verificando archivo .env..."
if [ ! -f .env ]; then
    echo "El archivo .env no existe. Creándolo desde .env.example..."
    cp .env.example .env
    echo ""
    echo "IMPORTANTE: Abre el archivo .env y completa las credenciales de Supabase"
    echo ""
    read -p "Presiona Enter para continuar..."
else
    echo "El archivo .env ya existe. Continuando..."
fi
echo ""

echo "[3/4] Instalando/Actualizando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudieron instalar las dependencias"
    exit 1
fi
echo ""

echo "[4/4] Iniciando servidor de desarrollo..."
echo ""
echo "========================================"
echo "  Servidor iniciado!"
echo "  Abre: http://localhost:5173"
echo "========================================"
echo ""

npm run dev
