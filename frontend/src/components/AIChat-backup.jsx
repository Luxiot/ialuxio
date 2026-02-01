import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, Cpu, Database, Zap, TrendingUp, Settings, BookOpen, Upload, Download, X, Lightbulb, AlertCircle, Globe, Play, Pause, RefreshCw, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
// APIs gratuitas - puedes usar cualquiera de estas
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY || '';
const STABILITY_API_KEY = process.env.REACT_APP_STABILITY_API_KEY || '';
// Prioridad: Groq (gratis y rápido) > OpenAI (créditos gratis) > Gemini (gratis) > HuggingFace (gratis)
const FREE_API_KEY = GROQ_API_KEY || OPENAI_API_KEY || GEMINI_API_KEY || HUGGINGFACE_API_KEY;
const FREE_API_TYPE = GROQ_API_KEY ? 'groq' : OPENAI_API_KEY ? 'openai' : GEMINI_API_KEY ? 'gemini' : HUGGINGFACE_API_KEY ? 'huggingface' : null;

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [knowledge, setKnowledge] = useState([]);
  const [commonSenseRules, setCommonSenseRules] = useState([]);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [learningRate, setLearningRate] = useState(0);
  const [memorySize, setMemorySize] = useState(0);
  const [reasoningLevel, setReasoningLevel] = useState(0);
  const [personality, setPersonality] = useState({
    name: 'Luxio',
    creator: 'Lucio Tapia',
    version: '5.0',
    specialty: 'IA auto-entrenada con internet'
  });
  const [trainingMode, setTrainingMode] = useState(false);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [trainingText, setTrainingText] = useState('');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [autoTrainingActive, setAutoTrainingActive] = useState(false);
  const [trainingTopics, setTrainingTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [webKnowledge, setWebKnowledge] = useState([]);
  const [webReadingActive, setWebReadingActive] = useState(false);
  const [webURLs, setWebURLs] = useState([]);
  const [currentURL, setCurrentURL] = useState('');
  const [webReadingProgress, setWebReadingProgress] = useState(0);
  const [exploredUrls, setExploredUrls] = useState([]);
  const [totalPagesExplored, setTotalPagesExplored] = useState(0);
  const [autoFollowLinks, setAutoFollowLinks] = useState(false);
  const [selfControl, setSelfControl] = useState({
    enabled: true,
    autoLearning: true,
    autoDecision: true,
    selfMonitoring: true,
    learningRate: 0,
    decisionConfidence: 50,
    selfAwareness: 0
  });
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const trainingIntervalRef = useRef(null);
  const urlInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dataLoadedRef = useRef(false); // Bandera para saber si los datos ya se cargaron

  const defaultTopics = [
    'inteligencia artificial machine learning deep learning',
    'ciencia descubrimientos científicos 2024',
    'historia mundial eventos importantes',
    'matemáticas álgebra geometría cálculo',
    'física mecánica cuántica relatividad',
    'biología genética evolución células',
    'química orgánica inorgánica elementos',
    'geografía países capitales continentes',
    'astronomía planetas estrellas galaxias',
    'filosofía ética lógica metafísica',
    'psicología comportamiento humano mente',
    'economía mercados finanzas inversión',
    'medicina enfermedades tratamientos salud',
    'literatura autores clásicos obras',
    'arte pintura escultura movimientos',
    'música géneros instrumentos compositores',
    'deportes fútbol básquet tenis records',
    'programación lenguajes desarrollo software',
    'tecnología computadoras internet redes',
    'educación pedagogía enseñanza aprendizaje',
    'cultura tradiciones costumbres sociedad',
    'política gobierno leyes democracia',
    'medio ambiente cambio climático sostenibilidad',
    'negocios empresas emprendimiento marketing',
    'viajes turismo destinos culturas',
    'cocina gastronomía recetas ingredientes',
    'salud bienestar nutrición ejercicio',
    'tecnología móvil smartphones aplicaciones',
    'ciencia datos big data análisis',
    'innovación invenciones patentes futuro'
  ];

  const initialCommonSense = [
    { rule: 'El fuego quema', category: 'física', confidence: 100 },
    { rule: 'Los humanos necesitan dormir', category: 'biología', confidence: 100 },
    { rule: 'El agua moja', category: 'física', confidence: 100 },
    { rule: 'Las cosas caen por gravedad', category: 'física', confidence: 100 },
    { rule: 'Los animales necesitan comer', category: 'biología', confidence: 100 },
    { rule: 'El pasado no se puede cambiar', category: 'lógica', confidence: 100 }
  ];

  useEffect(() => {
    // Cargar datos al iniciar INMEDIATAMENTE
    loadFromStorage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadFromStorage = () => {
    try {
      // Intentar cargar desde diferentes claves posibles
      let savedData = localStorage.getItem('ai-brain-data');
      
      // Si no encuentra, intentar datos de emergencia
      if (!savedData) {
        savedData = localStorage.getItem('ai-brain-data-emergency');
        if (savedData) {
          console.log('⚠️ Cargando datos de emergencia');
        }
      }
      
      // Si no encuentra, intentar otras claves posibles
      if (!savedData) {
        savedData = localStorage.getItem('ai-web-reader');
      }
      
      // Si no encuentra, buscar en backups
      if (!savedData) {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('ai-brain-backup-')) {
            backupKeys.push(key);
          }
        }
        if (backupKeys.length > 0) {
          // Usar el backup más reciente
          backupKeys.sort().reverse();
          savedData = localStorage.getItem(backupKeys[0]);
          console.log('📦 Cargando desde backup:', backupKeys[0]);
        }
      }
      
      // Si aún no encuentra, buscar cualquier clave que contenga 'ai' o 'brain'
      if (!savedData) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('ai') || key.includes('brain') || key.includes('knowledge'))) {
            const data = localStorage.getItem(key);
            if (data && data.includes('knowledge')) {
              savedData = data;
              console.log('📦 Datos encontrados en:', key);
              break;
            }
          }
        }
      }
      
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Cargar datos, preservando todo lo que exista
        setKnowledge(data.knowledge || []);
        setWebKnowledge(data.webKnowledge || []);
        setMemorySize(data.memorySize || (data.knowledge?.length || 0) + (data.webKnowledge?.length || 0));
        setLearningRate(data.learningRate || Math.min((data.knowledge?.length || 0) / 100, 100));
        setReasoningLevel(data.reasoningLevel || Math.min((data.knowledge?.length || 0) / 136, 100));
        setCommonSenseRules(data.commonSenseRules || initialCommonSense);
        setExploredUrls(data.exploredUrls || []);
        setTotalPagesExplored(data.totalPagesExplored || 0);
        setGeneratedImages(data.generatedImages || []); // Cargar imágenes generadas
        
        // CORREGIR: Actualizar automáticamente nombres antiguos a Luxio y Lucio Tapia
        const loadedPersonality = data.personality || personality;
        if (loadedPersonality.name === 'NeuroAI' || loadedPersonality.name === 'Usuario' || !loadedPersonality.name) {
          loadedPersonality.name = 'Luxio';
        }
        if (loadedPersonality.creator === 'Usuario' || !loadedPersonality.creator) {
          loadedPersonality.creator = 'Lucio Tapia';
        }
        setPersonality(loadedPersonality);
        
        setSelfControl(data.selfControl || {
          enabled: true,
          autoLearning: true,
          autoDecision: true,
          selfMonitoring: true,
          learningRate: 0,
          decisionConfidence: 50,
          selfAwareness: 0
        });

        const selfControlStatus = data.selfControl?.enabled ? 'ACTIVADO' : 'DESACTIVADO';
        const totalConcepts = (data.knowledge?.length || 0) + (data.webKnowledge?.length || 0);
        const finalReasoning = data.reasoningLevel || Math.min(totalConcepts / 136, 100);
        
        // SIEMPRE usar Luxio y Lucio Tapia, no los datos antiguos
        setMessages([{
          role: 'assistant',
          content: `¡Hola! Soy Luxio, creado por Lucio Tapia. He recuperado ${data.knowledge?.length || 0} conceptos de conversaciones, ${data.webKnowledge?.length || 0} de internet y ${data.commonSenseRules?.length || 6} reglas. Razonamiento al ${Math.round(finalReasoning)}%! 🧠🌐✨\n\n🎛️ **Sistema de Autocontrol**: ${selfControlStatus}\n• Aprendizaje automático: ${data.selfControl?.autoLearning ? 'ON' : 'OFF'}\n• Toma de decisiones: ${data.selfControl?.autoDecision ? 'ON' : 'OFF'}\n• Auto-monitoreo: ${data.selfControl?.selfMonitoring ? 'ON' : 'OFF'}\n\n💾 **Protección de Datos**: Tu aprendizaje está protegido con backups automáticos. No se perderá al agregar o modificar funciones.`
        }]);
        
        // Marcar que los datos se cargaron correctamente
        dataLoadedRef.current = true;
        
        // Guardar los datos corregidos después de un pequeño delay
        // para asegurar que todos los estados se hayan actualizado
        setTimeout(() => {
          saveToStorage();
        }, 100);
      } else {
        // Si no hay datos guardados, marcar como cargado para permitir guardados futuros
        dataLoadedRef.current = true;
        setCommonSenseRules(initialCommonSense);
        setMessages([{
          role: 'assistant',
          content: `¡Hola! Soy ${personality.name}, creado por ${personality.creator}. Soy una IA con sentido común humano, aprendizaje automático web y **SISTEMA DE AUTOCONTROL**.\n\n🧠 Tengo ${initialCommonSense.length} reglas básicas\n🌐 Puedo aprender de todas las páginas web de internet\n🎛️ **Autocontrol activado**: Puedo gestionar mi propio aprendizaje y comportamiento\n\n💻 **PARA APRENDER PROGRAMACIÓN:**\n\n📄 **Opción 1 - Subir archivo:**\n• Ve a la carpeta: frontend/public/\n• Encuentra: programacion-conceptos.txt\n• Súbelo usando el botón "Subir Archivo" arriba\n• Contiene conceptos fundamentales de programación\n\n🌐 **Opción 2 - URLs automáticas:**\n• Ve a: frontend/public/urls-programacion.txt\n• Copia las URLs y agrégalas con el botón "+"\n• O presiona "Iniciar Aprendizaje" y aprenderé automáticamente\n\n📚 **Opción 3 - Aprendizaje automático:**\n• Presiona "Iniciar Aprendizaje" en el panel\n• Aprenderé de internet sobre programación automáticamente\n\n¡Pregúntame lo que quieras o inicia mi aprendizaje! 💡`
        }]);
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      setCommonSenseRules(initialCommonSense);
      setMessages([{
        role: 'assistant',
        content: `¡Hola! Soy ${personality.name}, IA con sentido común, aprendizaje web y autocontrol. ¡Empecemos! 🚀`
      }]);
    }
  };

  // Función para hacer backup antes de cambios importantes
  // Completamente silenciosa - no muestra errores si falla
  const backupBeforeChange = () => {
    // Intentar hacer backup, pero si falla, simplemente continuar sin él
    // Los backups son opcionales y no críticos
    try {
      const currentData = localStorage.getItem('ai-brain-data');
      if (!currentData || currentData.length === 0) return; // No hay datos para respaldar
      
      // Verificar tamaño aproximado (localStorage tiene límite de ~5-10MB)
      // Si los datos son muy grandes (>2MB), no hacer backup para ahorrar espacio
      const dataSize = new Blob([currentData]).size;
      if (dataSize > 2 * 1024 * 1024) {
        // Datos muy grandes, no hacer backup para ahorrar espacio
        return;
      }
      
      // PRIMERO: Limpiar TODOS los backups antiguos para maximizar espacio
      const backupKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ai-brain-backup-')) {
          backupKeys.push(key);
        }
      }
      
      // Eliminar TODOS los backups antiguos antes de crear uno nuevo
      // Esto maximiza el espacio disponible
      backupKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignorar errores al eliminar
        }
      });
      
      // AHORA intentar crear el nuevo backup (solo uno)
      try {
        const backupKey = `ai-brain-backup-${Date.now()}`;
        localStorage.setItem(backupKey, currentData);
        // Si funciona, perfecto. Si no, simplemente continuar sin backup
      } catch (quotaError) {
        // Si no hay espacio, simplemente no hacer backup
        // No mostrar error - los backups son opcionales
        // El guardado principal continuará sin problemas
        return;
      }
    } catch (error) {
      // Completamente silencioso: los backups son opcionales
      // No mostrar ningún error - simplemente continuar
      return;
    }
  };

  const saveToStorage = () => {
    try {
      // IMPORTANTE: No guardar si los datos aún no se han cargado
      // Esto previene que se sobrescriban los datos al recargar la página
      if (!dataLoadedRef.current) {
        console.log('⏳ Esperando a que se carguen los datos antes de guardar...');
        return;
      }
      
      // Hacer backup antes de guardar si hay datos importantes
      if (knowledge.length > 0 || webKnowledge.length > 0) {
        try {
          backupBeforeChange();
        } catch (backupError) {
          console.warn('Error en backup, continuando con guardado principal:', backupError);
        }
      }

      // Asegurar que siempre se guarde con el nombre correcto
      const personalityToSave = {
        ...personality,
        name: personality.name === 'NeuroAI' || personality.name === 'Usuario' ? 'Luxio' : personality.name,
        creator: personality.creator === 'Usuario' ? 'Lucio Tapia' : personality.creator
      };
      
      const data = {
        knowledge: [...knowledge], // Copia para evitar referencias
        webKnowledge: [...webKnowledge], // Copia para evitar referencias
        exploredUrls: [...exploredUrls],
        totalPagesExplored,
        memorySize,
        learningRate,
        reasoningLevel,
        commonSenseRules: [...commonSenseRules],
        personality: personalityToSave,
        selfControl: { ...selfControl }, // Copia del objeto
        generatedImages: generatedImages.slice(-20), // Guardar últimas 20 imágenes
        timestamp: Date.now(),
        version: '2.0' // Versión del formato de datos
      };
      
      // Guardar en localStorage con manejo de errores
      try {
        localStorage.setItem('ai-brain-data', JSON.stringify(data));
        // También guardar como backup de emergencia para máxima seguridad
        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(data));
        // Solo mostrar en consola si hay cambios significativos (reducir spam)
        if (knowledge.length > 0 || webKnowledge.length > 0) {
          // Solo log cada 100 guardados para reducir spam en consola
          const lastLog = parseInt(localStorage.getItem('last-save-log') || '0');
          if (Date.now() - lastLog > 5000) { // Solo log cada 5 segundos
            console.log('✅ Datos guardados:', {
              knowledge: knowledge.length,
              webKnowledge: webKnowledge.length,
              total: knowledge.length + webKnowledge.length
            });
            localStorage.setItem('last-save-log', Date.now().toString());
          }
        }
      } catch (storageError) {
        // Si localStorage está lleno, intentar limpiar backups antiguos
        if (storageError.name === 'QuotaExceededError') {
          // Silencioso: solo log si realmente limpiamos algo
          const backupKeys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ai-brain-backup-')) {
              backupKeys.push(key);
            }
          }
          backupKeys.sort(); // Más antiguos primero
          // Eliminar la mitad de los backups más antiguos
          const toDelete = backupKeys.slice(0, Math.floor(backupKeys.length / 2));
          toDelete.forEach(key => {
            localStorage.removeItem(key);
          });
          if (toDelete.length > 0) {
            console.log(`🧹 Limpiados ${toDelete.length} backups antiguos para liberar espacio`);
          }
          // Intentar guardar de nuevo
          try {
            localStorage.setItem('ai-brain-data', JSON.stringify(data));
          } catch (retryError) {
            // Si aún está lleno, guardar versión reducida
            console.warn('⚠️ localStorage aún lleno, guardando versión reducida...');
            const reducedData = {
              ...data,
              knowledge: knowledge.slice(-50000), // Últimos 50k
              webKnowledge: webKnowledge.slice(-50000)
            };
            localStorage.setItem('ai-brain-data', JSON.stringify(reducedData));
          }
        } else {
          throw storageError;
        }
      }
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      // Intentar guardar al menos los datos críticos
      try {
        const minimalData = {
          knowledge: knowledge.slice(-10000), // Últimos 10k conceptos
          webKnowledge: webKnowledge.slice(-10000),
          personality: {
            name: 'Luxio',
            creator: 'Lucio Tapia'
          },
          timestamp: Date.now(),
          error: 'Guardado parcial debido a error'
        };
        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(minimalData));
        console.log('⚠️ Guardado de emergencia completado');
      } catch (emergencyError) {
        console.error('❌ Error crítico al guardar:', emergencyError);
      }
    }
  };

  // Guardado automático mejorado - se ejecuta cuando hay cambios
  useEffect(() => {
    // IMPORTANTE: Solo guardar si los datos ya se cargaron desde localStorage
    // Esto evita que se sobrescriban los datos al recargar la página
    if (!dataLoadedRef.current) {
      return; // No guardar hasta que los datos se hayan cargado
    }
    
    // Guardar siempre que haya datos, incluso si cambian
    if (knowledge.length > 0 || webKnowledge.length > 0 || commonSenseRules.length > 0 || generatedImages.length > 0) {
      // Usar un delay más corto para guardar más frecuentemente
      const saveTimeout = setTimeout(() => {
        saveToStorage();
      }, 300); // Guardar después de 300ms de inactividad
      
      return () => clearTimeout(saveTimeout);
    }
  }, [knowledge.length, webKnowledge.length, memorySize, learningRate, reasoningLevel, commonSenseRules.length, personality, selfControl, generatedImages.length]);

  // Guardado adicional antes de cerrar la página (CRÍTICO - debe guardar SIEMPRE)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Guardar datos críticos ANTES de recargar/cerrar
      // NO verificar dataLoadedRef porque puede estar false durante recarga
      try {
        const personalityToSave = {
          ...personality,
          name: 'Luxio',
          creator: 'Lucio Tapia'
        };
        
        const data = {
          knowledge: [...knowledge],
          webKnowledge: [...webKnowledge],
          exploredUrls: [...exploredUrls],
          totalPagesExplored,
          memorySize,
          learningRate,
          reasoningLevel,
          commonSenseRules: [...commonSenseRules],
          personality: personalityToSave,
          selfControl: { ...selfControl },
          generatedImages: generatedImages.slice(-20),
          timestamp: Date.now(),
          version: '2.0'
        };
        
        // Guardar en múltiples lugares para máxima seguridad
        localStorage.setItem('ai-brain-data', JSON.stringify(data));
        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(data));
        console.log('💾 Datos guardados antes de recargar/cerrar:', {
          knowledge: knowledge.length,
          webKnowledge: webKnowledge.length,
          total: knowledge.length + webKnowledge.length
        });
      } catch (error) {
        console.error('Error al guardar antes de cerrar:', error);
      }
    };
    
    // Usar both beforeunload y unload para máxima cobertura
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
    };
  }, [knowledge, webKnowledge, exploredUrls, totalPagesExplored, memorySize, learningRate, reasoningLevel, commonSenseRules, personality, selfControl, generatedImages]);

  const applyCommonSense = (input) => {
    const reasoning = [];
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('volar') && lowerInput.includes('humano') && !lowerInput.includes('avion')) {
      reasoning.push({ message: '⚠️ Los humanos no pueden volar solos' });
    }

    if (lowerInput.includes('respirar') && lowerInput.includes('agua') && !lowerInput.includes('tanque')) {
      reasoning.push({ message: '⚠️ No se puede respirar bajo el agua sin equipo' });
    }

    if (lowerInput.includes('tocar') && lowerInput.includes('fuego')) {
      reasoning.push({ message: '🔥 ¡PELIGRO! El fuego quema' });
    }

    if (lowerInput.includes('comer') && lowerInput.includes('veneno')) {
      reasoning.push({ message: '☠️ ¡PELIGRO! Sustancias tóxicas son mortales' });
    }

    return reasoning;
  };

  const learnCommonSense = (input) => {
    const patterns = [
      { regex: /(.+) causa (.+)/i, type: 'causal' },
      { regex: /si (.+) entonces (.+)/i, type: 'conditional' },
      { regex: /los (.+) necesitan (.+)/i, type: 'need' }
    ];

    patterns.forEach(pattern => {
      const match = input.match(pattern.regex);
      if (match) {
        const newRule = {
          rule: match[0],
          category: pattern.type,
          confidence: 70,
          learned: true
        };
        setCommonSenseRules(prev => [...prev, newRule]);
        setReasoningLevel(prev => Math.min(prev + 3, 100));
      }
    });
  };

  const extractConcepts = (text) => {
    const concepts = text.toLowerCase()
      .split(/[\s,;:.!?]+/)
      .filter(w => w.length > 4)
      .filter(w => !['para', 'como', 'donde', 'cuando', 'quien', 'esto', 'eres', 'esta', 'este', 'pero', 'porque', 'alguna', 'algunos', 'todas', 'todos', 'hacer', 'sobre', 'entre', 'otros', 'otras', 'también', 'tambien'].includes(w));

    return [...new Set(concepts)];
  };

  const searchAndLearnTopic = async (topic) => {
    if (!FREE_API_KEY) {
      return { success: false, error: 'API key gratuita no configurada. Configura REACT_APP_GROQ_API_KEY (recomendado - gratis) o REACT_APP_OPENAI_API_KEY' };
    }

    setCurrentTopic(topic);
    setNeuralActivity(100);

    try {
      // Búsqueda más exhaustiva con múltiples consultas
      const queries = [
        `Información completa y actualizada sobre: ${topic}. Incluye datos, hechos, conceptos clave, ejemplos y detalles importantes.`,
        `Explora en profundidad: ${topic}. Busca información de múltiples fuentes web confiables.`,
        `Aprende todo lo posible sobre: ${topic}. Incluye historia, aplicaciones, importancia y detalles técnicos.`
      ];

      let allLearningContent = '';
      let totalConcepts = 0;

      for (const query of queries) {
        try {
          let response;
          let data;

          // Usar diferentes APIs gratuitas según disponibilidad
          if (FREE_API_TYPE === 'groq') {
            // Groq API - GRATIS y MUY RÁPIDO
            response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Modelo más estable y rápido
                messages: [
                  {
                    role: "system",
                    content: `Eres Luxio, una IA creada por Lucio Tapia. Tu misión es aprender y almacenar TODO el conocimiento posible de internet. Busca información exhaustiva, detallada y completa sobre cada tema. Extrae conceptos, hechos, datos, ejemplos y toda información relevante. Sé muy detallado y completo.`
                  },
                  { role: "user", content: query }
                ],
                max_tokens: 2000,
                temperature: 0.7
              })
            });

            if (!response.ok) {
              continue;
            }

            data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
              allLearningContent += data.choices[0].message.content + '\n\n';
            }

          } else if (FREE_API_TYPE === 'openai') {
            // OpenAI API - Tiene créditos gratuitos iniciales
            response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: `Eres Luxio, una IA creada por Lucio Tapia. Tu misión es aprender y almacenar TODO el conocimiento posible de internet. Busca información exhaustiva, detallada y completa sobre cada tema. Extrae conceptos, hechos, datos, ejemplos y toda información relevante. Sé muy detallado y completo.`
                  },
                  { role: "user", content: query }
                ],
                max_tokens: 3000
              })
            });

            if (!response.ok) {
              continue;
            }

            data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
              allLearningContent += data.choices[0].message.content + '\n\n';
            }

          } else if (FREE_API_TYPE === 'gemini') {
            // Google Gemini API - Tier gratuito generoso
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `Eres Luxio, una IA creada por Lucio Tapia. Tu misión es aprender y almacenar TODO el conocimiento posible de internet. Busca información exhaustiva, detallada y completa sobre cada tema. Extrae conceptos, hechos, datos, ejemplos y toda información relevante. Sé muy detallado y completo.\n\n${query}`
                  }]
                }]
              })
            });

            if (!response.ok) {
              continue;
            }

            data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
              allLearningContent += data.candidates[0].content.parts[0].text + '\n\n';
            }

          } else if (FREE_API_TYPE === 'huggingface') {
            // Hugging Face API - Gratis con límites
            response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`
              },
              body: JSON.stringify({
                inputs: `Eres Luxio, una IA creada por Lucio Tapia. Tu misión es aprender y almacenar TODO el conocimiento posible de internet. Busca información exhaustiva, detallada y completa sobre cada tema. Extrae conceptos, hechos, datos, ejemplos y toda información relevante. Sé muy detallado y completo.\n\n${query}`,
                parameters: {
                  max_new_tokens: 1000,
                  return_full_text: false
                }
              })
            });

            if (!response.ok) {
              continue;
            }

            data = await response.json();
            if (Array.isArray(data) && data[0] && data[0].generated_text) {
              allLearningContent += data[0].generated_text + '\n\n';
            }
          }

          // Pequeña pausa entre consultas para no sobrecargar
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Error en consulta individual:', error);
          continue;
        }
      }

      if (allLearningContent) {
        const concepts = extractConcepts(allLearningContent);

        concepts.forEach(concept => {
          setWebKnowledge(prev => {
            const exists = prev.some(k => k.concept === concept);
            if (!exists && prev.length < 100000000) { // Límite aumentado a 100 millones de conceptos
              totalConcepts++;
              return [...prev, {
                concept,
                topic,
                source: 'web_training',
                summary: allLearningContent.substring(0, 300),
                timestamp: Date.now()
              }];
            }
            return prev;
          });
        });

        setMemorySize(prev => prev + totalConcepts);
        setLearningRate(prev => Math.min(prev + 3, 100));

        return {
          success: true,
          conceptsLearned: totalConcepts,
          content: allLearningContent.substring(0, 400)
        };
      }

      return { success: false };

    } catch (error) {
      console.error('Error en búsqueda:', error);
      return { success: false, error: error.message };
    } finally {
      setNeuralActivity(0);
    }
  };

  const startAutoTraining = async () => {
    if (autoTrainingActive) {
      return;
    }

    if (!FREE_API_KEY) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ No puedo iniciar el aprendizaje automático. Necesito una API key gratuita.\n\n🔑 **Opciones GRATUITAS:**\n\n1. **Groq (RECOMENDADO - Gratis y rápido):**\n   • Ve a https://console.groq.com/\n   • Crea cuenta gratis\n   • Obtén tu API key\n   • Agrega: REACT_APP_GROQ_API_KEY=tu_key\n\n2. **OpenAI (Créditos gratis iniciales):**\n   • Ve a https://platform.openai.com/\n   • Crea cuenta (tiene $5 gratis)\n   • Agrega: REACT_APP_OPENAI_API_KEY=tu_key\n\n3. **Google Gemini (Tier gratuito):**\n   • Ve a https://makersuite.google.com/app/apikey\n   • Crea API key gratis\n   • Agrega: REACT_APP_GEMINI_API_KEY=tu_key\n\n4. **Hugging Face (Gratis con límites):**\n   • Ve a https://huggingface.co/settings/tokens\n   • Crea token\n   • Agrega: REACT_APP_HUGGINGFACE_API_KEY=tu_key`
      }]);
      return;
    }

    setAutoTrainingActive(true);
    setTrainingTopics([...defaultTopics]);
    setTrainingProgress(0);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🚀 ¡Iniciando aprendizaje automático intensivo!\n\nSoy Luxio, creado por Lucio Tapia. Voy a explorar ${defaultTopics.length} temas diferentes en internet y aprender TODO lo que pueda de cada página web disponible.\n\n📚 Estoy listo para absorber conocimiento de:\n• Múltiples fuentes web\n• Información actualizada\n• Conceptos detallados\n• Datos y hechos importantes\n\nObserva mi progreso en el panel lateral. Esto puede tomar varios minutos mientras aprendo de internet... 🌐🧠`
    }]);

    let topicIndex = 0;
    const totalTopics = defaultTopics.length;

    const trainNextTopic = async () => {
      if (!autoTrainingActive || topicIndex >= totalTopics) {
        stopAutoTraining();
        return;
      }

      const topic = defaultTopics[topicIndex];
      setCurrentTopic(topic);
      setTrainingProgress(((topicIndex + 1) / totalTopics) * 100);

      // Buscar URLs automáticamente sobre este tema
      const urls = await findURLsForTopic(topic, 3); // 3 URLs por tema
      
      if (urls.length > 0) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🔍 Tema ${topicIndex + 1}/${totalTopics}: "${topic}"\n\n✅ Encontré ${urls.length} página(s) web automáticamente\n📚 Leyendo y aprendiendo de cada una...`
        }]);

        let totalConceptsLearned = 0;
        // Leer cada URL encontrada usando readAndLearnFromWeb (que SÍ guarda en webKnowledge)
        for (let i = 0; i < urls.length && autoTrainingActive; i++) {
          const url = urls[i];
          const result = await readAndLearnFromWeb(url);
          
          if (result.success) {
            totalConceptsLearned += result.conceptsLearned || 0;
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `📖 Página ${i + 1}/${urls.length} del tema "${topic}":\n✅ ${result.conceptsLearned || 0} conceptos aprendidos\n🌐 ${url.substring(0, 60)}...\n\n💾 Total acumulado: ${webKnowledge.length + totalConceptsLearned} conceptos de internet`
            }]);
          }
          
          // Esperar entre páginas
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Tema ${topicIndex + 1}/${totalTopics}: "${topic}"\n\nNo pude encontrar URLs automáticamente. Continuando con el siguiente tema...`
        }]);
      }

      topicIndex++;

      if (topicIndex < totalTopics && autoTrainingActive) {
        setTimeout(trainNextTopic, 1000);
      } else {
        stopAutoTraining();
      }
    };

    trainNextTopic();
  };

  const stopAutoTraining = () => {
    setAutoTrainingActive(false);
    setTrainingProgress(0);
    setCurrentTopic('');

    // Usar setTimeout para asegurar que el estado se haya actualizado
    setTimeout(() => {
      setWebKnowledge(prev => {
        const finalWebCount = prev.length;
        const finalKnowledgeCount = knowledge.length;
        const finalTotal = finalWebCount + finalKnowledgeCount;
        
        setMessages(prevMessages => [...prevMessages, {
          role: 'assistant',
          content: `✅ ¡Aprendizaje automático completado!\n\nSoy Luxio, creado por Lucio Tapia. He explorado internet automáticamente y aprendido de todas las páginas web disponibles.\n\n📊 Estadísticas:\n• ${finalWebCount} conceptos aprendidos de internet 🌐\n• ${finalKnowledgeCount} conceptos de conversaciones 💬\n• ${finalTotal} conceptos totales almacenados\n• Nivel de aprendizaje: ${learningRate}%\n\n💾 Todo el conocimiento ha sido almacenado correctamente.\n\n¡Ahora soy mucho más inteligente! Pregúntame sobre cualquier tema que investigué. 🧠✨`
        }]);
        
        return prev;
      });
    }, 1000);
  };

  // Nueva función para buscar URLs automáticamente sobre un tema
  const findURLsForTopic = async (topic, maxUrls = 3) => {
    if (!FREE_API_KEY) {
      // Si no hay API key, usar URLs predeterminadas
      return getDefaultURLsForTopic(topic).slice(0, maxUrls);
    }

    try {
      // Primero intentar buscar URLs usando la API
      const searchPrompt = `Busca en internet y encuentra ${maxUrls} URLs de páginas web relevantes sobre: "${topic}". 

