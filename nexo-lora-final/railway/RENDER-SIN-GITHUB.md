# Subir la API Luxio a Render SIN GitHub (desde tu PC)

Render sin GitHub se hace subiendo una **imagen Docker** desde tu PC.

---

## Qué necesitás

1. **Docker Desktop** en tu PC: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. **Cuenta en Docker Hub** (gratis): [hub.docker.com](https://hub.docker.com)
3. **Cuenta en Render**: [render.com](https://render.com)

---

## Parte 1: Crear la imagen en tu PC

### 1. Instalá Docker Desktop

- Descargá e instalá desde [docker.com](https://www.docker.com/products/docker-desktop/).
- Reiniciá la PC si te lo pide.
- Abrí Docker Desktop y esperá a que esté en verde (Running).

### 2. Abrí PowerShell o CMD en la carpeta de la API

```bash
cd "c:\Users\Luxio\Desktop\ia luxio\nexo-lora-final\railway"
```

### 3. Crear la imagen

```bash
docker build -t luxio-api .
```

(El punto al final es necesario.)

### 4. Entrar a Docker Hub

En [hub.docker.com](https://hub.docker.com) creá cuenta si no tenés. Anotá tu **usuario** (ej: `luxiot`).

### 5. Etiquetar la imagen con tu usuario de Docker Hub

Reemplazá **TU_USUARIO** por tu usuario de Docker Hub:

```bash
docker tag luxio-api TU_USUARIO/luxio-api:latest
```

Ejemplo: si tu usuario es `luxiot`:

```bash
docker tag luxio-api luxiot/luxio-api:latest
```

### 6. Iniciar sesión en Docker desde la PC

```bash
docker login
```

Te pide usuario y contraseña de Docker Hub (o un Access Token).

### 7. Subir la imagen a Docker Hub

```bash
docker push TU_USUARIO/luxio-api:latest
```

Ejemplo:

```bash
docker push luxiot/luxio-api:latest
```

Cuando termine, la imagen queda en Docker Hub (pública o privada, según tu configuración).

---

## Parte 2: Crear el servicio en Render

### 1. Entrá a Render

- [render.com](https://render.com) → Iniciar sesión.

### 2. Crear Web Service desde imagen

1. **New +** → **Web Service**.
2. En "Create a new Web Service" buscá la opción **"Deploy an existing image from a registry"** o **"Docker"** / **"Public image"**.
3. **Image URL** (o "Image from registry"):
   - Si la imagen es pública: `docker.io/TU_USUARIO/luxio-api:latest`
   - Ejemplo: `docker.io/luxiot/luxio-api:latest`
4. **Name:** `luxio-api`.
5. **Plan:** Free.
6. **Create Web Service**.

### 3. Variables de entorno (si Render lo pide)

- No hace falta nada especial; tu `main.py` ya usa `PORT` que Render asigna.

### 4. URL del servicio

Cuando termine el deploy, Render te da una URL tipo:

**https://luxio-api.onrender.com**

Esa es la URL de tu API. El chat usa: **https://luxio-api.onrender.com/api/chat**

---

## Cuando cambies algo en tu PC

1. Volvé a construir y subir la imagen:

```bash
cd "c:\Users\Luxio\Desktop\ia luxio\nexo-lora-final\railway"
docker build -t luxio-api .
docker tag luxio-api TU_USUARIO/luxio-api:latest
docker push TU_USUARIO/luxio-api:latest
```

2. En Render: entrá al servicio **luxio-api** → **Manual Deploy** → **Deploy latest commit** (o "Redeploy") para que use la imagen nueva.

---

## Resumen

| Paso | Dónde | Acción |
|------|--------|--------|
| 1 | PC | Instalar Docker Desktop |
| 2 | PC | `docker build -t luxio-api .` en la carpeta railway |
| 3 | Docker Hub | Crear cuenta, anotar usuario |
| 4 | PC | `docker tag` y `docker push` con TU_USUARIO/luxio-api:latest |
| 5 | Render | New → Web Service → Deploy existing image → docker.io/TU_USUARIO/luxio-api:latest |
| 6 | Tu web | data-api-url="https://luxio-api.onrender.com" |

Así usás Render sin conectar GitHub, todo desde tu PC.
