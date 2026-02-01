# Subir el proyecto ia luxio a GitHub

Repo: **https://github.com/Luxiot/ialuxio.git**

## En la terminal (desde la carpeta del proyecto)

Abre **PowerShell** o **CMD** y ejecuta:

```bash
cd "c:\Users\Luxio\Desktop\ia luxio"

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Luxiot/ialuxio.git
git push -u origin main
```

## Si ya tenés Git inicializado

Si en esa carpeta ya hiciste `git init` antes:

```bash
cd "c:\Users\Luxio\Desktop\ia luxio"

git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Luxiot/ialuxio.git
git push -u origin main
```

## Si ya tenés un remote "origin"

Si te dice que `origin` ya existe:

```bash
git remote remove origin
git remote add origin https://github.com/Luxiot/ialuxio.git
git push -u origin main
```

## Autenticación

Al hacer `git push`, GitHub puede pedirte:

- **Usuario:** Luxiot  
- **Contraseña:** ya no se usa la contraseña de la cuenta. Tenés que usar un **Personal Access Token (PAT)**.

Crear un token:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token**.
3. Marca al menos **repo**.
4. Copia el token y úsalo como “contraseña” cuando `git push` lo pida.

---

Después del primer `git push`, el proyecto quedará en: **https://github.com/Luxiot/ialuxio**
