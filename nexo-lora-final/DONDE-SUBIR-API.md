# Dónde subir la API Luxio (lista de opciones)

Tu API es una app **Python + FastAPI**. Estas plataformas pueden hostearla.

---

## Gratis o con plan free

| Plataforma | URL | Gratis | Notas |
|------------|-----|--------|--------|
| **Render** | [render.com](https://render.com) | Sí (Free tier) | Se “duerme” tras 15 min sin uso. Despierta en unos segundos. |
| **Railway** | [railway.app](https://railway.app) | Sí (límite mensual) | Fácil, conectás GitHub. Límite de horas/mes en free. |
| **Fly.io** | [fly.io](https://fly.io) | Sí (límites) | Buena opción, algo más técnica. |
| **PythonAnywhere** | [pythonanywhere.com](https://www.pythonanywhere.com) | Sí (Free) | Pensado para Python. Config manual. |
| **Vercel** | [vercel.com](https://vercel.com) | Sí | Mejor para Node/Next. Python como serverless (límites). |
| **Replit** | [replit.com](https://replit.com) | Sí | Para prototipos. Se duerme sin uso. |
| **Koyeb** | [koyeb.com](https://www.koyeb.com) | Sí (Free tier) | Similar a Render. |
| **Cyclic** | [cyclic.sh](https://www.cyclic.sh) | Sí | Orientado a Node, también soporta otros runtimes. |
| **Deta** | [deta.sh](https://www.deta.sh) | Sí | Micros en la nube, sencillo. |
| **Google Cloud Run** | [cloud.google.com/run](https://cloud.google.com/run) | Free tier generoso | Pago por uso después del free tier. |
| **Azure App Service** | [azure.microsoft.com](https://azure.microsoft.com) | Free tier | Requiere cuenta Microsoft. |
| **AWS (Lambda / Elastic Beanstalk)** | [aws.amazon.com](https://aws.amazon.com) | Free tier 12 meses | Más complejo de configurar. |

---

## De pago (más estables, sin “sueño”)

| Plataforma | URL | Notas |
|------------|-----|--------|
| **Render** (plan pago) | [render.com](https://render.com) | Siempre encendido, sin dormir. |
| **Railway** (plan pago) | [railway.app](https://railway.app) | Más recursos, sin dormir. |
| **DigitalOcean App Platform** | [digitalocean.com](https://www.digitalocean.com) | Desde ~5 USD/mes. |
| **Heroku** | [heroku.com](https://www.heroku.com) | De pago (ya no hay plan free). |
| **VPS (Hetzner, Contabo, etc.)** | Varios | Servidor tuyo, instalás Python y corrés la API. |

---

## Recomendadas para empezar

1. **Render** – Free, fácil, conectás GitHub.  
2. **Railway** – Free, muy fácil con GitHub.  
3. **Fly.io** – Free con límites, un poco más técnica.

---

## Qué carpeta subir

En todas usá la **versión ligera** de la API (sin modelo pesado):

- Carpeta: **`nexo-lora-final/railway`**
- Archivos: `main.py`, `requirements.txt`, `Procfile` (si la plataforma lo usa).

Así la API arranca rápido y no necesita mucha RAM.

---

## Resumen rápido

| Si querés… | Opción |
|------------|--------|
| Gratis y fácil | **Render** o **Railway** |
| Gratis y más control | **Fly.io** |
| Solo Python, gratis | **PythonAnywhere** |
| Estable y de pago | **Render** / **Railway** pagos o **DigitalOcean** |

Si me decís cuál te interesa (por ejemplo “Render” o “Railway”), te doy los pasos exactos para subir desde tu PC o desde GitHub.
