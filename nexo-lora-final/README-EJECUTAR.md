# CÓMO EJECUTAR EL SERVIDOR

## Problema: ModuleNotFoundError: No module named 'fastapi'

Este error ocurre porque estás ejecutando Python sin activar el entorno virtual.

## SOLUCIÓN RÁPIDA:

### Opción 1: Usar el script .bat (Más fácil)
Doble clic en: `ejecutar.bat`

### Opción 2: Desde PowerShell/CMD
```powershell
cd "C:\Users\Luxio\Desktop\ia luxio\nexo-lora-final"
.\venv\Scripts\python.exe main.py
```

### Opción 3: Activar entorno virtual primero
```powershell
cd "C:\Users\Luxio\Desktop\ia luxio\nexo-lora-final"
.\venv\Scripts\activate.bat
python main.py
```

## VERIFICAR QUE FUNCIONA:

```powershell
.\venv\Scripts\python.exe -c "import fastapi; print('✅ FastAPI instalado')"
```

## NOTA IMPORTANTE:

Siempre usa `.\venv\Scripts\python.exe` en lugar de solo `python` para asegurarte de usar el entorno virtual correcto.



