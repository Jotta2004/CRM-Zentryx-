window.views = window.views || {};

window.views.settings = {
  render: () => {
    const theme = window.db.data.theme;

    return `
      <div class="topbar">
        <h2 class="page-title">Configurações e Tema</h2>
      </div>
      <div class="view-container">
        <div class="card" style="max-width: 600px;">
          <h3 style="margin-bottom: 24px;">Conexão WhatsApp</h3>
          
          <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
            <div id="qr-container" style="background: white; padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 220px; height: 220px;">
              <img id="whatsapp-qr" src="qr_code.png" style="width: 180px; height: 180px; object-fit: contain;">
              <div id="qr-status-icon" class="hidden" style="color: #10b981; margin-top: 16px;"><i data-lucide="check-circle" style="width: 48px; height: 48px;"></i></div>
            </div>
            <div style="flex: 1;">
              <h4 style="margin-bottom: 8px;">Conecte seu aparelho</h4>
              <ol style="margin-left: 20px; color: var(--text-color); opacity: 0.8; font-size: 14px; margin-bottom: 16px; line-height: 1.8;">
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em <strong>Mais opções</strong> ou <strong>Configurações</strong></li>
                <li>Selecione <strong>Aparelhos conectados</strong></li>
                <li>Toque em <strong>Conectar um aparelho</strong></li>
                <li>Aponte a tela para capturar o código QR</li>
              </ol>
              <div id="connection-status" style="display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; color: #ef4444;">
                <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#ef4444;"></span> Desconectado
              </div>
              <button id="btn-mock-scan" class="btn-primary" style="margin-top: 16px; opacity: 0.1;">(Simular Scan)</button>
            </div>
          </div>

          <h3 style="margin-bottom: 24px;">Aparência</h3>
          
          <div class="input-group">
            <label class="input-label">Tema Base (Modo Escuro)</label>
            <div style="display:flex; gap: 16px; margin-top: 8px;">
              <button class="btn-secondary" id="btn-theme-light" style="padding: 12px 24px;">Claro</button>
              <button class="btn-secondary" id="btn-theme-dark" style="padding: 12px 24px;">Escuro</button>
            </div>
          </div>

          <div style="margin-top: 32px; margin-bottom: 16px; font-weight: 600;">Personalização de Cores (Nível SaaS)</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="input-group">
              <label class="input-label">Cor Principal (HEX)</label>
              <div style="display:flex; gap: 8px; align-items:center;">
                <input type="color" id="primary-color-pick" value="${theme.primaryColor}" style="width: 40px; height: 40px; padding:0; border:none; cursor:pointer; background:none;">
                <input type="text" id="primary-color-hex" class="input-field" value="${theme.primaryColor}" style="text-transform:uppercase;">
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Cor Secundária (HEX)</label>
               <div style="display:flex; gap: 8px; align-items:center;">
                <input type="color" id="secondary-color-pick" value="${theme.secondaryColor}" style="width: 40px; height: 40px; padding:0; border:none; cursor:pointer; background:none;">
                <input type="text" id="secondary-color-hex" class="input-field" value="${theme.secondaryColor}" style="text-transform:uppercase;">
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Cor do Texto (HEX)</label>
               <div style="display:flex; gap: 8px; align-items:center;">
                <input type="color" id="text-color-pick" value="${theme.textColor}" style="width: 40px; height: 40px; padding:0; border:none; cursor:pointer; background:none;">
                <input type="text" id="text-color-hex" class="input-field" value="${theme.textColor}" style="text-transform:uppercase;">
              </div>
            </div>
          </div>

          <div style="margin-top: 32px;">
            <button id="btn-save-theme" class="btn-primary w-full" style="padding: 14px;">Salvar Personalização</button>
          </div>
        </div>
      </div>
    `;
  },
  afterRender: () => {
    // Theme Dark/Light
    const root = document.documentElement;
    const btnLight = document.getElementById('btn-theme-light');
    const btnDark = document.getElementById('btn-theme-dark');

    const updateBtns = () => {
      if(root.getAttribute('data-theme') === 'dark') {
        btnDark.style.border = '2px solid var(--primary-color)';
        btnLight.style.border = 'none';
      } else {
        btnLight.style.border = '2px solid var(--primary-color)';
        btnDark.style.border = 'none';
      }
    };

    btnLight.addEventListener('click', () => {
      root.removeAttribute('data-theme');
      updateBtns();
    });

    btnDark.addEventListener('click', () => {
      root.setAttribute('data-theme', 'dark');
      updateBtns();
    });
    updateBtns();

    // Color Pickers
    const bindColors = (idInput, idPick) => {
      const pick = document.getElementById(idPick);
      const input = document.getElementById(idInput);
      
      pick.addEventListener('input', (e) => {
        input.value = e.target.value.toUpperCase();
        // Live Preview (temporary)
        if(idInput.includes('primary')) root.style.setProperty('--primary-color', input.value);
        if(idInput.includes('secondary')) root.style.setProperty('--secondary-color', input.value);
        if(idInput.includes('text')) root.style.setProperty('--text-color', input.value);
      });

      input.addEventListener('input', (e) => {
        if(e.target.value.length === 7) {
          pick.value = e.target.value;
          // Live Preview (temporary)
          if(idInput.includes('primary')) root.style.setProperty('--primary-color', e.target.value);
          if(idInput.includes('secondary')) root.style.setProperty('--secondary-color', e.target.value);
          if(idInput.includes('text')) root.style.setProperty('--text-color', e.target.value);
        }
      });
    };

    bindColors('primary-color-hex', 'primary-color-pick');
    bindColors('secondary-color-hex', 'secondary-color-pick');
    bindColors('text-color-hex', 'text-color-pick');

    // Save
    // QRCode Mock Logic
    const qrImg = document.getElementById('whatsapp-qr');
    const qrStatusIcon = document.getElementById('qr-status-icon');
    const statusText = document.getElementById('connection-status');
    const btnSimulate = document.getElementById('btn-mock-scan');

    // Retrieve state logic if needed, simplify for now:
    let isConnected = localStorage.getItem('zentryx_wa_connected') === 'true';
    if(isConnected) {
      qrImg.classList.add('hidden');
      qrStatusIcon.classList.remove('hidden');
      statusText.innerHTML = '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981;"></span> Conectado';
      statusText.style.color = '#10b981';
      btnSimulate.textContent = '(Desconectar)';
    }

    btnSimulate.addEventListener('click', () => {
      isConnected = !isConnected;
      localStorage.setItem('zentryx_wa_connected', isConnected);
      
      if(isConnected) {
        qrImg.style.opacity = '0.5';
        btnSimulate.textContent = 'Conectando...';
        setTimeout(() => {
          qrImg.classList.add('hidden');
          qrImg.style.opacity = '1';
          qrStatusIcon.classList.remove('hidden');
          statusText.innerHTML = '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981;"></span> Conectado';
          statusText.style.color = '#10b981';
          btnSimulate.textContent = '(Desconectar WhatsApp)';
          btnSimulate.style.opacity = '1';
          window.lucide.createIcons();
        }, 1000);
      } else {
        qrImg.classList.remove('hidden');
        qrStatusIcon.classList.add('hidden');
        statusText.innerHTML = '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#ef4444;"></span> Desconectado';
        statusText.style.color = '#ef4444';
        btnSimulate.textContent = '(Simular Scan QR Code)';
        btnSimulate.style.opacity = '0.5';
      }
    });

    document.getElementById('btn-save-theme').addEventListener('click', () => {
      window.db.updateTheme({
        primaryColor: document.getElementById('primary-color-hex').value,
        secondaryColor: document.getElementById('secondary-color-hex').value,
        textColor: document.getElementById('text-color-hex').value
      });
      alert('Tema atualizado com sucesso e salvo!');
    });
  }
};
