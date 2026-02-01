# Activar IA real en la API (Groq, OpenAI o Gemini)

**Importante:** En Render el **Root Directory** del servicio debe ser **`nexo-lora-final/railway`** y el **Start Command** **`python main.py`**. Si usás la carpeta `nexo-lora-final` (sin `/railway`), se ejecuta la API pesada y verás respuestas predefinidas.

La API puede usar **Groq**, **OpenAI** o **Google Gemini** para respuestas de IA real. Sin clave, usa respuestas predefinidas. Orden de uso: Groq → OpenAI → Gemini → fallback.

---

## Opción 1: Groq (gratis)

1. Entrá a [console.groq.com](https://console.groq.com) y creá cuenta.
2. **API Keys** → **Create API Key** → copiá la clave.
3. En **Render** → tu servicio **ialuxio** → **Environment** (Variables de entorno).
4. **Add Environment Variable**:
   - **Key:** `GROQ_API_KEY`
   - **Value:** tu clave de Groq (pegada).
5. Guardá. Render hace **redeploy** automático; esperá 1–2 minutos.

Listo: el chat usará Groq para responder.

---

## Opción 2: OpenAI

1. En [platform.openai.com](https://platform.openai.com) → **API keys** → creá una clave.
2. En **Render** → servicio **ialuxio** → **Environment**.
3. **Add Environment Variable**:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** tu clave de OpenAI.
4. Guardá y esperá el redeploy.

---

## Opción 3: Google Gemini (gratis)

1. Entrá a [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (Google AI Studio) y creá o usá tu cuenta Google.
2. **Create API Key** → copiá la clave.
3. En **Render** → servicio **ialuxio** → **Environment**.
4. **Add Environment Variable**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** tu clave de Gemini.
5. Guardá y esperá el redeploy.

Si Groq y OpenAI fallan o no están configuradas, la API usará Gemini.

---

## Resumen

| Variable           | Dónde conseguirla | Uso |
|--------------------|-------------------|-----|
| **GROQ_API_KEY**   | [console.groq.com](https://console.groq.com) | Groq (gratis) |
| **OPENAI_API_KEY** | [platform.openai.com](https://platform.openai.com) | GPT-3.5 |
| **GEMINI_API_KEY** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Gemini 1.5 Flash (gratis) |

Sin ninguna clave, la API sigue funcionando con respuestas predefinidas.
