# Widget de Chat Luxio - Cómo agregar conversación inteligente a tu web

## Uso rápido

Agrega este script **antes del cierre de `</body>`** en cualquier página HTML:

```html
<script 
  src="/luxio-chat-widget.js" 
  data-api-url="http://localhost:8001"
  data-name="Luxio"
></script>
```

## Parámetros configurables

| Atributo | Descripción | Ejemplo |
|----------|-------------|---------|
| `data-api-url` | URL de tu API de chat | `http://localhost:8001` |
| `data-name` | Nombre del asistente | `Luxio` |

## Requisitos

1. **Backend en ejecución**: El servidor FastAPI debe estar corriendo en el puerto configurado.
2. **Para probar localmente**: 
   - Ejecuta `start.bat` desde la raíz del proyecto, o
   - Ejecuta el backend: `cd nexo-lora-final && python main.py`
   - El frontend: `cd frontend && npm start`

## Ver ejemplo

Abre `embed-ejemplo.html` en el navegador (con el backend corriendo):
```
http://localhost:3000/embed-ejemplo.html
```

## Producción

Cuando despliegues tu API en un servidor:

1. Cambia `data-api-url` a la URL pública de tu API (ej: `https://tu-dominio.com/api`)
2. Asegúrate de que el endpoint sea `https://tu-dominio.com/api/chat` (POST)
