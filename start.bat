@echo off
echo ====================================
echo   Iniciando IA Luxio
echo ====================================
echo.

REM Verificar que existe el entorno virtual
if not exist "nexo-lora-final\venv\Scripts\python.exe" (
    echo ERROR: No se encuentra el entorno virtual!
    echo Por favor, crea el entorno virtual primero en nexo-lora-final
    pause
    exit /b 1
)

echo [1/2] Iniciando Backend (FastAPI)...
start cmd /k "cd /d %~dp0nexo-lora-final && title Backend - IA Luxio && .\venv\Scripts\python.exe main.py"

timeout /t 5 /nobreak >nul

echo [2/2] Iniciando Frontend (React)...
start cmd /k "cd /d %~dp0frontend && title Frontend - IA Luxio && npm start"

echo.
echo ====================================
echo   Servidores iniciados!
echo ====================================
echo Backend:  http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
echo (Los servidores continuaran ejecutandose)
echo ====================================
pause >nul









