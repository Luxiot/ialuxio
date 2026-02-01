import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, Database, Zap, Settings, BookOpen, Upload, Download, X, Lightbulb, AlertCircle, Globe, Play, Pause, RefreshCw, Image as ImageIcon } from 'lucide-react';
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
  const [creatorAuth, setCreatorAuth] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [tempName, setTempName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [trainingChatActive, setTrainingChatActive] = useState(false);
  const [trainingMode] = useState(false);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [trainingText, setTrainingText] = useState('');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [autoTrainingActive, setAutoTrainingActive] = useState(false);
  const [trainingTopics, setTrainingTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [trainingData, setTrainingData] = useState([]);
  const [validationData, setValidationData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [trainingMetrics, setTrainingMetrics] = useState({
    accuracy: 0,
    lastTrainingDate: null,
    trainingCycles: 0
  });
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
    decisionConfidence: 100,
    selfAwareness: 100
  });
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [autoWebLearningActive, setAutoWebLearningActive] = useState(false);
  const [autoWebLearningStats, setAutoWebLearningStats] = useState({
    pagesVisited: 0,
    conceptsLearned: 0,
    totalWords: 0
  });
  const [autoWebLearningLog, setAutoWebLearningLog] = useState([]);
  const [autoWebLearningCycle, setAutoWebLearningCycle] = useState(0);
  const autoWebLearningRef = useRef(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const trainingIntervalRef = useRef(null);
  const urlInputRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const imageInputRef = useRef(null);
  const dataLoadedRef = useRef(false);
  // Refs para acceder al estado más reciente en funciones de guardado
  // CRÍTICO: Inicializar con arrays vacíos para evitar errores de undefined
  const knowledgeRef = useRef([]);
  const webKnowledgeRef = useRef([]);
  
  // IndexedDB para almacenamiento con mayor capacidad
  const [indexedDBReady, setIndexedDBReady] = useState(false);
  const dbRef = useRef(null);
  
  // Actualizar refs cuando cambian los estados
  useEffect(() => {
    knowledgeRef.current = knowledge;
  }, [knowledge]);
  
  useEffect(() => {
    webKnowledgeRef.current = webKnowledge;
  }, [webKnowledge]); // Bandera para saber si los datos ya se cargaron

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

  const seedUrls = [
    'https://es.wikipedia.org/wiki/Inteligencia_artificial',
    'https://es.wikipedia.org/wiki/Aprendizaje_automático',
    'https://es.wikipedia.org/wiki/Red_neuronal_artificial',
    'https://es.wikipedia.org/wiki/Programación',
    'https://es.wikipedia.org/wiki/Ciencia_de_datos',
    'https://es.wikipedia.org/wiki/Machine_learning',
    'https://es.wikipedia.org/wiki/Deep_learning',
    'https://es.wikipedia.org/wiki/Procesamiento_de_lenguaje_natural'
  ];

  const searchTopics = [
    'Inteligencia artificial', 'Machine learning', 'Deep learning', 'Programación',
    'Ciencia de datos', 'Blockchain', 'Ciberseguridad', 'Computación cuántica',
    'Internet de las cosas', 'Realidad virtual', 'Robótica', 'Neurociencia',
    'Física cuántica', 'Biotecnología', 'Nanotecnología', 'Energías renovables',
    'Astronomía', 'Criptografía', 'Big data', 'Cloud computing', 'DevOps',
    'Biología molecular', 'Genética', 'Química orgánica', 'Matemáticas aplicadas',
    'Economía digital', 'Psicología cognitiva', 'Filosofía de la mente',
    'Historia de la tecnología', 'Ética en IA', 'Arquitectura de software',
    'Bases de datos', 'Redes neuronales', 'Procesamiento de lenguaje natural',
    'Visión por computadora', 'Automatización', 'Industria 4.0', 'Fintech',
    'E-commerce', 'Marketing digital', 'Diseño UX/UI', 'Metodologías ágiles',
    'Teoría de sistemas', 'Algoritmos genéticos', 'Sistemas expertos',
    'Lógica difusa', 'Minería de datos', 'Aprendizaje por refuerzo',
    'Redes de sensores', 'Edge computing', 'Computación paralela',
    'Inteligencia artificial generativa', 'Transformers', 'GPT', 'LLM',
    'Computer vision', 'Natural language processing', 'Reinforcement learning',
    'Neural networks', 'Convolutional networks', 'Recurrent networks',
    'Transfer learning', 'Few-shot learning', 'Meta-learning',
    'AutoML', 'Neural architecture search', 'Model compression',
    'Federated learning', 'Differential privacy', 'Adversarial learning'
  ];

  const getRandomTopic = () => {
    return searchTopics[Math.floor(Math.random() * searchTopics.length)];
  };

  const initialCommonSense = [
    { rule: 'El fuego quema', category: 'física', confidence: 100 },
    { rule: 'Los humanos necesitan dormir', category: 'biología', confidence: 100 },
    { rule: 'El agua moja', category: 'física', confidence: 100 },
    { rule: 'Las cosas caen por gravedad', category: 'física', confidence: 100 },
    { rule: 'Los animales necesitan comer', category: 'biología', confidence: 100 },
    { rule: 'El pasado no se puede cambiar', category: 'lógica', confidence: 100 }
  ];

  // Inicializar IndexedDB al cargar
  useEffect(() => {
    const initIndexedDB = async () => {
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          console.warn('⚠️ IndexedDB no disponible en este navegador');
          resolve(null);
          return;
        }
        
        const request = indexedDB.open('LuxioBrainDB', 1);
        
        request.onerror = () => {
          console.warn('⚠️ Error abriendo IndexedDB, usando solo localStorage');
          resolve(null);
        };
        
        request.onsuccess = () => {
          dbRef.current = request.result;
          setIndexedDBReady(true);
          console.log('✅ IndexedDB inicializado (capacidad: varios GB)');
          resolve(request.result);
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('brainData')) {
            const objectStore = db.createObjectStore('brainData', { keyPath: 'id' });
            objectStore.createIndex('timestamp', 'timestamp', { unique: false });
            console.log('✅ ObjectStore creado en IndexedDB');
          }
        };
      });
    };
    
    initIndexedDB().then(() => {
      // Cargar datos después de inicializar IndexedDB
      loadFromStorage();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadFromStorage = async () => {
    try {
      // PRIMERO: Intentar cargar desde IndexedDB (más confiable y con más capacidad)
      if (dbRef.current) {
        try {
          const transaction = dbRef.current.transaction(['brainData'], 'readonly');
          const objectStore = transaction.objectStore('brainData');
          const request = objectStore.get('main');
          
          request.onsuccess = (event) => {
            const result = event.target.result;
            if (result && result.data) {
              console.log('✅ Datos cargados desde IndexedDB');
              const data = result.data;
              
              const loadedKnowledge = data.knowledge || [];
              const loadedWebKnowledge = data.webKnowledge || [];
              const totalLoaded = loadedKnowledge.length + loadedWebKnowledge.length;
              
              console.log('📦 Cargando datos desde IndexedDB:');
              console.log('   - knowledge:', loadedKnowledge.length);
              console.log('   - webKnowledge:', loadedWebKnowledge.length);
              console.log('   - Total:', totalLoaded);
              
              knowledgeRef.current = loadedKnowledge;
              webKnowledgeRef.current = loadedWebKnowledge;
              
              setKnowledge(loadedKnowledge);
              setWebKnowledge(loadedWebKnowledge);
              setMemorySize(totalLoaded);
              setLearningRate(data.learningRate || Math.min((data.knowledge?.length || 0) / 100, 100));
              setReasoningLevel(data.reasoningLevel || Math.min((data.knowledge?.length || 0) / 136, 100));
              setCommonSenseRules(data.commonSenseRules || initialCommonSense);
              setExploredUrls(data.exploredUrls || []);
              setTotalPagesExplored(data.totalPagesExplored || 0);
              setGeneratedImages(data.generatedImages || []);
              
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
                decisionConfidence: 100,
                selfAwareness: 100
              });
              
              dataLoadedRef.current = true;
              window.lastLoadTime = Date.now();
              
              // Verificación final
              setTimeout(() => {
                setKnowledge(currentKnowledge => {
                  setWebKnowledge(currentWebKnowledge => {
                    const finalTotal = currentKnowledge.length + currentWebKnowledge.length;
                    knowledgeRef.current = currentKnowledge;
                    webKnowledgeRef.current = currentWebKnowledge;
                    setMemorySize(finalTotal);
                    return currentWebKnowledge;
                  });
                  return currentKnowledge;
                });
              }, 1000);
              
              // Cargar mensajes de bienvenida
              const savedCreator = localStorage.getItem('luxio-creator-auth');
              if (savedCreator) {
                try {
                  const authData = JSON.parse(savedCreator);
                  if (authData.name === 'Lucio Tapia' || authData.name.toLowerCase().includes('lucio') || authData.name.toLowerCase().includes('tapia')) {
                    setCreatorName(authData.name);
                    setCreatorAuth(true);
                    setMessages([{
                      role: 'assistant',
                      content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nHola ${authData.name}, estoy listo para ayudarte. Puedes pedirme que aprenda sobre cualquier tema.\n\n🎯 **Ejemplos:**\n• "Aprende sobre blockchain"\n• "Qué sabes sobre IA"\n• "Busca información de Python"\n\n¿En qué puedo ayudarte hoy?`
                    }]);
                  } else {
                    setMessages([{
                      role: 'assistant',
                      content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
                    }]);
                  }
                } catch (e) {
                  setMessages([{
                    role: 'assistant',
                    content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
                  }]);
                }
              } else {
                setMessages([{
                  role: 'assistant',
                  content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
                }]);
              }
              
              return; // Salir si se cargaron desde IndexedDB
            } else {
              console.log('ℹ️ No hay datos en IndexedDB, intentando localStorage');
            }
          };
          
          request.onerror = () => {
            console.warn('⚠️ Error cargando desde IndexedDB, usando localStorage');
          };
        } catch (idbError) {
          console.warn('⚠️ Error accediendo a IndexedDB:', idbError);
        }
      }
      
      // SEGUNDO: Intentar cargar desde localStorage (fallback)
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
        const loadedKnowledge = data.knowledge || [];
        const loadedWebKnowledge = data.webKnowledge || [];
        const totalLoaded = loadedKnowledge.length + loadedWebKnowledge.length;
        
        console.log('📦 Cargando datos desde localStorage:');
        console.log('   - knowledge:', loadedKnowledge.length);
        console.log('   - webKnowledge:', loadedWebKnowledge.length);
        console.log('   - Total:', totalLoaded);
        
        // CRÍTICO: Actualizar las refs ANTES de establecer el estado
        knowledgeRef.current = loadedKnowledge;
        webKnowledgeRef.current = loadedWebKnowledge;
        
        console.log('🔧 Estableciendo estados con datos cargados:');
        console.log('   - knowledge:', loadedKnowledge.length);
        console.log('   - webKnowledge:', loadedWebKnowledge.length);
        console.log('   - Refs actualizadas');
        
        setKnowledge(loadedKnowledge);
        setWebKnowledge(loadedWebKnowledge);
        // Usar el total real calculado, no el memorySize guardado (puede estar desactualizado)
        setMemorySize(totalLoaded);
        
        // CRÍTICO: Verificar inmediatamente que los estados se establecieron correctamente
        setTimeout(() => {
          setKnowledge(currentKnowledge => {
            setWebKnowledge(currentWebKnowledge => {
              console.log('🔍 Verificación inmediata (100ms después de cargar):');
              console.log('   - knowledge:', currentKnowledge.length);
              console.log('   - webKnowledge:', currentWebKnowledge.length);
              
              // Si webKnowledge está vacío pero debería tener datos, restaurarlo
              if (currentWebKnowledge.length === 0 && loadedWebKnowledge.length > 0) {
                console.error('❌ CRÍTICO: webKnowledge se perdió! Restaurando...');
                knowledgeRef.current = currentKnowledge;
                webKnowledgeRef.current = loadedWebKnowledge;
                setWebKnowledge(loadedWebKnowledge);
                setMemorySize(currentKnowledge.length + loadedWebKnowledge.length);
                return loadedWebKnowledge;
              }
              
              // Actualizar refs
              knowledgeRef.current = currentKnowledge;
              webKnowledgeRef.current = currentWebKnowledge;
              return currentWebKnowledge;
            });
            return currentKnowledge;
          });
        }, 100);
        
        // Verificación final después de cargar para asegurar que se cargaron todos
        setTimeout(() => {
          setKnowledge(currentKnowledge => {
            setWebKnowledge(currentWebKnowledge => {
              const finalTotal = currentKnowledge.length + currentWebKnowledge.length;
              console.log('✅ Verificación final después de cargar:');
              console.log('   - knowledge:', currentKnowledge.length);
              console.log('   - webKnowledge:', currentWebKnowledge.length);
              console.log('   - Total final:', finalTotal);
              
              // CRÍTICO: Actualizar las refs con el estado final
              knowledgeRef.current = currentKnowledge;
              webKnowledgeRef.current = currentWebKnowledge;
              
              if (finalTotal !== totalLoaded) {
                console.warn('⚠️ Diferencia detectada:', {
                  esperado: totalLoaded,
                  actual: finalTotal,
                  diferencia: finalTotal - totalLoaded
                });
                // Si hay diferencia, forzar actualización de refs
                if (finalTotal < totalLoaded) {
                  console.error('❌ ERROR: Se perdieron conceptos al cargar!');
                  console.error('   Intentando recuperar desde localStorage...');
                  // Intentar recargar desde localStorage
                  const savedData = localStorage.getItem('ai-brain-data') || localStorage.getItem('ai-brain-data-emergency');
                  if (savedData) {
                    try {
                      const backupData = JSON.parse(savedData);
                      const backupKnowledge = backupData.knowledge || [];
                      const backupWebKnowledge = backupData.webKnowledge || [];
                      console.log('📦 Recuperando desde backup:', {
                        knowledge: backupKnowledge.length,
                        webKnowledge: backupWebKnowledge.length,
                        total: backupKnowledge.length + backupWebKnowledge.length
                      });
                      knowledgeRef.current = backupKnowledge;
                      webKnowledgeRef.current = backupWebKnowledge;
                      setKnowledge(backupKnowledge);
                      setWebKnowledge(backupWebKnowledge);
                      setMemorySize(backupKnowledge.length + backupWebKnowledge.length);
                    } catch (e) {
                      console.error('❌ Error al recuperar desde backup:', e);
                    }
                  }
                }
              }
              setMemorySize(finalTotal);
              return currentWebKnowledge;
            });
            return currentKnowledge;
          });
        }, 1000);
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
          decisionConfidence: 100,
          selfAwareness: 100
        });

        // Variables calculadas pero no usadas - comentadas para evitar warnings
        // const selfControlStatus = data.selfControl?.enabled ? 'ACTIVADO' : 'DESACTIVADO';
        // const totalConcepts = (data.knowledge?.length || 0) + (data.webKnowledge?.length || 0);
        // const finalReasoning = data.reasoningLevel || Math.min(totalConcepts / 136, 100);
        
        // SIEMPRE usar Luxio y Lucio Tapia, no los datos antiguos
        // Verificar autenticación del creador
        const savedCreator = localStorage.getItem('luxio-creator-auth');
        if (savedCreator) {
          try {
            const authData = JSON.parse(savedCreator);
            if (authData.name === 'Lucio Tapia' || authData.name.toLowerCase().includes('lucio') || authData.name.toLowerCase().includes('tapia')) {
              setCreatorName(authData.name);
              setCreatorAuth(true);
              setMessages([{
                role: 'assistant',
                content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nHola ${authData.name}, estoy listo para ayudarte. Puedes pedirme que aprenda sobre cualquier tema.\n\n🎯 **Ejemplos:**\n• "Aprende sobre blockchain"\n• "Qué sabes sobre IA"\n• "Busca información de Python"\n\n¿En qué puedo ayudarte hoy?`
              }]);
            } else {
              setMessages([{
                role: 'assistant',
                content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
              }]);
            }
          } catch (e) {
            setMessages([{
              role: 'assistant',
              content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
            }]);
          }
        } else {
          setMessages([{
            role: 'assistant',
            content: `¡Hola! Soy Luxio, creado por Lucio Tapia. 🧠✨\n\nPara comenzar, necesito que te identifiques como mi creador. Escribe tu nombre (Lucio Tapia) para autenticarte.`
          }]);
        }
        
        // CRÍTICO: Actualizar las refs ANTES de marcar como cargado
        knowledgeRef.current = loadedKnowledge;
        webKnowledgeRef.current = loadedWebKnowledge;
        
        // Marcar el tiempo de carga para evitar guardados inmediatos
        window.lastLoadTime = Date.now();
        
        console.log('✅ Refs actualizadas después de cargar:', {
          knowledge: knowledgeRef.current.length,
          webKnowledge: webKnowledgeRef.current.length,
          total: knowledgeRef.current.length + webKnowledgeRef.current.length
        });
        
        // Marcar que los datos se cargaron correctamente
        dataLoadedRef.current = true;
        
        // NO guardar inmediatamente después de cargar - esto podría sobrescribir los datos
        // El guardado automático se encargará de guardar cuando haya cambios reales
      } else {
        // Si no hay datos guardados, marcar como cargado para permitir guardados futuros
        dataLoadedRef.current = true;
        setCommonSenseRules(initialCommonSense);
        setMessages([{
          role: 'assistant',
          content: `¡Hola! Soy ${personality.name}, creado por ${personality.creator}. 🧠✨\n\n¿En qué puedo ayudarte hoy?`
        }]);
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      setCommonSenseRules(initialCommonSense);
      setMessages([{
        role: 'assistant',
        content: `¡Hola! Soy ${personality.name}, creado por ${personality.creator}. 🧠✨\n\n¿En qué puedo ayudarte hoy?`
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
      
      // CRÍTICO: Usar refs para obtener el estado MÁS RECIENTE
      const currentKnowledge = knowledgeRef.current || knowledge;
      const currentWebKnowledge = webKnowledgeRef.current || webKnowledge;
      
      // Calcular el total real de conceptos antes de guardar
      const knowledgeToSave = Array.isArray(currentKnowledge) ? [...currentKnowledge] : [];
      const webKnowledgeToSave = Array.isArray(currentWebKnowledge) ? [...currentWebKnowledge] : [];
      const totalConcepts = knowledgeToSave.length + webKnowledgeToSave.length;
      
      console.log('💾 Guardando datos a localStorage:');
      console.log('   - knowledge:', knowledgeToSave.length);
      console.log('   - webKnowledge:', webKnowledgeToSave.length);
      console.log('   - Total:', totalConcepts);
      
      const data = {
        knowledge: knowledgeToSave, // Copia para evitar referencias
        webKnowledge: webKnowledgeToSave, // Copia para evitar referencias
        exploredUrls: [...exploredUrls],
        totalPagesExplored,
        memorySize: totalConcepts, // Usar el total real calculado
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
        
        // CRÍTICO: Guardar también en IndexedDB (más capacidad)
        if (dbRef.current) {
          try {
            const transaction = dbRef.current.transaction(['brainData'], 'readwrite');
            const objectStore = transaction.objectStore('brainData');
            objectStore.put({
              id: 'main',
              data: data,
              timestamp: Date.now()
            });
            console.log('✅ Datos guardados en IndexedDB');
          } catch (idbError) {
            console.warn('⚠️ Error guardando en IndexedDB:', idbError);
          }
        }
        
        // CRÍTICO: Guardar también como archivo JSON en la carpeta del proyecto
        try {
          const dataStr = JSON.stringify(data, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `luxio-brain-data-${Date.now()}.json`;
          // No hacer click automático, solo preparar para descarga manual si es necesario
          // link.click();
          URL.revokeObjectURL(url);
          console.log('✅ Archivo JSON preparado para guardar');
        } catch (fileError) {
          console.warn('⚠️ Error preparando archivo:', fileError);
        }
        // Solo mostrar en consola si hay cambios significativos (reducir spam)
        if (knowledge.length > 0 || webKnowledge.length > 0) {
          // Solo log cada 100 guardados para reducir spam en consola
          const lastLog = parseInt(localStorage.getItem('last-save-log') || '0');
          if (Date.now() - lastLog > 5000) { // Solo log cada 5 segundos
            console.log('✅ Datos guardados correctamente:', {
              knowledge: knowledgeToSave.length,
              webKnowledge: webKnowledgeToSave.length,
              total: totalConcepts,
              memorySize: totalConcepts
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
            // NUNCA recortar knowledge o webKnowledge - son datos críticos que no se deben perder
            // En su lugar, intentar guardar sin recortar (puede fallar, pero al menos intentamos)
            localStorage.setItem('ai-brain-data', JSON.stringify(data));
          }
        } else {
          throw storageError;
        }
      }
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      // Intentar guardar al menos los datos críticos
      try {
        // NUNCA recortar knowledge o webKnowledge - guardar TODO incluso en emergencia
        const minimalData = {
          knowledge: knowledge, // GUARDAR TODO, NUNCA RECORTAR
          webKnowledge: webKnowledge, // GUARDAR TODO, NUNCA RECORTAR
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
    
    // CRÍTICO: Esperar un poco después de cargar para evitar sobrescribir datos
    const timeSinceLoad = Date.now() - (window.lastLoadTime || 0);
    if (timeSinceLoad < 2000) {
      // Si se cargó hace menos de 2 segundos, no guardar automáticamente
      return;
    }
    
    // Guardar siempre que haya datos, incluso si cambian
    if (knowledge.length > 0 || webKnowledge.length > 0 || commonSenseRules.length > 0 || generatedImages.length > 0) {
      // Usar un delay más corto para guardar más frecuentemente
      const saveTimeout = setTimeout(() => {
        // CRÍTICO: Usar SIEMPRE las refs para obtener el estado MÁS RECIENTE
        // Las refs se actualizan inmediatamente, mientras que el estado puede estar desactualizado
        let currentKnowledge = Array.isArray(knowledgeRef.current) ? knowledgeRef.current : (Array.isArray(knowledge) ? knowledge : []);
        let currentWebKnowledge = Array.isArray(webKnowledgeRef.current) ? webKnowledgeRef.current : (Array.isArray(webKnowledge) ? webKnowledge : []);
        
        // Verificar que tenemos datos válidos antes de guardar
        if (!Array.isArray(currentKnowledge) || !Array.isArray(currentWebKnowledge)) {
          console.warn('⚠️ Datos inválidos, no guardando');
          return;
        }
        
        // CRÍTICO: Si webKnowledge está vacío en el estado pero la ref tiene datos, usar la ref
        if (currentWebKnowledge.length === 0 && webKnowledgeRef.current.length > 0) {
          console.warn('⚠️ webKnowledge vacío en estado pero ref tiene datos, usando ref');
          currentWebKnowledge = [...webKnowledgeRef.current];
        }
        
        const knowledgeToSave = [...currentKnowledge];
        const webKnowledgeToSave = [...currentWebKnowledge];
        const totalConcepts = knowledgeToSave.length + webKnowledgeToSave.length;
        
        // Verificar que no estamos guardando menos conceptos de los que había
        const savedData = localStorage.getItem('ai-brain-data');
        if (savedData) {
          try {
            const existingData = JSON.parse(savedData);
            const existingTotal = (existingData.knowledge?.length || 0) + (existingData.webKnowledge?.length || 0);
            if (totalConcepts < existingTotal) {
              console.warn('⚠️ Intentando guardar menos conceptos de los existentes, cancelando guardado automático');
              console.warn('   - Existente:', existingTotal);
              console.warn('   - Nuevo:', totalConcepts);
              return;
            }
          } catch (e) {
            // Si no se puede leer, continuar con el guardado
          }
        }
        
        const personalityToSave = {
          ...personality,
          name: personality.name === 'NeuroAI' || personality.name === 'Usuario' ? 'Luxio' : personality.name,
          creator: personality.creator === 'Usuario' ? 'Lucio Tapia' : personality.creator
        };
        
        const data = {
          knowledge: knowledgeToSave,
          webKnowledge: webKnowledgeToSave,
          exploredUrls: [...exploredUrls],
          totalPagesExplored,
          memorySize: totalConcepts,
          learningRate,
          reasoningLevel,
          commonSenseRules: [...commonSenseRules],
          personality: personalityToSave,
          selfControl: { ...selfControl },
          generatedImages: generatedImages.slice(-20),
          timestamp: Date.now(),
          version: '2.0'
        };
        
        // CRÍTICO: Verificar que webKnowledge no esté vacío cuando debería tener datos
        if (webKnowledgeToSave.length === 0 && webKnowledgeRef.current.length > 0) {
          console.warn('⚠️ ADVERTENCIA: webKnowledge está vacío en guardado pero la ref tiene datos!');
          console.warn('   - Ref webKnowledge:', webKnowledgeRef.current.length);
          console.warn('   - Usando datos de la ref en lugar de estado');
          const refWebKnowledge = [...webKnowledgeRef.current];
          data.webKnowledge = refWebKnowledge;
          webKnowledgeToSave = refWebKnowledge;
          totalConcepts = knowledgeToSave.length + refWebKnowledge.length;
        }
        
        try {
          localStorage.setItem('ai-brain-data', JSON.stringify(data));
          localStorage.setItem('ai-brain-data-emergency', JSON.stringify(data));
          console.log('💾 Guardado automático:', {
            knowledge: knowledgeToSave.length,
            webKnowledge: webKnowledgeToSave.length,
            total: totalConcepts
          });
        } catch (error) {
          if (error.name === 'QuotaExceededError') {
            console.error('❌ localStorage lleno en guardado automático');
            console.log('🧹 Limpiando TODOS los backups y datos no críticos...');
            
            // Eliminar TODOS los backups y otros datos no críticos
            const allKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                allKeys.push(key);
              }
            }
            
            // Eliminar todos los backups
            let deletedCount = 0;
            allKeys.forEach(key => {
              if (key.startsWith('ai-brain-backup-')) {
                try {
                  localStorage.removeItem(key);
                  deletedCount++;
                } catch (e) {
                  // Ignorar errores
                }
              }
            });
            
            // Eliminar otros datos no críticos (excepto los esenciales)
            allKeys.forEach(key => {
              if (key !== 'ai-brain-data' && 
                  key !== 'ai-brain-data-emergency' && 
                  !key.startsWith('ai-brain-backup-') &&
                  key !== 'luxio-creator-auth' &&
                  key !== 'last-save-log') {
                try {
                  localStorage.removeItem(key);
                  deletedCount++;
                } catch (e) {
                  // Ignorar errores
                }
              }
            });
            
            console.log(`🧹 Eliminados ${deletedCount} elementos`);
            
            // Intentar guardar solo los datos críticos (knowledge y webKnowledge)
            try {
              const criticalData = {
                knowledge: knowledgeToSave,
                webKnowledge: webKnowledgeToSave,
                timestamp: Date.now(),
                version: '2.0'
              };
              
              // Intentar guardar en emergencia primero (más pequeño)
              localStorage.setItem('ai-brain-data-emergency', JSON.stringify(criticalData));
              console.log('✅ Guardado crítico en emergencia después de limpiar:', {
                knowledge: knowledgeToSave.length,
                webKnowledge: webKnowledgeToSave.length
              });
              
              // Intentar guardar en principal también
              try {
                localStorage.setItem('ai-brain-data', JSON.stringify(criticalData));
                console.log('✅ También guardado en principal');
              } catch (e) {
                console.warn('⚠️ No se pudo guardar en principal, pero está en emergencia');
              }
            } catch (emergencyError) {
              console.error('❌ Error crítico: No se pudo guardar ni siquiera los datos críticos');
              console.error('   localStorage está completamente lleno');
            }
          } else {
            console.error('❌ Error en guardado automático:', error);
          }
        }
      }, 1000); // Guardar después de 1 segundo de inactividad (aumentado para dar más tiempo)
      
      return () => clearTimeout(saveTimeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledge.length, webKnowledge.length, memorySize, learningRate, reasoningLevel, commonSenseRules.length, personality, selfControl, generatedImages.length]);

  // Guardado adicional antes de cerrar la página (CRÍTICO - debe guardar SIEMPRE)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Guardar datos críticos ANTES de recargar/cerrar de forma SÍNCRONA
      // Usar una función que lea el estado actual directamente
      try {
        // CRÍTICO: Usar refs para obtener el estado MÁS RECIENTE antes de recargar
        const currentKnowledge = Array.isArray(knowledgeRef.current) ? [...knowledgeRef.current] : (Array.isArray(knowledge) ? [...knowledge] : []);
        const currentWebKnowledge = Array.isArray(webKnowledgeRef.current) ? [...webKnowledgeRef.current] : (Array.isArray(webKnowledge) ? [...webKnowledge] : []);
        const totalConcepts = currentKnowledge.length + currentWebKnowledge.length;
        
        console.log('💾 Guardado antes de recargar usando refs:', {
          knowledge: currentKnowledge.length,
          webKnowledge: currentWebKnowledge.length,
          total: totalConcepts
        });
        
        const personalityToSave = {
          ...personality,
          name: personality.name === 'NeuroAI' || personality.name === 'Usuario' ? 'Luxio' : personality.name,
          creator: personality.creator === 'Usuario' ? 'Lucio Tapia' : personality.creator
        };
        
        const data = {
          knowledge: currentKnowledge,
          webKnowledge: currentWebKnowledge,
          exploredUrls: [...exploredUrls],
          totalPagesExplored,
          memorySize: totalConcepts,
          learningRate,
          reasoningLevel,
          commonSenseRules: [...commonSenseRules],
          personality: personalityToSave,
          selfControl: { ...selfControl },
          generatedImages: generatedImages.slice(-20),
          timestamp: Date.now(),
          version: '2.0'
        };
        
        // Guardar de forma SÍNCRONA (sin await, directamente)
        localStorage.setItem('ai-brain-data', JSON.stringify(data));
        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(data));
        
        console.log('💾 Guardado forzado antes de recargar/cerrar:', {
          knowledge: currentKnowledge.length,
          webKnowledge: currentWebKnowledge.length,
          total: totalConcepts
        });
      } catch (error) {
        console.error('Error al guardar antes de cerrar:', error);
      }
    };
    
    // Usar both beforeunload y unload para máxima cobertura
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);
    // También usar pagehide para mejor compatibilidad
    window.addEventListener('pagehide', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
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

  // Función de búsqueda y aprendizaje para comandos del creador
  const searchAndLearn = async (topic) => {
    if (!FREE_API_KEY) {
      return null;
    }

    try {
      const prompt = `Busca información completa y actualizada sobre: ${topic}. Extrae los conceptos más importantes, hechos clave, definiciones, aplicaciones y detalles técnicos. Responde SOLO con JSON válido sin markdown: {"concepts": ["concepto1", "concepto2", "concepto3"], "summary": "resumen detallado de al menos 200 palabras", "keyPoints": ["punto1", "punto2", "punto3"], "source": "fuente"}`;

      let response;
      if (FREE_API_TYPE === 'groq') {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                content: "Eres un buscador de conocimiento experto. Responde SOLO con JSON válido, sin markdown ni explicaciones. Extrae conceptos, hechos y datos importantes de forma exhaustiva."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 3000,
            temperature: 0.3
          })
        });
      } else if (FREE_API_TYPE === 'openai') {
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
                content: "Eres un buscador de conocimiento experto. Responde SOLO con JSON válido, sin markdown ni explicaciones. Extrae conceptos, hechos y datos importantes de forma exhaustiva."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 3000
          })
        });
      } else {
        return null;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const textContent = data.choices?.[0]?.message?.content || '';
      
      const cleanText = textContent.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const parsed = JSON.parse(cleanText);
        
        // Guardar en webKnowledge
        if (parsed.concepts && parsed.concepts.length > 0) {
          const newConcepts = parsed.concepts.map(concept => ({
            concept: concept,
            topic: `Comando del creador: ${topic}`,
            source: 'creator_command',
            summary: parsed.summary || '',
            url: `search:${topic}`,
            timestamp: Date.now(),
            keyPoints: parsed.keyPoints || [],
            learnedFrom: creatorName
          }));

          // AGREGAR TODOS LOS CONCEPTOS SIN FILTRAR - NUNCA SE BORRAN
          setWebKnowledge(prev => {
            const updated = [...prev, ...newConcepts];
            // Guardar inmediatamente después de actualizar
            setTimeout(() => saveToStorage(), 100);
            return updated;
          });

          setMemorySize(prev => prev + newConcepts.length);
          setLearningRate(prev => Math.min(prev + 5, 100));
          
          // Guardar datos
          setTimeout(() => saveToStorage(), 500);
        }
        
        return { ...parsed, topic };
      } catch (e) {
        // Si no es JSON válido, crear estructura básica
        const concepts = cleanText.split('\n').filter(line => line.trim().length > 0).slice(0, 20);
        return {
          topic,
          concepts: concepts.length > 0 ? concepts : [topic, 'Conocimiento general'],
          summary: cleanText.substring(0, 500) || `Información sobre ${topic}`,
          keyPoints: cleanText.split('.').filter(s => s.trim().length > 20).slice(0, 5),
          source: 'Web Search'
        };
      }
    } catch (error) {
      console.error(`Error buscando ${topic}:`, error);
      return null;
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
          console.log(`🔍 [AUTO-TRAINING] Leyendo URL ${i + 1}/${urls.length}: ${url}`);
          
          const result = await readAndLearnFromWeb(url);
          console.log(`📊 [AUTO-TRAINING] Resultado de readAndLearnFromWeb:`, result);
          
          if (result && result.success) {
            const conceptsFromThisPage = result.conceptsLearned || 0;
            totalConceptsLearned += conceptsFromThisPage;
            
            // Verificar el estado actual de webKnowledge después de leer
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar a que se actualice el estado
            
            setWebKnowledge(prev => {
              const currentCount = prev.length;
              console.log(`💾 [AUTO-TRAINING] Estado actual de webKnowledge: ${currentCount} conceptos`);
              return prev;
            });
            
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `📖 Página ${i + 1}/${urls.length} del tema "${topic}":\n✅ ${conceptsFromThisPage} conceptos aprendidos\n🌐 ${url.substring(0, 60)}...\n\n💾 Total acumulado en esta sesión: ${totalConceptsLearned} conceptos nuevos`
            }]);
          } else {
            console.error(`❌ [AUTO-TRAINING] Error leyendo ${url}:`, result?.error || 'Error desconocido');
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `⚠️ Página ${i + 1}/${urls.length}: No se pudo leer ${url.substring(0, 50)}...\n${result?.error || 'Error desconocido'}`
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
      // Obtener el estado actual de webKnowledge y knowledge
      setWebKnowledge(prev => {
        const finalWebCount = prev.length;
        console.log(`📊 [STOP-AUTO-TRAINING] Final webKnowledge count: ${finalWebCount}`);
        
        // Obtener knowledge count de forma síncrona
        setKnowledge(currentKnowledge => {
          const finalKnowledgeCount = currentKnowledge.length;
          const finalTotal = finalWebCount + finalKnowledgeCount;
          
          console.log(`📊 [STOP-AUTO-TRAINING] Estadísticas finales:`);
          console.log(`   - Web: ${finalWebCount}`);
          console.log(`   - Conversaciones: ${finalKnowledgeCount}`);
          console.log(`   - Total: ${finalTotal}`);
          
          setMessages(prevMessages => [...prevMessages, {
            role: 'assistant',
            content: `✅ ¡Aprendizaje automático completado!\n\nSoy Luxio, creado por Lucio Tapia. He explorado internet automáticamente y aprendido de todas las páginas web disponibles.\n\n📊 Estadísticas:\n• ${finalWebCount} conceptos aprendidos de internet 🌐\n• ${finalKnowledgeCount} conceptos de conversaciones 💬\n• ${finalTotal} conceptos totales almacenados\n• Nivel de aprendizaje: ${learningRate}%\n\n💾 Todo el conocimiento ha sido almacenado correctamente.\n\n¡Ahora soy mucho más inteligente! Pregúntame sobre cualquier tema que investigué. 🧠✨`
          }]);
          
          return currentKnowledge;
        });
        
        return prev;
      });
    }, 2000); // Aumentado a 2 segundos para dar más tiempo
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
                text: cleanText.substring(0, 50000), // Aumentado de 10000 a 50000 caracteres (5x más)
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

  // Función mejorada de auto-aprendizaje web usando APIs gratuitas
  const extractContentWithAPI = async (url) => {
    if (!FREE_API_KEY) {
      return null;
    }

    try {
      const prompt = `Extrae los conceptos principales y conocimientos clave de esta URL: ${url}. Responde SOLO con un JSON válido sin markdown, con este formato: {"concepts": ["concepto1", "concepto2"], "summary": "resumen breve", "keyPoints": ["punto1", "punto2"]}`;

      let response;
      if (FREE_API_TYPE === 'groq') {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                content: "Eres un extractor de conocimiento. Responde SOLO con JSON válido, sin markdown ni explicaciones."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.3
          })
        });
      } else if (FREE_API_TYPE === 'openai') {
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
                content: "Eres un extractor de conocimiento. Responde SOLO con JSON válido, sin markdown ni explicaciones."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000
          })
        });
      } else {
        return null;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const textContent = data.choices?.[0]?.message?.content || '';
      
      // Limpiar el texto de posibles backticks de markdown
      const cleanText = textContent.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanText);
      } catch (e) {
        // Si no es JSON válido, crear estructura básica
        return {
          concepts: cleanText.split('\n').filter(line => line.trim().length > 0).slice(0, 20),
          summary: cleanText.substring(0, 200),
          keyPoints: cleanText.split('.').filter(s => s.trim().length > 10).slice(0, 5)
        };
      }
    } catch (error) {
      console.error(`Error procesando ${url}:`, error);
      return null;
    }
  };

  // Función de auto-aprendizaje web mejorada
  const startAutoWebLearning = async () => {
    if (!FREE_API_KEY) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ No puedo iniciar el auto-aprendizaje. Necesito una API key gratuita.\n\n🔑 **Opciones GRATUITAS:**\n\n1. **Groq (RECOMENDADO - Gratis y rápido):**\n   • Ve a https://console.groq.com/\n   • Crea cuenta gratis\n   • Obtén tu API key\n   • Agrega: REACT_APP_GROQ_API_KEY=tu_key\n\n2. **OpenAI (Créditos gratis iniciales):**\n   • Ve a https://platform.openai.com/\n   • Crea cuenta (tiene $5 gratis)\n   • Agrega: REACT_APP_OPENAI_API_KEY=tu_key`
      }]);
      return;
    }

    autoWebLearningRef.current = true;
    setAutoWebLearningActive(true);
    setAutoWebLearningStats({ pagesVisited: 0, conceptsLearned: 0, totalWords: 0 });
    setAutoWebLearningLog([]);

    const addLog = (message, type = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      setAutoWebLearningLog(prev => [...prev, { time: timestamp, message, type }]);
    };

    addLog('🚀 Iniciando auto-aprendizaje mejorado...', 'success');

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🚀 **Auto-Aprendizaje Mejorado Activado**\n\nVoy a explorar ${seedUrls.length} páginas web automáticamente y aprender TODO el conocimiento disponible.\n\n📚 Proceso:\n• Explorando cada página cuidadosamente\n• Extrayendo conceptos, hechos y datos\n• Almacenando en mi base de conocimientos\n• Aprendiendo como un estudiante\n\nEsto puede tomar varios minutos...`
    }]);

    for (let i = 0; i < seedUrls.length && autoWebLearningRef.current; i++) {
      const url = seedUrls[i];
      setCurrentURL(url);
      addLog(`📖 Explorando: ${url}`, 'info');

      const content = await extractContentWithAPI(url);
      
      if (content && content.concepts) {
        // Convertir conceptos a formato webKnowledge
        const newConcepts = content.concepts.map(concept => ({
          concept: concept,
          topic: `Auto-aprendizaje: ${url.substring(0, 50)}`,
          source: 'auto_web_learning',
          summary: content.summary || '',
          url: url,
          timestamp: Date.now(),
          keyPoints: content.keyPoints || []
        }));

        // Agregar a webKnowledge - NUNCA filtrar duplicados, guardar TODO
        setWebKnowledge(prev => {
          const updated = [...prev, ...newConcepts];
          // Guardar inmediatamente después de actualizar
          setTimeout(() => saveToStorage(), 100);
          return updated;
        });

        const conceptsCount = content.concepts.length;
        const wordsCount = content.summary?.split(' ').length || 0;

        setAutoWebLearningStats(prev => ({
          pagesVisited: prev.pagesVisited + 1,
          conceptsLearned: prev.conceptsLearned + conceptsCount,
          totalWords: prev.totalWords + wordsCount
        }));

        setMemorySize(prev => prev + conceptsCount);
        setLearningRate(prev => Math.min(prev + 5, 100));

        addLog(`✅ Aprendidos ${conceptsCount} conceptos nuevos`, 'success');

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📖 **Página ${i + 1}/${seedUrls.length}:** ${url.substring(0, 60)}...\n\n✅ **Aprendidos:** ${conceptsCount} conceptos nuevos\n📝 **Resumen:** ${content.summary?.substring(0, 150)}...\n\n💾 Total acumulado: ${autoWebLearningStats.conceptsLearned + conceptsCount} conceptos`
        }]);
      } else {
        addLog(`⚠️ No se pudo procesar: ${url}`, 'warning');
      }

      // Pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (autoWebLearningRef.current) {
      addLog('🎉 Auto-aprendizaje completado!', 'success');
      setAutoWebLearningActive(false);
      autoWebLearningRef.current = false;

      // Guardar datos
      saveToStorage();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **Auto-Aprendizaje Completado!**\n\n📊 **Estadísticas Finales:**\n• ${autoWebLearningStats.pagesVisited} páginas visitadas\n• ${autoWebLearningStats.conceptsLearned} conceptos aprendidos\n• ${autoWebLearningStats.totalWords} palabras procesadas\n\n💾 Todo el conocimiento ha sido almacenado correctamente.\n\n¡Ahora sé mucho más! Pregúntame sobre lo que aprendí. 🧠✨`
      }]);
    }
  };

  // Auto-aprendizaje continuo e ilimitado (sin límites)
  const startContinuousLearning = async () => {
    if (!FREE_API_KEY) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ No puedo iniciar el aprendizaje continuo. Necesito una API key gratuita.\n\n🔑 **Opciones GRATUITAS:**\n\n1. **Groq (RECOMENDADO - Gratis y rápido):**\n   • Ve a https://console.groq.com/\n   • Crea cuenta gratis\n   • Obtén tu API key\n   • Agrega: REACT_APP_GROQ_API_KEY=tu_key\n\n2. **OpenAI (Créditos gratis iniciales):**\n   • Ve a https://platform.openai.com/\n   • Crea cuenta (tiene $5 gratis)\n   • Agrega: REACT_APP_OPENAI_API_KEY=tu_key`
      }]);
      return;
    }

    autoWebLearningRef.current = true;
    setAutoWebLearningActive(true);
    setAutoWebLearningStats({ pagesVisited: 0, conceptsLearned: 0, totalWords: 0 });
    setAutoWebLearningLog([]);
    setAutoWebLearningCycle(0);

    const addLog = (message, type = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      setAutoWebLearningLog(prev => [...prev, { time: timestamp, message, type }]);
    };

    addLog('🚀 Iniciando aprendizaje continuo infinito...', 'success');
    addLog('⚡ No pararé hasta que presiones PAUSAR', 'warning');
    addLog('🌐 Aprendiendo de temas aleatorios sin límites...', 'info');

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🚀 **Aprendizaje Continuo Ilimitado Activado**\n\n⚡ **MODO ILIMITADO:** No pararé hasta que presiones PAUSAR\n\n🌐 Voy a explorar temas aleatorios de forma continua:\n• Aprendiendo 3 temas por ciclo\n• Sin límite de ciclos\n• Exploración infinita de conocimiento\n• Almacenando todo en mi base de conocimientos\n\n📚 Temas disponibles: ${searchTopics.length} temas diferentes\n\nEsto continuará indefinidamente hasta que lo detengas...`
    }]);

    let cycle = 1;

    while (autoWebLearningRef.current) {
      setAutoWebLearningCycle(cycle);
      addLog(`\n🔄 CICLO ${cycle} - Explorando nuevos temas...`, 'info');

      // Aprende 3 temas aleatorios por ciclo
      for (let i = 0; i < 3 && autoWebLearningRef.current; i++) {
        const topic = getRandomTopic();
        setCurrentURL(`Buscando: ${topic}`);

        const content = await searchAndLearn(topic);

        if (content && autoWebLearningRef.current) {
          // Convertir conceptos a formato webKnowledge
          const newConcepts = (content.concepts || []).map(concept => ({
            concept: concept,
            topic: `Aprendizaje continuo: ${content.topic || topic}`,
            source: 'continuous_learning',
            summary: content.summary || '',
            url: `search:${topic}`,
            timestamp: Date.now(),
            keyPoints: content.keyPoints || [],
            cycle: cycle
          }));

          // Agregar a webKnowledge
          // AGREGAR TODOS LOS CONCEPTOS SIN FILTRAR - NUNCA SE BORRAN
          setWebKnowledge(prev => {
            const updated = [...prev, ...newConcepts];
            // Guardar inmediatamente después de actualizar
            setTimeout(() => {
              // Usar el estado actualizado para guardar
              const knowledgeToSave = Array.isArray(knowledge) ? [...knowledge] : [];
              const webKnowledgeToSave = Array.isArray(updated) ? [...updated] : [];
              const totalConcepts = knowledgeToSave.length + webKnowledgeToSave.length;
              
              const personalityToSave = {
                ...personality,
                name: personality.name === 'NeuroAI' || personality.name === 'Usuario' ? 'Luxio' : personality.name,
                creator: personality.creator === 'Usuario' ? 'Lucio Tapia' : personality.creator
              };
              
              const data = {
                knowledge: knowledgeToSave,
                webKnowledge: webKnowledgeToSave,
                exploredUrls: [...exploredUrls],
                totalPagesExplored,
                memorySize: totalConcepts,
                learningRate,
                reasoningLevel,
                commonSenseRules: [...commonSenseRules],
                personality: personalityToSave,
                selfControl: { ...selfControl },
                generatedImages: generatedImages.slice(-20),
                timestamp: Date.now(),
                version: '2.0'
              };
              
              try {
                localStorage.setItem('ai-brain-data', JSON.stringify(data));
                localStorage.setItem('ai-brain-data-emergency', JSON.stringify(data));
                console.log('💾 Guardado inmediato después de aprendizaje continuo:', {
                  knowledge: knowledgeToSave.length,
                  webKnowledge: webKnowledgeToSave.length,
                  total: totalConcepts
                });
              } catch (error) {
                console.error('❌ Error guardando después de aprendizaje continuo:', error);
              }
            }, 200);
            return updated;
          });

          const conceptsCount = content.concepts?.length || 0;
          const wordsCount = content.summary?.split(' ').length || 0;

          setAutoWebLearningStats(prev => ({
            pagesVisited: prev.pagesVisited + 1,
            conceptsLearned: prev.conceptsLearned + conceptsCount,
            totalWords: prev.totalWords + wordsCount
          }));

          setMemorySize(prev => prev + conceptsCount);
          setLearningRate(prev => Math.min(prev + 10, 100));

          addLog(`✅ Aprendidos ${conceptsCount} conceptos de "${topic}"`, 'success');

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `📖 **Ciclo ${cycle} - Tema ${i + 1}/3:** ${topic}\n\n✅ **Aprendidos:** ${conceptsCount} conceptos nuevos\n📝 **Resumen:** ${content.summary?.substring(0, 150)}...\n\n💾 Total acumulado: ${autoWebLearningStats.conceptsLearned + conceptsCount} conceptos\n🔄 Continuando aprendizaje...`
          }]);
        }

        // Pausa entre búsquedas (3 segundos)
        if (autoWebLearningRef.current) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      if (autoWebLearningRef.current) {
        addLog(`✨ Ciclo ${cycle} completado. Continuando...`, 'success');
        cycle++;
        
        // Guardar datos periódicamente - CRÍTICO para preservar aprendizaje
        // Usar setTimeout para asegurar que el estado se haya actualizado
        setTimeout(() => {
          saveToStorage();
          console.log('💾 Guardado periódico después de ciclo de aprendizaje');
        }, 500);

        // Pausa entre ciclos (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    addLog('⏸️ Aprendizaje detenido por el usuario', 'warning');
    setAutoWebLearningActive(false);
    autoWebLearningRef.current = false;

    // Guardar datos finales
    saveToStorage();

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ **Aprendizaje Continuo Detenido**\n\n📊 **Estadísticas Finales:**\n• ${autoWebLearningStats.pagesVisited} temas explorados\n• ${autoWebLearningStats.conceptsLearned} conceptos aprendidos\n• ${autoWebLearningStats.totalWords} palabras procesadas\n• ${cycle - 1} ciclos completados\n\n💾 Todo el conocimiento ha sido almacenado correctamente.\n\n¡He aprendido mucho! Pregúntame sobre cualquier tema que exploré. 🧠✨`
    }]);
  };

  const stopAutoWebLearning = () => {
    autoWebLearningRef.current = false;
    setAutoWebLearningActive(false);
    setAutoWebLearningLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message: '⏸️ Auto-aprendizaje pausado',
      type: 'warning'
    }]);
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
          content: `🔍 No pude acceder directamente a ${url}. Buscando información sobre esta página usando IA...`
        }]);
      }

      let webContent = '';
      // MEJORADO: Siempre usar la API para extraer conocimiento, incluso si tenemos contenido
      const prompt = pageContent && pageContent.length > 100
        ? `Lee y aprende de este contenido web de la página ${url}:\n\n${pageContent.substring(0, 16000)}\n\nIMPORTANTE: Extrae TODOS los conceptos, términos, hechos, datos, nombres propios, conceptos técnicos, definiciones, explicaciones e información importante. Lista CADA concepto importante que encuentres. Sé EXTREMADAMENTE exhaustivo y detallado. Extrae al menos 2000-5000 conceptos diferentes. Incluye términos técnicos, nombres propios, conceptos científicos, datos históricos, estadísticas, fechas, lugares, personas, teorías, métodos, procesos, etc.`
        : `Busca y aprende información EXTREMADAMENTE detallada sobre esta página web: ${url}\n\nIMPORTANTE: Extrae TODOS los conceptos, términos, hechos, datos, nombres propios, conceptos técnicos, definiciones, explicaciones e información importante que puedas encontrar sobre el contenido de esta página. Lista CADA concepto importante. Sé EXTREMADAMENTE exhaustivo y detallado. Extrae al menos 2000-5000 conceptos diferentes. Incluye términos técnicos, nombres propios, conceptos científicos, datos históricos, estadísticas, fechas, lugares, personas, teorías, métodos, procesos, etc.`;
      
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
2. Extrae TODOS los conceptos, términos, palabras clave, hechos importantes, datos, información útil
3. Identifica ideas clave, definiciones, explicaciones, nombres propios, conceptos técnicos
4. Procesa la información como si estuvieras estudiando
5. Lista CADA concepto importante que encuentres (mínimo 2000-5000 conceptos)
6. Incluye términos técnicos, nombres propios, conceptos científicos, datos históricos, estadísticas, fechas, lugares, personas, teorías, métodos, procesos, definiciones, explicaciones, etc.

