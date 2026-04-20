window.views = window.views || {};

window.views.automations = {
  render: () => {
    return `
      <div class="topbar">
        <h2 class="page-title">Automações</h2>
        <button class="btn-primary flex items-center gap-2" onclick="alert('Funcionalidade em desenvolvimento')"><i data-lucide="plus" style="width:16px;"></i> Nova Automação</button>
      </div>
      <div class="view-container">
        
        <div style="margin-bottom: 32px; background: var(--bg-color); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
           <h3 style="margin-bottom: 16px;">Fluxos Ativos</h3>
           
           <div style="display: flex; flex-direction: column; gap: 16px;">
             <!-- Flow 1 -->
             <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <div style="display: flex; gap: 16px; align-items: center;">
                  <div style="background: rgba(37, 99, 235, 0.1); color: var(--primary-color); padding: 12px; border-radius: 8px;">
                    <i data-lucide="message-square-plus"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600;">Boas-vindas para Novo Lead</div>
                    <div style="font-size: 13px; opacity: 0.7;">Quando lead entrar na etapa "Novo" → enviar mensagem de saudação</div>
                  </div>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <span class="tag tag-quente" style="background: rgba(34, 197, 94, 0.1); color: #16a34a;">Ativo</span>
                  <i data-lucide="more-vertical" style="opacity: 0.5; cursor: pointer;"></i>
                </div>
             </div>

             <!-- Flow 2 -->
             <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <div style="display: flex; gap: 16px; align-items: center;">
                  <div style="background: rgba(37, 99, 235, 0.1); color: var(--primary-color); padding: 12px; border-radius: 8px;">
                    <i data-lucide="clock"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600;">Follow-up Automático</div>
                    <div style="font-size: 13px; opacity: 0.7;">Após 24h sem resposta em "Proposta" → enviar lembrete</div>
                  </div>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <span class="tag tag-frio">Inativo</span>
                  <i data-lucide="more-vertical" style="opacity: 0.5; cursor: pointer;"></i>
                </div>
             </div>
           </div>
        </div>

        <h3 style="margin-bottom: 16px;">Integrações e IA</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
           
           <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="background: rgba(37, 99, 235, 0.1); color: var(--primary-color); padding: 16px; border-radius: 8px;">
                  <i data-lucide="webhook"></i>
                </div>
                <div>
                  <div style="font-weight: 600;">Sua URL de Webhook</div>
                  <div style="font-size: 12px; opacity: 0.7;">Receba leads de fontes externas (Facebook, Forms)</div>
                </div>
              </div>
              <div class="input-group" style="margin-bottom: 0; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px dashed var(--border-color);">
                <code id="webhook-display-url" style="font-size: 11px; word-break: break-all; color: var(--primary-color);">https://${window.location.hostname}/api/webhook</code>
                <button id="btn-copy-webhook" class="btn-secondary w-full" style="margin-top: 12px; font-size: 12px;">Copiar URL</button>
              </div>
              <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                 <button id="btn-test-webhook" class="btn-primary w-full" style="background: #10b981;">Simular Envio de Lead (POST)</button>
                 <div id="webhook-test-result" style="font-size: 11px; margin-top: 8px; padding: 8px; border-radius: 4px; display:none;"></div>
              </div>
           </div>

           <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 16px; border-radius: 8px;">
                  <i data-lucide="bot"></i>
                </div>
                <div>
                  <div style="font-weight: 600;">Assistente IA (OpenAI)</div>
                  <div style="font-size: 12px; opacity: 0.7;">Gere respostas e resumos no chat</div>
                </div>
              </div>
              <div class="input-group" style="margin-bottom: 0;">
                <input type="password" id="openai-key" class="input-field" placeholder="sk-..." value="${window.db.data.automations?.openAiKey ? '***************' : ''}">
                <button id="btn-save-ai" class="btn-secondary w-full" style="margin-top: 8px; border: 1px solid var(--border-color);">Salvar API Key</button>
                <div style="font-size: 11px; margin-top: 8px; opacity: 0.6; color: var(--text-color);">A chave será salva localmente no navegador.</div>
              </div>
           </div>

        </div>

      </div>
    `;
  },
  afterRender: () => {
    // Initialize automations config array if missing
    if(!window.db.data.automations) {
      window.db.data.automations = { webhookUrl: '', openAiKey: '' };
    }

    const btnCopy = document.getElementById('btn-copy-webhook');
    const displayUrl = document.getElementById('webhook-display-url').textContent;
    
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(displayUrl);
      btnCopy.textContent = 'Copiado!';
      setTimeout(() => btnCopy.textContent = 'Copiar URL', 2000);
    });

    const btnTest = document.getElementById('btn-test-webhook');
    const resultDiv = document.getElementById('webhook-test-result');

    btnTest.addEventListener('click', async () => {
      btnTest.disabled = true;
      btnTest.textContent = 'Enviando...';
      
      try {
        const response = await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Lead de Teste',
            phone: '+55 11 91234-5678',
            email: 'teste@exemplo.com'
          })
        });

        const data = await response.json();
        
        resultDiv.style.display = 'block';
        if (data.success) {
          resultDiv.style.background = '#dcfce7';
          resultDiv.style.color = '#166534';
          resultDiv.innerHTML = `<strong>Sucesso!</strong> Lead recebido pela API: ${data.lead.name}`;
          
          // Re-render dashboard or pipeline to show new data? 
          // (In a real app, the server would save to DB and we'd refetch)
          // For now, let's manually add it to window.db so the user sees it immediately
          window.db.data.leads.push({
            id: 'webhook-' + Date.now(),
            name: data.lead.name,
            phone: data.lead.phone,
            status: 'new',
            tags: ['Webhook'],
            lastMessage: 'Vindo do Webhook',
            lastMessageTime: 'Agora'
          });
          window.db.save();
        } else {
          resultDiv.style.background = '#fee2e2';
          resultDiv.style.color = '#991b1b';
          resultDiv.textContent = 'Erro na API: ' + (data.error || 'Falha desconhecida');
        }
      } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fee2e2';
        resultDiv.style.color = '#991b1b';
        resultDiv.textContent = 'Erro de conexão: Verifique se o deploy no Vercel foi concluído.';
      } finally {
        btnTest.disabled = false;
        btnTest.textContent = 'Simular Envio de Lead (POST)';
      }
    });

    const btnAi = document.getElementById('btn-save-ai');
    const inputAi = document.getElementById('openai-key');

    btnAi.addEventListener('click', () => {
      const key = inputAi.value.trim();
      if(key && !key.includes('***')) {
          window.db.data.automations.openAiKey = key;
          window.db.save();
      }
      
      btnAi.textContent = 'Trabalhando...';
      setTimeout(() => {
        btnAi.textContent = 'Salvo com sucesso!';
        btnAi.style.background = '#10b981';
        btnAi.style.color = 'white';
        setTimeout(() => {
          btnAi.textContent = 'Salvar API Key';
          btnAi.style.background = 'var(--secondary-color)';
          btnAi.style.color = 'var(--text-color)';
        }, 2000);
      }, 500);
    });
  }
};
