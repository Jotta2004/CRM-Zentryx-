window.views = window.views || {};

window.views.pending = {
  render: () => {
    return `
      <div class="auth-page">
        <div class="auth-card">
          <i data-lucide="clock" class="pending-icon mx-auto flex justify-center w-full"></i>
          <h2 class="pending-title">Aguardando liberação</h2>
          <p class="pending-text">
            Sua conta foi criada, mas ainda não realizou ou confirmou o pagamento da assinatura. 
            Assim que confirmado com o administrador, seu acesso será liberado.
          </p>
          <button class="btn-secondary auth-btn" onclick="window.auth.logout()">Voltar ao Login</button>
        </div>
      </div>
    `;
  },
  afterRender: () => {}
};
