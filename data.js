// Data initialization and mock DB
const DB_KEY = 'zentryx_db';

const defaultData = {
  users: [
    { id: 'admin-1', email: 'admin@zentryx.com', password: 'admin', subscriptionStatus: 'active', role: 'admin' },
    { id: 'user-2', email: 'user@zentryx.com', password: 'user', subscriptionStatus: 'inactive', role: 'user' }
  ],
  leads: [
    { id: 'L1', name: 'João Silva', phone: '+55 11 99999-9999', status: 'new', tags: ['Quente'], lastMessage: 'Olá, gostaria de saber mais.', lastMessageTime: '10:30' },
    { id: 'L2', name: 'Maria Souza', phone: '+55 21 98888-8888', status: 'in_progress', tags: ['Frio'], lastMessage: 'Podemos falar amanhã?', lastMessageTime: '09:15' },
    { id: 'L3', name: 'Tech Store BR', phone: '+55 31 97777-7777', status: 'proposal', tags: ['VIP'], lastMessage: 'Gostei da proposta, vamos fechar.', lastMessageTime: 'Ontem' },
    { id: 'L4', name: 'Clínica Sorriso', phone: '+55 41 96666-6666', status: 'closed', tags: ['Cliente'], lastMessage: 'Pagamento efetuado!', lastMessageTime: 'Segunda-feira' }
  ],
  tags: [
    { id: 'T1', name: 'Quente', type: 'quente' },
    { id: 'T2', name: 'Frio', type: 'frio' },
    { id: 'T3', name: 'VIP', type: 'hot' },
    { id: 'T4', name: 'Cliente', type: 'cliente' },
  ],
  messages: {
    'L1': [
      { id: 'm1', text: 'Boa tarde, Zentryx CRM?', sender: 'lead', time: '10:28' },
      { id: 'm2', text: 'Tudo bem? Gostaria de saber mais informações.', sender: 'lead', time: '10:30' }
    ]
  },
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#f1f5f9',
    textColor: '#1e293b'
  },
  automations: {
    webhookUrl: '',
    openAiKey: ''
  }
};

class Database {
  constructor() {
    this.data = JSON.parse(localStorage.getItem(DB_KEY));
    if (!this.data) {
      this.data = defaultData;
      this.save();
    }
    
    // Migration: ensure automations exist
    if (!this.data.automations) {
      this.data.automations = defaultData.automations;
      this.save();
    }

    this.applyTheme();
  }

  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  }

  // Users
  getUser(email, password) {
    return this.data.users.find(u => u.email === email && u.password === password);
  }

  // Leads
  getLeads(status = null) {
    if (status) return this.data.leads.filter(l => l.status === status);
    return this.data.leads;
  }

  updateLeadStatus(leadId, newStatus) {
    const lead = this.data.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      this.save();
    }
  }

  // Theme
  updateTheme(settings) {
    this.data.theme = { ...this.data.theme, ...settings };
    this.save();
    this.applyTheme();
  }

  applyTheme() {
    const root = document.documentElement;
    if (this.data.theme.primaryColor) root.style.setProperty('--primary-color', this.data.theme.primaryColor);
    if (this.data.theme.secondaryColor) root.style.setProperty('--secondary-color', this.data.theme.secondaryColor);
    if (this.data.theme.textColor) root.style.setProperty('--text-color', this.data.theme.textColor);
  }
}

window.db = new Database();
