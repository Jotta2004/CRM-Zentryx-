// store.js - Mock LocalStorage DB

const DEFAULT_THEME = {
    mainBg: '#f8fafc',
    secondaryBg: '#1e293b',
    textColor: '#0f172a'
};

const INITIAL_LEADS = [
    { id: '1', name: 'Maria Silveira', phone: '+55 11 98888-7777', status: 'new', tags: ['quente'], lastMsg: 'Gostaria de saber mais...' },
    { id: '2', name: 'Carlos Santos', phone: '+55 21 97777-6666', status: 'active', tags: ['frio'], lastMsg: 'Ainda estou avaliando.' },
    { id: '3', name: 'Tech Solutions SA', phone: '+55 31 96666-5555', status: 'proposal', tags: ['cliente', 'VIP'], lastMsg: 'Aprovamos a proposta.' }
];

const INITIAL_MESSAGES = {
    '1': [
        { id: 'm1', from: 'm', text: 'Gostaria de saber mais sobre o sistema.', time: '10:00', isOut: false },
        { id: 'm2', from: 'me', text: 'Olá Maria! Claro, o que gostaria de saber?', time: '10:05', isOut: true },
    ],
    '2': [
        { id: 'm1', from: 'c', text: 'Achei um pouco caro.', time: '09:00', isOut: false },
        { id: 'm2', from: 'me', text: 'Entendo Carlos. Podemos negociar.', time: '09:30', isOut: true },
        { id: 'm3', from: 'c', text: 'Ainda estou avaliando outras opções.', time: '09:45', isOut: false },
    ],
    '3': [
        { id: 'm1', from: 't', text: 'Aprovamos a proposta. Qual o próximo passo?', time: 'Ontem', isOut: false }
    ]
};

const Store = {
    init() {
        if (!localStorage.getItem('zentryx_users')) {
            localStorage.setItem('zentryx_users', JSON.stringify([
                { id: 1, email: 'admin@zentryx.com', password: 'admin', status: 'active', theme: DEFAULT_THEME },
                { id: 2, email: 'bloqueado@zentryx.com', password: '123', status: 'inactive', theme: DEFAULT_THEME }
            ]));
        }
        if (!localStorage.getItem('zentryx_leads')) {
            localStorage.setItem('zentryx_leads', JSON.stringify(INITIAL_LEADS));
        }
        if (!localStorage.getItem('zentryx_msgs')) {
            localStorage.setItem('zentryx_msgs', JSON.stringify(INITIAL_MESSAGES));
        }
    },
    
    getUsers() { return JSON.parse(localStorage.getItem('zentryx_users')); },
    getLeads() { return JSON.parse(localStorage.getItem('zentryx_leads')); },
    getMsgs() { return JSON.parse(localStorage.getItem('zentryx_msgs')); },
    
    updateUser(updatedUser) {
        let users = this.getUsers();
        let idx = users.findIndex(u => u.id === updatedUser.id);
        if(idx !== -1) {
            users[idx] = updatedUser;
            localStorage.setItem('zentryx_users', JSON.stringify(users));
        }
    },

    setLeads(leads) {
        localStorage.setItem('zentryx_leads', JSON.stringify(leads));
    },

    addLead(lead) {
        let leads = this.getLeads();
        leads.push(lead);
        this.setLeads(leads);
    },

    addMessage(leadId, message) {
        let msgs = this.getMsgs();
        if(!msgs[leadId]) msgs[leadId] = [];
        msgs[leadId].push(message);
        localStorage.setItem('zentryx_msgs', JSON.stringify(msgs));
        
        // Update last message in lead
        let leads = this.getLeads();
        let lead = leads.find(l => l.id === leadId);
        if(lead) {
            lead.lastMsg = message.text;
            this.setLeads(leads);
        }
    }
};

Store.init();
