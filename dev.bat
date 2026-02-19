@echo off
setlocal

echo [ES ENTERPRISE] Iniciando script robusto...

REM 1. Tentar encontrar node.exe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado no PATH. Adicione ao PATH ou instale.
    pause
    exit /b 1
)

REM 2. Encontrar o npm-cli.js global para evitar usar versao local quebrada
set "NPM_CLI="

if exist "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" (
    set "NPM_CLI=C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"
) else (
    REM Tenta achar via where npm
    for /f "tokens=*" %%i in ('where npm') do (
        if exist "%%~dpi\node_modules\npm\bin\npm-cli.js" (
            set "NPM_CLI=%%~dpi\node_modules\npm\bin\npm-cli.js"
            goto :FOUND_NPM
        )
    )
)

:FOUND_NPM
if "%NPM_CLI%"=="" (
    echo [AVISO] Nao foi possivel encontrar npm-cli.js global. Tentando 'npm.cmd' padrao...
    set "NPM_EXEC=npm.cmd"
) else (
    echo [INFO] Usando npm global: "%NPM_CLI%"
    set "NPM_EXEC=node \"%NPM_CLI%\""
)

REM 3. Verificar dependencias
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    call %NPM_EXEC% install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias.
        pause
        exit /b %errorlevel%
    )
)

REM 4. Rodar servidor
echo [INFO] Iniciando servidor de desenvolvimento...
call %NPM_EXEC% run dev
if %errorlevel% neq 0 (
    echo [ERRO] Servidor parou com erro.
    pause
)
