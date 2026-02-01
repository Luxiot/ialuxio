# Subir la API Luxio a Railway

## Opción recomendada: API ligera (sin modelo)

La carpeta **`railway/`** tiene una versión ligera de la API que responde con frases predefinidas. No usa el modelo LoRA (no hace falta GPU ni mucha RAM) y Railway la puede ejecutar sin problemas.

---

## Pasos en Railway

### 1. Crear cuenta y proyecto

1. Entra a [railway.app](https://railway.app) e inicia sesión (GitHub o email).
2. Clic en **"New Project"**.
3. Elige **"Deploy from GitHub repo"** (conecta tu repo) **o** **"Empty Project"** para subir manualmente.

### 2. Desplegar desde la carpeta `railway/`

**Si usas GitHub:**

1. Conecta el repositorio donde está el proyecto **ia luxio**.
2. En Railway, en el servicio, ve a **Settings** → **Root Directory** (o **Source**).
3. Pon como directorio raíz: **`nexo-lora-final/railway`**  
   (así Railway usará solo esa carpeta con `main.py` y `requirements.txt`).
4. **Build Command:** déjalo por defecto (Railway detecta Python y hace `pip install -r requirements.txt`).
5. **Start Command:** `python main.py` (o `uvicorn main:app --host 0.0.0.0 --port $PORT`).
6. Guarda y haz **Deploy** (o espera el deploy automático si ya está conectado).

**Si subes sin GitHub (Railway CLI):**

```bash
cd c:\Users\Luxio\Desktop\ia luxio\nexo-lora-final\railway
npm i -g @railway/cli
railway login
railway init
railway up
```

### 3. Obtener la URL pública

1. En el proyecto de Railway, abre tu servicio.
2. Ve a **Settings** → **Networking** → **Generate Domain** (o **Public Networking**).
3. Railway te dará una URL como: **`https://tu-proyecto.up.railway.app`**.

Esa es la **URL base de tu API**. El chat usa el endpoint **`/api/chat`**, es decir:  
**`https://tu-proyecto.up.railway.app/api/chat`**.

### 4. Probar la API

- En el navegador: `https://tu-proyecto.up.railway.app` → deberías ver el JSON de bienvenida.
- Documentación: `https://tu-proyecto.up.railway.app/docs`.

---

## Conectar creatiwebsalta.com con la API en Railway

1. Abre **CreatiWebSalta/index.html**.
2. Busca el script del widget (CreatiWeb AI).
3. Cambia **`data-api-url`** a la URL de Railway **sin** `/api/chat`:

```html
<script 
  src="luxio-chat-widget.js" 
  data-api-url="https://tu-proyecto.up.railway.app"
  data-name="CreatiWeb AI"
></script>
```

4. Vuelve a desplegar la web en Firebase (`firebase deploy` desde la carpeta CreatiWebSalta).

Después de eso, el chat en creatiwebsalta.com usará la API alojada en Railway.

---

## Resumen

| Qué | Dónde |
|-----|--------|
| Código para Railway | `nexo-lora-final/railway/` (main.py + requirements.txt) |
| Root Directory en Railway | `nexo-lora-final/railway` (si el repo es "ia luxio") |
| URL del chat | `https://TU-DOMINIO.up.railway.app/api/chat` |
| En CreatiWebSalta | `data-api-url="https://TU-DOMINIO.up.railway.app"` |

Si más adelante quieres usar el **modelo LoRA completo** en Railway, haría falta un plan de pago (más RAM) y subir los checkpoints; esta guía es para la versión ligera que ya responde en el chat.
