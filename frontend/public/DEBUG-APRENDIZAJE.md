# DEBUG: Por qué no se guardan conceptos de internet

## Pasos para diagnosticar:

1. **Abre la consola del navegador** (F12 → Console)

2. **Agrega una URL** y presiona "Leer Páginas Web"

3. **Busca estos mensajes en la consola:**

### ✅ Mensajes que DEBEN aparecer:
- `🚀 INICIANDO readAndLearnFromWeb para URL: ...`
- `✅ CONTENIDO VÁLIDO PARA PROCESAR: ... caracteres`
- `🔍 Conceptos FINALES: ...`
- `✅ Conceptos preparados para agregar: ...`
- `💾 [readAndLearnFromWeb] DENTRO de setWebKnowledge:`
- `💾 Guardado explícito después de agregar conceptos web`

### ❌ Si ves estos errores:
- `❌ ERROR: No hay contenido disponible para procesar`
  → El problema es que no se puede obtener el contenido de la página
  
- `❌ NO SE PUDIERON EXTRAER CONCEPTOS DEL CONTENIDO`
  → El problema es que no se extrajeron conceptos del contenido
  
- `❌ ERROR CRÍTICO: No se agregaron conceptos aunque había conceptos nuevos!`
  → El problema es que los conceptos no se están agregando al estado

## Soluciones:

### Si no se obtiene contenido:
- Verifica que tengas una API key configurada (Groq, OpenAI, etc.)
- Verifica que la URL sea accesible
- Prueba con una URL de Wikipedia: `https://es.wikipedia.org/wiki/Inteligencia_artificial`

### Si no se extraen conceptos:
- Verifica que el contenido tenga al menos 50 caracteres
- Revisa los logs para ver cuántos conceptos se extrajeron

### Si no se guardan conceptos:
- Revisa si hay errores de JavaScript en la consola
- Verifica que `localStorage` no esté lleno
- Revisa los logs de `setWebKnowledge`

## Comando de prueba rápido:

Abre la consola y ejecuta:
```javascript
// Verificar estado actual
const data = JSON.parse(localStorage.getItem('ai-brain-data') || '{}');
console.log('Web Knowledge:', data.webKnowledge?.length || 0);
console.log('Knowledge:', data.knowledge?.length || 0);
```



