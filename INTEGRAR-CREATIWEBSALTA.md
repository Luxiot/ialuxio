# Integrar Luxio AI en CreatiWebSalta (creatiwebsalta.com)

## Paso 1: Desplegar tu API (obligatorio)

Tu API actualmente corre en `localhost:8001`. Para que funcione en creatiwebsalta.com **debes desplegarla** en un servidor público.

### Opciones gratuitas para desplegar FastAPI:

| Servicio | Dificultad | Notas |
|----------|------------|-------|
| **Railway** | Fácil | Tier gratuito, buen soporte Python |
| **Render** | Fácil | Free tier, se "duerme" tras inactividad |
| **Fly.io** | Media | Gratuito con límites |
| **PythonAnywhere** | Fácil | Gratis para apps web |

Ejemplo de URL una vez desplegado: `https://tu-api-luxio.railway.app` o `https://luxio-api.onrender.com`

---

## Paso 2: Subir el widget

1. Copia el archivo `frontend/public/luxio-chat-widget.js`
2. Súbelo a tu servidor de CreatiWebSalta (o hostéalo en GitHub Pages, Netlify, etc.)
3. La URL final podría ser: `https://creatiwebsalta.com/luxio-chat-widget.js`

---

## Paso 3: Agregar el script a CreatiWebSalta

Añade este código **antes del cierre de `</body>`** en todas las páginas donde quieras el chat:

```html
<!-- Luxio AI - Asistente Inteligente -->
<script 
  src="https://creatiwebsalta.com/luxio-chat-widget.js" 
  data-api-url="https://TU-API-DESPLEGADA.com"
  data-name="CreatiWeb AI"
></script>
```

**Reemplaza** `https://TU-API-DESPLEGADA.com` por la URL real de tu API desplegada.

---

## Si usas WordPress, Wix u otro constructor

### WordPress
- Ve a **Apariencia → Editor de temas** o usa un plugin como "Insert Headers and Footers"
- Pega el script en el footer
- O usa el widget HTML personalizado

### Wix
- Añade un elemento "Embebido" → "Código personalizado"
- Pega el script ahí

### HTML estático
- Edita el archivo `index.html` (o el que corresponda)
- Pega el script antes de `</body>`

---

## Verificación

1. API desplegada y respondiendo en `/api/chat`
2. Widget accesible en `creatiwebsalta.com/luxio-chat-widget.js`
3. CORS configurado (tu backend ya permite `*`)
4. El script tiene `data-api-url` correcto

---

## CORS en producción

Tu `main.py` ya tiene `allow_origins=["*"]`. Si en producción usas un dominio específico, cambia a:

```python
allow_origins=["https://creatiwebsalta.com", "https://www.creatiwebsalta.com"]
```

Esto mejora la seguridad.
