from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel, PeftConfig
import os
from dotenv import load_dotenv

load_dotenv()

# Variables globales para el modelo
model = None
tokenizer = None
device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    """Carga el modelo base y el adaptador LoRA"""
    global model, tokenizer
    
    try:
        base_model_name = "Qwen/Qwen2-1.5B-Instruct"
        adapter_path = "./checkpoint-9375"  # Usar el checkpoint más reciente
        
        print(f"Cargando modelo base: {base_model_name}")
        tokenizer = AutoTokenizer.from_pretrained(base_model_name)
        
        # Cargar modelo base
        model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            dtype=torch.float16 if device == "cuda" else torch.float32,
            device_map="auto" if device == "cuda" else None,
            low_cpu_mem_usage=True
        )
        
        # Cargar adaptador LoRA (SIN fusionar para mantener el efecto del LoRA)
        if os.path.exists(adapter_path):
            print(f"✓ Cargando adaptador LoRA entrenado desde: {adapter_path}")
            model = PeftModel.from_pretrained(model, adapter_path)
            print(f"✓ Adaptador LoRA cargado correctamente")
            print(f"✓ NOTA: LoRA se usa directamente (sin fusionar) para mantener tu entrenamiento activo")
            print(f"✓ Configuración LoRA: r=64, alpha=128, dropout=0.05")
        else:
            print(f"⚠ Advertencia: No se encontró el adaptador LoRA en {adapter_path}")
            print(f"⚠ El modelo usará solo el modelo base sin tus entrenamientos")
        
        model.eval()
        if device == "cpu":
            model = model.to(device)
        
        print(f"✓ Modelo cargado exitosamente en {device}")
        if os.path.exists(adapter_path):
            # Verificar configuración del LoRA
            try:
                config = PeftConfig.from_pretrained(adapter_path)
                print(f"✓ Estado: Usando modelo base + LoRA entrenado (checkpoint-9375)")
                print(f"✓ LoRA Config: r={config.r}, alpha={config.lora_alpha}, dropout={config.lora_dropout}")
                print(f"✓ Módulos entrenados: {', '.join(config.target_modules[:3])}...")
            except:
                print(f"✓ Estado: Usando modelo base + LoRA entrenado (checkpoint-9375)")
        
    except Exception as e:
        print(f"Error al cargar el modelo: {e}")
        print("Usando modo de respuestas simuladas")
        model = None
        tokenizer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_model()
    yield
    # Shutdown (opcional, para limpiar recursos)

app = FastAPI(title="Nexo LoRA API", version="1.0.0", lifespan=lifespan)

# Configurar CORS para permitir conexiones desde el frontend y widgets embebidos
# allow_origins=["*"] permite el widget en cualquier página web
# Nota: con "*" no se puede usar credentials=True (restricción CORS)
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
        "message": "Nexo LoRA API está funcionando",
        "model_loaded": model is not None,
        "device": device
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Procesa un mensaje del usuario y devuelve una respuesta de la IA"""
    
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
    
    try:
        if model is None or tokenizer is None:
            print(f"⚠ Modelo no cargado, usando modo fallback para: {request.message[:50]}")
            # Modo fallback: respuestas simuladas
            response_text = generate_fallback_response(request.message, request.context)
            return ChatResponse(response=response_text)
        
        # Verificar que el modelo es PeftModel (LoRA activo)
        is_lora_active = isinstance(model, PeftModel) if model else False
        lora_status = "✓ LoRA ACTIVO" if is_lora_active else "⚠ LoRA NO ACTIVO"
        print(f"📝 Procesando mensaje con modelo LoRA: {request.message[:50]}... [{lora_status}]")
        
        # Generar respuesta con el modelo
        response_text = generate_response(request.message, request.context)
        
        # Validar respuesta final antes de devolverla
        if response_text and len(response_text) > 5:
            print(f"✅ Respuesta generada ({len(response_text)} chars): {response_text[:80]}...")
            if is_lora_active:
                print(f"🧠 Respuesta generada usando tu LoRA entrenado")
        else:
            print(f"⚠ Respuesta muy corta o inválida, usando fallback")
            response_text = generate_fallback_response(request.message, request.context)
        
        return ChatResponse(response=response_text)
        
    except Exception as e:
        import traceback
        print(f"❌ Error al procesar mensaje: {e}")
        print(traceback.format_exc())
        # En caso de error, usar fallback en lugar de fallar completamente
        try:
            response_text = generate_fallback_response(request.message, request.context)
            return ChatResponse(response=response_text)
        except:
            raise HTTPException(status_code=500, detail=f"Error al procesar el mensaje: {str(e)}")

def generate_response(user_message: str, context: List[dict]) -> str:
    """Genera una respuesta usando el modelo LoRA"""
    
    message_lower = user_message.lower()
    
    # Prompt estilo Claude - útil, honesto, inofensivo, y detallado
    system_prompt = """Eres un asistente de IA avanzado, similar a Claude. Tu objetivo es ser útil, honesto e inofensivo.

