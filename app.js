// Main App Router and Controller
class App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentView = null;
    this.routes = {
      'login': window.views?.login || this.stubView('Login'),
      'pending': window.views?.pending || this.stubView('Pending'),
      'dashboard': window.views?.dashboard || this.stubView('Dashboard'),
      'pipeline': window.views?.pipeline || this.stubView('Pipeline'),
      'chat': window.views?.chat || this.stubView('Chat'),
      'automations': window.views?.automations || this.stubView('Automations'),
      'settings': window.views?.settings || this.stubView('Configurações')
    };

    window.addEventListener('hashchange', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        this.navigate(link.dataset.route);
      }
    });

    // Check auth on load
    this.init();
  }

  stubView(name) {
    return {
      render: () => `<div class="view-container"><h1>${name} (Stabbed)</h1></div>`,
      afterRender: () => {}
    };
  }

  registerView(route, viewObj) {
    this.routes[route] = viewObj;
  }

  init() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    this.navigate(hash, true);
  }

  navigate(route, force = false) {
    // Auth Guards
    const isAuth = window.auth.isAuthenticated();
    const isActive = window.auth.isActive();

    if (!isAuth && route !== 'login') {
      window.location.hash = 'login';
      return;
    }

    if (isAuth && !isActive && route !== 'pending') {
      window.location.hash = 'pending';
      return;
    }

    if (isAuth && isActive && (route === 'login' || route === 'pending')) {
      window.location.hash = 'dashboard';
      return;
    }

    window.location.hash = route;
    if (force) this.handleRoute(); // Force initial render if hash is already there
  }

  handleRoute() {
    const route = window.location.hash.slice(1);
    
    // Auth Guards for direct hash access
    const isAuth = window.auth.isAuthenticated();
    const isActive = window.auth.isActive();

    if (!isAuth && route !== 'login') return this.navigate('login');
    if (isAuth && !isActive && route !== 'pending') return this.navigate('pending');

    this.currentView = route;
    this.render();
  }

  renderSidebar() {
    const user = window.auth.getUser();
    const userEmail = user?.email || 'usuário@zentryx.com';
    const initial = userEmail.charAt(0).toUpperCase();

    return `
      <aside class="sidebar">
        <div class="sidebar-header">
          <i data-lucide="hexagon" class="logo-icon"></i>
          <span class="logo-text">Zentryx CRM</span>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item ${this.currentView === 'dashboard' ? 'active' : ''}" data-route="dashboard">
            <i data-lucide="layout-dashboard"></i> Dashboard
          </div>
          <div class="nav-item ${this.currentView === 'pipeline' ? 'active' : ''}" data-route="pipeline">
            <i data-lucide="users"></i> Leads
          </div>
          <div class="nav-item ${this.currentView === 'chat' ? 'active' : ''}" data-route="chat">
            <i data-lucide="message-circle"></i> Chat
          </div>
          <div class="nav-item ${this.currentView === 'automations' ? 'active' : ''}" data-route="automations">
            <i data-lucide="zap"></i> Automações
          </div>
          <div class="nav-item ${this.currentView === 'settings' ? 'active' : ''}" data-route="settings">
            <i data-lucide="settings"></i> Configurações
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="avatar">${initial}</div>
            <div class="user-info">
              <span class="user-email">${userEmail}</span>
              <button class="logout-btn" id="logout-btn"><i data-lucide="log-out" style="width: 14px;"></i> Sair</button>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  render() {
    try {
      const view = this.routes[this.currentView];
      
      if (!view) {
        console.error(`View not found: ${this.currentView}`);
        this.appEl.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <h2 style="color: #ef4444;">Erro: Visualização não encontrada</h2>
            <p>O roteamento falhou para: <strong>${this.currentView}</strong></p>
            <button class="btn-primary" onclick="window.location.hash='login'">Voltar ao Login</button>
          </div>
        `;
        return;
      }

      if (this.currentView === 'login' || this.currentView === 'pending') {
        this.appEl.innerHTML = view.render();
      } else {
        this.appEl.innerHTML = `
          <div class="app-container">
            ${this.renderSidebar()}
            <main class="main-content">
              ${view.render()}
            </main>
          </div>
        `;
      }

      // Refresh Icons globally
      if (window.lucide) {
        window.lucide.createIcons();
      }

      if (view.afterRender) {
        view.afterRender();
      }

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => window.auth.logout());
      }
    } catch (error) {
      console.error('Render Error:', error);
      this.appEl.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #ef4444;">
          <h2>Algo deu errado</h2>
          <p>${error.message}</p>
          <pre style="text-align: left; background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 12px; overflow: auto; max-width: 100%; color: #333;">${error.stack}</pre>
          <button class="btn-primary" style="margin-top: 20px;" onclick="location.reload()">Recarregar Página</button>
        </div>
      `;
    }
  }
}

// Global error handler for diagnostic
window.onerror = function(msg, url, lineNo, columnNo, error) {
    const debug = document.createElement('div');
    debug.style.position = 'fixed';
    debug.style.bottom = '0';
    debug.style.left = '0';
    debug.style.width = '100%';
    debug.style.background = '#fee2e2';
    debug.style.color = '#991b1b';
    debug.style.padding = '10px';
    debug.style.fontSize = '12px';
    debug.style.zIndex = '9999';
    debug.innerHTML = `<strong>JS Error:</strong> ${msg} at ${url}:${lineNo}`;
    // Only show if the app element is still empty after a while
    setTimeout(() => {
        const app = document.getElementById('app');
        if (app && app.innerHTML === '') {
            document.body.appendChild(debug);
        }
    }, 1000);
    return false;
};

// Initialize app
window.views = window.views || {};
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
