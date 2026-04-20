window.views = window.views || {};

window.views.login = {
  render: () => {
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo">
            <i data-lucide="hexagon"></i>
            <h1>Zentryx</h1>
          </div>
          <div id="login-error" class="auth-error"></div>
          <form id="login-form" class="auth-form">
            <div class="input-group">
              <label class="input-label">E-mail</label>
              <input type="email" id="email" class="input-field" placeholder="seu@email.com" required value="admin@zentryx.com">
            </div>
            <div class="input-group">
              <label class="input-label">Senha</label>
              <input type="password" id="password" class="input-field" placeholder="••••••••" required value="admin">
            </div>
            <button type="submit" class="btn-primary auth-btn">Entrar</button>
          </form>
          <div style="margin-top:20px;font-size:12px;color:#888;">Contas teste:<br>admin@zentryx.com / admin (Ativo)<br>user@zentryx.com / user (Inativo)</div>
        </div>
      </div>
    `;
  },
  afterRender: () => {
    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const result = window.auth.login(email, password);
      
      if (result.success) {
        window.app.navigate('dashboard');
      } else {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    });
  }
};
