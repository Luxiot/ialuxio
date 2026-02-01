"""
API Luxio - Versión ligera para Render/Railway.
Si hay GROQ_API_KEY o OPENAI_API_KEY, usa ese servicio de IA.
Si no, usa respuestas predefinidas. Misma interfaz /api/chat.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx

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

# Log al arranque para depurar en Render (no muestra el valor de la clave)
print(f"[Luxio API] GROQ_API_KEY configurada: {bool(GROQ_API_KEY)}")
print(f"[Luxio API] OPENAI_API_KEY configurada: {bool(OPENAI_API_KEY)}")
print(f"[Luxio API] Modo: {'groq' if GROQ_API_KEY else ('openai' if OPENAI_API_KEY else 'fallback')}")

SYSTEM_PROMPT = """Eres CreatiWeb AI, asistente de IA especializado en desarrollo web.
Responde siempre en español, de forma clara y profesional.
Ayudas con: proyectos web, presupuestos, tecnologías (HTML, CSS, JavaScript, React, etc.), buenas prácticas y consultas técnicas.
Sé conciso pero útil. Usa formato cuando ayude (listas, negritas)."""

class ChatRequest(BaseModel):
    message: str
    context: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    tokens_used: Optional[int] = None
    source: Optional[str] = None  # "groq" | "openai" | "fallback" para depurar

def _has_llm_key() -> bool:
    return bool(GROQ_API_KEY or OPENAI_API_KEY)

@app.get("/")
async def root():
    return {
        "message": "Luxio API está funcionando",
        "model_loaded": _has_llm_key(),
        "llm": "groq" if GROQ_API_KEY else ("openai" if OPENAI_API_KEY else "fallback"),
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": _has_llm_key()}

async def _call_groq(user_message: str, context: List[dict]) -> Optional[str]:
    if not GROQ_API_KEY:
        return None
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for c in context[-4:]:
        if isinstance(c, dict):
            r = c.get("role") or "user"
            content = c.get("content") or c.get("context") or ""
            if content:
                messages.append({"role": r if r in ("user", "assistant") else "user", "content": str(content)[:500]})
    messages.append({"role": "user", "content": user_message})
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.1-8b-instant",
                "messages": messages,
                "max_tokens": 1024,
                "temperature": 0.7,
            },
        )
    if r.status_code != 200:
        try:
            print(f"[Groq] status={r.status_code} body={r.text[:500]}")
        except Exception:
            print(f"[Groq] status={r.status_code}")
        return None
    data = r.json()
    if not data.get("choices"):
        print("[Groq] respuesta sin choices")
        return None
    return (data["choices"][0].get("message") or {}).get("content", "").strip()

async def _call_openai(user_message: str, context: List[dict]) -> Optional[str]:
    if not OPENAI_API_KEY:
        return None
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for c in context[-4:]:
        if isinstance(c, dict):
            r = c.get("role") or "user"
            content = c.get("content") or c.get("context") or ""
            if content:
                messages.append({"role": r if r in ("user", "assistant") else "user", "content": str(content)[:500]})
    messages.append({"role": "user", "content": user_message})
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "max_tokens": 1024,
            },
        )
    if r.status_code != 200:
        return None
    data = r.json()
    if not data.get("choices"):
        return None
    return (data["choices"][0].get("message") or {}).get("content", "").strip()

def generate_fallback_response(user_message: str, context: List[dict]) -> str:
    message_lower = user_message.lower().strip()
    if any(word in message_lower for word in ['hola', 'hi', 'buenos días', 'buenas tardes', 'buenas']):
        return """Hola. Soy CreatiWeb AI, asistente de IA para desarrollo web.

Puedo ayudarte con proyectos, presupuestos, tecnologías y buenas prácticas.

**Configura una API key en Render** (GROQ_API_KEY o OPENAI_API_KEY) para respuestas con IA real. Sin clave, uso respuestas predefinidas."""
    elif 'creador' in message_lower or 'creaste' in message_lower or 'quien te' in message_lower or 'quién te' in message_lower:
        return """Soy CreatiWeb AI, integrado en la API Luxio. Puedo usar Groq u OpenAI si está configurada la API key en el servidor."""
    elif 'como funciona' in message_lower or 'cómo funciona' in message_lower:
        return """Esta API puede usar Groq u OpenAI para respuestas inteligentes. Configura GROQ_API_KEY o OPENAI_API_KEY en las variables de entorno de Render."""
    elif 'que eres' in message_lower or 'qué eres' in message_lower:
        return """Soy CreatiWeb AI: asistente de IA para desarrollo web. Responde desde la API en Render; con API key uso un modelo de lenguaje externo (Groq/OpenAI)."""
    else:
        return f"""Recibí: **"{user_message}"**

Para respuestas con IA real, configura en Render la variable de entorno **GROQ_API_KEY** (gratis en groq.com) o **OPENAI_API_KEY**."""

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
    if response_text is None or not response_text:
        response_text = generate_fallback_response(user_message, ctx)

    return ChatResponse(response=response_text, source=source)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