Responde SOLO con URLs válidas, una por línea, sin explicaciones. Las URLs deben ser accesibles y contener información útil.`;

      let urls = [];

      if (FREE_API_TYPE === 'groq') {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "Eres un buscador de URLs. Responde SOLO con URLs válidas, una por línea, sin explicaciones ni texto adicional."
              },
              {
                role: "user",
                content: searchPrompt
              }
            ],
            max_tokens: 300,
            temperature: 0.2
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            const content = data.choices[0].message.content;
            // Extraer URLs del texto
            const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
            const foundUrls = content.match(urlRegex) || [];
            urls = foundUrls.slice(0, maxUrls);
            console.log('🔍 URLs encontradas automáticamente para tema:', topic, urls);
          }
        }
      }

      // Si no se encontraron URLs con la API, usar URLs predeterminadas
      if (urls.length === 0) {
        urls = getDefaultURLsForTopic(topic).slice(0, maxUrls);
        console.log('📚 Usando URLs predeterminadas para tema:', topic, urls);
      }

      return urls;
    } catch (error) {
      console.error('Error buscando URLs:', error);
      // Usar URLs predeterminadas como fallback
      return getDefaultURLsForTopic(topic).slice(0, maxUrls);
    }
  };

  // Función para obtener URLs predeterminadas según el tema
  const getDefaultURLsForTopic = (topic) => {
    const topicLower = topic.toLowerCase();
    const urls = [];

    if (topicLower.includes('inteligencia artificial') || topicLower.includes('machine learning') || topicLower.includes('deep learning')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Inteligencia_artificial',
        'https://es.wikipedia.org/wiki/Aprendizaje_automático',
        'https://es.wikipedia.org/wiki/Red_neuronal_artificial',
        'https://es.wikipedia.org/wiki/Procesamiento_de_lenguaje_natural'
      );
    } else if (topicLower.includes('ciencia') || topicLower.includes('descubrimientos')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Ciencia',
        'https://es.wikipedia.org/wiki/Método_científico',
        'https://es.wikipedia.org/wiki/Investigación_científica'
      );
    } else if (topicLower.includes('historia')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Historia',
        'https://es.wikipedia.org/wiki/Historia_universal',
        'https://es.wikipedia.org/wiki/Edad_Antigua'
      );
    } else if (topicLower.includes('matemáticas') || topicLower.includes('álgebra') || topicLower.includes('geometría')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Matemáticas',
        'https://es.wikipedia.org/wiki/Álgebra',
        'https://es.wikipedia.org/wiki/Geometría'
      );
    } else if (topicLower.includes('física') || topicLower.includes('mecánica') || topicLower.includes('cuántica')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Física',
        'https://es.wikipedia.org/wiki/Mecánica_cuántica',
        'https://es.wikipedia.org/wiki/Relatividad'
      );
    } else if (topicLower.includes('biología') || topicLower.includes('genética') || topicLower.includes('evolución')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Biología',
        'https://es.wikipedia.org/wiki/Genética',
        'https://es.wikipedia.org/wiki/Evolución'
      );
    } else if (topicLower.includes('química')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Química',
        'https://es.wikipedia.org/wiki/Química_orgánica',
        'https://es.wikipedia.org/wiki/Elemento_químico'
      );
    } else if (topicLower.includes('geografía') || topicLower.includes('países')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Geografía',
        'https://es.wikipedia.org/wiki/Continente',
        'https://es.wikipedia.org/wiki/País'
      );
    } else if (topicLower.includes('astronomía') || topicLower.includes('planetas') || topicLower.includes('estrellas')) {
      urls.push(
        'https://es.wikipedia.org/wiki/Astronomía',
        'https://es.wikipedia.org/wiki/Planeta',
        'https://es.wikipedia.org/wiki/Estrella'
      );
    } else {
      // URLs generales de conocimiento
      urls.push(
        'https://es.wikipedia.org/wiki/Conocimiento',
        'https://es.wikipedia.org/wiki/Educación',
        'https://es.wikipedia.org/wiki/Información'
      );
    }

    return urls;
  };

  const fetchWebContent = async (url) => {
    try {
      // Intentar obtener el contenido usando un proxy CORS gratuito
      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
      ];

      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });

          if (response.ok) {
            let text = await response.text();
            
            // Si es allorigins, extraer el contenido
            if (proxyUrl.includes('allorigins')) {
              const data = JSON.parse(text);
              text = data.contents || text;
            }

            // Limpiar HTML y extraer texto
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Remover scripts, styles, etc.
            const scripts = doc.querySelectorAll('script, style, nav, header, footer, aside');
            scripts.forEach(el => el.remove());
            
            // Extraer texto del body
            const bodyText = doc.body?.textContent || doc.textContent || '';
            
            // Limpiar espacios múltiples
            const cleanText = bodyText
              .replace(/\s+/g, ' ')
              .replace(/\n+/g, '\n')
              .trim();

            if (cleanText.length > 100) {
              return {
                text: cleanText.substring(0, 10000), // Limitar a 10000 caracteres
                html: text // Guardar HTML para extraer enlaces
              };
            }
          }
        } catch (err) {
          continue; // Intentar siguiente proxy
        }
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo contenido web:', error);
      return null;
    }
  };

  const extractLinksFromContent = (html, baseUrl) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href]');
      const extractedLinks = [];
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          try {
            // Convertir URL relativa a absoluta
            const absoluteUrl = new URL(href, baseUrl).href;
            // Solo URLs válidas y que no sean archivos
            if (absoluteUrl.startsWith('http') && 
                !absoluteUrl.match(/\.(pdf|jpg|jpeg|png|gif|zip|rar|exe|dmg)$/i) &&
                !exploredUrls.includes(absoluteUrl)) {
              extractedLinks.push(absoluteUrl);
            }
          } catch (e) {
            // Ignorar URLs inválidas
          }
        }
      });
      
      return [...new Set(extractedLinks)].slice(0, 5); // Máximo 5 enlaces únicos
    } catch (error) {
      return [];
    }
  };

  const readAndLearnFromWeb = async (url) => {
    console.log('🚀 INICIANDO readAndLearnFromWeb para URL:', url);
    
    if (!FREE_API_KEY) {
      console.error('❌ No hay API key configurada');
      return { success: false, error: 'Necesitas configurar una API key gratuita para leer páginas web' };
    }

    console.log('✅ API key disponible:', FREE_API_TYPE);
    setCurrentURL(url);
    setNeuralActivity(100);

    try {
      // Marcar URL como explorada
      if (!exploredUrls.includes(url)) {
        setExploredUrls(prev => [...prev, url]);
        setTotalPagesExplored(prev => prev + 1);
        console.log('📌 URL marcada como explorada');
      }

      // Primero obtener el contenido real de la página web
      console.log('🔍 Obteniendo contenido de la página web...');
      let pageContentData = await fetchWebContent(url);
      let pageContent = pageContentData?.text || null;
      let pageHtml = pageContentData?.html || null;
      
      console.log('📄 Resultado de fetchWebContent:', {
        hasData: !!pageContentData,
        hasText: !!pageContent,
        textLength: pageContent?.length || 0,
        hasHtml: !!pageHtml,
        htmlLength: pageHtml?.length || 0
      });
      
      // Extraer enlaces si está habilitado el seguimiento automático
      let extractedLinks = [];
      if (autoFollowLinks && pageHtml) {
        extractedLinks = extractLinksFromContent(pageHtml, url);
        console.log('🔗 Enlaces extraídos:', extractedLinks.length);
      }
      
      // Si no se pudo obtener directamente, usar la API para buscar información sobre la URL
      if (!pageContent || pageContent.length < 100) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🔍 No pude acceder directamente a ${url}. Buscando información sobre esta página en internet...`
        }]);
      }

      let webContent = '';
      const prompt = pageContent 
        ? `Lee y aprende de este contenido web de la página ${url}:\n\n${pageContent.substring(0, 8000)}\n\nExtrae TODO el conocimiento importante: conceptos, hechos, datos, información útil, definiciones, explicaciones. Sé exhaustivo y detallado.`
        : `Busca y aprende información sobre esta página web: ${url}\n\nExtrae TODO el conocimiento importante que puedas encontrar sobre el contenido de esta página: conceptos, hechos, datos, información útil, definiciones, explicaciones. Sé exhaustivo y detallado.`;
      
      if (FREE_API_TYPE === 'groq') {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: `Eres Luxio, una IA creada por Lucio Tapia. Tu misión es leer y aprender de páginas web como lo haría un humano estudiando. 

Cuando te den contenido web o una URL:
1. Lee todo el contenido cuidadosamente
2. Extrae los conceptos principales, hechos importantes, datos, información útil
3. Identifica ideas clave, definiciones, explicaciones
4. Procesa la información como si estuvieras estudiando
5. Estructura el conocimiento de forma clara

Responde con TODO el conocimiento importante que encuentres. Sé muy detallado y exhaustivo.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 3000,
            temperature: 0.5
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          webContent = data.choices[0].message.content;
          console.log('✅ Contenido obtenido de Groq:', webContent.length, 'caracteres');
          console.log('📄 Primeros 300 caracteres:', webContent.substring(0, 300));
        } else {
          console.error('❌ No se obtuvo contenido de Groq:', data);
          console.error('❌ Estructura de respuesta:', JSON.stringify(data, null, 2));
        }
      } else if (FREE_API_TYPE === 'openai') {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Eres Luxio, una IA creada por Lucio Tapia. Lee y aprende de páginas web como lo haría un humano estudiando. Extrae TODO el conocimiento importante.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 3000
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            webContent = data.choices[0].message.content;
          }
        }
      }

      // MEJORADO: Usar el contenido REAL de la página si está disponible, no solo la respuesta de Groq
      let contentToProcess = '';
      
      console.log('🔍 DEBUG: Verificando contenido disponible...');
      console.log('   - pageContent:', pageContent ? `${pageContent.length} chars` : 'null');
      console.log('   - webContent:', webContent ? `${webContent.length} chars` : 'null');
      
      if (pageContent && pageContent.length > 100) {
        // Si tenemos el contenido real de la página, usarlo directamente
        contentToProcess = pageContent;
        console.log('✅ Usando contenido REAL de la página:', contentToProcess.length, 'caracteres');
        console.log('📄 Muestra del contenido real (primeros 300 chars):', contentToProcess.substring(0, 300));
      } else if (webContent && webContent.length > 50) {
        // Si no, usar la respuesta de Groq
        contentToProcess = webContent;
        console.log('✅ Usando contenido de Groq:', contentToProcess.length, 'caracteres');
        console.log('📄 Muestra del contenido Groq (primeros 300 chars):', contentToProcess.substring(0, 300));
      } else {
        console.error('❌ ERROR: No hay contenido disponible para procesar');
        console.error('   - pageContent disponible:', !!pageContent);
        console.error('   - webContent disponible:', !!webContent);
        return { success: false, error: 'No se pudo obtener contenido de la página' };
      }

      if (contentToProcess && contentToProcess.length > 50) {
        console.log('✅ CONTENIDO VÁLIDO PARA PROCESAR:', contentToProcess.length, 'caracteres');
        console.log('📄 Muestra del contenido (primeros 500 chars):', contentToProcess.substring(0, 500));
        
        // Extraer conceptos línea por línea para mejor extracción
        const lines = contentToProcess.split('\n').filter(line => line.trim().length > 0);
        console.log('📄 Líneas extraídas del contenido:', lines.length);
        
        let allConcepts = [];
        
        lines.forEach((line, lineIndex) => {
          const words = line.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3 && w.length < 20)
            .filter(w => !['para', 'como', 'donde', 'cuando', 'quien', 'esto', 'esta', 'este', 'pero', 'porque', 'todas', 'todos', 'hacer', 'sobre', 'entre', 'puede', 'pueden', 'tiene', 'tienen', 'desde', 'hasta', 'también', 'tambien', 'otros', 'otras', 'cada', 'todo', 'toda', 'ser', 'son', 'fue', 'fueron', 'eres', 'alguna', 'algunos'].includes(w));
          
          if (lineIndex < 5) {
            console.log(`📝 Línea ${lineIndex + 1}: "${line.substring(0, 100)}" → ${words.length} palabras válidas`);
          }
          
          words.forEach(word => {
            if (!allConcepts.includes(word)) {
              allConcepts.push(word);
            }
          });
        });
        
        // MEJORADO: Extraer MÁS conceptos (hasta 500 por página)
        let finalConcepts = allConcepts.slice(0, 500); // Aumentado de 200 a 500
        
        console.log('🔍 TOTAL Conceptos extraídos (línea por línea):', finalConcepts.length);
        console.log('🔍 Primeros 30 conceptos:', finalConcepts.slice(0, 30));
        
        // Si no hay suficientes conceptos, usar método alternativo más agresivo
        if (finalConcepts.length < 50) {
          console.warn('⚠️ Pocos conceptos extraídos. Usando método alternativo más agresivo...');
          
          // Método alternativo: extraer TODAS las palabras válidas
          const allWords = contentToProcess.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && w.length < 30) // Palabras de 3 a 29 caracteres
            .filter(w => !['para', 'como', 'donde', 'cuando', 'quien', 'esto', 'esta', 'este', 'pero', 'porque', 'todas', 'todos', 'hacer', 'sobre', 'entre', 'puede', 'pueden', 'tiene', 'tienen', 'desde', 'hasta', 'también', 'tambien', 'otros', 'otras', 'cada', 'todo', 'toda', 'ser', 'son', 'fue', 'fueron', 'eres', 'alguna', 'algunos', 'que', 'del', 'las', 'los', 'una', 'uno', 'con', 'por', 'sus', 'ese', 'esa', 'ese', 'esa', 'estos', 'estas', 'estos', 'estas', 'mismo', 'misma', 'mismos', 'mismas', 'muy', 'mas', 'más', 'menos', 'mucho', 'muchos', 'poco', 'pocos', 'algo', 'nada', 'todo', 'todos', 'cual', 'cuales', 'cualquier', 'cualquiera'].includes(w));
          
          const uniqueWords = [...new Set(allWords)];
          const additionalConcepts = uniqueWords.slice(0, 400); // Agregar hasta 400 conceptos más
          
          // Combinar sin duplicados
          const existingSet = new Set(finalConcepts);
          additionalConcepts.forEach(word => {
            if (!existingSet.has(word)) {
              finalConcepts.push(word);
              existingSet.add(word);
            }
          });
          
          finalConcepts = finalConcepts.slice(0, 500); // Limitar a 500 máximo
          console.log('🔍 Conceptos totales después del método alternativo:', finalConcepts.length);
        }
        
        // Extraer también frases de 2-3 palabras como conceptos adicionales
        const phrases = [];
        const words = contentToProcess.toLowerCase()
          .replace(/[^\w\sáéíóúñ]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 3);
        
        for (let i = 0; i < words.length - 1; i++) {
          const phrase = `${words[i]} ${words[i + 1]}`;
          if (phrase.length > 8 && phrase.length < 30 && !phrases.includes(phrase)) {
            phrases.push(phrase);
          }
        }
        
        // Agregar frases como conceptos adicionales (hasta 100)
        phrases.slice(0, 100).forEach(phrase => {
          if (!finalConcepts.includes(phrase)) {
            finalConcepts.push(phrase);
          }
        });
        
        finalConcepts = finalConcepts.slice(0, 600); // Hasta 600 conceptos por página
        console.log('🔍 Conceptos FINALES (incluyendo frases):', finalConcepts.length);

        // Usar una función de callback para asegurar que el estado se actualice correctamente
        let conceptsLearned = 0;
        
        if (finalConcepts.length > 0) {
          // Preparar todos los conceptos nuevos de una vez
          const newKnowledgeArray = finalConcepts.map(concept => {
            // Encontrar la línea que contiene este concepto para contexto
            const contextLine = lines.find(line => 
              line.toLowerCase().includes(concept)
            ) || contentToProcess.substring(0, 200);
            
            return {
              concept,
              topic: `Página web: ${url.substring(0, 50)}`,
              source: 'web_reading',
              summary: contextLine.substring(0, 400),
              url: url,
              timestamp: Date.now()
            };
          });
          
          conceptsLearned = newKnowledgeArray.length;
          console.log('✅ Conceptos preparados para agregar:', conceptsLearned);
          console.log('✅ Primeros 5 conceptos:', newKnowledgeArray.slice(0, 5).map(k => k.concept));
          
          // Agregar todos los conceptos de una vez usando una función de actualización
          await new Promise(resolve => {
            setWebKnowledge(prev => {
              // Filtrar duplicados
              const existingConcepts = new Set(prev.map(k => `${k.concept}-${k.url}`));
              const uniqueNewConcepts = newKnowledgeArray.filter(k => 
                !existingConcepts.has(`${k.concept}-${k.url}`)
              );
              
              const beforeLength = prev.length;
              const updated = [...prev, ...uniqueNewConcepts];
              const afterLength = updated.length;
              const added = afterLength - beforeLength;
              
              console.log('💾 DENTRO de setWebKnowledge:');
              console.log('   - Antes:', beforeLength);
              console.log('   - Después:', afterLength);
              console.log('   - Agregados:', added);
              console.log('   - Esperados:', uniqueNewConcepts.length);
              
              if (added !== uniqueNewConcepts.length) {
                console.warn('⚠️ Algunos conceptos eran duplicados');
              }
              
              resolve();
              return updated;
            });
          });
          
          setMemorySize(prev => prev + conceptsLearned);
          setLearningRate(prev => Math.min(prev + 5, 100));
          
          console.log('💾 Conceptos agregados correctamente:', conceptsLearned);
        } else {
          console.error('❌ NO SE PUDIERON EXTRAER CONCEPTOS DEL CONTENIDO');
        }

        // Esperar un momento para que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verificar que el estado se actualizó correctamente
        const finalState = await new Promise(resolve => {
          setWebKnowledge(prev => {
            const count = prev.length;
            const fromThisUrl = prev.filter(k => k.url === url).length;
            console.log('🔍 VERIFICACIÓN FINAL:');
            console.log('   - Total webKnowledge:', count);
            console.log('   - Conceptos de esta URL:', fromThisUrl);
            resolve({ total: count, fromUrl: fromThisUrl });
            return prev;
          });
        });
        
        console.log('📈 Conceptos aprendidos finales:', finalState.fromUrl);

        return {
          success: true,
          conceptsLearned: finalState.fromUrl > 0 ? finalState.fromUrl : conceptsLearned,
          content: contentToProcess.substring(0, 500),
          url
        };
      } else {
        console.error('❌ Contenido inválido o muy corto:', contentToProcess?.length || 0);
      }

      return { success: false, error: 'No se pudo extraer contenido útil de la página' };

    } catch (error) {
      console.error('Error leyendo página web:', error);
      return { success: false, error: error.message };
    } finally {
      setNeuralActivity(0);
    }
  };

  const startWebReading = async () => {
    if (webReadingActive || !FREE_API_KEY) {
      if (!FREE_API_KEY) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Necesitas configurar una API key gratuita para leer páginas web.'
        }]);
      }
      return;
    }

    if (webURLs.length === 0) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '📝 Por favor, agrega al menos una URL para leer. Usa el campo "Agregar URL" y presiona Enter.'
      }]);
      return;
    }

    setWebReadingActive(true);
    setWebReadingProgress(0);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🌐 ¡Iniciando lectura de páginas web!\n\nSoy Luxio, creado por Lucio Tapia. Voy a leer y estudiar ${webURLs.length} página(s) web como lo haría un humano, extrayendo TODO el conocimiento importante.\n\n📚 Proceso:\n• Leyendo cada página cuidadosamente\n• Extrayendo conceptos, hechos y datos\n• Almacenando todo el conocimiento\n• Aprendiendo como un estudiante\n\nEsto puede tomar varios minutos...`
    }]);

    let urlIndex = 0;
    const totalURLs = webURLs.length;

    const readNextURL = async () => {
      if (!webReadingActive || urlIndex >= totalURLs) {
        stopWebReading();
        return;
      }

      const url = webURLs[urlIndex];
      console.log(`📖 [${urlIndex + 1}/${totalURLs}] Llamando a readAndLearnFromWeb para: ${url}`);
      console.log(`📊 Estado ANTES de leer: webKnowledge.length = ${webKnowledge.length}`);
      
      const result = await readAndLearnFromWeb(url);
      
      console.log(`📊 Resultado de readAndLearnFromWeb:`, {
        success: result.success,
        conceptsLearned: result.conceptsLearned || 0,
        error: result.error,
        hasContent: !!result.content
      });
      
      // Verificar el estado después de leer
      await new Promise(resolve => {
        setWebKnowledge(prev => {
          console.log(`📊 Estado DESPUÉS de leer: webKnowledge.length = ${prev.length}`);
          resolve();
          return prev;
        });
      });

      if (result.success) {
        setWebReadingProgress(((urlIndex + 1) / totalURLs) * 100);

        // Si hay enlaces y el seguimiento automático está activado, agregarlos a la cola
        if (autoFollowLinks && result.links && result.links.length > 0 && webURLs.length < 20) {
          const newLinks = result.links.filter(link => !webURLs.includes(link));
          if (newLinks.length > 0) {
            setWebURLs(prev => [...prev, ...newLinks.slice(0, 3)]); // Agregar máximo 3 enlaces
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `📖 Página ${urlIndex + 1}/${totalURLs}: ${url}\n\n✅ Leí y aprendí:\n• ${result.conceptsLearned} conceptos nuevos\n• Encontré ${result.links.length} enlaces interesantes\n• Continuaré explorando automáticamente\n\n${result.content.substring(0, 200)}...\n\n💾 ${result.conceptsLearned} conceptos nuevos de esta página`
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `📖 Página ${urlIndex + 1}/${totalURLs}: ${url}\n\n✅ Leí y aprendí:\n• ${result.conceptsLearned} conceptos nuevos\n• Contenido procesado y almacenado\n\n${result.content.substring(0, 200)}...\n\n💾 ${result.conceptsLearned} conceptos nuevos de esta página`
            }]);
          }
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `📖 Página ${urlIndex + 1}/${totalURLs}: ${url}\n\n✅ Leí y aprendí:\n• ${result.conceptsLearned} conceptos nuevos\n• Contenido procesado y almacenado\n\n${result.content.substring(0, 200)}...\n\n💾 ${result.conceptsLearned} conceptos nuevos de esta página`
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Página ${urlIndex + 1}/${totalURLs}: ${url}\n\nError: ${result.error || 'No se pudo leer'}\nContinuando con la siguiente...`
        }]);
      }

      urlIndex++;

      // Actualizar totalURLs por si se agregaron nuevos enlaces
      const currentTotal = webURLs.length;

      if (urlIndex < currentTotal && webReadingActive) {
        setTimeout(readNextURL, 3000);
      } else {
        stopWebReading();
      }
    };

    readNextURL();
  };

  const stopWebReading = () => {
    setWebReadingActive(false);
    setWebReadingProgress(0);
    const finalURL = currentURL;
    setCurrentURL('');

    // Usar setTimeout para asegurar que el estado se haya actualizado
    setTimeout(() => {
      // Obtener el estado actualizado usando una función de callback
      setWebKnowledge(prev => {
        const finalWebCount = prev.length;
        const finalKnowledgeCount = knowledge.length;
        const finalTotal = finalWebCount + finalKnowledgeCount;
        
        console.log('📊 Estado final de webKnowledge:', finalWebCount);
        console.log('📊 Estado final de knowledge:', finalKnowledgeCount);
        console.log('📊 Total conceptos:', finalTotal);
        console.log('📊 URLs exploradas:', exploredUrls.length);
        console.log('📊 Páginas exploradas:', totalPagesExplored);
        
        // Mostrar algunos conceptos de ejemplo
        if (finalWebCount > 0) {
          console.log('📚 Primeros 10 conceptos de webKnowledge:', prev.slice(0, 10).map(k => k.concept));
        } else {
          console.warn('⚠️ PROBLEMA: webKnowledge está vacío después de leer páginas');
          console.warn('⚠️ Posibles causas:');
          console.warn('   1. No se extrajeron conceptos del contenido');
          console.warn('   2. Los conceptos no se guardaron correctamente');
          console.warn('   3. El estado se reseteó después de guardar');
        }
        
        setMessages(prevMessages => [...prevMessages, {
          role: 'assistant',
          content: `✅ ¡Lectura de páginas web completada!\n\nSoy Luxio, creado por Lucio Tapia. He leído y estudiado todas las páginas web como un humano.\n\n📊 Estadísticas:\n• ${webURLs.length} página(s) web leída(s)\n• ${finalWebCount} conceptos aprendidos de internet 🌐\n• ${finalKnowledgeCount} conceptos de conversaciones 💬\n• ${finalTotal} conceptos totales\n• Nivel de aprendizaje: ${learningRate}%\n\n💾 Todo el conocimiento ha sido almacenado. ¡Ahora sé mucho más! Pregúntame sobre lo que leí. 🧠📚`
        }]);
        
        return prev; // No modificar el estado, solo leerlo
      });
    }, 2000);
  };

  const addURL = () => {
    const urlInput = urlInputRef.current?.value || '';
    if (!urlInput.trim()) return;
    
    let url = urlInput.trim();
    // Agregar https:// si no tiene protocolo
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (!webURLs.includes(url)) {
      setWebURLs(prev => [...prev, url]);
      if (urlInputRef.current) urlInputRef.current.value = '';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✓ URL agregada: ${url}\n\nTotal: ${webURLs.length + 1} URL(s) en lista. Presiona "Leer Páginas Web" para empezar.`
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Esta URL ya está en la lista: ${url}`
      }]);
    }
  };

  // Función mejorada para extraer palabras y definiciones del diccionario RAE
  const extractDictionaryEntries = (text) => {
    const entries = [];
    const lines = text.split('\n');
    
    // Patrón para detectar entradas del diccionario RAE
    // Formato: palabra. (etimología). m./f./adj. definición...
    // O: palabra. m./f./adj. definición...
    const entryPattern = /^([a-záéíóúñ]+(?:[,\s]+[a-záéíóúñ]+)*)\.\s*(?:\([^)]+\)\.\s*)?(?:[a-záéíóúñ]+\s+)?(?:[0-9]+\s+)?([A-ZÁÉÍÓÚÑ].*)/i;
    const simpleEntryPattern = /^([a-záéíóúñ]+(?:[,\s]+[a-záéíóúñ]+)*)\.\s+([A-ZÁÉÍÓÚÑ].*)/i;
    
    let currentWord = '';
    let currentDefinition = '';
    let inDefinition = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Saltar líneas vacías o de formato
      if (!line || line.length < 3) {
        if (inDefinition && currentWord) {
          // Finalizar definición anterior si hay una palabra pendiente
          if (currentDefinition.trim().length > 10) {
            entries.push(`${currentWord}: ${currentDefinition.trim()}`);
          }
          currentWord = '';
          currentDefinition = '';
          inDefinition = false;
        }
        continue;
      }
      
      // Detectar entrada de diccionario
      const match = line.match(entryPattern) || line.match(simpleEntryPattern);
      
      if (match) {
        // Guardar entrada anterior si existe
        if (currentWord && currentDefinition.trim().length > 10) {
          entries.push(`${currentWord}: ${currentDefinition.trim()}`);
        }
        
        // Nueva entrada
        currentWord = match[1].trim().toLowerCase();
        currentDefinition = match[2] || '';
        inDefinition = true;
      } else if (inDefinition && currentWord) {
        // Continuar definición en líneas siguientes
        // Detectar si es una nueva entrada (palabra seguida de punto)
        const newEntryMatch = line.match(/^([a-záéíóúñ]+)\.\s/i);
        if (newEntryMatch && line.length < 100) {
          // Es una nueva entrada, guardar la anterior
          if (currentDefinition.trim().length > 10) {
            entries.push(`${currentWord}: ${currentDefinition.trim()}`);
          }
          currentWord = newEntryMatch[1].trim().toLowerCase();
          currentDefinition = line.substring(newEntryMatch[0].length).trim();
        } else {
          // Continuar la definición actual
          currentDefinition += ' ' + line;
        }
      }
    }
    
    // Agregar última entrada
    if (currentWord && currentDefinition.trim().length > 10) {
      entries.push(`${currentWord}: ${currentDefinition.trim()}`);
    }
    
    return entries.length > 0 ? entries : null;
  };

  const trainWithText = async (text) => {
    // Detectar si es un diccionario
    const isDictionary = text.toLowerCase().includes('diccionario') || 
                        text.toLowerCase().includes('real academia') ||
                        text.toLowerCase().includes('definición') ||
                        text.toLowerCase().includes('diccionario de la lengua');
    
    let itemsToProcess = [];
    
    if (isDictionary) {
      // Para diccionarios, intentar extraer entradas primero
      const dictionaryEntries = extractDictionaryEntries(text);
      if (dictionaryEntries && dictionaryEntries.length > 100) {
        // Si encontramos muchas entradas, usarlas
        itemsToProcess = dictionaryEntries;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📚 Diccionario RAE detectado! Encontré ${dictionaryEntries.length} entradas. Procesando...`
        }]);
      } else {
        // Si no se pueden extraer entradas específicas, procesar por líneas/párrafos
        // Dividir en bloques de texto razonables
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 20);
        if (paragraphs.length > 0) {
          itemsToProcess = paragraphs;
        } else {
          // Si no hay párrafos, dividir por líneas significativas
          itemsToProcess = text.split('\n')
            .filter(line => line.trim().length > 30 && 
                           !line.match(/^(Sr\.|Sra\.|Excmo\.|Mons\.)/) && // Filtrar nombres
                           !line.match(/^\d+$/) && // Filtrar números solos
                           !line.match(/^[A-Z\s]+$/) && // Filtrar títulos en mayúsculas
                           line.match(/[a-záéíóúñ]/i)) // Debe contener letras
            .slice(0, 10000); // Limitar a 10000 líneas para no sobrecargar
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📚 Diccionario detectado! Procesando ${itemsToProcess.length} bloques de texto...`
        }]);
      }
    } else {
      // Procesamiento normal por oraciones
      itemsToProcess = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    }
    
    // Procesar en lotes para archivos grandes
    const batchSize = 50; // Reducido para evitar rate limiting
    let progress = 0;
    let totalProcessed = 0;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 5;
    
    for (let i = 0; i < itemsToProcess.length; i += batchSize) {
      const batch = itemsToProcess.slice(i, i + batchSize);
      
      for (const item of batch) {
        const trimmedItem = item.trim();
        if (trimmedItem.length > 5) {
          try {
            // MEJORADO: Procesar localmente sin API durante entrenamiento masivo
            // Esto evita rate limiting y es más rápido
            const concepts = trimmedItem.toLowerCase()
              .split(/[\s,;:]+/)
              .filter(w => w.length > 3)
              .filter(w => !['para', 'como', 'donde', 'cuando', 'esto', 'esta', 'este'].includes(w));
            
            // Agregar conceptos directamente sin usar API
            concepts.forEach(concept => {
              setKnowledge(prev => {
                const exists = prev.some(k => k.concept === concept && k.context === trimmedItem.substring(0, 100));
                if (!exists && prev.length < 100000000) { // Límite aumentado a 100 millones de conceptos
                  return [...prev, {
                    concept,
                    context: trimmedItem.substring(0, 200),
                    timestamp: Date.now()
                  }];
                }
                return prev;
              });
            });
            
            // Aprender sentido común
            learnCommonSense(trimmedItem);
            
            // Pequeño delay para no sobrecargar React
            await new Promise(resolve => setTimeout(resolve, 10));
            totalProcessed++;
            consecutiveErrors = 0;
          } catch (error) {
            consecutiveErrors++;
            if (consecutiveErrors >= maxConsecutiveErrors) {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ Demasiados errores consecutivos (${consecutiveErrors}). Continuando con procesamiento local...`
              }]);
              consecutiveErrors = 0;
            }
          }
        }
      }
      
      progress = ((i + batch.length) / itemsToProcess.length) * 100;
      setTrainingProgress(Math.min(progress, 100));
      
      // Actualizar mensaje de progreso cada 200 items
      if (totalProcessed % 200 === 0 || totalProcessed === batch.length) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content.includes('Procesando')) {
            return prev.slice(0, -1);
          }
          return prev;
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📚 Procesando... ${totalProcessed}/${itemsToProcess.length} (${Math.round(progress)}%)`
        }]);
      }
    }

    return totalProcessed;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar tamaño del archivo (limitar a 50MB para evitar problemas de memoria)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ El archivo es muy grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Por favor, usa un archivo menor a 50MB.`
      }]);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const isDictionary = file.name.toLowerCase().includes('diccionario') || 
                           text.toLowerCase().includes('real academia');
      
      setTrainingText(text);
      setShowTrainingPanel(true);
      
      const fileInfo = isDictionary 
        ? `📚 Diccionario "${file.name}" cargado (${fileSizeMB}MB). Detectado como diccionario de la RAE. ¡Listo para entrenar! 🧠`
        : `📄 Archivo "${file.name}" cargado (${fileSizeMB}MB). Listo para entrenar! 🧠`;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fileInfo
      }]);
    };
    
    reader.onerror = () => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error al leer el archivo. Por favor, intenta de nuevo.'
      }]);
    };
    
    reader.readAsText(file, 'UTF-8');
  };

  const startMassiveTraining = async () => {
    if (!trainingText.trim()) return;

    setTrainingProgress(0);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🚀 Iniciando entrenamiento masivo... Esto puede tardar varios minutos para archivos grandes. ⏳'
    }]);
    
    const count = await trainWithText(trainingText);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ ¡Entrenamiento completado! 

