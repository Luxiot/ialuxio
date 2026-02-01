/**
 * Luxio Chat Widget - Widget de conversación inteligente para CreatiWebSalta
 * Conecta con la API Luxio (Qwen + LoRA) para respuestas de IA real
 */
(function() {
  'use strict';

  const script = document.currentScript;
  const API_URL = script?.getAttribute('data-api-url') || 'http://localhost:8001';
  const BOT_NAME = script?.getAttribute('data-name') || 'CreatiWeb AI';

  const styles = `
    #luxio-widget-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
    }
    #luxio-widget-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #luxio-widget-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
    }
    #luxio-widget-btn svg {
      width: 28px;
      height: 28px;
      color: white;
    }
    #luxio-widget-panel {
      display: none;
      position: absolute;
      bottom: 76px;
      right: 0;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: linear-gradient(180deg, #fafbfc 0%, #f0f2f5 100%);
      border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
      flex-direction: column;
      overflow: hidden;
    }
    #luxio-widget-panel.open {
      display: flex;
      animation: luxio-slideUp 0.3s ease;
    }
    @keyframes luxio-slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .luxio-widget-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .luxio-widget-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .luxio-widget-header p {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }
    .luxio-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f0f2f5;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .luxio-msg {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.55;
      word-wrap: break-word;
      color: #1f2937;
    }
    .luxio-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
    }
    .luxio-msg.assistant {
      align-self: flex-start;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      color: #374151;
    }
    .luxio-msg.assistant strong {
      color: #1f2937;
    }
    .luxio-msg.assistant pre, .luxio-msg.assistant code {
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
      color: #4b5563;
    }
    .luxio-typing {
      display: flex;
      gap: 4px;
      padding: 12px;
    }
    .luxio-typing span {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      animation: luxio-bounce 1.4s infinite ease-in-out;
    }
    .luxio-typing span:nth-child(1) { animation-delay: 0s; }
    .luxio-typing span:nth-child(2) { animation-delay: 0.2s; }
    .luxio-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes luxio-bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }
    .luxio-widget-input-area {
      padding: 16px;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
    }
    .luxio-widget-input-wrap {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    #luxio-widget-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e9ecef;
      border-radius: 24px;
      font-size: 14px;
      resize: none;
      max-height: 120px;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    #luxio-widget-input:focus {
      outline: none;
      border-color: #667eea;
    }
    #luxio-widget-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, opacity 0.2s;
    }
    #luxio-widget-send:hover:not(:disabled) {
      transform: scale(1.05);
    }
    #luxio-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  const welcomeMessage = `Hola, soy ${BOT_NAME}.\n\nAsistente comercial de CreatiWebSalta. Desarrollo web profesional en Salta: sitios corporativos, e-commerce, landing pages. Presupuestos desde $150.000.\n\n¿Querés saber cuánto sale tu proyecto o qué incluye?`;

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'luxio-widget-container';

    container.innerHTML = `
      <button id="luxio-widget-btn" aria-label="Abrir chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <div id="luxio-widget-panel">
        <div class="luxio-widget-header">
          <div>
            <h3>${BOT_NAME}</h3>
            <p>Desarrollo web profesional • Presupuestos sin compromiso</p>
          </div>
        </div>
        <div class="luxio-widget-messages"></div>
        <div class="luxio-widget-input-area">
          <div class="luxio-widget-input-wrap">
            <textarea id="luxio-widget-input" placeholder="Escribe tu mensaje..." rows="1"></textarea>
            <button id="luxio-widget-send" aria-label="Enviar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;

    document.head.appendChild(styleEl);
    document.body.appendChild(container);

    const panel = document.getElementById('luxio-widget-panel');
    const messagesEl = panel.querySelector('.luxio-widget-messages');
    const inputEl = document.getElementById('luxio-widget-input');
    const sendBtn = document.getElementById('luxio-widget-send');

    addMessage('assistant', welcomeMessage);
    autoResizeTextarea(inputEl);

    document.getElementById('luxio-widget-btn').addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        inputEl.focus();
      }
    });

    sendBtn.addEventListener('click', () => sendMessage());
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    let conversationHistory = [];

    async function sendMessage() {
      const text = inputEl.value.trim();
      if (!text) return;

      addMessage('user', text);
      inputEl.value = '';
      inputEl.style.height = 'auto';

      const typingEl = addTypingIndicator();
      sendBtn.disabled = true;

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            context: conversationHistory.slice(-6)
          }),
          cache: 'no-store'
        });

        typingEl.remove();

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        const reply = data.response || 'No pude generar una respuesta.';

        addMessage('assistant', formatMessage(reply));

        conversationHistory.push(
          { role: 'user', content: text },
          { role: 'assistant', content: reply }
        );
      } catch (err) {
        typingEl.remove();
        addMessage('assistant', `⚠️ No pude conectar con el servidor. ¿Está la API en ejecución? Para probar localmente, ejecuta \`start.bat\` desde el proyecto ia luxio.`);
        console.error('CreatiWeb AI Error:', err);
      }

      sendBtn.disabled = false;
    }

    function addMessage(role, content) {
      const div = document.createElement('div');
      div.className = `luxio-msg ${role}`;
      div.innerHTML = formatMessage(content);
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'luxio-typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function formatMessage(text) {
      if (!text) return '';
      var escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      escaped = escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      escaped = escaped.replace(/(<br>|^)([\-\*])\s+/g, '$1• ');
      return escaped;
    }

    function autoResizeTextarea(el) {
      el.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
