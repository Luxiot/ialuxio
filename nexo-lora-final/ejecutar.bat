@echo off
echo ========================================
echo   EJECUTANDO SERVIDOR FASTAPI
echo ========================================
cd /d "%~dp0"
echo Directorio actual: %CD%
echo.
echo Verificando Python del entorno virtual...
if not exist "venv\Scripts\python.exe" (
    echo ERROR: No se encuentra el entorno virtual!
    echo Por favor, crea el entorno virtual primero.
    pause
    exit /b 1
)
echo Python encontrado: venv\Scripts\python.exe
echo.
echo Verificando FastAPI...
venv\Scripts\python.exe -c "import fastapi; print('FastAPI OK')" 2>nul
if errorlevel 1 (
    echo ERROR: FastAPI no esta instalado en el entorno virtual
    echo Instalando dependencias...
    venv\Scripts\python.exe -m pip install -r requirements.txt
)
echo.
echo Iniciando servidor...
echo.
venv\Scripts\python.exe main.py
pause

