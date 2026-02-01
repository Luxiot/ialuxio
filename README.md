# IA Luxio - Sistema de Chat con Aprendizaje Continuo

Sistema completo de chat con IA que incluye un frontend React moderno y un backend FastAPI con modelo LoRA entrenado.

## 🚀 Estructura del Proyecto

```
ia luxio/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   └── AIChat.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── nexo-lora-final/       # Backend FastAPI con modelo LoRA
    ├── main.py
    ├── requirements.txt
    └── checkpoint-9375/   # Modelo entrenado
```

## 📋 Requisitos Previos

### Frontend
- Node.js 16 o superior
- npm o yarn

### Backend
- Python 3.8 o superior
- CUDA (opcional, para GPU)
- 4GB+ RAM
- 8GB+ espacio en disco

## 🛠️ Instalación

### 1. Frontend

```bash
cd frontend
npm install
```

### 2. Backend

```bash
cd nexo-lora-final
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

## 🚀 Uso

### Iniciar el Backend

```bash
cd nexo-lora-final
python main.py
```

El servidor estará disponible en `http://localhost:8000`

### Iniciar el Frontend

En una nueva terminal:

```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Características

### Frontend
- ✨ Interfaz moderna con Tailwind CSS
- 🧠 Panel de métricas del "cerebro IA"
- 📊 Visualización de actividad neural en tiempo real
- 💾 Sistema de memoria visualizado
- 📈 Indicadores de aprendizaje continuo

### Backend
- 🤖 Modelo Qwen2-1.5B-Instruct con LoRA
- 🔄 API REST para chat
- 🛡️ Modo fallback cuando el modelo no está disponible
- 📝 Soporte para contexto en conversaciones
- ⚡ Optimizado para inferencia

## 📡 API Endpoints

### `GET /`
Información básica del servidor

### `GET /health`
Estado de salud del servidor

### `POST /api/chat`
Enviar mensaje al chat

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

## 🔧 Configuración

### Variables de Entorno

**Frontend** (`.env`):
```
REACT_APP_API_URL=http://localhost:8000
```

**Backend** (`.env`):
```
HOST=0.0.0.0
PORT=8000
BASE_MODEL=Qwen/Qwen2-1.5B-Instruct
ADAPTER_PATH=./checkpoint-9375
```

## 📝 Notas Importantes

1. **Primera ejecución del backend**: El modelo se descargará automáticamente la primera vez (puede tardar varios minutos)

2. **Memoria**: El modelo requiere al menos 4GB de RAM. Para GPU, se recomienda 8GB+ de VRAM

3. **Modo Fallback**: Si el modelo no carga, el backend funcionará con respuestas simuladas

4. **Checkpoints**: El sistema usa automáticamente el checkpoint más reciente (9375)

## 🐛 Troubleshooting

### El backend no inicia
- Verifica que Python 3.8+ esté instalado
- Asegúrate de tener todas las dependencias instaladas
- Revisa los logs para errores específicos

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en el puerto 8000
- Revisa la variable `REACT_APP_API_URL` en `.env`
- Comprueba la consola del navegador para errores CORS

### El modelo no carga
- Verifica que tienes suficiente RAM/disco
- Si usas GPU, asegúrate de tener los drivers de CUDA instalados
- El servidor funcionará en modo fallback si el modelo no carga

## 📚 Documentación Adicional

- [Frontend README](frontend/README.md)
- [Backend README](nexo-lora-final/README.md)

## 📄 Licencia

Este proyecto es de uso educativo y personal.











