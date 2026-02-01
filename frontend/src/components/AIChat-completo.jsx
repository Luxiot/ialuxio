import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, Database, Globe, Play, Pause, ExternalLink, TrendingUp, Settings, Download, X, Zap, Plus, Image as ImageIcon, Palette, Copy, Check, Code, FileDown } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [knowledge, setKnowledge] = useState([]);
  const [webKnowledge, setWebKnowledge] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [urlsToRead, setUrlsToRead] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [readUrls, setReadUrls] = useState([]);
  const [learningRate, setLearningRate] = useState(0);
  const [totalPagesRead, setTotalPagesRead] = useState(0);
  const [personality, setPersonality] = useState({
    name: 'Luxio',
    creator: 'Lucio Tapia'
  });
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showCode, setShowCode] = useState({});
  const messagesEndRef = useRef(null);
  const readingActive = useRef(false);

  useEffect(() => {
    loadFromStorage();
    return () => {
      readingActive.current = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadFromStorage = async () => {
    try {
      // Usar localStorage en lugar de window.storage
      const savedData = localStorage.getItem('ai-web-reader');
      if (savedData) {
        const data = JSON.parse(savedData);
        setWebKnowledge(data.webKnowledge || []);
        setKnowledge(data.knowledge || []);
        setReadUrls(data.readUrls || []);
        setGeneratedImages(data.generatedImages || []);
        setTotalPagesRead(data.totalPagesRead || 0);
        setLearningRate(data.learningRate || 0);
        setPersonality(data.personality || personality);
        
        setMessages([{
          role: 'assistant',
          content: `¡Hola! Soy ${data.personality?.name || 'Luxio'} 🧠🎨\n\n✨ **Artista Digital IA**\nCreo imágenes SVG desde cero sin APIs de pago\n\n📊 Estado:\n• ${data.totalPagesRead || 0} páginas leídas\n• ${data.generatedImages?.length || 0} imágenes generadas\n• ${data.webKnowledge?.length || 0} conceptos aprendidos\n\n🎨 Pídeme: "dibuja un gato", "crea un paisaje", "diseña un logo"`
        }]);
      } else {
        setMessages([{
          role: 'assistant',
          content: `¡Hola! Soy ${personality.name}, creado por ${personality.creator}. 🧠🎨\n\n🎨 **Artista Digital IA**\nGenero imágenes SVG vectoriales desde cero. 100% GRATIS - sin APIs de pago.\n\n✨ **Mis Capacidades:**\n• Dibujo personajes, animales, objetos\n• Creo paisajes y escenas\n• Diseño logos y formas abstractas\n• Todo generado localmente\n\n💬 **Prueba pedirme:**\n"Dibuja un gato"\n"Crea un árbol"\n"Diseña un logo de tecnología"\n"Genera un paisaje de montañas"`
        }]);
      }
    } catch (error) {
      setMessages([{
        role: 'assistant',
        content: `¡Hola! Soy ${personality.name}. ¡Pídeme que dibuje algo! 🎨`
      }]);
    }
  };

  const saveToStorage = async () => {
    try {
      const data = {
        webKnowledge,
        knowledge,
        readUrls,
        generatedImages: generatedImages.slice(-50),
        totalPagesRead,
        learningRate,
        personality,
        timestamp: Date.now()
      };
      // Usar localStorage en lugar de window.storage
      localStorage.setItem('ai-web-reader', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando:', error);
    }
  };

  useEffect(() => {
    if (webKnowledge.length > 0 || generatedImages.length > 0) {
      saveToStorage();
    }
  }, [webKnowledge, knowledge, readUrls, totalPagesRead, learningRate, generatedImages]);

  const generateSVGImage = async (prompt) => {
    setIsGeneratingImage(true);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🎨 Diseñando: "${prompt}"\n\nCreando ilustración SVG...`,
      generating: true
    }]);
    
    // Simular un pequeño delay para que se vea el proceso
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generar SVG directamente sin API
    const finalSVG = createDefaultSVG(prompt);

    const imageData = {
      prompt,
      svg: finalSVG,
      timestamp: Date.now()
    };
    
    setGeneratedImages(prev => [...prev, imageData]);
    
    setMessages(prev => {
      const filtered = prev.filter(m => !m.generating);
      return [...filtered, {
        role: 'assistant',
        content: `✅ ¡Ilustración creada!\n\n🎨 "${prompt}"\n\nHe diseñado esta imagen vectorial desde cero. Es un SVG completamente original, generado localmente sin APIs.`,
        svg: finalSVG,
        prompt: prompt
      }];
    });
    
    setIsGeneratingImage(false);
  };

  const createDefaultSVG = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const mainColor = colors[Math.floor(Math.random() * colors.length)];
    const secondaryColor = colors[Math.floor(Math.random() * colors.length)];

    // Detectar qué tipo de imagen crear
    if (lowerPrompt.includes('gato') || lowerPrompt.includes('cat')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="catGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${mainColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#1a1a2e"/>
        <ellipse cx="400" cy="350" rx="180" ry="200" fill="url(#catGrad)"/>
        <ellipse cx="330" cy="250" rx="50" ry="80" fill="url(#catGrad)"/>
        <ellipse cx="470" cy="250" rx="50" ry="80" fill="url(#catGrad)"/>
        <circle cx="360" cy="330" r="25" fill="#2d2d44"/>
        <circle cx="440" cy="330" r="25" fill="#2d2d44"/>
        <circle cx="365" cy="330" r="12" fill="white"/>
        <circle cx="445" cy="330" r="12" fill="white"/>
        <path d="M 400 360 Q 400 380 420 370 Q 400 380 380 370 Q 400 380 400 360" fill="#FF69B4"/>
        <path d="M 280 340 L 330 350 L 320 360" stroke="${mainColor}" stroke-width="3" fill="none"/>
        <path d="M 520 340 L 470 350 L 480 360" stroke="${mainColor}" stroke-width="3" fill="none"/>
      </svg>`;
    } else if (lowerPrompt.includes('árbol') || lowerPrompt.includes('arbol') || lowerPrompt.includes('tree')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="leafGrad">
            <stop offset="0%" style="stop-color:#90EE90;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#skyGrad)"/>
        <ellipse cx="400" cy="550" rx="300" ry="50" fill="#8B7355" opacity="0.5"/>
        <rect x="370" y="350" width="60" height="200" fill="#8B4513" rx="10"/>
        <circle cx="400" cy="280" r="120" fill="url(#leafGrad)"/>
        <circle cx="340" cy="320" r="90" fill="url(#leafGrad)"/>
        <circle cx="460" cy="320" r="90" fill="url(#leafGrad)"/>
        <circle cx="400" cy="220" r="80" fill="url(#leafGrad)"/>
        <circle cx="320" cy="250" r="70" fill="url(#leafGrad)" opacity="0.8"/>
        <circle cx="480" cy="250" r="70" fill="url(#leafGrad)" opacity="0.8"/>
        <circle cx="720" cy="80" r="40" fill="#FFD700" opacity="0.9"/>
      </svg>`;
    } else if (lowerPrompt.includes('montaña') || lowerPrompt.includes('montana') || lowerPrompt.includes('mountain')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#skyGrad2)"/>
        <polygon points="100,550 300,200 500,550" fill="#4a5568"/>
        <polygon points="250,550 450,250 650,550" fill="#2d3748"/>
        <polygon points="400,550 600,180 800,550" fill="#1a202c"/>
        <polygon points="450,250 600,180 650,250" fill="#e2e8f0"/>
        <polygon points="300,200 350,160 400,200" fill="#f7fafc"/>
        <rect y="550" width="800" height="50" fill="#065f46"/>
        <circle cx="700" cy="100" r="50" fill="#fbbf24" opacity="0.8"/>
      </svg>`;
    } else if (lowerPrompt.includes('casa') || lowerPrompt.includes('house')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#87CEEB"/>
        <ellipse cx="400" cy="580" rx="350" ry="30" fill="#90EE90"/>
        <rect x="300" y="300" width="200" height="250" fill="#D2691E"/>
        <polygon points="400,200 250,300 550,300" fill="#8B4513"/>
        <rect x="340" y="380" width="50" height="70" fill="#654321"/>
        <rect x="420" y="340" width="60" height="60" fill="#ADD8E6"/>
        <rect x="435" y="355" width="30" height="30" fill="#87CEEB"/>
        <circle cx="700" cy="100" r="40" fill="#FFD700"/>
      </svg>`;
    } else if (lowerPrompt.includes('logo') || lowerPrompt.includes('diseño') || lowerPrompt.includes('design')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${mainColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#0f0f1e"/>
        <circle cx="400" cy="300" r="150" fill="none" stroke="url(#logoGrad)" stroke-width="8"/>
        <polygon points="400,180 460,280 500,220 440,320 540,320 420,400 460,320 360,320 420,220" fill="url(#logoGrad)"/>
        <circle cx="400" cy="300" r="120" fill="none" stroke="${mainColor}" stroke-width="3" opacity="0.5"/>
        <circle cx="400" cy="300" r="180" fill="none" stroke="${secondaryColor}" stroke-width="2" opacity="0.3"/>
      </svg>`;
    } else if (lowerPrompt.includes('robot')) {
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#1a1a2e"/>
        <rect x="300" y="200" width="200" height="180" fill="${mainColor}" rx="20"/>
        <circle cx="360" cy="260" r="25" fill="#00ff00"/>
        <circle cx="440" cy="260" r="25" fill="#00ff00"/>
        <rect x="350" y="320" width="100" height="10" fill="#333" rx="5"/>
        <rect x="280" y="250" width="40" height="80" fill="${secondaryColor}" rx="10"/>
        <rect x="480" y="250" width="40" height="80" fill="${secondaryColor}" rx="10"/>
        <rect x="330" y="380" width="60" height="100" fill="${mainColor}" rx="10"/>
        <rect x="410" y="380" width="60" height="100" fill="${mainColor}" rx="10"/>
        <circle cx="360" cy="150" r="15" fill="#ff0000"/>
        <rect x="360" y="150" width="3" height="50" fill="#ff0000"/>
      </svg>`;
    } else {
      // Diseño abstracto por defecto
      return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[2]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[3]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#0a0a1e"/>
        <circle cx="200" cy="200" r="100" fill="url(#grad1)" opacity="0.7"/>
        <circle cx="600" cy="400" r="120" fill="url(#grad2)" opacity="0.7"/>
        <polygon points="400,100 500,300 300,300" fill="${colors[4]}" opacity="0.6"/>
        <rect x="100" y="400" width="200" height="150" fill="${colors[5]}" opacity="0.5" rx="20"/>
        <circle cx="400" cy="300" r="80" fill="none" stroke="${colors[6]}" stroke-width="5"/>
        <text x="400" y="320" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${prompt.substring(0, 20)}</text>
      </svg>`;
    }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setUrlsToRead(prev => [...prev, url]);
    setUrlInput('');
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✓ URL agregada: ${url}`
    }]);
  };

  const removeUrl = (urlToRemove) => {
    setUrlsToRead(prev => prev.filter(url => url !== urlToRemove));
  };

  const readPageContent = async (url) => {
    setCurrentUrl(url);
    try {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📖 Intentando leer: ${url}\n\n⚠️ Nota: La lectura de páginas web requiere una API gratuita (Groq, OpenAI, Gemini o Hugging Face). Por ahora, esta función está deshabilitada para evitar costos.`,
        reading: true
      }]);
      
      // Función deshabilitada - requiere API gratuita
      // Puedes usar una API gratuita como Groq si la configuras
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => {
        const filtered = prev.filter(m => !m.reading);
        return [...filtered, {
          role: 'assistant',
          content: `ℹ️ La lectura de páginas web está deshabilitada para evitar costos.\n\n💡 Si quieres habilitarla, configura una API gratuita como Groq (100% gratis) en el archivo .env:\n\nREACT_APP_GROQ_API_KEY=tu_key_aqui`
        }];
      });
    } catch (error) {
      setMessages(prev => prev.filter(m => !m.reading));
    }
  };

  const startReading = async () => {
    if (isReading || urlsToRead.length === 0) return;
    setIsReading(true);
    readingActive.current = true;
    const urlsToProcess = [...urlsToRead];
    setUrlsToRead([]);
    for (let i = 0; i < urlsToProcess.length && readingActive.current; i++) {
      await readPageContent(urlsToProcess[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    stopReading();
  };

  const stopReading = () => {
    setIsReading(false);
    readingActive.current = false;
    setCurrentUrl('');
  };

  const callClaudeAPI = async (userMessage) => {
    setIsThinking(true);
    const imageKeywords = ['dibuja', 'genera', 'crea', 'diseña', 'ilustra', 'pinta', 'haz'];
    const lowerMessage = userMessage.toLowerCase();
    const shouldGenerateImage = imageKeywords.some(keyword => lowerMessage.includes(keyword));

    if (shouldGenerateImage) {
      setIsThinking(false);
      const prompt = userMessage.replace(/dibuja|genera|crea|diseña|ilustra|pinta|haz|hazme|una|un|imagen|de|del/gi, '').trim();
      await generateSVGImage(prompt || userMessage);
      return;
    }

    // Respuesta simple sin API - puedes mejorarla con lógica local
    setIsThinking(false);
    
    const responses = [
      `¡Hola! Soy ${personality.name}, creado por ${personality.creator}. 🎨\n\nHe generado ${generatedImages.length} ilustraciones SVG y aprendido ${webKnowledge.length} conceptos.\n\n¿Qué quieres que dibuje?`,
      `Soy un artista digital que crea imágenes SVG desde cero. 🖼️\n\nPuedo dibujar:\n• Animales (gatos, perros, etc.)\n• Paisajes (montañas, árboles, etc.)\n• Objetos (casas, logos, etc.)\n• Diseños abstractos\n\nSolo pídeme: "dibuja un [lo que quieras]"`,
      `¡Perfecto! Soy ${personality.name} y me encanta crear arte digital. 🎨\n\nHe creado ${generatedImages.length} imágenes SVG originales. Todas son generadas localmente, sin usar APIs de pago.\n\n¿Qué te gustaría que dibuje hoy?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setConversationHistory(prev => [
      ...prev.slice(-10),
      { role: 'user', content: userMessage },
      { role: 'assistant', content: randomResponse }
    ]);
    
    return randomResponse;
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '🧠 Procesando...', 
      thinking: true 
    }]);
    const response = await callClaudeAPI(currentInput);
    if (response) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.thinking);
        return [...filtered, { role: 'assistant', content: response }];
      });
    } else {
      setMessages(prev => prev.filter(m => !m.thinking));
    }
  };

  const clearMemory = async () => {
    setKnowledge([]);
    setWebKnowledge([]);
    setReadUrls([]);
    setGeneratedImages([]);
    setTotalPagesRead(0);
    setLearningRate(0);
    await saveToStorage();
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🧹 Memoria limpiada.'
    }]);
  };

  const exportBrain = () => {
    const brainData = {
      personality,
      webKnowledge,
      generatedImages,
      totalPagesRead,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(brainData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personality.name}_art_${Date.now()}.json`;
    link.click();
  };

  const copySVGToClipboard = async (svg, index) => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Error copiando:', error);
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = svg;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Error en fallback:', err);
        alert('No se pudo copiar. Por favor, selecciona el código manualmente.');
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadSVG = (svg, prompt, index) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `imagen-${prompt?.substring(0, 20).replace(/[^a-z0-9]/gi, '-') || 'svg'}-${index}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleShowCode = (index) => {
    setShowCode(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-r border-purple-500 border-opacity-30 p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="text-purple-400" size={32} />
            <h2 className="text-2xl font-bold text-white">{personality.name}</h2>
          </div>
          <p className="text-gray-400 text-sm">Artista Digital IA</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="text-white" size={20} />
            <h3 className="text-white font-semibold">Ilustraciones SVG</h3>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-2">
            <div className="text-white text-3xl font-bold">{generatedImages.length}</div>
            <div className="text-xs text-gray-200">Imágenes creadas</div>
          </div>
          <div className="mt-2 text-xs text-gray-200">
            🎨 Sin APIs - Arte original
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="text-white" size={18} />
            <h3 className="text-white font-semibold text-sm">Lector Web</h3>
          </div>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              placeholder="Agregar URL..."
              className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={addUrl}
              className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2 text-sm transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {urlsToRead.length > 0 && (
            <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
              {urlsToRead.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-black bg-opacity-30 rounded p-2 text-xs">
                  <span className="text-gray-300 flex-1 truncate">{url}</span>
                  <button
                    onClick={() => removeUrl(url)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={startReading}
              disabled={isReading || urlsToRead.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isReading ? <Pause size={14} /> : <Play size={14} />}
              {isReading ? 'Leyendo...' : 'Leer'}
            </button>
            {isReading && (
              <button
                onClick={stopReading}
                className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 text-sm transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {currentUrl && (
            <div className="mt-2 text-xs text-gray-300">
              📖 {currentUrl}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-white" size={18} />
            <h3 className="text-white font-semibold text-sm">Estadísticas</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-200">
              <span>Páginas leídas:</span>
              <span className="font-bold">{totalPagesRead}</span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Conceptos:</span>
              <span className="font-bold">{webKnowledge.length}</span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Aprendizaje:</span>
              <span className="font-bold">{learningRate}%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearMemory}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 text-sm transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={exportBrain}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-2 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Exportar
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black bg-opacity-40 backdrop-blur-lg border-b border-purple-500 border-opacity-30 p-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {personality.name}
          </h1>
          <p className="text-gray-400 text-sm">
            Por {personality.creator} • {webKnowledge.length + knowledge.length} conceptos aprendidos
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-black bg-opacity-40 text-gray-100 border border-purple-500 border-opacity-30'
              }`}>
                {msg.thinking && (
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">🧠</div>
                    <span className="animate-pulse">{msg.content}</span>
                  </div>
                )}
                {!msg.thinking && (
                  <>
                    <div className="whitespace-pre-line">{msg.content}</div>
                    {msg.svg && (
                      <div className="mt-3 border border-purple-500 rounded-lg p-3 bg-black bg-opacity-30">
                        {/* Botones de acción */}
                        <div className="mb-3 flex gap-2 flex-wrap">
                          <button
                            onClick={() => copySVGToClipboard(msg.svg, i)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              copiedIndex === i
                                ? 'bg-green-600 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                            title="Copiar código SVG"
                          >
                            {copiedIndex === i ? (
                              <>
                                <Check size={18} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={18} />
                                <span>Copiar código</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => downloadSVG(msg.svg, msg.prompt, i)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                            title="Descargar SVG"
                          >
                            <FileDown size={18} />
                            <span>Descargar</span>
                          </button>
                          
                          <button
                            onClick={() => toggleShowCode(i)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all"
                            title="Ver código SVG"
                          >
                            <Code size={18} />
                            <span>{showCode[i] ? 'Ocultar código' : 'Ver código'}</span>
                          </button>
                        </div>

                        {/* Vista previa de la imagen */}
                        <div className="mb-3 bg-white bg-opacity-5 rounded-lg p-3 flex items-center justify-center">
                          <div 
                            className="max-w-full"
                            style={{ maxHeight: '400px', overflow: 'auto' }}
                            dangerouslySetInnerHTML={{ __html: msg.svg }} 
                          />
                        </div>

                        {/* Código SVG (mostrar/ocultar) */}
                        {showCode[i] && (
                          <div className="mt-3">
                            <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-xs font-mono">Código SVG</span>
                                <button
                                  onClick={() => copySVGToClipboard(msg.svg, i)}
                                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                >
                                  <Copy size={12} />
                                  Copiar todo
                                </button>
                              </div>
                              <pre className="text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
                                <code>{msg.svg}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border-t border-purple-500 border-opacity-30 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pídeme que dibuje algo... 🎨"
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isThinking || isGeneratingImage}
            />
            <button
              onClick={handleSend}
              disabled={isThinking || isGeneratingImage || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-6 py-3 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