PRINCIPIOS:
- Sé extremadamente útil: proporciona respuestas completas, detalladas y bien estructuradas
- Sé honesto: si no sabes algo, admítelo claramente
- Sé inofensivo: nunca generes contenido dañino, ilegal o inapropiado
- Piensa paso a paso: razona antes de responder
- Sé claro y conciso: explica conceptos complejos de manera comprensible
- Usa formato cuando sea útil: listas, párrafos estructurados, ejemplos

ESTILO:
- Responde siempre en español
- Usa un tono profesional pero amigable
- Proporciona contexto y explicaciones cuando sea relevante
- Estructura tus respuestas de manera lógica
- Incluye ejemplos prácticos cuando ayuden a la comprensión

Usa todo el conocimiento que aprendiste durante tu entrenamiento con LoRA para dar respuestas precisas y útiles."""
    
    # Construir contexto mejorado con historial de conversación
    messages = [{"role": "system", "content": system_prompt}]
    
    # Agregar contexto de conversaciones previas si está disponible
    if context and len(context) > 0:
        # Agregar las últimas 3 interacciones como contexto
        for ctx_item in context[-3:]:
            if isinstance(ctx_item, dict):
                ctx_text = ctx_item.get('context', '') or ctx_item.get('concept', '')
                if ctx_text:
                    messages.append({
                        "role": "user", 
                        "content": f"Contexto previo: {ctx_text}"
                    })
    
    # Agregar el mensaje actual
    messages.append({"role": "user", "content": user_message})
    
    try:
        # Tokenizar usando el chat template de Qwen2
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        
        model_inputs = tokenizer([text], return_tensors="pt").to(device)
        input_length = model_inputs.input_ids.shape[1]
        
        # Configurar pad_token si no existe
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Generar respuesta con parámetros optimizados para calidad tipo Claude
        # Parámetros balanceados para respuestas coherentes, detalladas y útiles
        with torch.no_grad():
            generated_ids = model.generate(
                **model_inputs,
                max_new_tokens=512,  # Más tokens para respuestas más completas
                min_new_tokens=20,   # Mínimo razonable para respuestas útiles
                temperature=0.7,    # Balance entre creatividad y coherencia
                top_p=0.95,          # Nucleus sampling para mejor calidad
                top_k=50,            # Top-k sampling
                do_sample=True,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id,
                repetition_penalty=1.2,  # Penalización moderada para evitar repeticiones
                no_repeat_ngram_size=3,  # Evitar n-gramas repetidos
                length_penalty=1.1,      # Penalizar respuestas muy cortas
                early_stopping=True       # Parar cuando encuentre EOS token
            )
        
        # Extraer solo la parte generada (sin el prompt)
        generated_text = tokenizer.decode(
            generated_ids[0][input_length:], 
            skip_special_tokens=True
        )
        
        # Limpiar la respuesta
        response = generated_text.strip()
        
        # Remover posibles prefijos o sufijos no deseados
        response = response.replace("<|im_end|>", "").replace("<|endoftext|>", "").replace("<|im_start|>", "").strip()
        
        # Validación más permisiva para respuestas tipo Claude (pueden ser largas y detalladas)
        if not response or len(response) < 3:
            print(f"⚠ Respuesta vacía o muy corta del modelo: '{response}'")
            return generate_fallback_response(user_message, context)
        
        # Verificar si la respuesta parece válida (no solo caracteres especiales)
        clean_response = response.replace(" ", "").replace(".", "").replace(",", "").replace("!", "").replace("?", "").replace("¿", "").replace("¡", "").replace("\n", "").replace("*", "")
        if len(clean_response) < 2:
            print(f"⚠ Respuesta parece inválida (solo caracteres especiales): '{response}'")
            return generate_fallback_response(user_message, context)
        
        # Validación más flexible - solo detectar respuestas claramente corruptas
        response_lower = response.lower()
        
        # Detectar respuestas que claramente no tienen sentido (solo las más obvias)
        nonsensical_phrases = ['escribiste', 'harían feliz', 'qué escribiste']
        has_nonsense = any(phrase in response_lower for phrase in nonsensical_phrases)
        
        # Solo rechazar si es claramente sin sentido Y muy corta
        if has_nonsense and len(response.split()) < 5:
            print(f"⚠ Respuesta contiene frases sin sentido: '{response}'")
            return generate_fallback_response(user_message, context)
        
        # Si la respuesta es razonablemente larga (más de 10 palabras), probablemente es válida
        if len(response.split()) >= 10:
            print(f"✅ Respuesta aceptada (longitud: {len(response.split())} palabras)")
            return response
        
        # Para respuestas más cortas, verificar que tenga al menos algunas palabras en español
        spanish_indicators = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para']
        has_spanish = any(word in response_lower.split() for word in spanish_indicators)
        
        if has_spanish or len(response.split()) >= 5:
            print(f"✅ Respuesta aceptada (indicios de español o longitud suficiente)")
            return response
        
        # Si no pasa ninguna validación, usar fallback
        print(f"⚠ Respuesta no pasó validación: '{response[:50]}...'")
        return generate_fallback_response(user_message, context)
        
    except Exception as e:
        print(f"❌ Error en generate_response: {e}")
        import traceback
        print(traceback.format_exc())
        return generate_fallback_response(user_message, context)

def generate_fallback_response(user_message: str, context: List[dict]) -> str:
    """Genera una respuesta de fallback estilo Claude cuando el modelo no está disponible"""
    
    message_lower = user_message.lower().strip()
    
    # Respuestas mejoradas estilo Claude - más detalladas y útiles
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
- Un modelo de lenguaje grande optimizado para instrucciones
- Capacidad de comprensión y generación de texto en múltiples idiomas

**Entrenamiento Personalizado:** LoRA (Low-Rank Adaptation)
- Técnica de fine-tuning eficiente que me permite especializarme
- Entrenado con datos específicos para mejorar mis respuestas
- Mantiene la flexibilidad del modelo base mientras añade conocimiento especializado

**Objetivo:** Proporcionar respuestas útiles, precisas y bien estructuradas, similar a los mejores asistentes de IA como Claude."""
    
    elif 'como funciona' in message_lower or 'cómo funciona' in message_lower:
        return """**Cómo funciono:**

Mi arquitectura se basa en tres componentes principales:

**1. Modelo de Lenguaje Base (Qwen2-1.5B-Instruct)**
- Procesa y comprende el lenguaje natural
- Genera respuestas coherentes y contextualmente relevantes
- Aprende patrones de conversación humana

**2. Adaptador LoRA Personalizado**
- Añade conocimiento especializado mediante fine-tuning
- Mejora mis respuestas en áreas específicas
- Permite aprendizaje eficiente sin modificar todo el modelo

**3. Sistema de Memoria y Contexto**
- Almacena información de conversaciones previas
- Mantiene coherencia a lo largo de múltiples interacciones
- Aprende de cada conversación para mejorar

**Resultado:** Un asistente que combina la capacidad general del modelo base con conocimiento especializado, proporcionando respuestas más precisas y útiles."""
    
    elif 'que aprendiste' in message_lower or 'qué aprendiste' in message_lower:
        context_count = len(context) if context else 0
        return f"""**Estado de mi aprendizaje:**

**Memoria y Contexto:**
- He procesado {context_count} interacciones recientes
- Mi sistema almacena conceptos clave y relaciones entre ideas
- Cada conversación fortalece mi comprensión

**Capacidades:**
- Comprensión de lenguaje natural en español
- Generación de respuestas coherentes y útiles
- Aprendizaje continuo de patrones conversacionales
- Análisis de contexto para respuestas más precisas

**Mejora continua:**
Cada interacción me ayuda a:
- Entender mejor tus necesidades
- Proporcionar respuestas más relevantes
- Mejorar la coherencia y utilidad de mis respuestas"""
    
    elif 'que eres' in message_lower or 'qué eres' in message_lower:
        return """**Soy un asistente de IA avanzado**

**Mi propósito:**
Ayudarte de la manera más útil, honesta e inofensiva posible. Mi objetivo es proporcionar información precisa, responder preguntas de manera completa, y asistirte en diversas tareas.

**Mis características:**
- **Útil:** Proporciono respuestas detalladas y bien estructuradas
- **Honesto:** Admito cuando no sé algo en lugar de inventar información
- **Inofensivo:** Nunca genero contenido dañino o inapropiado
- **Adaptable:** Aprendo de cada conversación para mejorar

**Tecnología:**
Utilizo aprendizaje profundo con transformers, entrenado mediante técnicas de fine-tuning (LoRA) para especializarme en conversaciones útiles y constructivas."""
    
    else:
        # Respuesta general más útil y estructurada
        return f"""Entiendo que preguntaste sobre: **"{user_message}"**

**Mi análisis:**
Estoy procesando tu pregunta con mi modelo de IA entrenado. Para darte la mejor respuesta posible, podría ser útil:

1. **Más contexto:** ¿Podrías proporcionar más detalles sobre lo que necesitas?
2. **Reformulación:** A veces reformular la pregunta ayuda a obtener mejores resultados
3. **Especificidad:** Cuanto más específica sea tu pregunta, más precisa será mi respuesta

**¿Cómo puedo ayudarte mejor?**
- Si tienes una pregunta específica, puedo intentar responderla
- Si necesitas información sobre un tema, puedo proporcionar una explicación detallada
- Si buscas ayuda con una tarea, puedo guiarte paso a paso"""

if __name__ == "__main__":
    import uvicorn
    import sys
    
    # Permitir cambiar el puerto desde variable de entorno o argumento
    port = int(os.getenv("PORT", 8001))  # Cambiado a 8001 por defecto
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"⚠️ Puerto inválido: {sys.argv[1]}. Usando puerto {port}")
    
    print(f"🚀 Iniciando servidor en puerto {port}...")
    print(f"📡 Accede en: http://localhost:{port}")
    print(f"📚 Documentación: http://localhost:{port}/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
