# Nexo LoRA - Backend de IA

Backend FastAPI para servir el modelo de IA entrenado con LoRA (Low-Rank Adaptation).

## Características

- Servidor FastAPI con CORS habilitado
- Integración con modelo Qwen2-1.5B-Instruct + LoRA
- API REST para chat
- Modo fallback cuando el modelo no está disponible
- Soporte para contexto en conversaciones

## Requisitos

- Python 3.8+
- CUDA (opcional, para GPU)
- 4GB+ RAM
- 8GB+ espacio en disco

## Instalación

1. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
# Editar .env según sea necesario
```

## Uso

### Iniciar el servidor

```bash
python main.py
```

O con uvicorn directamente:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en `http://localhost:8000`

### Endpoints

#### GET `/`
Información básica del servidor

#### GET `/health`
Estado de salud del servidor y modelo

#### POST `/api/chat`
Enviar un mensaje al chat

**Request:**
```json
{
  "message": "Hola, ¿cómo estás?",
  "context": []
}
```

**Response:**
```json
{
  "response": "¡Hola! Estoy funcionando correctamente...",
  "tokens_used": 42
}
```

## Estructura del Proyecto

```
nexo-lora-final/
├── main.py                 # Servidor FastAPI
├── requirements.txt        # Dependencias Python
├── .env.example           # Ejemplo de configuración
├── checkpoint-9375/       # Adaptador LoRA (más reciente)
├── checkpoint-9000/       # Checkpoint anterior
└── checkpoint-8500/       # Checkpoint anterior
```

## Notas

- El modelo se carga automáticamente al iniciar el servidor
- Si el modelo no está disponible, se usan respuestas de fallback
- El modelo usa el checkpoint más reciente (9375) por defecto
- Para producción, considera usar un servidor WSGI como Gunicorn

## Troubleshooting

### Error: "CUDA out of memory"
- Reduce el tamaño del batch
- Usa CPU en lugar de GPU
- Cierra otras aplicaciones que usen GPU

### Error: "Model not found"
- Verifica que los checkpoints estén en la ruta correcta
- Asegúrate de tener el modelo base descargado

### El modelo no carga
- Verifica que tienes suficiente RAM/disco
- Revisa los logs para ver errores específicos
- El servidor funcionará en modo fallback si el modelo no carga











