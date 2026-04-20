window.views = window.views || {};

const EMOJIS = ['😀','😂','🥰','😎','🤔','👍','🙌','🔥','🎉','❤️','✅','🚀','👋','✨','🤝','💰','🚨','📉'];
let replyToMessage = null;

window.views.chat = {
  render: () => {
    const leads = window.db.getLeads();
    
    // Select first lead as active chat for simplicity
    const activeLead = leads[0];
    const messages = window.db.data.messages[activeLead.id] || [];

    const renderContact = (lead, isActive) => `
      <div class="chat-contact ${isActive ? 'active' : ''}">
        <div class="contact-avatar">${lead.name.charAt(0)}</div>
        <div class="contact-info">
          <div class="contact-top">
            <span class="contact-name">${lead.name}</span>
            <span class="contact-time">${lead.lastMessageTime}</span>
          </div>
          <div class="contact-msg text-ellipsis">${lead.lastMessage}</div>
        </div>
      </div>
    `;

    const renderMessage = (msg) => {
      const isSent = msg.sender === 'agent';
      return `
        <div class="msg-wrapper ${isSent ? 'sent' : 'received'}" data-id="${msg.id}" onclick="window.setReply('${msg.id}', '${msg.text.replace(/'/g, "\\'")}')" style="cursor: pointer;">
          <div class="msg-bubble">
            ${msg.replyTo ? `<div style="background: rgba(0,0,0,0.05); padding: 4px 8px; border-left: 4px solid var(--primary-color); border-radius: 4px; font-size: 11px; margin-bottom: 4px; opacity: 0.8;">${msg.replyTo}</div>` : ''}
            ${msg.type === 'media' ? `<div style="display:flex; align-items:center; gap:8px; background: rgba(0,0,0,0.05); padding: 8px; border-radius: 8px; margin-bottom: 4px;"><i data-lucide="${msg.mediaIcon}"></i> ${msg.mediaName}</div>` : ''}
            ${msg.type === 'view_once' ? `<div style="color: var(--primary-color); font-weight: 500; display:flex; align-items:center; gap:4px;"><i data-lucide="eye" style="width:14px;height:14px;"></i> Mensagem de visualização única</div>` : msg.text}
            <div class="msg-time">
              ${msg.time}
              ${isSent ? '<i data-lucide="check-check" style="width:14px; height:14px; color: #34b7f1;"></i>' : ''}
            </div>
          </div>
        </div>
      `;
    };

    return `
      <div class="chat-view">
        <!-- Sidebar Contacts -->
        <div class="chat-sidebar">
          <div class="chat-search-bar">
            <input type="text" placeholder="Pesquisar ou começar uma nova conversa">
          </div>
          <div class="chat-contacts">
            ${leads.map(l => renderContact(l, l.id === activeLead.id)).join('')}
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="chat-main">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="contact-avatar" style="width: 40px; height: 40px; font-size: 16px;">${activeLead.name.charAt(0)}</div>
              <div>
                <div style="font-weight: 600;">${activeLead.name}</div>
                <div style="font-size: 12px; opacity: 0.7;">${activeLead.phone}</div>
              </div>
            </div>
            <div class="chat-header-actions">
              <i data-lucide="search" style="cursor: pointer;"></i>
              <i data-lucide="more-vertical" style="cursor: pointer;"></i>
            </div>
          </div>

          <!-- Messages -->
          <div class="chat-messages" id="chat-messages">
            <div style="text-align: center; margin: 16px 0;">
              <span style="background: var(--bg-color); padding: 4px 12px; border-radius: 8px; font-size: 12px; opacity: 0.8; box-shadow: var(--shadow-sm);">Hoje</span>
            </div>
            ${messages.map(renderMessage).join('')}
          </div>

          <!-- Chat Input -->
          <div class="chat-input-area" style="position: relative; flex-direction: column; align-items: stretch;">
            
            <!-- Reply Preview (Hidden by default) -->
            <div id="reply-preview" class="hidden" style="background: var(--secondary-color); padding: 8px 12px; border-left: 4px solid var(--primary-color); border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: -12px; z-index: 5;">
               <div style="font-size: 12px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="reply-text"></div>
               <i data-lucide="x" style="width:16px; cursor:pointer;" id="cancel-reply"></i>
            </div>

            <!-- Attachment Menu (Hidden by default) -->
            <div id="attach-menu" class="hidden" style="position: absolute; bottom: 80px; left: 60px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); padding: 8px; display: flex; flex-direction: column; gap: 4px; z-index: 100;">
              <div class="attach-option" data-type="image"><i data-lucide="image" style="color: #3b82f6;"></i> Imagem</div>
              <div class="attach-option" data-type="video"><i data-lucide="video" style="color: #ef4444;"></i> Vídeo</div>
              <div class="attach-option" data-type="file"><i data-lucide="file-text" style="color: #8b5cf6;"></i> Documento</div>
              <div class="attach-option" data-type="mic"><i data-lucide="mic" style="color: #10b981;"></i> Áudio</div>
              <div class="attach-option" data-type="view_once"><i data-lucide="eye" style="color: #f59e0b;"></i> Visualização Única</div>
            </div>

            <div id="emoji-picker" class="emoji-picker-container">
              ${EMOJIS.map(e => `<div class="emoji-btn">${e}</div>`).join('')}
            </div>

            <div style="display: flex; gap: 12px; align-items: flex-end;">
              <div class="chat-input-action" id="btn-ai" title="Gerar com IA">
                <i data-lucide="bot" style="color: #10b981;"></i>
              </div>
              <div class="chat-input-action" id="btn-emoji" title="Emojis">
                <i data-lucide="smile"></i>
              </div>
              <div class="chat-input-action" id="btn-attach" title="Anexar">
                <i data-lucide="paperclip"></i>
              </div>
              
              <div class="chat-input-wrapper">
                <input type="text" id="chat-input" class="chat-input-field" placeholder="Digite uma mensagem" autocomplete="off">
              </div>

              <div class="chat-input-action" id="btn-send">
                <i data-lucide="send" style="color: var(--primary-color);"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  afterRender: () => {
    const messagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const btnEmoji = document.getElementById('btn-emoji');
    const emojiPicker = document.getElementById('emoji-picker');

    // Scroll to bottom initially
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Toggle Emojis
    btnEmoji.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPicker.classList.toggle('open');
      document.getElementById('attach-menu').classList.add('hidden');
    });

    // Toggle Attach Menu
    document.getElementById('btn-attach').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('attach-menu').classList.toggle('hidden');
      emojiPicker.classList.remove('open');
    });

    // Handle Reply Cancel
    document.getElementById('cancel-reply').addEventListener('click', () => {
      replyToMessage = null;
      document.getElementById('reply-preview').classList.add('hidden');
    });

    window.setReply = (id, text) => {
      replyToMessage = text;
      document.getElementById('reply-text').textContent = "Respondendo: " + text;
      document.getElementById('reply-preview').classList.remove('hidden');
      chatInput.focus();
    };

    document.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        chatInput.value += e.target.textContent;
        chatInput.focus();
        emojiPicker.classList.remove('open');
      });
    });

    // Handle attach option clicks
    document.querySelectorAll('.attach-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-type');
        let icon = ''; let name = ''; let viewOnce = false;

        if(type === 'image') { icon = 'image'; name = 'imagem.jpg'; }
        if(type === 'video') { icon = 'video'; name = 'video.mp4'; }
        if(type === 'file') { icon = 'file-text'; name = 'documento.pdf'; }
        if(type === 'mic') { icon = 'mic'; name = 'audio_001.opus'; }
        if(type === 'view_once') { viewOnce = true; }

        document.getElementById('attach-menu').classList.add('hidden');
        sendRealMessage(viewOnce ? 'Mídia de visualização única' : '', type !== 'view_once' ? { type: 'media', mediaIcon: icon, mediaName: name } : { type: 'view_once' });
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if(!e.target.closest('#emoji-picker') && !e.target.closest('#btn-emoji')) {
        emojiPicker.classList.remove('open');
      }
      if(!e.target.closest('#attach-menu') && !e.target.closest('#btn-attach')) {
        document.getElementById('attach-menu').classList.add('hidden');
      }
    });

    // Send Message Logic
    const activeLeadId = window.db.getLeads()[0].id; // mock active lead
    
    const btnAi = document.getElementById('btn-ai');

    btnAi.addEventListener('click', async () => {
      const apiKey = window.db.data.automations?.openAiKey;
      if(!apiKey) {
        alert('Configure sua API Key da OpenAI no menu Automações primeiro.');
        window.app.navigate('automations');
        return;
      }

      const promptMsg = chatInput.value.trim() || 'Crie uma mensagem amigável de follow-up para um lead.';
      chatInput.value = 'Gerando resposta com IA...';
      chatInput.disabled = true;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Escreva uma mensagem curta de atendimento para Whatsapp. Contexto/Instrução: ${promptMsg}` }]
          })
        });
        
        const data = await response.json();
        chatInput.disabled = false;
        
        if(data.choices && data.choices.length > 0) {
          chatInput.value = data.choices[0].message.content.replace(/"/g, '');
        } else {
           chatInput.value = '';
           alert('Erro na resposta da API.');
        }
      } catch (e) {
        chatInput.disabled = false;
        chatInput.value = '';
        alert('Falha ao contatar OpenAI. Verifique sua chave API.');
      }
    });

    const sendRealMessage = (text, mediaData = null) => {
      if(!text && !mediaData) return;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Save state
      if(!window.db.data.messages[activeLeadId]) {
        window.db.data.messages[activeLeadId] = [];
      }
      
      const newMsg = {
        id: 'm'+Date.now(),
        text: text,
        sender: 'agent',
        time: timeStr,
        replyTo: replyToMessage,
        ...mediaData
      };

      window.db.data.messages[activeLeadId].push(newMsg);
      window.db.save();

      // Clear layout
      chatInput.value = '';
      replyToMessage = null;
      document.getElementById('reply-preview').classList.add('hidden');
      
      // Re-render chat
      const chatRoute = window.app.routes.chat;
      window.app.appEl.querySelector('.chat-main').outerHTML = new DOMParser().parseFromString(chatRoute.render(), 'text/html').querySelector('.chat-main').outerHTML;
      chatRoute.afterRender();
    };

    const sendMessage = () => {
      sendRealMessage(chatInput.value.trim());
    };

    btnSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
};
