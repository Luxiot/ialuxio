@echo off
echo ========================================
echo   DETENIENDO PROCESO EN PUERTO 8000
echo ========================================
echo.
echo Buscando proceso en puerto 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    set PID=%%a
    echo Proceso encontrado: PID %%a
    echo Deteniendo proceso...
    taskkill /PID %%a /F
    echo Proceso detenido.
)
echo.
echo Si no se detuvo ningun proceso, el puerto 8000 ya esta libre.
pause



