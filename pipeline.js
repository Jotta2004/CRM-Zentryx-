window.views = window.views || {};

const renderLeadCard = (lead) => {
  const getTagClass = (tag) => {
    if(tag.toLowerCase() === 'quente') return 'tag-quente';
    if(tag.toLowerCase() === 'frio') return 'tag-frio';
    if(tag.toLowerCase() === 'cliente') return 'tag-cliente';
    return 'tag-frio';
  };

  return `
    <div class="lead-card" draggable="true" data-id="${lead.id}">
      <div class="lead-header">
        <span class="lead-name">${lead.name}</span>
        <button onclick="window.app.navigate('chat')" style="color: var(--primary-color)"><i data-lucide="message-circle" style="width:16px;"></i></button>
      </div>
      <div style="font-size: 12px; opacity:0.6; margin-bottom: 12px;">${lead.phone}</div>
      <div class="lead-tags">
        ${lead.tags.map(t => `<span class="tag ${getTagClass(t)}">${t}</span>`).join('')}
      </div>
      <div class="lead-msg">
        <i data-lucide="message-square"></i>
        <span>"${lead.lastMessage}"</span>
      </div>
    </div>
  `;
};

window.views.pipeline = {
  render: () => {
    const leads = window.db.getLeads();
    const cols = {
      'new': leads.filter(l => l.status === 'new'),
      'in_progress': leads.filter(l => l.status === 'in_progress'),
      'proposal': leads.filter(l => l.status === 'proposal'),
      'closed': leads.filter(l => l.status === 'closed')
    };

    return `
      <div class="topbar">
        <h2 class="page-title">Pipeline de Vendas</h2>
        <button class="btn-primary flex items-center gap-2"><i data-lucide="plus" style="width:16px;"></i> Novo Lead</button>
      </div>
      <div class="view-container">
        <div class="board">
          <div class="column" data-status="new">
            <div class="column-header">
              <span>Novos Leads</span>
              <span class="column-count">${cols['new'].length}</span>
            </div>
            <div class="column-body">
              ${cols['new'].map(renderLeadCard).join('')}
            </div>
          </div>

          <div class="column" data-status="in_progress">
            <div class="column-header">
              <span>Em Atendimento</span>
              <span class="column-count">${cols['in_progress'].length}</span>
            </div>
            <div class="column-body">
              ${cols['in_progress'].map(renderLeadCard).join('')}
            </div>
          </div>

          <div class="column" data-status="proposal">
            <div class="column-header">
              <span>Proposta Enviada</span>
              <span class="column-count">${cols['proposal'].length}</span>
            </div>
            <div class="column-body">
              ${cols['proposal'].map(renderLeadCard).join('')}
            </div>
          </div>

          <div class="column" data-status="closed">
            <div class="column-header">
              <span>Fechados</span>
              <span class="column-count">${cols['closed'].length}</span>
            </div>
            <div class="column-body">
              ${cols['closed'].map(renderLeadCard).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },
  afterRender: () => {
    // Kanban Drag & Drop Logic
    const columns = document.querySelectorAll('.column-body');
    const cards = document.querySelectorAll('.lead-card');

    let draggedCard = null;

    cards.forEach(card => {
      card.addEventListener('dragstart', function() {
        draggedCard = this;
        setTimeout(() => this.style.opacity = '0.5', 0);
      });

      card.addEventListener('dragend', function() {
        setTimeout(() => {
          draggedCard.style.opacity = '1';
          draggedCard = null;
        }, 0);
      });
    });

    columns.forEach(col => {
      col.addEventListener('dragover', function(e) {
        e.preventDefault();
      });

      col.addEventListener('drop', function() {
        if(draggedCard) {
          const newStatus = this.parentElement.getAttribute('data-status');
          const leadId = draggedCard.getAttribute('data-id');
          
          this.appendChild(draggedCard);
          window.db.updateLeadStatus(leadId, newStatus);
          
          // Webhook Trigger Logic
          const webhookUrl = window.db.data.automations?.webhookUrl;
          if(webhookUrl) {
            const leadData = window.db.getLeads().find(l => l.id === leadId);
            fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ event: 'lead_status_changed', lead: leadData, new_status: newStatus })
            }).catch(e => console.log('Webhook silenciosamente falhou na versão client:', e));
          }

          // Refresh view slightly to update counts
          setTimeout(() => window.app.handleRoute(), 50);
        }
      });
    });
  }
};
