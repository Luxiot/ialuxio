#!/bin/bash

echo "===================================="
echo "Iniciando IA Luxio"
echo "===================================="
echo ""

# Iniciar backend en background
echo "Iniciando Backend..."
cd nexo-lora-final
python main.py &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar frontend
echo "Iniciando Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================="
echo "Servidores iniciados!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "===================================="
echo ""
echo "Presiona Ctrl+C para detener los servidores"

# Esperar a que se presione Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait











