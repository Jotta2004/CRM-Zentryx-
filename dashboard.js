window.views = window.views || {};

window.views.dashboard = {
  render: () => {
    const leads = window.db.getLeads();
    const newLeads = leads.filter(l => l.status === 'new').length;
    const inProgress = leads.filter(l => l.status === 'in_progress').length;
    const closed = leads.filter(l => l.status === 'closed').length;
    
    return `
      <div class="topbar">
        <h2 class="page-title">Dashboard</h2>
      </div>
      <div class="view-container">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <div class="card" style="display:flex; align-items:center; gap: 16px;">
            <div style="padding: 16px; background: var(--secondary-color); border-radius: 50%; color: var(--primary-color);">
              <i data-lucide="users"></i>
            </div>
            <div>
              <div style="font-size: 14px; opacity: 0.7;">Total de Leads</div>
              <div style="font-size: 24px; font-weight: 700;">${leads.length}</div>
            </div>
          </div>
          
          <div class="card" style="display:flex; align-items:center; gap: 16px;">
            <div style="padding: 16px; background: var(--tag-client); border-radius: 50%; color: var(--success);">
              <i data-lucide="check-circle"></i>
            </div>
            <div>
              <div style="font-size: 14px; opacity: 0.7;">Leads Fechados</div>
              <div style="font-size: 24px; font-weight: 700;">${closed}</div>
            </div>
          </div>

          <div class="card" style="display:flex; align-items:center; gap: 16px;">
            <div style="padding: 16px; background: var(--tag-cold); border-radius: 50%; color: var(--info);">
              <i data-lucide="clock"></i>
            </div>
            <div>
              <div style="font-size: 14px; opacity: 0.7;">Em Atendimento</div>
              <div style="font-size: 24px; font-weight: 700;">${inProgress}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom: 16px;">Atividade Recente (Leads Novos)</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                <th style="padding: 12px 8px; font-weight: 500; opacity: 0.7;">Nome</th>
                <th style="padding: 12px 8px; font-weight: 500; opacity: 0.7;">Telefone</th>
                <th style="padding: 12px 8px; font-weight: 500; opacity: 0.7;">Status</th>
                <th style="padding: 12px 8px; font-weight: 500; opacity: 0.7;">Ação</th>
              </tr>
            </thead>
            <tbody>
              ${leads.filter(l => l.status === 'new').map(lead => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 16px 8px; font-weight: 500;">${lead.name}</td>
                  <td style="padding: 16px 8px; opacity: 0.8;">${lead.phone}</td>
                  <td style="padding: 16px 8px;">
                    <span class="tag tag-frio">Novo</span>
                  </td>
                  <td style="padding: 16px 8px;">
                    <button class="btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="window.app.navigate('chat')">Atender</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  afterRender: () => {}
};
