"""
API Luxio - Versión ligera para Railway (sin modelo LoRA).
Usa solo respuestas predefinidas. Misma interfaz /api/chat que la versión completa.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="Luxio API (Railway)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    context: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    tokens_used: Optional[int] = None

@app.get("/")
async def root():
    return {
        "message": "Luxio API está funcionando (modo ligero)",
        "model_loaded": False,
        "hosting": "Railway"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": False}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
    try:
        response_text = generate_fallback_response(request.message, request.context or [])
        return ChatResponse(response=response_text)
    except Exception as e:
        response_text = generate_fallback_response(request.message, request.context or [])
        return ChatResponse(response=response_text)

def generate_fallback_response(user_message: str, context: List[dict]) -> str:
    message_lower = user_message.lower().strip()
    if any(word in message_lower for word in ['hola', 'hi', 'buenos días', 'buenas tardes', 'buenas']):
        return """¡Hola! Soy un asistente de IA diseñado para ayudarte de la mejor manera posible.

**¿Qué puedo hacer por ti?**
- Responder preguntas sobre diversos temas
- Ayudar con tareas y problemas
- Proporcionar explicaciones detalladas
- Mantener conversaciones útiles y constructivas

Cada interacción me ayuda a mejorar. ¿En qué puedo asistirte hoy?"""
    elif 'creador' in message_lower or 'creaste' in message_lower or 'quien te' in message_lower or 'quién te' in message_lower:
        return """**Sobre mi creación:**

Fui desarrollado usando una arquitectura de aprendizaje profundo avanzada:

**Modelo Base:** Qwen2-1.5B-Instruct
**Entrenamiento Personalizado:** LoRA (Low-Rank Adaptation)
**Objetivo:** Proporcionar respuestas útiles, precisas y bien estructuradas."""
    elif 'como funciona' in message_lower or 'cómo funciona' in message_lower:
        return """**Cómo funciono:**

Mi arquitectura se basa en tres componentes principales:

**1. Modelo de Lenguaje Base**
**2. Adaptador LoRA Personalizado**
**3. Sistema de Memoria y Contexto**

**Resultado:** Un asistente que combina la capacidad general del modelo base con conocimiento especializado."""
    elif 'que aprendiste' in message_lower or 'qué aprendiste' in message_lower:
        context_count = len(context) if context else 0
        return f"""**Estado de mi aprendizaje:**

He procesado {context_count} interacciones recientes.
Cada conversación fortalece mi comprensión. ¿En qué puedo ayudarte?"""
    elif 'que eres' in message_lower or 'qué eres' in message_lower:
        return """**Soy un asistente de IA avanzado**

**Mi propósito:** Ayudarte de la manera más útil, honesta e inofensiva posible.
**Mis características:** Útil, Honesto, Inofensivo, Adaptable."""
    else:
        return f"""Entiendo que preguntaste sobre: **"{user_message}"**

**Mi análisis:**
Estoy procesando tu pregunta. Para darte la mejor respuesta posible:

1. **Más contexto:** ¿Podrías proporcionar más detalles?
2. **Reformulación:** A veces reformular la pregunta ayuda
3. **Especificidad:** Cuanto más específica sea tu pregunta, más precisa será mi respuesta

¿En qué puedo ayudarte mejor?"""

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