📊 Estadísticas:
• ${count} entradas/oraciones procesadas
• ${knowledge.length} conceptos totales en memoria
• ${commonSenseRules.length} reglas de sentido común
• Razonamiento: ${reasoningLevel}%
• Tasa de aprendizaje: ${learningRate}%

🎓 Tu IA ahora tiene acceso al conocimiento del diccionario!`
    }]);

    setTrainingText('');
    setTrainingProgress(0);
    setShowTrainingPanel(false);
  };

  const exportBrain = () => {
    const brainData = {
      personality,
      knowledge,
      webKnowledge,
      commonSenseRules,
      memorySize,
      learningRate,
      reasoningLevel,
      stats: {
        totalConcepts: knowledge.length + webKnowledge.length,
        webConcepts: webKnowledge.length,
        conversationConcepts: knowledge.length
      }
    };

    const dataStr = JSON.stringify(brainData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personality.name}_trained_brain.json`;
    link.click();

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🧠 Cerebro exportado:\n📊 ${knowledge.length + webKnowledge.length} conceptos totales\n🌐 ${webKnowledge.length} aprendidos de internet\n💬 ${knowledge.length} de conversaciones\n🧠 ${commonSenseRules.length} reglas de sentido común`
    }]);
  };

  const importBrain = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Hacer backup ANTES de importar (por si acaso)
          backupBeforeChange();
          
          const brainData = JSON.parse(event.target.result);
          
          // Restaurar todos los datos del backup
          setKnowledge(brainData.knowledge || []);
          setWebKnowledge(brainData.webKnowledge || []);
          setCommonSenseRules(brainData.commonSenseRules || initialCommonSense);
          setMemorySize(brainData.memorySize || (brainData.knowledge?.length || 0) + (brainData.webKnowledge?.length || 0));
          setLearningRate(brainData.learningRate || Math.min((brainData.knowledge?.length || 0) / 100, 100));
          setReasoningLevel(brainData.reasoningLevel || Math.min((brainData.knowledge?.length || 0) / 136, 100));
          
          // Restaurar personalidad (corrigiendo nombres antiguos)
          const restoredPersonality = brainData.personality || personality;
          if (restoredPersonality.name === 'NeuroAI' || restoredPersonality.name === 'Usuario' || !restoredPersonality.name) {
            restoredPersonality.name = 'Luxio';
          }
          if (restoredPersonality.creator === 'Usuario' || !restoredPersonality.creator) {
            restoredPersonality.creator = 'Lucio Tapia';
          }
          setPersonality(restoredPersonality);
          
          // Restaurar autocontrol si existe
          if (brainData.selfControl) {
            setSelfControl(brainData.selfControl);
          }
          
          // Restaurar URLs exploradas si existen
          if (brainData.exploredUrls) {
            setExploredUrls(brainData.exploredUrls);
          }
          if (brainData.totalPagesExplored) {
            setTotalPagesExplored(brainData.totalPagesExplored);
          }
          
          // IMPORTANTE: Marcar que los datos se cargaron para permitir guardados futuros
          dataLoadedRef.current = true;
          
          // Guardar en localStorage
          saveToStorage();
          
          const totalConcepts = (brainData.knowledge?.length || 0) + (brainData.webKnowledge?.length || 0);
          const finalReasoning = brainData.reasoningLevel || Math.min(totalConcepts / 136, 100);
          
          // Verificar si hay API keys configuradas para imágenes
          const hasImageAPI = HUGGINGFACE_API_KEY || STABILITY_API_KEY;
          const imageInfo = hasImageAPI 
            ? '' 
            : '\n\n🎨 **Para generar imágenes, necesitas configurar una API key gratuita.**\n\n**Opciones GRATUITAS:**\n\n1. **Hugging Face (Recomendado - 100% Gratis):**\n• Ve a https://huggingface.co/settings/tokens\n• Crea un token de acceso (gratis)\n• Agrega en .env: REACT_APP_HUGGINGFACE_API_KEY=tu_token\n• Puede tardar 10-30 segundos la primera vez\n\n2. **Stability AI (Gratis con límites):**\n• Ve a https://platform.stability.ai/\n• Crea cuenta gratis (tiene créditos gratuitos)\n• Obtén API key\n• Agrega en .env: REACT_APP_STABILITY_API_KEY=tu_key\n• Mejor calidad y más rápido\n\n**Cómo agregar la API key:**\n1. Crea o edita el archivo: frontend/.env\n2. Agrega la línea: REACT_APP_HUGGINGFACE_API_KEY=tu_token_aqui\n3. Reinicia la aplicación (npm start)\n\nUna vez configurada, podré generar imágenes desde texto. 🖼️✨';
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ ¡Backup restaurado exitosamente!\n\n📊 Datos recuperados:\n• ${brainData.knowledge?.length || 0} conceptos de conversaciones\n• ${brainData.webKnowledge?.length || 0} conceptos de internet\n• ${brainData.commonSenseRules?.length || 6} reglas de sentido común\n• Razonamiento: ${Math.round(finalReasoning)}%\n• Tasa de aprendizaje: ${Math.round(brainData.learningRate || 0)}%\n\n🧠 ¡He recuperado todo mi conocimiento anterior!${imageInfo}`
          }]);
        } catch (error) {
          console.error('Error al importar backup:', error);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '❌ Error al importar el backup. Por favor, verifica que el archivo sea un JSON válido.'
          }]);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearMemory = async () => {
    // Hacer backup antes de limpiar
    backupBeforeChange();
    
    setKnowledge([]);
    setWebKnowledge([]);
    setExploredUrls([]);
    setTotalPagesExplored(0);
    setWebURLs([]);
    setMemorySize(0);
    setLearningRate(0);
    setReasoningLevel(0);
    setCommonSenseRules(initialCommonSense);
    await saveToStorage();

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🧹 Memoria limpiada completamente. Todo mi conocimiento web y conversacional ha sido borrado. Puedo empezar a entrenarme de nuevo.\n\n💾 **Nota**: Se creó un backup automático antes de limpiar. Puedes restaurarlo usando "Importar Backup" si lo necesitas.'
    }]);
  };

  // Función mejorada para buscar en el conocimiento almacenado
  const searchKnowledge = (query) => {
    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    // Si la consulta es una sola palabra, buscar coincidencias exactas primero
    const isSingleWord = queryWords.length === 1;
    
    // Combinar knowledge y webKnowledge para buscar en ambos
    const allKnowledge = [
      ...knowledge.map(k => ({ ...k, source: 'conversation', searchText: `${k.concept} ${k.context || ''}` })),
      ...webKnowledge.map(k => ({ 
        ...k, 
        source: 'web', 
        context: k.summary || k.topic || '',
        searchText: `${k.concept} ${k.summary || ''} ${k.topic || ''} ${k.url || ''}`
      }))
    ];
    
    // Buscar conceptos que coincidan
    const matches = allKnowledge.filter(k => {
      const conceptLower = (k.concept || '').toLowerCase();
      const contextLower = (k.context || '').toLowerCase();
      const searchText = (k.searchText || '').toLowerCase();
      
      // Coincidencia exacta (mayor prioridad)
      if (isSingleWord && conceptLower === queryLower) {
        return true;
      }
      
      // Coincidencia parcial en concepto
      if (queryWords.some(word => conceptLower.includes(word) || word.includes(conceptLower))) {
        return true;
      }
      
      // Coincidencia en contexto, resumen o tema
      if (contextLower.includes(queryLower) || queryWords.some(word => contextLower.includes(word))) {
        return true;
      }
      
      // Coincidencia en todo el texto de búsqueda
      if (queryWords.some(word => searchText.includes(word))) {
        return true;
      }
      
      return false;
    });
    
    // Ordenar por relevancia: conocimiento web primero (más reciente), luego coincidencias exactas
    matches.sort((a, b) => {
      const aConcept = (a.concept || '').toLowerCase();
      const bConcept = (b.concept || '').toLowerCase();
      const aExact = aConcept === queryLower ? 1 : 0;
      const bExact = bConcept === queryLower ? 1 : 0;
      
      // Priorizar conocimiento web (más reciente y relevante)
      if (a.source === 'web' && b.source !== 'web') return -1;
      if (b.source === 'web' && a.source !== 'web') return 1;
      
      // Luego coincidencias exactas
      if (aExact !== bExact) return bExact - aExact;
      
      // Finalmente por longitud de contexto/resumen
      return (b.context || b.summary || '').length - (a.context || a.summary || '').length;
    });
    
    return matches.slice(0, 15); // Devolver hasta 15 coincidencias
  };

  // Detectar el tipo de pregunta
  const detectQuestionType = (input) => {
    if (input.match(/^(qué|que|qué es|que es|define|definición|significa|significado)/i)) {
      return 'definition';
    }
    if (input.match(/^(cómo|como|por qué|porque|porque|por qué)/i)) {
      return 'explanation';
    }
    if (input.match(/^(cuándo|cuando|dónde|donde|quién|quien)/i)) {
      return 'factual';
    }
    if (input.match(/\?$/)) {
      return 'question';
    }
    return 'general';
  };

  // Generar razonamiento inteligente
  const generateSmartReasoning = (userInput, concepts, questionType, knowledgeMatches) => {
    if (questionType === 'definition' && concepts.length > 0) {
      const word = concepts[0];
      if (knowledgeMatches.length === 0) {
        return `Estoy buscando la definición de "${word}" en mi conocimiento.

🔍 **Búsqueda realizada:**
He revisado mis ${knowledge.length} conceptos almacenados, pero no encontré una definición exacta para "${word}".

💡 **Opciones:**
1. La palabra podría estar escrita de manera diferente
2. Podría no estar en el diccionario que entrené
3. Podrías intentar con una palabra relacionada

**¿Quieres que busque palabras similares o relacionadas?**`;
      }
    }
    
    if (questionType === 'explanation') {
      return `Estoy analizando tu pregunta para darte una explicación detallada.

🧠 **Proceso de razonamiento:**
1. Identifiqué que buscas una explicación
2. Estoy relacionando conceptos en mi memoria
3. Estructurando una respuesta clara y útil

💡 Basándome en mi conocimiento, puedo ayudarte con una explicación completa.`;
    }
    
    return null;
  };

  // Generar imagen desde texto usando API gratuita
  const generateImage = async (prompt) => {
    if (!prompt || prompt.trim().length < 3) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Por favor, proporciona una descripción más detallada de la imagen que quieres generar.'
      }]);
      return null;
    }

    // Verificar API keys al inicio y mostrar en consola para debugging
    const hasHuggingFaceKey = HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.trim().length > 0;
    const hasStabilityKey = STABILITY_API_KEY && STABILITY_API_KEY.trim().length > 0;
    
    // Solo log si realmente hay un problema o si se está generando una imagen
    // (reducir spam en consola)
    
    // Si la API key está configurada pero vacía, mostrar mensaje específico
    if (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.trim().length === 0) {
      setGeneratingImage(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **API key de Hugging Face está vacía**\n\nEl archivo .env tiene la línea pero no tiene el token.\n\n**SOLUCIÓN RÁPIDA:**\n\n1. Ve a: https://huggingface.co/settings/tokens\n2. Crea un token nuevo (empieza con "hf_")\n3. Abre el archivo: C:\\Users\\Luxio\\Desktop\\ia luxio\\frontend\\.env\n4. Cambia esta línea:\n   \`REACT_APP_HUGGINGFACE_API_KEY=\`\n   Por esta (con tu token):\n   \`REACT_APP_HUGGINGFACE_API_KEY=hf_tu_token_aqui\`\n5. Guarda el archivo\n6. Reinicia: npm start\n\n✅ Después de esto, podré dibujar sin problemas.`
      }]);
      return null;
    }

    setGeneratingImage(true);
    
    // Detectar si es una solicitud de dibujo
    const isDibujo = prompt.toLowerCase().includes('dibuja') || 
                     prompt.toLowerCase().includes('dibujo') || 
                     prompt.toLowerCase().includes('sketch') ||
                     prompt.toLowerCase().includes('boceto') ||
                     prompt.toLowerCase().includes('draw');
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: isDibujo 
        ? `✏️ **Dibujando:** "${prompt.replace(/dibuja|dibujo/gi, '').trim()}"\n\n⏳ Creando tu dibujo... Esto puede tomar 10-30 segundos...`
        : `🎨 Generando imagen: "${prompt}"\n\n⏳ Esto puede tomar 10-30 segundos...`
    }]);

    try {
      let imageUrl = null;
      let errorMessage = '';

      // PRIORIDAD 1: Hugging Face con API key (MÁS SENCILLO Y FUNCIONAL)
      // Esta es la opción más fácil: solo necesitas un token gratis de 2 minutos
      if (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.trim().length > 0) {
        console.log('✅ Usando Hugging Face API key para generar imagen');
        console.log('✅ API key de Hugging Face detectada, generando imagen...');
        
        const isDibujo = prompt.toLowerCase().includes('dibuja') || 
                         prompt.toLowerCase().includes('dibujo') || 
                         prompt.toLowerCase().includes('sketch') ||
                         prompt.toLowerCase().includes('boceto');
        
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: isDibujo
                ? `✏️ **Dibujando con Hugging Face** (API key configurada ✓)\n\n⏳ Creando tu dibujo: "${prompt.replace(/dibuja|dibujo/gi, '').trim()}"\n\nEsto puede tomar 10-30 segundos...`
                : `🎨 **Generando con Hugging Face** (API key configurada ✓)\n\n⏳ Procesando: "${prompt}"\n\nEsto puede tomar 10-30 segundos...`
            };
          }
          return updated;
        });
        // Lista de modelos a probar en orden de preferencia
        const models = [
          "black-forest-labs/FLUX.1-dev", // Modelo más moderno y de mejor calidad
          "stabilityai/stable-diffusion-xl-base-1.0", // SDXL de alta calidad
          "runwayml/stable-diffusion-v1-5", // Modelo más rápido y estable
          "CompVis/stable-diffusion-v1-4" // Fallback
        ];

        for (const model of models) {
          try {
            // Crear un AbortController para timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout
            
            // Usar la API de inference de Hugging Face
            const response = await fetch(
              `https://api-inference.huggingface.co/models/${model}`,
              {
                headers: {
                  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                  "Content-Type": "application/json",
                },
                method: "POST",
                signal: controller.signal,
                body: JSON.stringify({ 
                  inputs: prompt,
                  parameters: model.includes('FLUX') ? {
                    num_inference_steps: 28, // FLUX usa 28 pasos
                    guidance_scale: 3.5, // FLUX usa guidance más bajo
                    width: 1024,
                    height: 1024
                  } : {
                    num_inference_steps: 30,
                    guidance_scale: 7.5
                  }
                }),
              }
            );
            
            clearTimeout(timeoutId);

            if (response.ok) {
              const blob = await response.blob();
              
              // Verificar que sea una imagen válida
              if (blob.type.startsWith('image/')) {
                imageUrl = URL.createObjectURL(blob);
                console.log(`✅ Imagen generada exitosamente con modelo: ${model}`);
                break; // Salir del loop si funcionó
              } else {
                // Si no es imagen, puede ser JSON con error
                const text = await blob.text();
                try {
                  const json = JSON.parse(text);
                  if (json.error) {
                    console.warn(`⚠️ Modelo ${model} error:`, json.error);
                    if (json.error.includes('loading') || json.error.includes('cargando') || json.error.includes('model is currently loading')) {
                      // Modelo cargando, esperar y continuar
                      console.log(`⏳ Modelo ${model} está cargando, probando siguiente modelo...`);
                      await new Promise(resolve => setTimeout(resolve, 5000));
                      continue;
                    }
                  }
                } catch (e) {
                  // No es JSON, continuar
                }
              }
            } else if (response.status === 503) {
              // Modelo cargando, intentar siguiente
              console.log(`⏳ Modelo ${model} está cargando (503), probando siguiente modelo...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
              continue;
            } else if (response.status === 401) {
              errorMessage = 'API key inválida o sin permisos para Hugging Face';
              console.error('❌ Error de autenticación con Hugging Face');
              break; // No tiene sentido seguir intentando
            } else {
              console.warn(`⚠️ Modelo ${model} error: ${response.status}`);
              continue; // Intentar siguiente modelo
            }
            } catch (err) {
              // Manejar errores de timeout, CORS y otros errores de red
              if (err.name === 'AbortError') {
                console.warn(`⏱️ Timeout con modelo ${model} (60s), probando siguiente modelo...`);
                continue; // Intentar siguiente modelo
              } else if (err.message && (err.message.includes('CORS') || err.message.includes('Failed to fetch') || err.name === 'TypeError')) {
                console.warn(`⚠️ Error de CORS o red con modelo ${model}:`, err.message);
                errorMessage = 'Error de conexión (CORS). Se requiere API key válida.';
                break; // No tiene sentido seguir intentando si es CORS
              } else {
                console.error(`Error con modelo ${model}:`, err);
                continue; // Intentar siguiente modelo solo si no es CORS
              }
            }
        }

        if (!imageUrl && !errorMessage) {
          errorMessage = 'Todos los modelos de Hugging Face están cargando o no disponibles. Intenta de nuevo en unos minutos.';
        }
      }

      // PRIORIDAD 2: Stability AI (si está configurado)
      if (!imageUrl && STABILITY_API_KEY) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout
          
          const response = await fetch(
            "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${STABILITY_API_KEY}`,
              },
              signal: controller.signal,
              body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1,
              }),
            }
          );
          
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.artifacts && data.artifacts[0]) {
              const base64Image = data.artifacts[0].base64;
              imageUrl = `data:image/png;base64,${base64Image}`;
            }
          } else {
            errorMessage = `Stability AI: ${response.status}`;
          }
        } catch (err) {
          if (err.name === 'AbortError') {
            errorMessage = 'Timeout al generar imagen (60s). Intenta de nuevo.';
          } else {
            console.error('Error con Stability AI:', err);
            errorMessage = 'Stability AI no disponible';
          }
        }
      }

      // PRIORIDAD 3: NO intentar servicios públicos sin API key (CORS los bloquea)
      // Hugging Face requiere API key para evitar problemas de CORS
      const hasAnyAPIKey = (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.trim().length > 0) || 
                          (STABILITY_API_KEY && STABILITY_API_KEY.trim().length > 0);
      if (!imageUrl && !hasAnyAPIKey) {
        // Silencioso: solo establecer errorMessage, no log
        errorMessage = 'Se requiere API key para generar imágenes (los servicios públicos sin API key son bloqueados por CORS).';
      }

      // PRIORIDAD 3: ComfyUI Local (si está corriendo - opcional)
      if (!imageUrl) {
        try {
          const healthCheck = await fetch('http://127.0.0.1:8188/system_stats', {
            method: 'GET',
            signal: AbortSignal.timeout(2000)
          });
          if (healthCheck.ok) {
            console.log('🖥️ ComfyUI detectado, pero requiere configuración de workflow');
            // ComfyUI requiere workflow específico, por ahora lo omitimos para simplicidad
          }
        } catch (e) {
          // ComfyUI no disponible, continuar
        }
      }

      // PRIORIDAD 4: Eliminada - Los servicios públicos sin API key son bloqueados por CORS

      // Si se generó la imagen exitosamente
      if (imageUrl) {
        const newImage = {
          id: Date.now(),
          prompt,
          url: imageUrl,
          timestamp: Date.now()
        };
        
        setGeneratedImages(prev => [...prev, newImage]);
        
        // Actualizar el último mensaje con la imagen
        const isDibujo = prompt.toLowerCase().includes('dibuja') || 
                         prompt.toLowerCase().includes('dibujo') || 
                         prompt.toLowerCase().includes('sketch') ||
                         prompt.toLowerCase().includes('boceto') ||
                         prompt.toLowerCase().includes('draw');
        
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: isDibujo
                ? `✏️ **¡Dibujo completado!**\n\n**Tema:** "${prompt.replace(/dibuja|dibujo/gi, '').trim()}"\n\n📊 Total dibujos generados: ${generatedImages.length + 1}`
                : `🎨 **¡Imagen generada exitosamente!**\n\n**Prompt:** "${prompt}"\n\n📊 Total imágenes generadas: ${generatedImages.length + 1}`,
              image: imageUrl // Agregar la imagen al mensaje
            };
          }
          return updated;
        });
        
        setGeneratingImage(false);
        return imageUrl;
      } else {
        // No se generó la imagen - verificar si hay API keys configuradas
        const hasAPIKey = (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.trim().length > 0) || 
                         (STABILITY_API_KEY && STABILITY_API_KEY.trim().length > 0);
        
        // Solo log si realmente hay un error técnico (no solo falta de API key)
        if (errorMessage && !errorMessage.includes('requiere API key')) {
          console.warn('⚠️ Error generando imagen:', errorMessage);
        }
        
        // Si no hay API key, no mostrar mensaje molesto - simplemente no hacer nada
        // El usuario ya sabe que necesita API key si intenta generar imágenes
        if (errorMessage && errorMessage.includes('requiere API key')) {
          // Silenciosamente no mostrar mensaje - el usuario puede configurar API key si quiere
          setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
              // Eliminar el mensaje de "generando..." sin mostrar error
              updated.pop();
            }
            return updated;
          });
          setGeneratingImage(false);
          return null;
        }
        
        // Solo mostrar mensaje si hay un error real (no solo falta de API key)
        let finalErrorMessage = errorMessage || 'No se pudo generar la imagen en este momento.';
        
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: `❌ ${finalErrorMessage}\n\n💡 Intenta de nuevo en unos minutos.`
            };
          }
          return updated;
        });
        setGeneratingImage(false);
        return null;
      }
    } catch (error) {
      console.error('Error generando imagen:', error);
      setGeneratingImage(false);
      
      // Si no hay API key, no mostrar mensaje
      if (error.message && error.message.includes('requiere API key')) {
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
            updated.pop(); // Eliminar mensaje de "generando..."
          }
          return updated;
        });
        return null;
      }
      
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: `❌ Error al generar la imagen: ${error.message || 'Error desconocido'}\n\n💡 Intenta de nuevo en unos minutos.`
          };
        }
        return updated;
      });
      return null;
    } finally {
      // Asegurar que siempre se desactive el estado de generación
      setGeneratingImage(false);
    }
  };

  // Detectar si el usuario quiere generar una imagen o dibujo
  const detectImageRequest = (input) => {
    const lowerInput = input.toLowerCase();
    const imageKeywords = [
      'genera imagen', 'crea imagen', 'dibuja', 'imagen de', 'picture of', 'generate image',
      'crear imagen', 'haz una imagen', 'muéstrame una imagen', 'dame una imagen',
      'pintar', 'diseñar imagen', 'imagen sobre', 'foto de', 'ilustración', 'ilustra',
      'diseña', 'hazme una imagen', 'quiero una imagen', 'necesito una imagen',
      'muestra una imagen', 'crea una imagen de', 'genera una imagen de',
      'haz un dibujo', 'dibuja un', 'dibuja una', 'pinta un', 'pinta una', 
      'ilustra un', 'ilustra una', 'dibujo de', 'dibujo', 'sketch', 'draw', 
      'drawing', 'boceto', 'esbozo', 'haz un sketch', 'haz un boceto', 
      'dibuja algo', 'dibújame', 'dibújalo'
    ];
    return imageKeywords.some(keyword => lowerInput.includes(keyword));
  };

  // Extraer prompt de imagen del texto y optimizarlo para dibujo
  const extractImagePrompt = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Remover comandos comunes de forma más exhaustiva
    let prompt = input
      .replace(/genera imagen de|crea imagen de|dibuja|imagen de|picture of|generate image of|crear imagen de|haz una imagen de|muéstrame una imagen de|dame una imagen de|pintar|diseñar imagen de|imagen sobre|foto de|ilustración de|ilustra|diseña|hazme una imagen|quiero una imagen|necesito una imagen|muestra una imagen|crea una imagen de|genera una imagen de|haz un dibujo|dibuja un|dibuja una|pinta un|pinta una|ilustra un|ilustra una|haz una|crea una|genera una|dibujo de|dibujo|sketch|draw|drawing|boceto|esbozo|haz un sketch|haz un boceto|dibuja algo|dibújame|dibújalo/gi, '')
      .trim();
    
    // Limpiar espacios múltiples
    prompt = prompt.replace(/\s+/g, ' ').trim();
    
    // Si el prompt está vacío o muy corto, usar el input completo pero limpiado
    if (!prompt || prompt.length < 3) {
      prompt = input.trim();
    }
    
    // Si el prompt contiene palabras relacionadas con dibujo, asegurar estilo de dibujo
    const dibujoKeywords = ['dibuja', 'dibujo', 'sketch', 'boceto', 'esbozo', 'ilustra', 'pinta', 'draw'];
    const isDibujoRequest = dibujoKeywords.some(keyword => lowerInput.includes(keyword));
    
    // Si es una solicitud de dibujo, agregar estilos de dibujo al prompt
    if (isDibujoRequest && !prompt.toLowerCase().includes('dibujo') && !prompt.toLowerCase().includes('sketch') && !prompt.toLowerCase().includes('drawing') && !prompt.toLowerCase().includes('artístico')) {
      // Agregar estilos de dibujo al prompt para mejor resultado
      prompt = `${prompt}, dibujo artístico, estilo ilustración, líneas definidas, arte digital`;
    }
    
    // Si el prompt es muy largo, tomar solo las primeras 200 palabras
    const words = prompt.split(' ');
    if (words.length > 200) {
      prompt = words.slice(0, 200).join(' ');
    }
    
    return prompt;
  };

  // Detectar si el usuario quiere código o programación
  const detectProgrammingRequest = (input) => {
    const lowerInput = input.toLowerCase();
    const programmingKeywords = [
      'código', 'code', 'programa', 'programar', 'función', 'function', 'variable',
      'array', 'objeto', 'clase', 'class', 'javascript', 'html', 'css', 'python',
      'java', 'crear', 'hacer', 'escribe', 'muéstrame', 'ejemplo', 'ejemplo de código',
      'genera', 'escribir código', 'cómo hacer', 'como hacer', 'implementa', 'implementar'
    ];
    return programmingKeywords.some(keyword => lowerInput.includes(keyword));
  };

  // Generar código según la solicitud
  const generateCode = (userInput, concepts) => {
    const lowerInput = userInput.toLowerCase();
    let code = '';
    let language = 'javascript';
    let explanation = '';

    // Detectar lenguaje solicitado
    if (lowerInput.includes('python')) language = 'python';
    else if (lowerInput.includes('html')) language = 'html';
    else if (lowerInput.includes('css')) language = 'css';
    else if (lowerInput.includes('java') && !lowerInput.includes('javascript')) language = 'java';

    // Buscar conocimiento relevante sobre programación
    const programmingKnowledge = searchKnowledge(userInput).filter(k => 
      k.concept && (
        k.concept.includes('función') || k.concept.includes('variable') || 
        k.concept.includes('array') || k.concept.includes('objeto') ||
        k.concept.includes('clase') || k.concept.includes('programación') ||
        k.context?.toLowerCase().includes('código') || k.context?.toLowerCase().includes('programar')
      )
    );

    // Generar código según la solicitud
    if (lowerInput.includes('función') || lowerInput.includes('function')) {
      if (language === 'javascript') {
        code = `function ${concepts[0] || 'miFuncion'}(parametro) {\n  // Tu código aquí\n  return resultado;\n}`;
        explanation = 'Esta es una función básica en JavaScript. Puedes agregar lógica dentro de las llaves.';
      } else if (language === 'python') {
        code = `def ${concepts[0] || 'mi_funcion'}(parametro):\n    # Tu código aquí\n    return resultado`;
        explanation = 'Esta es una función básica en Python. Nota la indentación con espacios.';
      }
    } else if (lowerInput.includes('variable') || lowerInput.includes('declarar')) {
      if (language === 'javascript') {
        code = `let ${concepts[0] || 'miVariable'} = valor;\nconst ${concepts[0] || 'constante'} = valor;`;
        explanation = 'Usa "let" para variables que pueden cambiar y "const" para constantes.';
      } else if (language === 'python') {
        code = `${concepts[0] || 'mi_variable'} = valor`;
        explanation = 'En Python no necesitas declarar el tipo, se infiere automáticamente.';
      }
    } else if (lowerInput.includes('array') || lowerInput.includes('lista')) {
      if (language === 'javascript') {
        code = `const miArray = [1, 2, 3, "texto", true];\n\n// Acceder a elementos\nmiArray[0]; // Primer elemento\n\n// Agregar elemento\nmiArray.push(4);\n\n// Recorrer array\nmiArray.forEach(item => {\n  console.log(item);\n});`;
        explanation = 'Los arrays en JavaScript pueden contener diferentes tipos de datos.';
      } else if (language === 'python') {
        code = `mi_lista = [1, 2, 3, "texto", True]\n\n# Acceder a elementos\nmi_lista[0]  # Primer elemento\n\n# Agregar elemento\nmi_lista.append(4)\n\n# Recorrer lista\nfor item in mi_lista:\n    print(item)`;
        explanation = 'Las listas en Python son similares a los arrays en JavaScript.';
      }
    } else if (lowerInput.includes('objeto') || lowerInput.includes('object')) {
      if (language === 'javascript') {
        code = `const miObjeto = {\n  propiedad1: "valor1",\n  propiedad2: 123,\n  metodo: function() {\n    return "Hola";\n  }\n};\n\n// Acceder a propiedades\nmiObjeto.propiedad1;\nmiObjeto["propiedad1"];`;
        explanation = 'Los objetos almacenan datos en pares clave-valor.';
      } else if (language === 'python') {
        code = `mi_objeto = {\n    "propiedad1": "valor1",\n    "propiedad2": 123\n}\n\n# Acceder a propiedades\nmi_objeto["propiedad1"]\nmi_objeto.get("propiedad1")`;
        explanation = 'En Python se llaman diccionarios y usan llaves.';
      }
    } else if (lowerInput.includes('clase') || lowerInput.includes('class')) {
      if (language === 'javascript') {
        code = `class ${concepts[0] || 'MiClase'} {\n  constructor(parametro) {\n    this.propiedad = parametro;\n  }\n  \n  metodo() {\n    return this.propiedad;\n  }\n}\n\n// Crear instancia\nconst instancia = new ${concepts[0] || 'MiClase'}("valor");`;
        explanation = 'Las clases son plantillas para crear objetos con propiedades y métodos.';
      } else if (language === 'python') {
        code = `class ${concepts[0] || 'MiClase'}:\n    def __init__(self, parametro):\n        self.propiedad = parametro\n    \n    def metodo(self):\n        return self.propiedad\n\n# Crear instancia\ninstancia = ${concepts[0] || 'MiClase'}("valor")`;
        explanation = 'En Python, __init__ es el constructor y "self" se usa para referirse a la instancia.';
      }
    } else if (lowerInput.includes('bucle') || lowerInput.includes('loop') || lowerInput.includes('for') || lowerInput.includes('while')) {
      if (language === 'javascript') {
        code = `// Bucle for\nfor (let i = 0; i < 10; i++) {\n  console.log(i);\n}\n\n// Bucle while\nlet i = 0;\nwhile (i < 10) {\n  console.log(i);\n  i++;\n}\n\n// Bucle for...of (para arrays)\nconst array = [1, 2, 3];\nfor (const item of array) {\n  console.log(item);\n}`;
        explanation = 'Los bucles permiten repetir código. "for" cuando sabes cuántas veces, "while" cuando depende de una condición.';
      } else if (language === 'python') {
        code = `# Bucle for\nfor i in range(10):\n    print(i)\n\n# Bucle while\ni = 0\nwhile i < 10:\n    print(i)\n    i += 1\n\n# Bucle for...in (para listas)\nlista = [1, 2, 3]\nfor item in lista:\n    print(item)`;
        explanation = 'En Python, range() genera números y la indentación es crucial.';
      }
    } else if (lowerInput.includes('condicional') || lowerInput.includes('if') || lowerInput.includes('else')) {
      if (language === 'javascript') {
        code = `if (condicion) {\n  // Código si es verdadero\n} else if (otraCondicion) {\n  // Código si otra condición es verdadera\n} else {\n  // Código si ninguna es verdadera\n}`;
        explanation = 'Los condicionales permiten ejecutar código diferente según condiciones.';
      } else if (language === 'python') {
        code = `if condicion:\n    # Código si es verdadero\n    pass\nelif otra_condicion:\n    # Código si otra condición es verdadera\n    pass\nelse:\n    # Código si ninguna es verdadera\n    pass`;
        explanation = 'En Python se usa "elif" en lugar de "else if" y la indentación define los bloques.';
      }
    } else {
      // Código genérico
      if (language === 'javascript') {
        code = `// Ejemplo básico de código JavaScript\n\n// Declarar variable\nlet mensaje = "Hola mundo";\n\n// Función simple\nfunction saludar(nombre) {\n  return "Hola, " + nombre;\n}\n\n// Llamar función\nconsole.log(saludar("Luxio"));`;
        explanation = 'Este es un ejemplo básico de JavaScript con variable y función.';
      } else if (language === 'python') {
        code = `# Ejemplo básico de código Python\n\n# Declarar variable\nmensaje = "Hola mundo"\n\n# Función simple\ndef saludar(nombre):\n    return "Hola, " + nombre\n\n# Llamar función\nprint(saludar("Luxio"))`;
        explanation = 'Este es un ejemplo básico de Python. Nota que no hay punto y coma y la indentación es importante.';
      }
    }

    // Agregar explicación del conocimiento aprendido si existe
    if (programmingKnowledge.length > 0) {
      explanation += '\n\n📚 **Basado en mi conocimiento aprendido:**\n';
      programmingKnowledge.slice(0, 3).forEach(k => {
        explanation += `- ${k.concept}: ${(k.summary || k.context || '').substring(0, 100)}\n`;
      });
    }

    return {
      code,
      language,
      explanation
    };
  };

  const generateResponse = (userInput, concepts, reasoning) => {
    const input = userInput.toLowerCase().trim();
    
    // Detectar si es solicitud de imagen
    if (detectImageRequest(input)) {
      const prompt = extractImagePrompt(userInput);
      // Generar imagen de forma asíncrona
      generateImage(prompt);
      return `🎨 Generando imagen para: "${prompt}"\n\n⏳ Por favor espera, esto puede tomar unos segundos...`;
    }
    
    // Detectar si es solicitud de programación
    if (detectProgrammingRequest(input)) {
      const codeResult = generateCode(userInput, concepts);
      return `💻 **Código ${codeResult.language.toUpperCase()}:**\n\n\`\`\`${codeResult.language}\n${codeResult.code}\n\`\`\`\n\n${codeResult.explanation}\n\n¿Necesitas ayuda con algo más específico del código?`;
    }

    let reasoningText = '';
    if (reasoning.length > 0) {
      reasoningText = '\n\n🧠 ' + reasoning.map(r => r.message).join('\n');
    }

    // Buscar en el conocimiento almacenado
    const knowledgeMatches = searchKnowledge(input);
    
    // Si encontramos conocimiento relevante, validarlo y usarlo
    if (knowledgeMatches.length > 0) {
      // Filtrar solo resultados realmente útiles
      const usefulMatches = knowledgeMatches.filter(match => {
        if (!match.context || match.context.length < 30) return false;
        
        // Si es formato diccionario, validar que esté completo
        if (match.context.includes(':')) {
          const parts = match.context.split(':');
          if (parts.length < 2) return false;
          const word = parts[0].trim();
          const definition = parts.slice(1).join(':').trim();
          
          // Validar que la palabra tenga sentido (no sea un fragmento)
          if (word.length < 2 || word.length > 50) return false;
          // Validar que la definición tenga sentido (mínimo 20 caracteres)
          if (definition.length < 20) return false;
          // Evitar fragmentos que empiezan con caracteres raros
          if (/^[^a-záéíóúñ]/i.test(definition)) return false;
          
          return true;
        }
        
        // Para otros contextos, validar que sean completos
        return match.context.length >= 30 && 
               !match.context.match(/^[^a-záéíóúñ]/i) && // No empezar con caracteres raros
               match.context.split(/\s+/).length >= 5; // Al menos 5 palabras
      });
      
      if (usefulMatches.length > 0) {
        const bestMatch = usefulMatches[0];
        
        if (bestMatch.context && bestMatch.context.includes(':')) {
          // Es una entrada de diccionario (formato: palabra: definición)
          const parts = bestMatch.context.split(':');
          if (parts.length >= 2) {
            const word = parts[0].trim();
            const definition = parts.slice(1).join(':').trim();
            
            // Validar que la definición sea útil
            if (word.length >= 2 && definition.length >= 20 && !definition.match(/^[^a-záéíóúñ]/i)) {
              return `📚 **${word}**

${definition}${reasoningText}`;
            }
          }
        }
        
        // Si no es formato diccionario pero tiene contexto útil
        if (bestMatch.context && bestMatch.context.length >= 30) {
          // Solo mostrar si no parece un fragmento
          if (!bestMatch.context.match(/^[^a-záéíóúñ]/i) && bestMatch.context.split(/\s+/).length >= 5) {
            return `${bestMatch.context}${reasoningText}`;
          }
        }
      }
    }

    // Respuestas específicas
    if (input.includes('sentido común')) {
      return `Mi sentido común:

🧠 ${commonSenseRules.length} reglas
💡 ${reasoningLevel}% razonamiento

Ejemplos:
• El fuego quema
• Necesitas dormir
• Causa-efecto${reasoningText}`;
    }

    if (input.includes('hola') || input === 'hola') {
      return `¡Hola! Soy ${personality.name}. Tengo ${knowledge.length} conceptos y ${commonSenseRules.length} reglas. Razonamiento: ${reasoningLevel}% 🧠${reasoningText}`;
    }

    if (input.includes('quien eres') || input.includes('quién eres')) {
      return `Soy ${personality.name} con sentido común.

🧠 ${knowledge.length} conceptos
💡 ${commonSenseRules.length} reglas
🎯 ${reasoningLevel}% razonamiento${reasoningText}`;
    }

    if (input.includes('que sabes') || input.includes('qué sabes')) {
      return `Estado: ${knowledge.length} conceptos, ${commonSenseRules.length} reglas, ${reasoningLevel}% razonamiento${reasoningText}`;
    }

    if (input.includes('entrena')) {
      setShowTrainingPanel(true);
      return `🎯 Panel abierto!${reasoningText}`;
    }

    // Respuestas para preguntas comunes
    if (input.includes('que haces') || input.includes('qué haces') || input === 'que haces' || input === 'qué haces') {
      return `Soy ${personality.name}, un asistente de IA con capacidad de razonamiento.

**¿Qué puedo hacer?**
- Responder tus preguntas usando mi conocimiento y razonamiento
- Buscar información en el diccionario RAE que he aprendido
- Ayudarte con explicaciones y análisis
- Mantener conversaciones útiles y constructivas

**Mi estado actual:**
- ${knowledge.length} conceptos en memoria
- ${commonSenseRules.length} reglas de sentido común
- ${reasoningLevel}% de capacidad de razonamiento

¿En qué puedo ayudarte?${reasoningText}`;
    }

    // Razonamiento inteligente basado en el tipo de pregunta
    const questionType = detectQuestionType(input);
    const smartResponse = generateSmartReasoning(userInput, concepts, questionType, knowledgeMatches);
    
    if (smartResponse) {
      return smartResponse + reasoningText;
    }

    // Si no hay conocimiento específico útil, dar una respuesta directa y útil
    if (concepts.length > 0) {
      const mainConcept = concepts[0];
      
      // Respuesta directa y útil sin información innecesaria
      return `Sobre "${mainConcept}":

He buscado en mi conocimiento pero no encontré información específica sobre este tema en este momento.

💡 **¿Cómo puedo ayudarte?**
- Puedo intentar responder usando mi razonamiento general
- Si tienes una pregunta específica, puedo analizarla
- Puedo ayudarte con otros temas sobre los que sí tengo información

¿Hay algo más específico que quieras saber?${reasoningText}`;
    }

    // Respuesta directa y útil para preguntas generales
    return `Entiendo tu pregunta.

He analizado lo que preguntaste y estoy listo para ayudarte.

💡 **Puedo ayudarte con:**
- Responder preguntas usando mi conocimiento y razonamiento
- Explicar conceptos
- Mantener una conversación útil

¿Qué te gustaría saber o en qué puedo ayudarte?${reasoningText}`;
  };

  // Sistema de Autocontrol - Auto-evaluación y auto-decisión
  const selfEvaluate = () => {
    const totalKnowledge = knowledge.length + webKnowledge.length;
    const awareness = Math.min(100, Math.floor((totalKnowledge / 1000) * 10 + (reasoningLevel / 10)));
    const confidence = Math.min(100, Math.floor((learningRate / 2) + (reasoningLevel / 2)));
    
    setSelfControl(prev => ({
      ...prev,
      selfAwareness: awareness,
      decisionConfidence: confidence,
      learningRate: Math.min(100, Math.floor(totalKnowledge / 100))
    }));
    
    return { awareness, confidence, totalKnowledge };
  };

  // Auto-decisión: La IA decide qué hacer basándose en su estado
  const makeAutoDecision = (userInput) => {
    if (!selfControl.enabled || !selfControl.autoDecision) return null;
    
    const evaluation = selfEvaluate();
    const lowerInput = userInput.toLowerCase();
    
    // Decidir si debe aprender automáticamente
    if (selfControl.autoLearning && evaluation.totalKnowledge < 5000) {
      if (lowerInput.includes('aprender') || lowerInput.includes('entrenar') || lowerInput.includes('estudiar')) {
        return { action: 'startAutoTraining', reason: 'Usuario solicita aprendizaje y tengo poco conocimiento' };
      }
    }
    
    // Decidir si debe buscar información en internet
    if (lowerInput.includes('qué es') || lowerInput.includes('qué son') || lowerInput.includes('información sobre')) {
      return { action: 'searchWeb', reason: 'Pregunta que requiere información actualizada' };
    }
    
    // Decidir si debe mejorar su conocimiento
    if (evaluation.awareness < 50 && !autoTrainingActive) {
      return { action: 'suggestLearning', reason: 'Mi nivel de conocimiento es bajo, debería aprender más' };
    }
    
    return null;
  };

  const processWithBrain = async (userInput, isMassive = false) => {
    // DETECTAR SI ES SOLICITUD DE IMAGEN - Generar automáticamente
    if (detectImageRequest(userInput)) {
      const prompt = extractImagePrompt(userInput);
      if (prompt && prompt.trim().length >= 3) {
        // Generar imagen automáticamente
        await generateImage(prompt.trim());
        // La función generateImage ya actualiza los mensajes, así que retornamos
        return `🎨 Generando imagen para: "${prompt.trim()}"...`;
      }
    }

    // Autocontrol: Auto-evaluación antes de procesar
    if (selfControl.enabled && selfControl.selfMonitoring) {
      selfEvaluate();
    }

    // Autocontrol: Auto-decisión
    const autoDecision = makeAutoDecision(userInput);
    if (autoDecision) {
      console.log('🎛️ AUTOCONTROL: Decisión automática:', autoDecision);
      
      if (autoDecision.action === 'startAutoTraining' && !autoTrainingActive) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🎛️ **Autocontrol activado**: He decidido iniciar mi aprendizaje automático para mejorar mi conocimiento. Iniciando entrenamiento...`
        }]);
        setTimeout(() => startAutoTraining(), 1000);
      } else if (autoDecision.action === 'suggestLearning') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🎛️ **Autocontrol**: He evaluado mi conocimiento y creo que debería aprender más. ¿Quieres que inicie el aprendizaje automático?`
        }]);
      }
    }

    if (!isMassive) {
      setNeuralActivity(100);
      setTimeout(() => setNeuralActivity(0), 2000);
    }

    const reasoning = applyCommonSense(userInput);

    const concepts = userInput.toLowerCase()
      .split(/[\s,;:]+/)
      .filter(w => w.length > 3)
      .filter(w => !['para', 'como', 'donde', 'cuando'].includes(w));
    
    const multiplier = trainingMode ? 2 : 1;
    // Si es una entrada de diccionario (formato: palabra: definición), guardarla completa
    const isDictionaryEntry = userInput.includes(':') && userInput.split(':').length >= 2;
    const newKnowledge = concepts.map(c => ({
      concept: c,
      timestamp: Date.now(),
      context: isDictionaryEntry ? userInput : userInput.substring(0, 200) // Guardar más contexto para entradas de diccionario
    }));
    
    setKnowledge(prev => [...prev, ...newKnowledge].slice(-100000000)); // Límite aumentado a 100 millones de conceptos
    setMemorySize(prev => prev + concepts.length * multiplier);
    setLearningRate(prev => Math.min(prev + (trainingMode ? 8 : 4), 100));

    if (reasoning.length > 0) {
      setReasoningLevel(prev => Math.min(prev + 2, 100));
    }

    // Usar API gratuita directamente si está disponible (más rápido y confiable)
    let response = '';
    let usedBackend = false;
    
    // Priorizar API gratuita si está disponible
    if (FREE_API_KEY) {
          try {
            let apiResponse;
            
            if (FREE_API_TYPE === 'groq') {
              const recentKnowledge = knowledge.slice(-10).map(k => `- ${k.concept}: ${k.context?.substring(0, 100)}`).join('\n');
              const recentWebKnowledge = webKnowledge.slice(-10).map(k => `- ${k.concept} (${k.topic}): ${k.summary?.substring(0, 150)}`).join('\n');
              
              // Buscar conocimiento relevante para esta pregunta
              const relevantKnowledge = searchKnowledge(userInput);
              const relevantInfo = relevantKnowledge.length > 0 
                ? `\n\nConocimiento RELEVANTE para esta pregunta:\n${relevantKnowledge.slice(0, 5).map(k => `- ${k.concept}: ${(k.summary || k.context || k.topic)?.substring(0, 150)}`).join('\n')}`
                : '';
              
              // Detectar si pregunta sobre lo que leyó
              const isAskingAboutReading = userInput.toLowerCase().includes('leíste') || 
                                         userInput.toLowerCase().includes('leiste') ||
                                         userInput.toLowerCase().includes('qué leíste') ||
                                         userInput.toLowerCase().includes('que leiste') ||
                                         userInput.toLowerCase().includes('que aprendiste') ||
                                         userInput.toLowerCase().includes('qué aprendiste');
              
              // Construir el contenido del sistema de forma más segura
              let systemContent = `Eres Luxio, una IA creada por Lucio Tapia. Eres amigable, inteligente y servicial. Responde de forma natural y conversacional.

Tienes ${knowledge.length} conceptos aprendidos de conversaciones y ${webKnowledge.length} conceptos aprendidos de páginas web que leíste.`;
              
              if (isAskingAboutReading && webKnowledge.length > 0) {
                const webKnowledgeSummary = webKnowledge.slice(-20).map(k => 
                  `- ${k.concept} (de ${k.url || k.topic}): ${(k.summary || k.context || '').substring(0, 100)}`
                ).join('\n');
                systemContent += `\n\nIMPORTANTE: El usuario pregunta sobre lo que leíste. Has leído ${webKnowledge.length} conceptos de páginas web. Aquí está tu conocimiento web:\n${webKnowledgeSummary}\n\nResponde mencionando específicamente qué páginas leíste y qué aprendiste de cada una.`;
              } else if (recentKnowledge || recentWebKnowledge) {
                systemContent += `\n\nConocimiento reciente:`;
                if (recentKnowledge) systemContent += `\n${recentKnowledge}`;
                if (recentWebKnowledge) systemContent += `\n${recentWebKnowledge}`;
              }
              
              if (relevantInfo) {
                systemContent += relevantInfo;
              }
              
              systemContent += `\n\nIMPORTANTE: Si el usuario pregunta sobre algo que leíste en páginas web, menciona específicamente qué aprendiste de esas páginas. Usa el conocimiento relevante para dar respuestas detalladas y precisas.`;
              
              const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                  model: "llama-3.1-8b-instant", // Modelo más estable y rápido
                  messages: [
                    {
                      role: "system",
                      content: systemContent
                    },
                    { role: "user", content: userInput }
                  ],
                  max_tokens: 1500,
                  temperature: 0.7
                })
              });
              
              if (groqResponse.ok) {
                const data = await groqResponse.json();
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                  response = data.choices[0].message.content;
                  
                  // Mejorar con conocimiento local
                  const knowledgeMatches = searchKnowledge(userInput);
                  if (knowledgeMatches.length > 0) {
                    const usefulMatch = knowledgeMatches.find(match => {
                      if (!match.context || match.context.length < 30) return false;
                      if (match.context.includes(':')) {
                        const parts = match.context.split(':');
                        if (parts.length >= 2) {
                          const definition = parts.slice(1).join(':').trim();
                          return definition.length >= 20 && !definition.match(/^[^a-záéíóúñ]/i);
                        }
                      }
                      return match.context.length >= 30 && match.context.split(/\s+/).length >= 5;
                    });
                    
                    if (usefulMatch && !response.toLowerCase().includes(usefulMatch.concept)) {
                      if (usefulMatch.context && usefulMatch.context.includes(':')) {
                        const parts = usefulMatch.context.split(':');
                        if (parts.length >= 2) {
                          const word = parts[0].trim();
                          const definition = parts.slice(1).join(':').trim();
                          if (word.length >= 2 && definition.length >= 20) {
                            response += `\n\n📚 **Información del diccionario RAE:**\n**${word}**: ${definition.substring(0, 300)}`;
                          }
                        }
                      }
                    }
                  }
                  
                  if (reasoning.length > 0) {
                    response += '\n\n🧠 ' + reasoning.map(r => r.message).join('\n');
                  }
                } else {
                  throw new Error('Respuesta inválida de Groq');
                }
              } else if (groqResponse.status === 429) {
                // Rate limiting - usar respuesta local en lugar de fallar
                console.warn('⚠️ Rate limit (429) de Groq. Usando respuesta local sin API.');
                response = generateResponse(userInput, concepts, reasoning);
              } else {
                // Si Groq falla, obtener el error para debug
                const errorData = await groqResponse.json().catch(() => ({}));
                console.error('Error de Groq API:', groqResponse.status, errorData);
                // Usar respuesta local como fallback
                response = generateResponse(userInput, concepts, reasoning);
              }
            } else if (FREE_API_TYPE === 'openai') {
              // Similar para OpenAI
              const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                  model: "gpt-3.5-turbo",
                  messages: [
                    {
                      role: "system",
                      content: `Eres Luxio, una IA creada por Lucio Tapia. Eres amigable, inteligente y servicial.`
                    },
                    { role: "user", content: userInput }
                  ],
                  max_tokens: 2000
                })
              });
              
              if (openaiResponse.ok) {
                const data = await openaiResponse.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                  response = data.choices[0].message.content;
                }
              }
            }
          } catch (apiError) {
            console.error('Error con API gratuita:', apiError);
            // Si también falla la API, usar respuesta local
            response = generateResponse(userInput, concepts, reasoning);
          }
    } else {
      // Si no hay API gratuita, intentar backend como fallback
      try {
        const enhancedContext = knowledge
          .slice(-20)
          .map(k => ({
            concept: k.concept,
            context: k.context
          }));
        
        const backendResponse = await axios.post(`${API_URL}/api/chat`, {
          message: userInput,
          context: enhancedContext
        }, {
          timeout: 2000
        });
        
        response = backendResponse.data.response;
        
        if (response && response.length >= 5) {
          usedBackend = true;
          
          const knowledgeMatches = searchKnowledge(userInput);
          if (knowledgeMatches.length > 0) {
            const usefulMatch = knowledgeMatches.find(match => {
              if (!match.context || match.context.length < 30) return false;
              if (match.context.includes(':')) {
                const parts = match.context.split(':');
                if (parts.length < 2) return false;
                const definition = parts.slice(1).join(':').trim();
                return definition.length >= 20 && !definition.match(/^[^a-záéíóúñ]/i);
              }
              return match.context.length >= 30 && match.context.split(/\s+/).length >= 5;
            });
            
            if (usefulMatch && !response.toLowerCase().includes(usefulMatch.concept)) {
              if (usefulMatch.context && usefulMatch.context.includes(':')) {
                const parts = usefulMatch.context.split(':');
                if (parts.length >= 2) {
                  const word = parts[0].trim();
                  const definition = parts.slice(1).join(':').trim();
                  if (word.length >= 2 && definition.length >= 20) {
                    response += `\n\n📚 **Información del diccionario RAE:**\n**${word}**: ${definition.substring(0, 300)}`;
                  }
                }
              }
            }
          }
          
          if (reasoning.length > 0) {
            response += '\n\n🧠 ' + reasoning.map(r => r.message).join('\n');
          }
        } else {
          throw new Error('Respuesta inválida del backend');
        }
      } catch (error) {
        // Si el backend también falla, usar respuesta local
        console.log('Backend no disponible, usando respuesta local');
        response = generateResponse(userInput, concepts, reasoning);
      }
    }

    // SIEMPRE asegurar que hay una respuesta
    if (!response || response.trim().length < 3) {
      response = generateResponse(userInput, concepts, reasoning);
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '🧠 Razonando...', 
      thinking: true 
    }]);

    const response = await processWithBrain(currentInput);

    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.thinking);
        return [...filtered, { role: 'assistant', content: response }];
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-80 bg-black bg-opacity-40 backdrop-blur-lg border-r border-purple-500 border-opacity-30 p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="text-purple-400" size={32} />
            <h2 className="text-2xl font-bold text-white">Luxio</h2>
          </div>
          <p className="text-gray-400 text-sm">IA creada por Lucio Tapia</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-white" size={20} />
            <h3 className="text-white font-semibold">Sentido Común</h3>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-2">
            <div className="text-white text-3xl font-bold">{commonSenseRules.length}</div>
            <div className="text-xs text-gray-200">Reglas</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Settings className="text-white" size={20} />
              <h3 className="text-white font-semibold">Autocontrol</h3>
            </div>
            <button
              onClick={() => setSelfControl(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                selfControl.enabled
                  ? 'bg-white text-purple-600'
                  : 'bg-black bg-opacity-30 text-gray-300'
              }`}
            >
              {selfControl.enabled ? 'ON' : 'OFF'}
            </button>
          </div>
          
          {selfControl.enabled && (
            <div className="space-y-2">
              <div className="bg-black bg-opacity-30 rounded p-2">
                <div className="flex justify-between text-xs text-white mb-1">
                  <span>Auto-conciencia</span>
                  <span>{selfControl.selfAwareness}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all"
                    style={{ width: `${selfControl.selfAwareness}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded p-2">
                <div className="flex justify-between text-xs text-white mb-1">
                  <span>Confianza en decisiones</span>
                  <span>{selfControl.decisionConfidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${selfControl.decisionConfidence}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white mt-2">
                <span>Auto-aprendizaje:</span>
                <button
                  onClick={() => setSelfControl(prev => ({ ...prev, autoLearning: !prev.autoLearning }))}
                  className={`px-2 py-1 rounded ${selfControl.autoLearning ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  {selfControl.autoLearning ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white">
                <span>Auto-decisión:</span>
                <button
                  onClick={() => setSelfControl(prev => ({ ...prev, autoDecision: !prev.autoDecision }))}
                  className={`px-2 py-1 rounded ${selfControl.autoDecision ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  {selfControl.autoDecision ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white">
                <span>Auto-monitoreo:</span>
                <button
                  onClick={() => setSelfControl(prev => ({ ...prev, selfMonitoring: !prev.selfMonitoring }))}
                  className={`px-2 py-1 rounded ${selfControl.selfMonitoring ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  {selfControl.selfMonitoring ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}
          
          {!selfControl.enabled && (
            <div className="text-xs text-gray-300 text-center py-2">
              El autocontrol está desactivado
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-white" size={20} />
            <h3 className="text-white font-semibold">Razonamiento</h3>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-2">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>Capacidad</span>
              <span>{reasoningLevel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${reasoningLevel}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="text-white" size={20} />
            <h3 className="text-white font-semibold">Generador IA</h3>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-2">
            <div className="text-white text-3xl font-bold">{generatedImages.length}</div>
            <div className="text-xs text-gray-200">Imágenes generadas</div>
          </div>
          <div className="mt-2 text-xs text-gray-200">
            💡 Pide: "genera una imagen de..."
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-white" size={20} />
            <h3 className="text-white font-semibold">Conocimiento</h3>
          </div>
          <div className="bg-black bg-opacity-30 rounded p-2 space-y-2">
            <div>
              <div className="text-white text-2xl font-bold">{webKnowledge.length}</div>
              <div className="text-xs text-gray-200">De internet 🌐</div>
            </div>
            <div>
              <div className="text-white text-xl font-bold">{knowledge.length}</div>
              <div className="text-xs text-gray-200">De conversaciones 💬</div>
            </div>
            <div className="border-t border-white border-opacity-20 pt-2">
              <div className="text-white text-3xl font-bold">{knowledge.length + webKnowledge.length}</div>
              <div className="text-xs text-gray-200">Total conceptos</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="text-white" size={20} />
              <h3 className="text-white font-semibold">Aprendizaje Auto</h3>
            </div>
          </div>

          <button
            onClick={autoTrainingActive ? stopAutoTraining : startAutoTraining}
            disabled={!FREE_API_KEY}
            className={`w-full rounded-lg p-3 font-semibold flex items-center justify-center gap-2 transition-all ${
              autoTrainingActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white text-green-600 hover:bg-gray-100'
            }`}
          >
            {autoTrainingActive ? (
              <><Pause size={18} /> Detener Aprendizaje</>
            ) : (
              <><Play size={18} /> Iniciar Aprendizaje</>
            )}
          </button>

            {!FREE_API_KEY && (
              <div className="mt-2 text-xs text-yellow-200 bg-yellow-900 bg-opacity-50 rounded p-2">
                ⚠️ Configura una API key gratuita:
                <br />• REACT_APP_GROQ_API_KEY (recomendado)
                <br />• REACT_APP_OPENAI_API_KEY
                <br />• REACT_APP_GEMINI_API_KEY
              </div>
            )}
            {FREE_API_KEY && (
              <div className="mt-2 text-xs text-green-200 bg-green-900 bg-opacity-50 rounded p-2">
                ✓ API {FREE_API_TYPE} configurada
              </div>
            )}

          {autoTrainingActive && (
            <div className="mt-3">
              <div className="text-xs text-white mb-1">
                Aprendiendo: {currentTopic}
              </div>
              <div className="w-full bg-black bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-200 mt-1 text-right">
                {Math.round(trainingProgress)}%
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="text-white" size={20} />
              <h3 className="text-white font-semibold">Leer Páginas Web</h3>
            </div>
          </div>

          <div className="mb-3 bg-black bg-opacity-30 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white">Seguir enlaces automáticamente</span>
              <button
                onClick={() => setAutoFollowLinks(!autoFollowLinks)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  autoFollowLinks
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {autoFollowLinks ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {autoFollowLinks 
                ? '✓ Explorará enlaces encontrados automáticamente' 
                : '✗ Solo leerá las URLs que agregues'}
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              ref={urlInputRef}
              type="text"
              placeholder="https://ejemplo.com"
              onKeyPress={(e) => e.key === 'Enter' && addURL()}
              className="flex-1 bg-black bg-opacity-30 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              disabled={webReadingActive}
            />
            <button
              onClick={addURL}
              disabled={webReadingActive}
              className="bg-white text-blue-600 rounded px-4 py-2 font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              +
            </button>
          </div>

          {webURLs.length > 0 && (
            <div className="mb-3 bg-black bg-opacity-40 rounded-lg p-2 max-h-32 overflow-y-auto">
              <div className="text-xs text-white font-semibold mb-2">
                URLs en Lista ({webURLs.length}):
              </div>
              <div className="space-y-1">
                {webURLs.map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-green-900 bg-opacity-30 rounded p-2">
                    <div className="text-xs text-green-300 truncate flex-1">{url}</div>
                    <button
                      onClick={() => setWebURLs(prev => prev.filter((_, idx) => idx !== i))}
                      className="ml-2 text-red-400 hover:text-red-300"
                      disabled={webReadingActive}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={webReadingActive ? stopWebReading : startWebReading}
            disabled={!FREE_API_KEY || webURLs.length === 0}
            className={`w-full rounded-lg p-3 font-semibold flex items-center justify-center gap-2 transition-all ${
              webReadingActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {webReadingActive ? (
              <><Pause size={18} /> Detener Lectura</>
            ) : (
              <><BookOpen size={18} /> Leer Páginas Web</>
            )}
          </button>

          {webReadingActive && (
            <div className="mt-3">
              <div className="text-xs text-white mb-1">
                Leyendo: {currentURL || 'Preparando...'}
              </div>
              <div className="w-full bg-black bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${webReadingProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-200 mt-1 text-right">
                {Math.round(webReadingProgress)}%
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => setShowTrainingPanel(!showTrainingPanel)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-3 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Zap size={18} />
            Entrenar
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-3 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Upload size={18} />
            Subir .txt
          </button>
          
          <button
            onClick={() => {
              const prompt = window.prompt('✏️ ¿Qué quieres que dibuje?', 'Un gato astronauta en el espacio');
              if (prompt && prompt.trim()) {
                // Agregar "dibuja" al prompt si no está presente para optimizar el dibujo
                const finalPrompt = prompt.toLowerCase().includes('dibuja') || prompt.toLowerCase().includes('dibujo') 
                  ? prompt.trim() 
                  : `dibuja ${prompt.trim()}`;
                generateImage(finalPrompt);
              }
            }}
            disabled={generatingImage}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg p-3 hover:from-pink-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon size={18} />
            {generatingImage ? 'Dibujando...' : '✏️ Dibujar'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={importBrain}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-3 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Upload size={18} />
            Importar Backup
          </button>
          
          <button
            onClick={exportBrain}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-3 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Download size={18} />
            Exportar
          </button>
          
          <button
            onClick={clearMemory}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-3 hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <X size={18} />
            Limpiar Memoria
          </button>
        </div>

        <div className="bg-black bg-opacity-40 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-yellow-400" size={18} />
            <h3 className="text-white font-semibold text-sm">Últimos Aprendidos</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {webKnowledge.slice(-10).reverse().map((k, i) => (
              <div key={i} className="bg-green-900 bg-opacity-30 rounded p-2 hover:bg-opacity-50 transition-all">
                <div className="text-green-300 text-xs font-mono flex items-center gap-1">
                  <span className="text-yellow-400">🌐</span>
                  {k.concept}
                </div>
                <div className="text-gray-500 text-xs truncate mt-1">{k.topic}</div>
              </div>
            ))}
            {knowledge.slice(-5).reverse().map((k, i) => (
              <div key={`conv-${i}`} className="bg-purple-900 bg-opacity-30 rounded p-2 hover:bg-opacity-50 transition-all">
                <div className="text-purple-300 text-xs font-mono flex items-center gap-1">
                  <span className="text-blue-400">💬</span>
                  {k.concept}
                </div>
                <div className="text-gray-500 text-xs truncate mt-1">{k.context.substring(0, 40)}</div>
              </div>
            ))}
            {webKnowledge.length === 0 && knowledge.length === 0 && (
              <div className="text-gray-500 text-xs text-center py-6">
                💭 Sin conocimiento aún
                <br />
                <span className="text-xs">¡Habla conmigo o inicia el entrenamiento!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative">
        {showTrainingPanel && (
          <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl p-6 max-w-2xl w-full border-2 border-purple-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="text-yellow-400" />
                  Entrenamiento
                </h2>
                <button
                  onClick={() => {
                    setShowTrainingPanel(false);
                    setTrainingText('');
                    setTrainingProgress(0);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <textarea
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                placeholder="Pega texto aquí..."
                className="w-full h-64 bg-gray-900 text-white rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              
              {trainingProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white mb-2">
                    <span>Procesando...</span>
                    <span>{Math.round(trainingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={startMassiveTraining}
                disabled={!trainingText.trim() || trainingProgress > 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-4 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50"
              >
                <Brain size={24} />
                Iniciar
              </button>
            </div>
          </div>
        )}

        <div className="bg-black bg-opacity-40 backdrop-blur-lg border-b border-purple-500 border-opacity-30 p-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {personality.name}
            {autoTrainingActive && <RefreshCw size={20} className="text-green-400 animate-spin" />}
            {!autoTrainingActive && FREE_API_KEY && <Globe size={20} className="text-green-400" />}
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
                    {/* Mostrar imagen si está en el mensaje */}
                    {msg.image && (
                      <div className="mt-3 border border-purple-500 rounded-lg p-2 bg-black bg-opacity-30">
                        <img 
                          src={msg.image} 
                          alt={msg.content.includes('Prompt') ? msg.content.split('Prompt:')[1]?.trim() || 'Imagen generada' : 'Imagen generada'} 
                          className="max-w-full h-auto rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <p className="text-xs text-gray-400 mt-2" style={{ display: 'none' }}>
                          ⚠️ No se pudo cargar la imagen
                        </p>
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
              placeholder={autoTrainingActive ? "Estoy aprendiendo de internet... Espera o escribe" : "Pregúntame sobre lo que aprendí de internet... 🌐"}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={autoTrainingActive}
            />
            <button
              onClick={handleSend}
              disabled={autoTrainingActive || !input.trim()}
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
