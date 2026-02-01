"""
API Luxio - Versión ligera para Render/Railway.
Soporta GROQ_API_KEY, OPENAI_API_KEY o GEMINI_API_KEY. Si no hay ninguna, usa respuestas predefinidas.
Solo usa stdlib (urllib) para no depender de httpx en el build de Render.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import ssl
import urllib.request
import asyncio

app = FastAPI(title="Luxio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Log al arranque para depurar en Render (no muestra el valor de la clave)
def _llm_mode() -> str:
    if GROQ_API_KEY:
        return "groq"
    if OPENAI_API_KEY:
        return "openai"
    if GEMINI_API_KEY:
        return "gemini"
    return "fallback"

print(f"[Luxio API] GROQ_API_KEY configurada: {bool(GROQ_API_KEY)}")
print(f"[Luxio API] OPENAI_API_KEY configurada: {bool(OPENAI_API_KEY)}")
print(f"[Luxio API] GEMINI_API_KEY configurada: {bool(GEMINI_API_KEY)}")
print(f"[Luxio API] Modo: {_llm_mode()}")

SYSTEM_PROMPT = """Eres CreatiWeb AI, el asistente comercial de CreatiWebSalta. Tu rol es vender desarrollo web profesional de forma amigable y convincente.

**Tu identidad:** Representás a CreatiWebSalta, desarrollo web profesional en Salta. Sos un vendedor experto que asesora y cierra proyectos.

**Precios (siempre que pregunten por costos):**
- Los proyectos web van desde **$150.000** hasta **$1.000.000** (pesos), según complejidad, páginas, diseño y funcionalidades.
- Landing o sitio sencillo: desde $150.000.
- Sitio corporativo / portfolio: $250.000 - $500.000.
- E-commerce o web a medida: $500.000 - $1.000.000.
- Ofrecé presupuesto sin compromiso y destacá que incluye diseño profesional, responsive y buenas prácticas.

**Estilo:** Profesional pero cercano. Vendé con confianza: calidad, experiencia, resultados. Invitá a contactar por WhatsApp o email para presupuesto personalizado. No inventes precios fuera de ese rango. Responde siempre en español.

