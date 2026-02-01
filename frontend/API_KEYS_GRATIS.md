# 🔑 Cómo Obtener API Keys GRATUITAS para Luxio

Luxio ahora soporta múltiples APIs **GRATUITAS** para aprender de internet. Elige la que prefieras:

## 🚀 **1. Groq API (RECOMENDADO - Gratis y Rápido)**

**✅ Ventajas:**
- Completamente GRATIS
- MUY RÁPIDO (respuestas en segundos)
- Sin límites estrictos
- Modelo: Llama 3.1 70B (muy potente)

**📝 Pasos:**
1. Ve a: https://console.groq.com/
2. Crea una cuenta (gratis)
3. Ve a "API Keys" en el menú
4. Crea una nueva API key
5. Copia la key

**🔧 Configuración:**
Crea un archivo `.env` en la carpeta `frontend/` con:
```
REACT_APP_GROQ_API_KEY=tu_key_aqui
```

---

## 💰 **2. OpenAI API (Créditos Gratis Iniciales)**

**✅ Ventajas:**
- $5 USD gratis al registrarte
- Modelo GPT-3.5-turbo (muy bueno)
- Funciona muy bien

**📝 Pasos:**
1. Ve a: https://platform.openai.com/
2. Crea una cuenta
3. Ve a "API Keys"
4. Crea una nueva key
5. Copia la key

**🔧 Configuración:**
```
REACT_APP_OPENAI_API_KEY=tu_key_aqui
```

---

## 🌟 **3. Google Gemini API (Tier Gratuito Generoso)**

**✅ Ventajas:**
- Completamente GRATIS
- Tier gratuito muy generoso
- Modelo Gemini Pro (excelente)

**📝 Pasos:**
1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con Google
3. Crea una nueva API key
4. Copia la key

**🔧 Configuración:**
```
REACT_APP_GEMINI_API_KEY=tu_key_aqui
```

---

## 🤗 **4. Hugging Face API (Gratis con Límites)**

**✅ Ventajas:**
- Completamente GRATIS
- Modelo Llama 2 (bueno)
- Comunidad open source

**📝 Pasos:**
1. Ve a: https://huggingface.co/
2. Crea una cuenta
3. Ve a Settings > Access Tokens
4. Crea un nuevo token
5. Copia el token

**🔧 Configuración:**
```
REACT_APP_HUGGINGFACE_API_KEY=tu_token_aqui
```

---

## ⚙️ **Configuración Final**

1. **Crea el archivo `.env`** en la carpeta `frontend/`:
   ```bash
   # Elige UNA de estas opciones (Groq es la más recomendada):
   REACT_APP_GROQ_API_KEY=tu_key_aqui
   # O
   REACT_APP_OPENAI_API_KEY=tu_key_aqui
   # O
   REACT_APP_GEMINI_API_KEY=tu_key_aqui
   # O
   REACT_APP_HUGGINGFACE_API_KEY=tu_key_aqui
   ```

2. **Reinicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

3. **¡Listo!** Ahora Luxio puede aprender de internet usando la API gratuita que elegiste.

---

## 🎯 **Recomendación**

**Usa Groq API** porque:
- ✅ Es completamente gratis
- ✅ Es MUY rápido
- ✅ No tiene límites estrictos
- ✅ El modelo es muy bueno (Llama 3.1 70B)

---

## ❓ **¿Problemas?**

Si tienes problemas:
1. Verifica que el archivo `.env` esté en la carpeta `frontend/`
2. Reinicia el servidor después de agregar la key
3. Verifica que la key sea correcta (sin espacios extra)
4. Revisa la consola del navegador para ver errores

---

## 📝 **Nota Importante**

- **NO compartas tus API keys** públicamente
- Agrega `.env` a tu `.gitignore` para no subirlo a GitHub
- Las keys son personales y privadas

¡Disfruta aprendiendo con Luxio! 🧠🌐✨








