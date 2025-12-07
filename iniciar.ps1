# Script PowerShell optimizado para iniciar el servidor
# Maneja automáticamente la política de ejecución

param(
    [switch]$AbrirNavegador = $true
)

# Cambiar al directorio del script
Set-Location $PSScriptRoot

Write-Host "========================================" -ForegroundColor Green
Write-Host "  INICIANDO SERVIDOR (POWER SHELL)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Función para cambiar política de ejecución temporalmente
function Set-TemporaryExecutionPolicy {
    $originalPolicy = Get-ExecutionPolicy -Scope Process
    if ($originalPolicy -eq "Restricted") {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force | Out-Null
        Write-Host "[*] Política de ejecución ajustada temporalmente" -ForegroundColor Yellow
    }
    return $originalPolicy
}

# Paso 1: Ajustar política de ejecución si es necesario
$originalPolicy = Set-TemporaryExecutionPolicy

try {
    # Paso 2: Cerrar procesos Node existentes
    Write-Host "[1/3] Liberando puerto 5173..." -ForegroundColor Cyan
    
    # Encontrar procesos usando el puerto 5173
    $connections = netstat -ano | Select-String ":5173" | Select-String "LISTENING"
    if ($connections) {
        $connections | ForEach-Object {
            $pid = ($_ -split '\s+')[-1]
            if ($pid -match '^\d+$') {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "  Proceso $pid terminado" -ForegroundColor Gray
            }
        }
    }
    
    # También cerrar todos los procesos node.exe que puedan estar bloqueando
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1

    # Paso 3: Verificaciones
    Write-Host "[2/3] Verificando entorno..." -ForegroundColor Cyan
    
    # Verificar Node.js
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) {
        Write-Host "  [ERROR] Node.js no encontrado" -ForegroundColor Red
        Write-Host "  Instala Node.js desde https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
    
    # Verificar dependencias
    if (-not (Test-Path "node_modules")) {
        Write-Host "  Instalando dependencias..." -ForegroundColor Yellow
        npm install --silent
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [ERROR] No se pudieron instalar las dependencias" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "  Dependencias OK" -ForegroundColor Green

    # Paso 4: Iniciar servidor
    Write-Host "[3/3] Iniciando servidor..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SERVIDOR LISTO" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  URL: http://localhost:5173" -ForegroundColor Yellow
    Write-Host "  También: http://127.0.0.1:5173" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Presiona Ctrl+C para detener" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

    # Abrir navegador después de 3 segundos si está habilitado
    if ($AbrirNavegador) {
        Start-Job -ScriptBlock {
            Start-Sleep -Seconds 3
            Start-Process "http://localhost:5173"
        } | Out-Null
    }

    # Iniciar servidor
    npm run dev
    
} catch {
    Write-Host ""
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Restaurar política de ejecución original si fue cambiada
    if ($originalPolicy -eq "Restricted") {
        Set-ExecutionPolicy -ExecutionPolicy $originalPolicy -Scope Process -Force | Out-Null
    }
}



