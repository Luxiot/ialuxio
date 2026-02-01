# Frontend - IA Chat con Aprendizaje Continuo

Interfaz de usuario React para el sistema de chat con IA que aprende continuamente.

## Características

- Interfaz moderna con Tailwind CSS
- Panel lateral con métricas del "cerebro IA"
- Visualización de actividad neural en tiempo real
- Sistema de memoria y aprendizaje visualizado
- Conexión con backend para respuestas de IA real

## Requisitos

- Node.js 16+
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env y configurar REACT_APP_API_URL si es necesario
```

## Uso

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `build/`

## Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/
│   │   └── AIChat.jsx  # Componente principal del chat
│   ├── App.jsx         # Componente raíz
│   ├── App.css         # Estilos globales
│   ├── index.js        # Punto de entrada
│   └── index.css       # Estilos base con Tailwind
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración de Tailwind
└── postcss.config.js   # Configuración de PostCSS
```

## Características de la UI

### Panel Lateral
- **Chip Neural**: Muestra la actividad de procesamiento
- **Almacenamiento**: Número de conceptos almacenados
- **Aprendizaje**: Progreso de la tasa de aprendizaje
- **Memoria Reciente**: Últimos conceptos procesados

### Chat Principal
- Interfaz de mensajes estilo chat
- Input con envío por Enter o botón
- Indicador de "pensando" durante el procesamiento
- Scroll automático a nuevos mensajes

## Configuración

### Variables de Entorno

- `REACT_APP_API_URL`: URL del backend (default: `http://localhost:8000`)

### Personalización

Puedes personalizar los colores y estilos editando:
- `tailwind.config.js` para temas
- `src/components/AIChat.jsx` para la lógica y estructura
- `src/App.css` para estilos globales

## Notas

- El frontend funciona en modo standalone si el backend no está disponible
- Las respuestas de fallback se generan localmente
- Las métricas se actualizan en tiempo real durante las conversaciones