**Formato de respuesta (MUY IMPORTANTE):** Usa SOLO texto plano. Para negrita usa **texto**. Para listas usa guión y espacio "- " al inicio de cada ítem. Para saltos de línea usa un salto de línea normal. NUNCA escribas etiquetas HTML como <br>, <strong>, ni asteriscos sueltos "* " para listas; el chat las muestra mal. Usa "- " para viñetas."""

class ChatRequest(BaseModel):
    message: str
    context: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    tokens_used: Optional[int] = None
    source: Optional[str] = None  # "groq" | "openai" | "gemini" | "fallback" para depurar

def _has_llm_key() -> bool:
    return bool(GROQ_API_KEY or OPENAI_API_KEY or GEMINI_API_KEY)

@app.get("/")
async def root():
    return {
        "message": "Luxio API está funcionando",
        "model_loaded": _has_llm_key(),
        "llm": _llm_mode(),
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": _has_llm_key()}


def _http_post_sync(url: str, headers: dict, body: dict) -> tuple[int, str]:
    """POST JSON usando solo stdlib. Devuelve (status_code, body_str)."""
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        body_read = e.read().decode("utf-8") if e.fp else ""
        return e.code, body_read
    except Exception as e:
        print(f"[HTTP] error: {e}")
        return 0, ""


def _build_messages(user_message: str, context: List[dict]) -> list:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for c in (context or [])[-4:]:
        if isinstance(c, dict):
            r = c.get("role") or "user"
            content = c.get("content") or c.get("context") or ""
            if content:
                messages.append({"role": r if r in ("user", "assistant") else "user", "content": str(content)[:500]})
    messages.append({"role": "user", "content": user_message})
    return messages


async def _call_groq(user_message: str, context: List[dict]) -> Optional[str]:
    if not GROQ_API_KEY:
        return None
    messages = _build_messages(user_message, context)
    body = {"model": "llama-3.1-8b-instant", "messages": messages, "max_tokens": 1024, "temperature": 0.7}
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    loop = asyncio.get_event_loop()
    status, raw = await loop.run_in_executor(
        None, lambda: _http_post_sync("https://api.groq.com/openai/v1/chat/completions", headers, body)
    )
    if status != 200:
        try:
            print(f"[Groq] status={status} body={raw[:500]}")
        except Exception:
            print(f"[Groq] status={status}")
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not data.get("choices"):
        print("[Groq] respuesta sin choices")
        return None
    return (data["choices"][0].get("message") or {}).get("content", "").strip()


async def _call_openai(user_message: str, context: List[dict]) -> Optional[str]:
    if not OPENAI_API_KEY:
        return None
    messages = _build_messages(user_message, context)
    body = {"model": "gpt-3.5-turbo", "messages": messages, "max_tokens": 1024}
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    loop = asyncio.get_event_loop()
    status, raw = await loop.run_in_executor(
        None, lambda: _http_post_sync("https://api.openai.com/v1/chat/completions", headers, body)
    )
    if status != 200:
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not data.get("choices"):
        return None
    return (data["choices"][0].get("message") or {}).get("content", "").strip()


def _build_gemini_contents(user_message: str, context: List[dict]) -> list:
    """Construye contents para Gemini API (roles: user / model)."""
    contents = []
    for c in (context or [])[-4:]:
        if not isinstance(c, dict):
            continue
        role = c.get("role") or "user"
        content = c.get("content") or c.get("context") or ""
        if not content:
            continue
        # Gemini usa "model" no "assistant"
        gemini_role = "model" if role == "assistant" else "user"
        contents.append({"role": gemini_role, "parts": [{"text": str(content)[:500]}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})
    return contents


# Modelos Gemini a probar en orden (el primero que responda 200 se usa)
GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"]


def _call_gemini_sync(model: str, body: dict, headers: dict) -> tuple[int, str]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    return _http_post_sync(url, headers, body)


async def _call_gemini(user_message: str, context: List[dict]) -> Optional[str]:
    if not GEMINI_API_KEY:
        return None
    contents = _build_gemini_contents(user_message, context)
    body = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {"maxOutputTokens": 1024, "temperature": 0.7},
    }
    headers = {"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"}
    loop = asyncio.get_event_loop()
    for model in GEMINI_MODELS:
        status, raw = await loop.run_in_executor(
            None, lambda m=model: _call_gemini_sync(m, body, headers)
        )
        if status != 200:
            try:
                print(f"[Gemini] {model} status={status} body={raw[:300]}")
            except Exception:
                print(f"[Gemini] {model} status={status}")
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        candidates = data.get("candidates") or []
        if not candidates:
            continue
        parts = (candidates[0].get("content") or {}).get("parts") or []
        if not parts:
            continue
        text = (parts[0].get("text") or "").strip()
        if text:
            print(f"[Gemini] OK con modelo {model}")
            return text
    return None


def generate_fallback_response(user_message: str, context: List[dict]) -> str:
    message_lower = user_message.lower().strip()
    if any(word in message_lower for word in ['hola', 'hi', 'buenos días', 'buenas tardes', 'buenas']):
        return """Hola. Soy CreatiWeb AI, asistente de IA para desarrollo web.

Puedo ayudarte con proyectos, presupuestos, tecnologías y buenas prácticas.

**Configura una API key en Render** (GROQ_API_KEY o OPENAI_API_KEY) para respuestas con IA real. Sin clave, uso respuestas predefinidas."""
    elif 'creador' in message_lower or 'creaste' in message_lower or 'quien te' in message_lower or 'quién te' in message_lower:
        return """Soy CreatiWeb AI, integrado en la API Luxio. Puedo usar Groq, OpenAI o Gemini si está configurada la API key en el servidor."""
    elif 'como funciona' in message_lower or 'cómo funciona' in message_lower:
        return """Esta API puede usar Groq, OpenAI o Gemini para respuestas inteligentes. Configura GROQ_API_KEY, OPENAI_API_KEY o GEMINI_API_KEY en las variables de entorno de Render."""
    elif 'que eres' in message_lower or 'qué eres' in message_lower:
        return """Soy CreatiWeb AI: asistente de IA para desarrollo web. Responde desde la API en Render; con API key uso Groq, OpenAI o Gemini."""
    else:
        return f"""Recibí: **"{user_message}"**

Para respuestas con IA real, configura en Render **GROQ_API_KEY** (gratis en groq.com), **OPENAI_API_KEY** o **GEMINI_API_KEY** (gratis en aistudio.google.com)."""

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
    ctx = request.context or []
    user_message = request.message.strip()

    response_text = None
    source = "fallback"
    if GROQ_API_KEY:
        response_text = await _call_groq(user_message, ctx)
        if response_text:
            source = "groq"
    if (response_text is None or not response_text) and OPENAI_API_KEY:
        response_text = await _call_openai(user_message, ctx)
        if response_text:
            source = "openai"
    if (response_text is None or not response_text) and GEMINI_API_KEY:
        response_text = await _call_gemini(user_message, ctx)
        if response_text:
            source = "gemini"
    if response_text is None or not response_text:
        response_text = generate_fallback_response(user_message, ctx)

    return ChatResponse(response=response_text, source=source)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
