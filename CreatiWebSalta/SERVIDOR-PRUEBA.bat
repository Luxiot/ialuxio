@echo off
echo ====================================
echo   Servidor de prueba CreatiWebSalta
echo ====================================
echo.
echo Inicia PRIMERO el backend (start.bat o nexo-lora-final\ejecutar.bat)
echo para que el chat de IA funcione.
echo.
echo Abre: http://localhost:8080
echo.
python -m http.server 8080
pause