IMPORTANTE: Responde con una lista EXTREMADAMENTE exhaustiva de TODOS los conceptos importantes que encuentres. Sé muy detallado y extrae al menos 2000-5000 conceptos diferentes. Incluye TODO: palabras clave, términos técnicos, nombres propios, conceptos, frases importantes, datos, hechos, etc.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 8000, // Aumentado de 4000 a 8000 (2x más tokens)
            temperature: 0.2 // Reducido para más precisión
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

      // MEJORADO: Combinar contenido de la página Y respuesta de la IA para máximo conocimiento
      let contentToProcess = '';
      
      console.log('🔍 DEBUG: Verificando contenido disponible...');
      console.log('   - pageContent:', pageContent ? `${pageContent.length} chars` : 'null');
      console.log('   - webContent:', webContent ? `${webContent.length} chars` : 'null');
      
      // Combinar ambos contenidos para extraer más conceptos
      if (pageContent && pageContent.length > 100 && webContent && webContent.length > 50) {
        // Combinar ambos: contenido real + análisis de IA
        contentToProcess = `${pageContent}\n\n${webContent}`;
        console.log('✅ Usando contenido COMBINADO (página + IA):', contentToProcess.length, 'caracteres');
      } else if (pageContent && pageContent.length > 100) {
        // Si tenemos el contenido real de la página, usarlo directamente
        contentToProcess = pageContent;
        console.log('✅ Usando contenido REAL de la página:', contentToProcess.length, 'caracteres');
      } else if (webContent && webContent.length > 50) {
        // Si no, usar la respuesta de Groq (que ya tiene conceptos extraídos)
        contentToProcess = webContent;
        console.log('✅ Usando contenido de IA (Groq):', contentToProcess.length, 'caracteres');
        console.log('📄 Muestra del contenido IA (primeros 300 chars):', contentToProcess.substring(0, 300));
      } else {
        console.error('❌ ERROR: No hay contenido disponible para procesar');
        console.error('   - pageContent disponible:', !!pageContent);
        console.error('   - webContent disponible:', !!webContent);
        // Aún así, intentar con lo que tengamos
        if (webContent && webContent.length > 20) {
          contentToProcess = webContent;
          console.log('⚠️ Usando contenido mínimo disponible:', contentToProcess.length, 'caracteres');
        } else {
          return { success: false, error: 'No se pudo obtener contenido de la página' };
        }
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
        
        // MEJORADO: Extraer MÁS conceptos (hasta 5000 por página - 10x más)
        let finalConcepts = allConcepts.slice(0, 5000); // Aumentado de 500 a 5000
        
        console.log('🔍 TOTAL Conceptos extraídos (línea por línea):', finalConcepts.length);
        console.log('🔍 Primeros 30 conceptos:', finalConcepts.slice(0, 30));
        
        // SIEMPRE usar método alternativo más agresivo para extraer MÁXIMOS conceptos
        console.log('🔍 Usando método agresivo para extraer TODOS los conceptos posibles...');
        
        // Método alternativo: extraer TODAS las palabras válidas
        const allWords = contentToProcess.toLowerCase()
          .replace(/[^\w\sáéíóúñ]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 2 && w.length < 30) // Palabras de 3 a 29 caracteres
          .filter(w => !['para', 'como', 'donde', 'cuando', 'quien', 'esto', 'esta', 'este', 'pero', 'porque', 'todas', 'todos', 'hacer', 'sobre', 'entre', 'puede', 'pueden', 'tiene', 'tienen', 'desde', 'hasta', 'también', 'tambien', 'otros', 'otras', 'cada', 'todo', 'toda', 'ser', 'son', 'fue', 'fueron', 'eres', 'alguna', 'algunos', 'que', 'del', 'las', 'los', 'una', 'uno', 'con', 'por', 'sus', 'ese', 'esa', 'ese', 'esa', 'estos', 'estas', 'estos', 'estas', 'mismo', 'misma', 'mismos', 'mismas', 'muy', 'mas', 'más', 'menos', 'mucho', 'muchos', 'poco', 'pocos', 'algo', 'nada', 'todo', 'todos', 'cual', 'cuales', 'cualquier', 'cualquiera', 'tambien', 'también', 'tambien', 'también'].includes(w));
        
        const uniqueWords = [...new Set(allWords)];
        const additionalConcepts = uniqueWords.slice(0, 5000); // Agregar hasta 5000 conceptos más (10x)
        
        // Combinar sin duplicados
        const existingSet = new Set(finalConcepts);
        additionalConcepts.forEach(word => {
          if (!existingSet.has(word)) {
            finalConcepts.push(word);
            existingSet.add(word);
          }
        });
        
        finalConcepts = finalConcepts.slice(0, 8000); // Limitar a 8000 máximo (13x más)
        console.log('🔍 Conceptos totales después del método agresivo:', finalConcepts.length);
        
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
        
        // Agregar frases como conceptos adicionales (hasta 2000 - 20x más)
        phrases.slice(0, 2000).forEach(phrase => {
          if (!finalConcepts.includes(phrase)) {
            finalConcepts.push(phrase);
          }
        });
        
        finalConcepts = finalConcepts.slice(0, 10000); // Aumentado a 10,000 conceptos por página (12.5x más)
        console.log('🔍 Conceptos FINALES (incluyendo frases):', finalConcepts.length);
        
        // GARANTIZAR que siempre tengamos al menos 1000 conceptos (10x más)
        if (finalConcepts.length < 1000) {
          console.warn('⚠️ Pocos conceptos extraídos. Forzando extracción adicional agresiva...');
          // Extraer incluso palabras más cortas si es necesario
          const emergencyWords = contentToProcess.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 1 && w.length < 30)
            .filter(w => !['el', 'la', 'de', 'en', 'un', 'una', 'es', 'son', 'que', 'del', 'las', 'los', 'con', 'por', 'para', 'como', 'sus', 'ese', 'esa', 'estos', 'estas'].includes(w));
          
          const emergencyUnique = [...new Set(emergencyWords)];
          const existingSet = new Set(finalConcepts);
          emergencyUnique.slice(0, 5000).forEach(word => {
            if (!existingSet.has(word) && finalConcepts.length < 10000) {
              finalConcepts.push(word);
              existingSet.add(word);
            }
          });
          
          // También extraer n-gramas (secuencias de 3-4 palabras)
          const words = contentToProcess.toLowerCase().replace(/[^\w\sáéíóúñ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
          for (let i = 0; i < words.length - 2 && finalConcepts.length < 10000; i++) {
            const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            if (trigram.length > 10 && trigram.length < 50 && !existingSet.has(trigram)) {
              finalConcepts.push(trigram);
              existingSet.add(trigram);
            }
          }
          
          console.log('🔍 Conceptos después de extracción de emergencia agresiva:', finalConcepts.length);
        }

        // Usar una función de callback para asegurar que el estado se actualice correctamente
        let conceptsLearned = 0;
        let actualConceptsAdded = 0; // Declarar fuera del if para que esté disponible en todo el scope
        
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
          
          // CRÍTICO: Usar una función que garantice la actualización del estado
          await new Promise(resolve => {
            setWebKnowledge(prev => {
              try {
                // NUNCA FILTRAR DUPLICADOS - AGREGAR TODOS LOS CONCEPTOS SIEMPRE
                const beforeLength = prev.length;
                const updated = [...prev, ...newKnowledgeArray];
                const afterLength = updated.length;
                actualConceptsAdded = afterLength - beforeLength;
                
                console.log('💾 [readAndLearnFromWeb] DENTRO de setWebKnowledge:');
                console.log('   - URL:', url);
                console.log('   - Antes:', beforeLength);
                console.log('   - Después:', afterLength);
                console.log('   - Agregados:', actualConceptsAdded);
                console.log('   - Esperados:', newKnowledgeArray.length);
                console.log('   - Primeros 5 conceptos nuevos:', newKnowledgeArray.slice(0, 5).map(k => k.concept));
                console.log('   ✅ TODOS los conceptos agregados (sin filtrar duplicados)');
                
                // CRÍTICO: Retornar el array actualizado
                resolve();
                return updated;
              } catch (error) {
                console.error('❌ ERROR al actualizar webKnowledge:', error);
                resolve();
                return prev; // Retornar el estado anterior si hay error
              }
            });
          });
          
          // Esperar un momento para asegurar que React procese la actualización
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // CRÍTICO: Guardar inmediatamente después de actualizar webKnowledge
          // Guardar con el estado más reciente
          saveToStorage();
          console.log('💾 Guardado inmediato después de agregar conceptos web');
          
          // Actualizar conceptos aprendidos con el valor real
          conceptsLearned = actualConceptsAdded > 0 ? actualConceptsAdded : conceptsLearned;
          
          console.log('💾 Conceptos agregados correctamente:', conceptsLearned);
          console.log('💾 actualConceptsAdded:', actualConceptsAdded);
          
          if (conceptsLearned > 0) {
            setMemorySize(prev => prev + conceptsLearned);
            setLearningRate(prev => Math.min(prev + 5, 100));
            
            // FORZAR guardado inmediato después de agregar conceptos
            setTimeout(() => {
              saveToStorage();
              console.log('💾 Guardado explícito después de agregar conceptos web');
            }, 500);
          } else {
            console.error('⚠️ ADVERTENCIA: conceptsLearned es 0 después de intentar agregar conceptos');
            console.error('   - actualConceptsAdded:', actualConceptsAdded);
            console.error('   - finalConcepts.length:', finalConcepts.length);
            console.error('   - newKnowledgeArray.length:', newKnowledgeArray.length);
          }
        } else {
          console.error('❌ NO SE PUDIERON EXTRAER CONCEPTOS DEL CONTENIDO');
          console.error('   - finalConcepts.length:', finalConcepts.length);
          console.error('   - contentToProcess.length:', contentToProcess?.length || 0);
        }

        // Esperar un momento para que el estado se actualice completamente
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar que el estado se actualizó correctamente usando una función helper
        let finalCount = 0;
        let finalFromUrl = 0;
        
        // Usar un callback para obtener el estado actual
        await new Promise(resolve => {
          setWebKnowledge(prev => {
            finalCount = prev.length;
            finalFromUrl = prev.filter(k => k.url === url).length;
            console.log('🔍 VERIFICACIÓN FINAL:');
            console.log('   - Total webKnowledge:', finalCount);
            console.log('   - Conceptos de esta URL:', finalFromUrl);
            console.log('   - conceptsLearned calculado:', conceptsLearned);
            
            // Si no hay conceptos de esta URL pero debería haberlos, forzar agregar
            if (finalFromUrl === 0 && conceptsLearned > 0) {
              console.error('❌ PROBLEMA: No se guardaron conceptos. Intentando guardar manualmente...');
              // Esto no debería pasar, pero si pasa, al menos tenemos el conteo
            }
            
            setTimeout(() => resolve(), 100);
            return prev;
          });
        });
        
        console.log('📈 Conceptos aprendidos finales:', finalFromUrl || conceptsLearned);

        return {
          success: true,
          conceptsLearned: finalFromUrl > 0 ? finalFromUrl : (conceptsLearned > 0 ? conceptsLearned : (actualConceptsAdded > 0 ? actualConceptsAdded : 0)),
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

  // Función para dividir datos en entrenamiento, validación y prueba
  const splitDataForTraining = (data, trainRatio = 0.7, valRatio = 0.15, testRatio = 0.15) => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const total = shuffled.length;
    const trainEnd = Math.floor(total * trainRatio);
    const valEnd = trainEnd + Math.floor(total * valRatio);
    return {
      training: shuffled.slice(0, trainEnd),
      validation: shuffled.slice(trainEnd, valEnd),
      test: shuffled.slice(valEnd)
    };
  };

  // Función de validación
  const validateWithData = async (validationItems) => {
    let validated = 0;
    const total = Math.min(validationItems.length, 100);
    for (const item of validationItems.slice(0, total)) {
      const concepts = item.toLowerCase().split(/[\s,;:]+/).filter(w => w.length > 3);
      const found = concepts.some(c => 
        knowledge.some(k => k.concept === c) || webKnowledge.some(k => k.concept === c)
      );
      if (found) validated++;
    }
    const accuracy = total > 0 ? (validated / total) * 100 : 0;
    return { validated, total, accuracy };
  };

  // Función de evaluación
  const evaluateWithData = async (testItems) => {
    let correct = 0;
    const total = Math.min(testItems.length, 50);
    for (const item of testItems.slice(0, total)) {
      const matches = searchKnowledge(item);
      if (matches.length > 0) correct++;
    }
    return {
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      correct,
      total,
      knowledgeSize: knowledge.length + webKnowledge.length
    };
  };

  // Función para entrenamiento con validación
  const trainWithValidation = async (text, useValidation = true) => {
    const items = text.split(/[.!?\n]+/).filter(item => item.trim().length > 10);
    
    if (useValidation && items.length > 100) {
      const split = splitDataForTraining(items, 0.7, 0.15, 0.15);
      setTrainingData(split.training);
      setValidationData(split.validation);
      setTestData(split.test);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📊 Datos divididos para aprendizaje supervisado:
• Entrenamiento: ${split.training.length} items (70%)
• Validación: ${split.validation.length} items (15%)
• Prueba: ${split.test.length} items (15%)

🚀 Iniciando entrenamiento...`
      }]);
      
      const trainCount = await trainWithText(split.training.join('. '));
      const valResult = await validateWithData(split.validation);
      const testMetrics = await evaluateWithData(split.test);
      
      setTrainingMetrics(prev => ({
        accuracy: testMetrics.accuracy,
        lastTrainingDate: new Date().toISOString(),
        trainingCycles: prev.trainingCycles + 1
      }));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Validación: ${valResult.validated}/${valResult.total} reconocidos (${valResult.accuracy.toFixed(1)}%)
📊 Prueba: ${testMetrics.correct}/${testMetrics.total} correctos (${testMetrics.accuracy.toFixed(1)}% precisión)`
      }]);
      
      return { trainCount, valResult, testMetrics, totalProcessed: trainCount };
    } else {
      return await trainWithText(text);
    }
  };

  // Función para aprendizaje continuo
  const continuousLearning = async () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🔄 Iniciando aprendizaje continuo... Mejorando con nuevos datos.'
    }]);
    
    const newData = knowledge.slice(-1000);
    if (newData.length > 100) {
      const textData = newData.map(k => k.context || k.concept).join('. ');
      const result = await trainWithValidation(textData, true);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Aprendizaje continuo completado!
📊 Precisión: ${result.testMetrics?.accuracy?.toFixed(1) || 0}%
🧠 Ciclo: ${trainingMetrics.trainingCycles + 1}
💾 Total: ${knowledge.length + webKnowledge.length} conceptos`
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'ℹ️ Necesitas más datos para reentrenar. Continúa conversando.'
      }]);
    }
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
      content: '🚀 Iniciando entrenamiento masivo con validación... ⏳'
    }]);
    
    // Usar validación si el archivo es grande (>10KB)
    const useValidation = trainingText.length > 10000;
    const result = await trainWithValidation(trainingText, useValidation);
    const count = typeof result === 'number' ? result : result.totalProcessed;
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ ¡Entrenamiento completado! 

📊 Estadísticas:
• ${count} entradas/oraciones procesadas
• ${knowledge.length} conceptos totales en memoria
• ${commonSenseRules.length} reglas de sentido común
• Razonamiento: ${reasoningLevel}%
• Tasa de aprendizaje: ${learningRate}%
${typeof result === 'object' && result.testMetrics ? `• Precisión: ${result.testMetrics.accuracy.toFixed(1)}%` : ''}

🎓 Tu IA ahora tiene acceso al conocimiento!`
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
          const importedKnowledge = brainData.knowledge || [];
          const importedWebKnowledge = brainData.webKnowledge || [];
          const totalImported = importedKnowledge.length + importedWebKnowledge.length;
          
          console.log('📦 Importando datos del archivo:');
          console.log('   - knowledge:', importedKnowledge.length);
          console.log('   - webKnowledge:', importedWebKnowledge.length);
          console.log('   - Total:', totalImported);
          
          // CRÍTICO: Actualizar las refs INMEDIATAMENTE antes de establecer el estado
          knowledgeRef.current = importedKnowledge;
          webKnowledgeRef.current = importedWebKnowledge;
          
          console.log('🔧 Refs actualizadas después de importar:');
          console.log('   - knowledgeRef:', knowledgeRef.current.length);
          console.log('   - webKnowledgeRef:', webKnowledgeRef.current.length);
          
          setKnowledge(importedKnowledge);
          setWebKnowledge(importedWebKnowledge);
          setCommonSenseRules(brainData.commonSenseRules || initialCommonSense);
          setMemorySize(brainData.memorySize || totalImported);
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
          window.lastLoadTime = Date.now();
          
          // CRÍTICO: Esperar antes de guardar para que el estado se actualice completamente
          // Y usar las refs que ya están actualizadas
          setTimeout(() => {
            // Verificar que los estados se actualizaron correctamente
            setKnowledge(currentKnowledge => {
              setWebKnowledge(currentWebKnowledge => {
                console.log('🔍 Verificación después de importar:');
                console.log('   - knowledge estado:', currentKnowledge.length);
                console.log('   - webKnowledge estado:', currentWebKnowledge.length);
                console.log('   - knowledgeRef:', knowledgeRef.current.length);
                console.log('   - webKnowledgeRef:', webKnowledgeRef.current.length);
                
                // Si el estado está vacío pero las refs tienen datos, restaurar desde las refs
                if (currentWebKnowledge.length === 0 && webKnowledgeRef.current.length > 0) {
                  console.error('❌ CRÍTICO: webKnowledge se perdió después de importar! Restaurando desde refs...');
                  setWebKnowledge([...webKnowledgeRef.current]);
                  setMemorySize(currentKnowledge.length + webKnowledgeRef.current.length);
                }
                
                // Guardar usando las refs (más confiables)
                const knowledgeToSave = [...knowledgeRef.current];
                const webKnowledgeToSave = [...webKnowledgeRef.current];
                const totalToSave = knowledgeToSave.length + webKnowledgeToSave.length;
                
                const personalityToSave = {
                  ...restoredPersonality,
                  name: restoredPersonality.name === 'NeuroAI' || restoredPersonality.name === 'Usuario' ? 'Luxio' : restoredPersonality.name,
                  creator: restoredPersonality.creator === 'Usuario' ? 'Lucio Tapia' : restoredPersonality.creator
                };
                
                const dataToSave = {
                  knowledge: knowledgeToSave,
                  webKnowledge: webKnowledgeToSave,
                  exploredUrls: brainData.exploredUrls || [],
                  totalPagesExplored: brainData.totalPagesExplored || 0,
                  memorySize: totalToSave,
                  learningRate: brainData.learningRate || Math.min((brainData.knowledge?.length || 0) / 100, 100),
                  reasoningLevel: brainData.reasoningLevel || Math.min((brainData.knowledge?.length || 0) / 136, 100),
                  commonSenseRules: brainData.commonSenseRules || initialCommonSense,
                  personality: personalityToSave,
                  selfControl: brainData.selfControl || {
                    enabled: true,
                    autoLearning: true,
                    autoDecision: true,
                    selfMonitoring: true,
                    learningRate: 0,
                    decisionConfidence: 100,
                    selfAwareness: 100
                  },
                  generatedImages: brainData.generatedImages || [],
                  timestamp: Date.now(),
                  version: '2.0'
                };
                
                // PRIMERO: Intentar guardar en IndexedDB (más capacidad, no se llena)
                if (dbRef.current) {
                  try {
                    const transaction = dbRef.current.transaction(['brainData'], 'readwrite');
                    const objectStore = transaction.objectStore('brainData');
                    objectStore.put({
                      id: 'main',
                      data: dataToSave,
                      timestamp: Date.now()
                    });
                    console.log('✅ Datos guardados en IndexedDB después de importar (capacidad ilimitada)');
                    
                    // También intentar guardar en localStorage como backup
                    try {
                      localStorage.setItem('ai-brain-data-emergency', JSON.stringify({
                        knowledge: knowledgeToSave,
                        webKnowledge: webKnowledgeToSave,
                        timestamp: Date.now(),
                        version: '2.0'
                      }));
                    } catch (e) {
                      console.warn('⚠️ No se pudo guardar en localStorage, pero está en IndexedDB');
                    }
                    
                    setMessages(prev => [...prev, {
                      role: 'assistant',
                      content: `✅ **Datos importados y guardados exitosamente en IndexedDB!**\n\n📊 Datos guardados:\n• ${knowledgeToSave.length} conceptos de conversaciones\n• ${webKnowledgeToSave.length} conceptos de internet\n• ${knowledgeToSave.length + webKnowledgeToSave.length} conceptos totales\n\n💾 **Almacenamiento**: IndexedDB (capacidad ilimitada, no se llenará)\n\n✅ Los datos están guardados correctamente y no se perderán.`
                    }]);
                    return; // Salir si se guardó en IndexedDB
                  } catch (idbError) {
                    console.warn('⚠️ Error guardando en IndexedDB:', idbError);
                  }
                }
                
                // SEGUNDO: Intentar guardar en localStorage (fallback)
                try {
                  localStorage.setItem('ai-brain-data', JSON.stringify(dataToSave));
                  localStorage.setItem('ai-brain-data-emergency', JSON.stringify(dataToSave));
                  console.log('✅ Guardado después de importar:', {
                    knowledge: knowledgeToSave.length,
                    webKnowledge: webKnowledgeToSave.length,
                    total: totalToSave
                  });
                } catch (error) {
                  if (error.name === 'QuotaExceededError') {
                    console.error('❌ localStorage lleno después de importar');
                    console.log('🔄 Intentando usar IndexedDB...');
                    
                    // Intentar IndexedDB si localStorage está lleno
                    // Inicializar IndexedDB si no está listo
                    const initAndSaveToIndexedDB = () => {
                      return new Promise((resolve) => {
                        if (dbRef.current) {
                          // IndexedDB ya está inicializado
                          try {
                            const transaction = dbRef.current.transaction(['brainData'], 'readwrite');
                            const objectStore = transaction.objectStore('brainData');
                            const request = objectStore.put({
                              id: 'main',
                              data: dataToSave,
                              timestamp: Date.now()
                            });
                            
                            request.onsuccess = () => {
                              console.log('✅ Datos guardados en IndexedDB (localStorage estaba lleno)');
                              setMessages(prev => [...prev, {
                                role: 'assistant',
                                content: `✅ **Datos importados y guardados exitosamente en IndexedDB!**\n\n📊 Datos guardados:\n• ${knowledgeToSave.length} conceptos de conversaciones\n• ${webKnowledgeToSave.length} conceptos de internet\n• ${knowledgeToSave.length + webKnowledgeToSave.length} conceptos totales\n\n💾 **Almacenamiento**: IndexedDB (capacidad ilimitada)\n⚠️ localStorage estaba lleno, pero los datos están seguros en IndexedDB.\n\n✅ Los datos están guardados correctamente y no se perderán.`
                              }]);
                              resolve(true);
                            };
                            
                            request.onerror = () => {
                              console.error('❌ Error guardando en IndexedDB:', request.error);
                              resolve(false);
                            };
                          } catch (idbError) {
                            console.error('❌ Error en transacción IndexedDB:', idbError);
                            resolve(false);
                          }
                        } else if (window.indexedDB) {
                          // Intentar inicializar IndexedDB
                          console.log('🔄 IndexedDB no inicializado, inicializando...');
                          const openRequest = indexedDB.open('LuxioBrainDB', 1);
                          
                          openRequest.onsuccess = () => {
                            dbRef.current = openRequest.result;
                            setIndexedDBReady(true);
                            console.log('✅ IndexedDB inicializado');
                            
                            try {
                              const transaction = dbRef.current.transaction(['brainData'], 'readwrite');
                              const objectStore = transaction.objectStore('brainData');
                              const saveRequest = objectStore.put({
                                id: 'main',
                                data: dataToSave,
                                timestamp: Date.now()
                              });
                              
                              saveRequest.onsuccess = () => {
                                console.log('✅ Datos guardados en IndexedDB después de inicializar');
                                setMessages(prev => [...prev, {
                                  role: 'assistant',
                                  content: `✅ **Datos importados y guardados exitosamente en IndexedDB!**\n\n📊 Datos guardados:\n• ${knowledgeToSave.length} conceptos de conversaciones\n• ${webKnowledgeToSave.length} conceptos de internet\n• ${knowledgeToSave.length + webKnowledgeToSave.length} conceptos totales\n\n💾 **Almacenamiento**: IndexedDB (capacidad ilimitada)\n⚠️ localStorage estaba lleno, pero los datos están seguros en IndexedDB.\n\n✅ Los datos están guardados correctamente y no se perderán.`
                                }]);
                                resolve(true);
                              };
                              
                              saveRequest.onerror = () => {
                                console.error('❌ Error guardando en IndexedDB:', saveRequest.error);
                                resolve(false);
                              };
                            } catch (idbError) {
                              console.error('❌ Error en transacción IndexedDB:', idbError);
                              resolve(false);
                            }
                          };
                          
                          openRequest.onerror = () => {
                            console.error('❌ Error inicializando IndexedDB:', openRequest.error);
                            resolve(false);
                          };
                          
                          openRequest.onupgradeneeded = (event) => {
                            const db = event.target.result;
                            if (!db.objectStoreNames.contains('brainData')) {
                              const objectStore = db.createObjectStore('brainData', { keyPath: 'id' });
                              objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                              console.log('✅ ObjectStore creado en IndexedDB');
                            }
                          };
                        } else {
                          console.warn('⚠️ IndexedDB no disponible en este navegador');
                          resolve(false);
                        }
                      });
                    };
                    
                    // Intentar guardar en IndexedDB y esperar el resultado ANTES de continuar
                    initAndSaveToIndexedDB().then((success) => {
                      if (success) {
                        // Si IndexedDB guardó exitosamente, no hacer nada más
                        console.log('✅ Datos guardados en IndexedDB, no es necesario limpiar localStorage');
                        return; // Salir completamente
                      }
                      
                      // Si falló IndexedDB, continuar con la limpieza de localStorage
                      console.log('🧹 IndexedDB no disponible o falló, limpiando localStorage...');
                      
                      // Continuar con la limpieza de localStorage
                      console.log('🧹 Limpiando TODOS los backups y datos no críticos...');
                      
                      // Eliminar TODOS los backups
                      const allKeys = [];
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key) {
                          allKeys.push(key);
                        }
                      }
                      
                      // Eliminar todos los backups
                      allKeys.forEach(key => {
                        if (key.startsWith('ai-brain-backup-')) {
                          localStorage.removeItem(key);
                        }
                      });
                      
                      // Eliminar otros datos no críticos
                      allKeys.forEach(key => {
                        if (key !== 'ai-brain-data' && 
                            key !== 'ai-brain-data-emergency' && 
                            !key.startsWith('ai-brain-backup-') &&
                            key !== 'luxio-creator-auth') {
                          try {
                            localStorage.removeItem(key);
                          } catch (e) {
                            // Ignorar errores al eliminar
                          }
                        }
                      });
                      
                      // Intentar guardar solo datos críticos
                      try {
                        const criticalData = {
                          knowledge: knowledgeToSave,
                          webKnowledge: webKnowledgeToSave,
                          timestamp: Date.now(),
                          version: '2.0'
                        };
                        
                        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(criticalData));
                        console.log('✅ Guardado crítico en emergencia después de limpiar');
                      } catch (emergencyError) {
                        console.error('❌ Error crítico: No se pudo guardar ni siquiera los datos críticos');
                        console.error('   localStorage está completamente lleno');
                        
                        // Mostrar mensaje al usuario con botón para limpiar
                        setMessages(prev => [...prev, {
                          role: 'assistant',
                          content: `⚠️ **Alerta crítica:**\n\nEl almacenamiento del navegador está completamente lleno. Los datos se han importado correctamente (${knowledgeToSave.length} knowledge + ${webKnowledgeToSave.length} webKnowledge = ${knowledgeToSave.length + webKnowledgeToSave.length} total), pero no se pudieron guardar.\n\n**Solución rápida:**\nPresiona el botón "🧹 Limpiar localStorage" en el panel lateral para liberar espacio automáticamente.\n\n**O manualmente:**\n1. Abre las herramientas de desarrollador (F12)\n2. Ve a la pestaña "Application" o "Almacenamiento"\n3. Busca "Local Storage" → "http://localhost:3000"\n4. Elimina manualmente las claves antiguas\n5. Recarga la página\n\nLos datos están en memoria pero se perderán al recargar si no se guardan.`
                        }]);
                      }
                    });
                  } else {
                    console.error('❌ Error al guardar después de importar:', error);
                  }
                }
                
                return currentWebKnowledge;
              });
              return currentKnowledge;
            });
          }, 500);
          
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
    
    // NUNCA BORRAR knowledge o webKnowledge - son datos críticos que deben preservarse
    // setKnowledge([]); // DESHABILITADO - NUNCA BORRAR CONCEPTOS
    // setWebKnowledge([]); // DESHABILITADO - NUNCA BORRAR CONCEPTOS
    
    // Solo limpiar datos no críticos
    setExploredUrls([]);
    setTotalPagesExplored(0);
    setWebURLs([]);
    // NO limpiar memorySize, learningRate, reasoningLevel porque dependen de knowledge/webKnowledge
    // setMemorySize(0); // DESHABILITADO
    // setLearningRate(0); // DESHABILITADO
    // setReasoningLevel(0); // DESHABILITADO
    setCommonSenseRules(initialCommonSense);
    await saveToStorage();

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🧹 Memoria limpiada completamente. Todo mi conocimiento web y conversacional ha sido borrado. Puedo empezar a entrenarme de nuevo.\n\n💾 **Nota**: Se creó un backup automático antes de limpiar. Puedes restaurarlo usando "Importar Backup" si lo necesitas.'
    }]);
  };

  // Función para verificar el tamaño del localStorage
  const checkLocalStorageSize = () => {
    let totalSize = 0;
    const items = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        items.push({
          key,
          size: size,
          sizeMB: (size / 1024 / 1024).toFixed(2)
        });
      }
    }
    
    const totalMB = (totalSize / 1024 / 1024).toFixed(2);
    const maxSize = 5 * 1024 * 1024; // 5MB típico para localStorage
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
    const percentage = ((totalSize / maxSize) * 100).toFixed(1);
    
    console.log('📊 Estado del localStorage:');
    console.log(`   - Tamaño total usado: ${totalMB} MB`);
    console.log(`   - Límite aproximado: ${maxSizeMB} MB`);
    console.log(`   - Porcentaje usado: ${percentage}%`);
    console.log('   - Items almacenados:');
    items.sort((a, b) => b.size - a.size).forEach(item => {
      console.log(`     • ${item.key}: ${item.sizeMB} MB`);
    });
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `📊 **Estado del almacenamiento:**\n\n💾 **localStorage del navegador:**\n• Tamaño usado: ${totalMB} MB\n• Límite aproximado: ${maxSizeMB} MB\n• Porcentaje usado: ${percentage}%\n\n📦 **Items más grandes:**\n${items.sort((a, b) => b.size - a.size).slice(0, 5).map(item => `• ${item.key}: ${item.sizeMB} MB`).join('\n')}\n\n**Dónde se almacenan los datos:**\n• \`ai-brain-data\`: Datos principales (knowledge + webKnowledge)\n• \`ai-brain-data-emergency\`: Backup de emergencia\n• \`ai-brain-backup-*\`: Backups automáticos\n\n**Ubicación física:**\nLos datos se almacenan en el navegador (Chrome/Edge: C:\\Users\\[Usuario]\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Local Storage)`
    }]);
  };

  // Nueva función para limpiar localStorage completamente
  const clearLocalStorage = () => {
    try {
      // Hacer backup de los datos actuales antes de limpiar
      const currentKnowledge = knowledgeRef.current || knowledge;
      const currentWebKnowledge = webKnowledgeRef.current || webKnowledge;
      
      // Exportar los datos actuales como backup
      const backupData = {
        knowledge: currentKnowledge,
        webKnowledge: currentWebKnowledge,
        timestamp: Date.now(),
        version: '2.0'
      };
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `luxio-backup-antes-de-limpiar-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Limpiar TODO el localStorage excepto la autenticación del creador
      const keysToKeep = ['luxio-creator-auth'];
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          allKeys.push(key);
        }
      }
      
      let deletedCount = 0;
      allKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          deletedCount++;
        } catch (e) {
          // Ignorar errores
        }
      });
      
      // Guardar los datos actuales en el localStorage limpio
      try {
        localStorage.setItem('ai-brain-data', JSON.stringify(backupData));
        localStorage.setItem('ai-brain-data-emergency', JSON.stringify(backupData));
        
        // Actualizar las refs
        knowledgeRef.current = currentKnowledge;
        webKnowledgeRef.current = currentWebKnowledge;
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ **localStorage limpiado exitosamente!**\n\n🧹 Se eliminaron ${deletedCount} elementos del almacenamiento.\n💾 Se creó un backup automático antes de limpiar (descargado automáticamente).\n✅ Los datos actuales (${currentKnowledge.length} knowledge + ${currentWebKnowledge.length} webKnowledge = ${currentKnowledge.length + currentWebKnowledge.length} total) se guardaron correctamente.\n\nAhora deberías poder importar tus datos sin problemas.`
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ **localStorage limpiado pero error al guardar:**\n\n🧹 Se eliminaron ${deletedCount} elementos.\n💾 Se creó un backup automático (descargado).\n❌ Error al guardar: ${error.message}\n\nPor favor, recarga la página e importa el backup descargado.`
        }]);
      }
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error al limpiar localStorage: ${error.message}`
      }]);
    }
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
    // Auto-conciencia: 100% si hay conocimiento, o calcular basado en conocimiento
    const awareness = totalKnowledge > 0 ? 100 : Math.min(100, Math.floor((totalKnowledge / 1000) * 10 + (reasoningLevel / 10)));
    // Confianza en decisiones: 100% siempre (la IA tiene confianza total en sus decisiones)
    const confidence = 100;
    
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
    
    // NUNCA LIMITAR - AGREGAR TODOS LOS CONCEPTOS SIEMPRE
    setKnowledge(prev => [...prev, ...newKnowledge]);
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
                    
                    // Información del diccionario RAE deshabilitada - no mostrar en respuestas
                    // if (usefulMatch && !response.toLowerCase().includes(usefulMatch.concept)) {
                    //   if (usefulMatch.context && usefulMatch.context.includes(':')) {
                    //     const parts = usefulMatch.context.split(':');
                    //     if (parts.length >= 2) {
                    //       const word = parts[0].trim();
                    //       const definition = parts.slice(1).join(':').trim();
                    //       if (word.length >= 2 && definition.length >= 20) {
                    //         response += `\n\n📚 **Información del diccionario RAE:**\n**${word}**: ${definition.substring(0, 300)}`;
                    //       }
                    //     }
                    //   }
                    // }
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
            
            // Información del diccionario RAE deshabilitada - no mostrar en respuestas
            // if (usefulMatch && !response.toLowerCase().includes(usefulMatch.concept)) {
            //   if (usefulMatch.context && usefulMatch.context.includes(':')) {
            //     const parts = usefulMatch.context.split(':');
            //     if (parts.length >= 2) {
            //       const word = parts[0].trim();
            //       const definition = parts.slice(1).join(':').trim();
            //       if (word.length >= 2 && definition.length >= 20) {
            //         response += `\n\n📚 **Información del diccionario RAE:**\n**${word}**: ${definition.substring(0, 300)}`;
            //       }
            //     }
            //   }
            // }
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

        {/* Panel de Auto-Aprendizaje Web Mejorado */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-white" size={20} />
            <h3 className="text-white font-semibold">Auto-Aprendizaje Web</h3>
          </div>
          
          {autoWebLearningActive && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-white text-sm">Aprendiendo...</p>
              </div>
              {currentURL && (
                <p className="text-purple-200 text-xs truncate">📍 {currentURL}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-black bg-opacity-30 rounded p-2 text-center">
              <div className="text-white text-lg font-bold">{autoWebLearningStats.pagesVisited}</div>
              <div className="text-xs text-gray-200">Páginas</div>
            </div>
            <div className="bg-black bg-opacity-30 rounded p-2 text-center">
              <div className="text-white text-lg font-bold">{autoWebLearningStats.conceptsLearned}</div>
              <div className="text-xs text-gray-200">Conceptos</div>
            </div>
            <div className="bg-black bg-opacity-30 rounded p-2 text-center">
              <div className="text-white text-lg font-bold">{autoWebLearningStats.totalWords}</div>
              <div className="text-xs text-gray-200">Palabras</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={autoWebLearningActive ? stopAutoWebLearning : startAutoWebLearning}
              disabled={!FREE_API_KEY}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                autoWebLearningActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : FREE_API_KEY
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {autoWebLearningActive ? (
                <>
                  <Pause size={18} />
                  Pausar
                </>
              ) : (
                <>
                  <Play size={18} />
                  Iniciar Auto-Aprendizaje
                </>
              )}
            </button>

            <button
              onClick={autoWebLearningActive ? stopAutoWebLearning : startContinuousLearning}
              disabled={!FREE_API_KEY || autoWebLearningActive}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                FREE_API_KEY && !autoWebLearningActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Zap size={18} />
              Aprendizaje Continuo Ilimitado
            </button>
          </div>

          {autoWebLearningCycle > 0 && (
            <div className="mt-3 bg-black bg-opacity-30 rounded p-2 text-center">
              <div className="text-white text-sm font-semibold">Ciclo {autoWebLearningCycle}</div>
              <div className="text-xs text-gray-300">Aprendizaje continuo activo</div>
            </div>
          )}

          {!FREE_API_KEY && (
            <p className="text-xs text-yellow-200 mt-2 text-center">
              ⚠️ Necesitas API key para usar esta función
            </p>
          )}

          {autoWebLearningLog.length > 0 && (
            <div className="mt-3 bg-black bg-opacity-30 rounded p-2 max-h-32 overflow-y-auto">
              <div className="text-xs text-gray-300 space-y-1">
                {autoWebLearningLog.slice(-5).map((entry, idx) => (
                  <div key={idx} className={`${
                    entry.type === 'error' ? 'text-red-400' : 
                    entry.type === 'success' ? 'text-green-400' : 
                    entry.type === 'warning' ? 'text-yellow-400' : 
                    'text-gray-300'
                  }`}>
                    <span className="text-gray-500">[{entry.time}]</span> {entry.message}
                  </div>
                ))}
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
          
          <button
            onClick={checkLocalStorageSize}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-3 hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Database size={18} />
            📊 Ver almacenamiento
          </button>
          
          <button
            onClick={clearLocalStorage}
            className="w-full bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-lg p-3 hover:from-yellow-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <AlertCircle size={18} />
            🧹 Limpiar localStorage
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
              placeholder={!creatorAuth ? "Escribe tu nombre (Lucio Tapia) para comenzar..." : (autoTrainingActive ? "Estoy aprendiendo de internet... Espera o escribe" : creatorName ? `Escribe tu comando, ${creatorName}... (ej: "Aprende sobre IA")` : "Pregúntame sobre lo que aprendí de internet... 🌐")}
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
