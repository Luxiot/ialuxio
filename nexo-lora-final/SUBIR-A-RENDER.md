# Subir la API Luxio a Render (desde tu PC)

Tu IA (API del chat) está en **nexo-lora-final/railway/** — esa es la versión ligera que Render puede ejecutar.

---

## Opción A: Render conectado a GitHub (recomendada)

Ya tenés el proyecto en **https://github.com/Luxiot/ialuxio**. Render puede desplegar desde ahí.

### 1. Entrar a Render

- Entrá a [render.com](https://render.com) e iniciá sesión (con GitHub es más fácil).

### 2. Crear un Web Service

1. **New** → **Web Service**.
2. Conectá el repo **Luxiot/ialuxio** (si no está, “Connect account” con GitHub).
3. Configuración:
   - **Name:** `luxio-api` (o el nombre que quieras).
   - **Region:** el más cercano (ej. Oregon).
   - **Branch:** `main`.
   - **Root Directory:** `nexo-lora-final/railway` ← importante.
   - **Runtime:** Python 3.
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
4. **Plan:** Free (para probar).
5. **Create Web Service**.

### 3. Esperar el deploy

Render va a instalar dependencias y arrancar la API. Cuando termine, te da una URL como:

**https://luxio-api.onrender.com**

Esa es la URL de tu API. El chat usa: **https://luxio-api.onrender.com/api/chat**

### 4. Conectar creatiwebsalta.com (cuando la tengas online)

En el HTML del chat, cambiá:

```html
data-api-url="https://luxio-api.onrender.com"
```

(Reemplazá por la URL que te muestre Render.)

---

## Opción B: Subir desde la PC sin GitHub (Render CLI)

Si no querés usar GitHub, podés desplegar desde tu carpeta con la CLI de Render.

### 1. Instalar Render CLI

En PowerShell (como administrador si hace falta):

```bash
npm install -g @render/cli
```

O con scoop (si lo tenés):

```bash
scoop install render
```

### 2. Iniciar sesión

```bash
render login
```

Se abre el navegador para que entres con tu cuenta de Render.

### 3. Ir a la carpeta de la API

```bash
cd "c:\Users\Luxio\Desktop\ia luxio\nexo-lora-final\railway"
```

### 4. Crear el servicio desde la PC

```bash
render deploy
```

Te va a preguntar nombre del servicio, tipo (Web Service), etc. Elegí **Web Service** y que use **Python**.  
Cuando termine, te da la URL (ej. `https://algo.onrender.com`).

---

## Otras plataformas (también desde tu PC vía GitHub)

| Plataforma | Desde PC | Cómo |
|------------|----------|------|
| **Railway** | Sí (repo en GitHub) | New Project → Deploy from GitHub → repo **Luxiot/ialuxio** → Root: **nexo-lora-final/railway** |
| **Render** | Sí (repo o CLI) | Opción A o B de arriba |
| **Fly.io** | Sí | `fly launch` en la carpeta railway (requiere cuenta y `flyctl`) |
| **PythonAnywhere** | Manual | Subís los archivos por la web y configurás un WSGI app |

---

## Resumen

- **Más fácil:** Opción A (Render + GitHub). Solo conectás el repo, ponés Root Directory **nexo-lora-final/railway** y Start Command **python main.py**.
- **Sin GitHub:** Opción B (Render CLI) desde `nexo-lora-final\railway` con `render deploy`.
- La **URL** que te dé Render (ej. `https://luxio-api.onrender.com`) es la que ponés en **data-api-url** del chat en tu página.
