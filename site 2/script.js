/**
 * 
 * 
 * 
 * ============================================
 * PRODFLOW | DASHBOARD DE PRODUÇÃO - SCRIPTS
 * ============================================
 */
const STORAGE_KEY = 'prodflow_user_data';
// ------------------------------------
// 1. Dados Mock (Simulando o sistema ProdFlow)
// ------------------------------------
const appData = {
    modulos: [
        { nome: "Estoque", info: "Armazena 28 bases.", estoque: [{ cor: 'Azul', quantidade: 10 }, { cor: 'Preto', quantidade: 8 }, { cor: 'Vermelho', quantidade: 10 }] },
        { nome: "Processo", processo_atual: "Peça ID: P005 - Furação (75%)", info: "Etapa de usinagem." },
        { nome: "Montagem", montagem_atual: "Pedido ID: C101 - Inserção de pino (2/5)", info: "União das peças." },
        { nome: "Expedição", info: "Armazenamento de 12 pedidos finalizados.", expedicao: [{ id: 'EXP01', pronto: true }, { id: 'EXP02', pronto: true }, { id: 'EXP03', pronto: false }, { id: 'EXP04', pronto: true }, { id: 'EXP05', pronto: false }, { id: 'EXP06', pronto: false }, { id: 'EXP07', pronto: true }, { id: 'EXP08', pronto: false }, { id: 'EXP09', pronto: false }, { id: 'EXP10', pronto: false }, { id: 'EXP11', pronto: false }, { id: 'EXP12', pronto: false } ] }
    ],
    ambiente: [
        { temp: 24.5, umidade: 62 }, { temp: 25.1, umidade: 60 }, { temp: 23.9, umidade: 65 }, { temp: 24.8, umidade: 58 }
    ],
    usuario: { 
        nome: "Sávio Zoboli", tipo: "Professor", email: "savio.z@prodflow.com", theme: "light", language: "pt-br"
    },
    statusContagem: {
        "Não iniciado": 5, "Aguardando módulo": 2, "Em processo": 3, "Finalizado": 15, "Cancelado": 1
    },
    pedidos: [
        { id: 'P1001', status: 'Em processo', modulo: 'Processo', prioridade: 'Alta', previsao: '04/12 10:30' },
        { id: 'P1002', status: 'Aguardando módulo', modulo: 'Montagem', prioridade: 'Média', previsao: '04/12 14:00' },
        { id: 'P1003', status: 'Finalizado', modulo: 'Expedição', prioridade: 'Baixa', previsao: '04/12 09:00' },
        { id: 'P1004', status: 'Não iniciado', modulo: 'Estoque', prioridade: 'Alta', previsao: '05/12 08:00' },
        { id: 'P1005', status: 'Em processo', modulo: 'Processo', prioridade: 'Média', previsao: '05/12 11:00' },
    ],
    isLoggedIn: false 
};

// ------------------------------------
// 2. Referências DOM (DOM Caching)
// ------------------------------------
const DOM = {
    loginPage: document.getElementById('login-page'),
    dashboardShell: document.getElementById('dashboard-shell'),
    
    // Formulários e Links de Autenticação
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    showRegisterLink: document.getElementById('show-register'),
    showLoginLink: document.getElementById('show-login'),
    showLoginText: document.getElementById('show-login-text'),
    logoutBtn: document.getElementById('logout-btn'),

    // Dashboard - Elementos de Renderização
    bancadaContainer: document.getElementById('bancada-container'),
    statusGridResumo: document.querySelector('.status-grid-resumo'),
    pedidosTableBody: document.getElementById('pedidos-table-body'),
    
    // Dashboard - Informações do Usuário
    userRoleSpan: document.getElementById('user-role'),
    currentUserSpan: document.getElementById('current-user'),
    
    // Perfil
    profileForm: document.getElementById('profile-form'),
    profileNameInput: document.getElementById('profile-name'),
    profileEmailInput: document.getElementById('profile-email'),
    profileLanguageSelect: document.getElementById('profile-language'),
    profileRoleInput: document.getElementById('profile-role'), 
    themeRadios: document.querySelectorAll('input[name="theme"]'),
    
    // Botões
    refreshDataButton: document.querySelector('[data-action="refresh-data"]') 
};

// Substitua pelo IP onde o seu Node-RED está rodando
const socket = new WebSocket('ws://192.168.1.50:1880/dados-bancada');

socket.onopen = () => {
    console.log("Conectado à bancada!");
};

socket.onmessage = (event) => {
    const dados = event.data;
    const display = document.getElementById('display-leitura');
    
    // Atualiza a tela com o valor recebido
    display.innerText = `Valor Atual: ${dados}`;
    
    // Opcional: Se os dados forem JSON, use JSON.parse(event.data)
};

socket.onerror = (error) => {
    console.error("Erro na conexão:", error);
};

// ------------------------------------
// 3. Utilitários e Helpers
// ------------------------------------
const getStatusClass = (status, prefix = '') => {
    const statusMap = { 
        'Não iniciado': 'secondary', 
        'Aguardando módulo': 'warning', 
        'Em processo': 'info', 
        'Finalizado': 'success', 
        'Cancelado': 'danger' 
    };
    return `${prefix}${statusMap[status] || 'secondary'}`;
};

/* =================================================== */
/* 3.1. Dados de Internacionalização (i18n) - NOVO */
/* =================================================== */
const translations = {
    'pt-br': {
        // Textos Comuns
        'app_name': 'PRODFLOW',
        'dashboard_title': 'Visão Geral do Processo',
        'perfil_title': 'Configurações de Perfil',
        'pedidos_title': 'Gerenciamento de Pedidos',
        'logout_btn': 'Sair',
        'refresh_btn': 'Atualizar Dados',
        'save_profile_btn': 'Salvar Alterações',

        // Menu
        'menu_dashboard': 'Dashboard',
        'menu_pedidos': 'Pedidos',
        'menu_perfil': 'Perfil',
        'menu_secao_principal': 'Principal',
        'menu_secao_ajustes': 'Ajustes',

        // Login
        'login_header': 'Acesse o Dashboard',
        'login_username_placeholder': 'Usuário (Simulação)',
        'login_password_placeholder': 'Senha (Simulação)',
        'login_btn': 'Entrar',
        'login_link_text_a': 'Não tem conta?',
        'login_link_text_b': 'Registre-se',
        'register_header': 'Novo Registro',
        'register_link_text_a': 'Já tem conta?',
        'register_link_text_b': 'Faça Login',
        'register_btn': 'Registrar',
        
        // Dashboard
        'card_title_modulos': 'Bancada de Módulos',
        'card_title_resumo': 'Resumo de Status',
        'card_title_pedidos_table': 'Pedidos Recentes',
        'table_header_status': 'Status',
        'table_header_modulo': 'Módulo',
        'table_header_prioridade': 'Prioridade',
        'table_header_previsao': 'Previsão',
        'alert_data_updated': 'Dados Atualizados!',

        // Perfil
        'perfil_info_header': 'Informações Pessoais',
        'perfil_settings_header': 'Ajustes da Interface',
        'perfil_name_label': 'Nome Completo',
        'perfil_email_label': 'Email',
        'perfil_role_label': 'Cargo (Somente Leitura)',
        'perfil_lang_label': 'Idioma da Interface',
        'perfil_theme_label': 'Tema',
        'perfil_theme_light': 'Claro',
        'perfil_theme_dark': 'Escuro',
        'alert_profile_success': 'Perfil atualizado com sucesso!',
        'alert_name_email_required': 'Nome e Email são obrigatórios.',
    },
    'en-us': {
        // Common Texts
        'app_name': 'PRODFLOW',
        'dashboard_title': 'Process Overview',
        'perfil_title': 'Profile Settings',
        'pedidos_title': 'Order Management',
        'logout_btn': 'Logout',
        'refresh_btn': 'Refresh Data',
        'save_profile_btn': 'Save Changes',

        // Menu
        'menu_dashboard': 'Dashboard',
        'menu_pedidos': 'Orders',
        'menu_perfil': 'Profile',
        'menu_secao_principal': 'Main',
        'menu_secao_ajustes': 'Settings',

        // Login
        'login_header': 'Access Dashboard',
        'login_username_placeholder': 'User (Simulation)',
        'login_password_placeholder': 'Password (Simulation)',
        'login_btn': 'Login',
        'login_link_text_a': 'Don\'t have an account?',
        'login_link_text_b': 'Sign Up',
        'register_header': 'New Registration',
        'register_link_text_a': 'Already have an account?',
        'register_link_text_b': 'Login',
        'register_btn': 'Register',

        // Dashboard
        'card_title_modulos': 'Module Workstation',
        'card_title_resumo': 'Status Summary',
        'card_title_pedidos_table': 'Recent Orders',
        'table_header_status': 'Status',
        'table_header_modulo': 'Module',
        'table_header_prioridade': 'Priority',
        'table_header_previsao': 'Forecast',
        'alert_data_updated': 'Data Updated!',

        // Profile
        'perfil_info_header': 'Personal Information',
        'perfil_settings_header': 'Interface Settings',
        'perfil_name_label': 'Full Name',
        'perfil_email_label': 'Email',
        'perfil_role_label': 'Role (Read-Only)',
        'perfil_lang_label': 'Interface Language',
        'perfil_theme_label': 'Theme',
        'perfil_theme_light': 'Light',
        'perfil_theme_dark': 'Dark',
        'alert_profile_success': 'Profile updated successfully!',
        'alert_name_email_required': 'Name and Email are required.',
    }
};

/** Salva os dados do usuário no localStorage. */
const saveDataToLocalStorage = () => {
    try {
        // Salva apenas os dados do usuário (nome, email, theme, language)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData.usuario));
        console.log("Dados do usuário salvos no localStorage.");
    } catch (e) {
        console.error("Erro ao salvar no localStorage:", e);
    }
};

/** Carrega os dados do usuário do localStorage e aplica. */
const loadDataFromLocalStorage = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Sobrescreve os dados mockados com os dados salvos
            appData.usuario = { ...appData.usuario, ...parsedData };
            console.log("Dados do usuário carregados do localStorage.");
        }
    } catch (e) {
        console.error("Erro ao carregar do localStorage:", e);
    }
};

/** Aplica o tema (Claro/Escuro) ao body e salva a preferência. */
const applyTheme = (theme) => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    
    // Salva a preferência se o tema mudou e o usuário está logado
    if (appData.isLoggedIn && appData.usuario.theme !== theme) {
        appData.usuario.theme = theme;
        saveDataToLocalStorage(); 
    }
};

/* =================================================== */
/* NOVO: Função para trocar o Idioma da UI */
/* =================================================== */
const switchLanguage = (lang) => {
    // Garante que o idioma existe
    const langData = translations[lang] || translations['pt-br']; 
    
    // 1. Atualiza o appData e salva
    appData.usuario.language = lang;
    saveDataToLocalStorage();
    
    // 2. Itera sobre todos os elementos com o atributo de tradução
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        
        // Verifica se a chave existe para evitar erros
        if (langData[key]) {
            el.textContent = langData[key];
        }
        
        // Para Placeholders em inputs
        if (el.placeholder && langData[`${key}_placeholder`]) {
            el.placeholder = langData[`${key}_placeholder`];
        }
    });

    // 3. Re-renderiza elementos dinâmicos que não usam data-i18n
    // Ex: Tabela de pedidos (cabeçalhos dinâmicos)
    renderPedidosTable(); 
    
    // 4. Atualiza o seletor de idioma no formulário de perfil
    if (DOM.profileLanguageSelect) {
        DOM.profileLanguageSelect.value = lang;
    }
};


// ------------------------------------
// 4. Funções de Autenticação
// ------------------------------------
const showRegisterForm = () => {
    DOM.loginForm.classList.add('hidden');
    const switchTextLogin = DOM.showRegisterLink.closest('p');
    if (switchTextLogin) switchTextLogin.classList.add('hidden');
    
    DOM.registerForm.classList.remove('hidden');
    DOM.showLoginText.classList.remove('hidden');
};

const showLoginForm = () => {
    DOM.registerForm.classList.add('hidden');
    DOM.showLoginText.classList.add('hidden');
    
    DOM.loginForm.classList.remove('hidden');
    
    const switchTextLogin = DOM.showRegisterLink.closest('p');
    if (switchTextLogin) switchTextLogin.classList.remove('hidden');
};

const handleLogin = async (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert("Preencha usuário e senha.");
        return;
    }

    // 🔵 ENVIAR DADOS PARA O NODE-RED
    try {
        const resposta = await fetch("http://localhost:1880/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: username, senha: password })
        });

        const data = await resposta.json();

        if (data.status !== "ok") {
            alert("Usuário ou senha inválidos");
            return;
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao conectar com o servidor Node-RED.");
        return;
    }

    // 🔵 SE O NODE-RED ACEITAR, DESBLOQUEAR DASHBOARD
    appData.isLoggedIn = true;

    appData.usuario.nome = username.split("@")[0];
    appData.usuario.email = username.includes("@") ? username : `${username}@prodflow.com`;
    appData.usuario.tipo = "Operador";

    saveDataToLocalStorage();

    DOM.loginPage.classList.add("hidden");
    DOM.dashboardShell.classList.remove("hidden");

    initializeApp();
};

const handleRegistration = (event) => {
    event.preventDefault();
    alert("Usuário registrado com sucesso (Simulação). Faça login agora.");
    showLoginForm();
};

const handleLogout = () => {
    appData.isLoggedIn = false;
    localStorage.removeItem(STORAGE_KEY); 
    
    // Reseta para o idioma padrão ao sair (opcional, mas comum)
    appData.usuario.language = 'pt-br';
    
    DOM.dashboardShell.classList.add('hidden');
    DOM.loginPage.classList.remove('hidden');
    
    DOM.loginForm.reset();
    if (DOM.registerForm) DOM.registerForm.reset(); 
    
    // Aplica o idioma padrão novamente na tela de login
    switchLanguage('pt-br'); 
    showLoginForm();
};

// ------------------------------------
// 5. Funções de Personalização de Perfil
// ------------------------------------

const loadProfileData = () => {
    DOM.profileNameInput.value = appData.usuario.nome;
    DOM.profileEmailInput.value = appData.usuario.email;
    
    if (DOM.profileRoleInput) DOM.profileRoleInput.value = appData.usuario.tipo;
    
    // Garante que o seletor esteja no idioma atual
    DOM.profileLanguageSelect.value = appData.usuario.language;
    
    const themeInput = document.querySelector(`input[name="theme"][value="${appData.usuario.theme}"]`);
    if (themeInput) themeInput.checked = true;
};

/** Salva as alterações feitas no formulário de Perfil */
const handleProfileSave = (event) => {
    event.preventDefault();
    
    const lang = appData.usuario.language;
    const alertNameEmailRequired = translations[lang].alert_name_email_required;
    const alertProfileSuccess = translations[lang].alert_profile_success;

    if (!DOM.profileNameInput.value || !DOM.profileEmailInput.value) {
        alert(alertNameEmailRequired);
        return;
    }
    
    // Se o idioma foi alterado pelo seletor, ele já foi salvo e aplicado pela função switchLanguage
    
    appData.usuario.nome = DOM.profileNameInput.value;
    appData.usuario.email = DOM.profileEmailInput.value;
    
    const checkedTheme = document.querySelector('input[name="theme"]:checked');
    if(checkedTheme) {
        applyTheme(checkedTheme.value); 
    }
    
    DOM.currentUserSpan.textContent = appData.usuario.nome;
    
    saveDataToLocalStorage(); 
    
    alert(alertProfileSuccess);
};


// ------------------------------------
// 6. Funções de Renderização do Dashboard
// ------------------------------------
// Funções renderEstoque, renderExpedicao, renderBancada, renderStatusResumo... (Mantidas)
// ... (Código das funções de renderização omitido por brevidade, pois não mudam a lógica central)
// ...
const renderEstoque = (modulo) => {
    const totalCapacidade = 28;
    const totalBases = modulo.estoque.reduce((acc, item) => acc + item.quantidade, 0);
    let basesHTML = `<p class="stock-summary">Bases: <strong>${totalBases}</strong>/${totalCapacidade}</p><div class="estoque-visual">`;
    
    modulo.estoque.forEach(item => {
        const corClass = `base-${item.cor.toLowerCase()}`;
        for (let i = 0; i < item.quantidade; i++) {
            basesHTML += `<div class="${corClass} base-item" title="Base ${item.cor}"></div>`;
        }
    });
    
    const espacosVazios = totalCapacidade - totalBases;
    for (let i = 0; i < espacosVazios; i++) {
        basesHTML += `<div class="base-item base-empty" title="Espaço Vazio"></div>`;
    }
    
    basesHTML += '</div>';
    return basesHTML;
};

const renderExpedicao = (modulo) => {
    const totalCapacidade = 12;
    const prontos = modulo.expedicao.filter(e => e.pronto).length;
    let expedicaoHTML = `<p class="stock-summary">Prontos: <strong>${prontos}</strong>/${totalCapacidade}</p><div class="expedicao-espacos">`;
    
    modulo.expedicao.forEach((espaco) => {
        const content = espaco.pronto ? `<i class="fas fa-box" aria-hidden="true"></i>` : ``;
        const className = espaco.pronto ? 'base-black' : 'base-empty'; 
        const titleText = espaco.pronto ? `Pedido Pronto ID: ${espaco.id}` : 'Espaço Vazio';
        
        expedicaoHTML += `<div class="base-item ${className}" title="${titleText}">${content}</div>`;
    });
    expedicaoHTML += '</div>';
    return expedicaoHTML;
};

const renderBancada = () => {
    if (!DOM.bancadaContainer) return;
    DOM.bancadaContainer.innerHTML = '';
    
    const modulosHTML = appData.modulos.map((modulo, index) => {
        let moduloContent = '';
        const ambiente = appData.ambiente[index];
        
        if (modulo.nome === "Estoque") {
            moduloContent = renderEstoque(modulo);
        } else if (modulo.nome === "Expedição") {
            moduloContent = renderExpedicao(modulo);
        } else {
            const atividade = modulo.processo_atual || modulo.montagem_atual || 'N/A';
            const progressoMatch = atividade.includes('(') ? atividade.match(/\((.*?)\)/) : null;
            const progresso = progressoMatch ? progressoMatch[1] : 'N/A';
            
            // Textos "Atividade" e "Progresso" não são estáticos e permanecem aqui, 
            // mas o ideal seria traduzir as palavras-chave no objeto appData.
            moduloContent = `
                <p class="stock-summary">Atividade: <strong>${atividade.split('(')[0].trim()}</strong></p>
                <p class="stock-summary">Progresso: <strong>${progresso}</strong></p>
            `;
        }
        
        return `
            <div class="modulo-card" role="listitem">
                <h3>${modulo.nome} <span class="status-indicator">${modulo.info}</span></h3>
                ${moduloContent}
                <div class="ambiente-data">
                    <div><i class="fas fa-thermometer-half" aria-hidden="true"></i> ${ambiente.temp}°C</div>
                    <div><i class="fas fa-tint" aria-hidden="true"></i> ${ambiente.umidade}%</div>
                </div>
            </div>
        `;
    }).join('');
    
    DOM.bancadaContainer.innerHTML = modulosHTML;
};

const renderStatusResumo = () => {
    if (!DOM.statusGridResumo) return;
    DOM.statusGridResumo.innerHTML = '';
    
    const resumoHTML = Object.entries(appData.statusContagem).map(([status, count]) => {
        const statusClass = getStatusClass(status, 'status-');
        return `<div class="status-item ${statusClass}" data-status="${status}" role="button" tabindex="0"><span class="count">${count}</span><span class="label">${status}</span></div>`;
    }).join('');
    
    DOM.statusGridResumo.innerHTML = resumoHTML;
    
    document.querySelectorAll('.status-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            alert(`Simulação: Indo para Listagem de Pedidos (RF04) e filtrando por: "${status}".`);
        });
    });
};

const renderPedidosTable = () => {
    if (!DOM.pedidosTableBody) return;
    DOM.pedidosTableBody.innerHTML = '';
    
    const lang = appData.usuario.language;
    const currentTranslations = translations[lang];

    // O código HTML deve ter th com data-i18n, mas se a renderização for JS:
    // Exemplo: document.querySelector('[data-i18n="table_header_status"]').textContent = currentTranslations.table_header_status;

    const tableRows = appData.pedidos.map(pedido => {
        const statusClass = getStatusClass(pedido.status, 'badge-'); 
        return `
            <tr>
                <td>${pedido.id}</td>
                <td><span class="table-status-badge ${statusClass}">${pedido.status}</span></td>
                <td>${pedido.modulo}</td>
                <td>${pedido.prioridade}</td>
                <td>${pedido.previsao}</td>
            </tr>
        `;
    }).join('');
    
    DOM.pedidosTableBody.innerHTML = tableRows;
};

/** SIMULAÇÃO: Atualiza os dados de ambiente e dá feedback. */
const simulateDataUpdate = () => {
    if (!DOM.refreshDataButton) return;
    
    appData.ambiente.forEach(a => {
        a.temp = parseFloat((a.temp + (Math.random() * 1 - 0.5)).toFixed(1));
        a.umidade = parseFloat((a.umidade + (Math.random() * 2 - 1)).toFixed(0));
    });
    
    renderBancada(); 
    
    const lang = appData.usuario.language;
    const alertDataUpdated = translations[lang].alert_data_updated;
    const refreshBtnText = translations[lang].refresh_btn;

    const initialText = `<i class="fas fa-sync-alt" aria-hidden="true"></i> ${refreshBtnText}`;
    DOM.refreshDataButton.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${alertDataUpdated}`;
    
    setTimeout(() => { 
        DOM.refreshDataButton.innerHTML = initialText; 
    }, 1500);
};

// ------------------------------------
// 7. Funções de Navegação e Inicialização
// ------------------------------------

const setupNavigation = () => {
    
    const menuItems = document.querySelectorAll('.menu-item[data-view]'); 
    const views = document.querySelectorAll('.view');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');
            const targetViewId = targetView + '-view';

            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            views.forEach(v => v.classList.remove('active-view'));
            const viewElement = document.getElementById(targetViewId);
            
            if (viewElement) {
                viewElement.classList.add('active-view');
                if (targetView === 'perfil') {
                    loadProfileData(); 
                }
            }
        });
    });
    
    const dashboardItem = document.querySelector('.menu-item[data-view="dashboard"]');
    const dashboardView = document.getElementById('dashboard-view');
    if(dashboardItem && dashboardView && !document.querySelector('.active-view')) {
         dashboardItem.classList.add('active');
         dashboardView.classList.add('active-view');
    }
};

const initializeApp = () => {
const fetchGlobalData = async () => {
    try {
        const response = await fetch('http://192.168.1.50:1880/api/dados-producao');
        const data = await response.json();
        
        // Atualiza o appData com o que veio do Node-RED
        appData.pedidos = data.pedidos;
        appData.statusContagem = data.contagem;
        
        // Re-renderiza as tabelas
        renderStatusResumo();
        renderPedidosTable();
    } catch (err) {
        console.error("Erro ao buscar dados reais do Node-RED", err);
    }
};
    
    // 1. TENTA CARREGAR DADOS SALVOS
    loadDataFromLocalStorage(); 

    // 2. APLICA O IDIOMA SALVO (NOVO)
    switchLanguage(appData.usuario.language);

    if (!appData.isLoggedIn) {
        // Se não está logado, permanece na tela de login
        DOM.loginPage.classList.remove('hidden');
        DOM.dashboardShell.classList.add('hidden');
        showLoginForm();
        return;
    }
    
    // Se logado:
    DOM.loginPage.classList.add('hidden');
    DOM.dashboardShell.classList.remove('hidden');
    
    // 3. Aplica o tema
    applyTheme(appData.usuario.theme); 
    
    // 4. Atualiza informações do usuário na sidebar
    DOM.currentUserSpan.textContent = appData.usuario.nome;
    DOM.userRoleSpan.textContent = appData.usuario.tipo;

    // 5. Renderiza o conteúdo do dashboard (com textos dinâmicos do idioma)
    renderBancada();
    renderStatusResumo();
    renderPedidosTable(); 

    // 6. Configura a navegação
    setupNavigation();
};


// ------------------------------------
// 8. LISTENERS (Configuração de Eventos)
// ------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. AUTENTICAÇÃO
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
    if (DOM.registerForm) DOM.registerForm.addEventListener('submit', handleRegistration);
    
    if (DOM.showRegisterLink) DOM.showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
    if (DOM.showLoginLink) DOM.showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
    
    if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
    
    // 2. PERFIL: O botão Salvar (submit) está conectado a handleProfileSave
    if (DOM.profileForm) DOM.profileForm.addEventListener('submit', handleProfileSave);
    
    // PERFIL: Conecta os radio buttons do tema à função applyTheme
    DOM.themeRadios.forEach(radio => {
        radio.addEventListener('change', () => applyTheme(radio.value));
    });

    // PERFIL: CONECTA O SELETOR DE IDIOMA À FUNÇÃO switchLanguage (NOVO)
    if (DOM.profileLanguageSelect) {
        DOM.profileLanguageSelect.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });
    }
    
    // 3. ATUALIZAÇÃO DE DADOS (Refresh)
    if (DOM.refreshDataButton) DOM.refreshDataButton.addEventListener('click', simulateDataUpdate);
    
    // Inicia a aplicação
    initializeApp();
});
// Função para carregar usuários na visão de usuários
const renderUsuariosView = async () => {
    const container = document.getElementById('usuarios-view');
    if (!container) return;

    try {
        const res = await fetch('http://192.168.1.50:1880/api/usuarios');
        const usuarios = await res.json();

        container.innerHTML = `
            <h2><i class="fas fa-users"></i> Gerência de Usuários</h2>
            <table class="prodflow-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios.map(u => `
                        <tr>
                            <td>${u.nome}</td>
                            <td>${u.email}</td>
                            <td>${u.tipo}</td>
                            <td>
                                <button onclick="deletarUsuario(${u.id})" class="btn-icon delete"><i class="fas fa-trash"></i></button>
                                <button onclick="prepararEdicao(${u.id})" class="btn-icon edit"><i class="fas fa-edit"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar usuários do servidor.</p>";
    }
};

// Função para Deletar (Requisito: Remover Usuário)
window.deletarUsuario = async (id) => {
    if(confirm("Deseja realmente excluir este usuário?")) {
        await fetch(`http://192.168.1.50:1880/api/usuarios/${id}`, { method: 'DELETE' });
        renderUsuariosView(); // Atualiza a lista
    }
};
socket.onmessage = (event) => {
    try {
        const dados = JSON.parse(event.data);
        const display = document.getElementById('display-leitura');
        // Exemplo: se o JSON for { "valor": 25.5 }
        display.innerText = `Valor Atual: ${dados.valor || event.data}`;
    } catch (e) {
        document.getElementById('display-leitura').innerText = `Valor Atual: ${event.data}`;
    }
};


fetch("http://localhost:1880/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        usuario: document.getElementById("usuario").value,
        senha: document.getElementById("senha").value
    })
})
.then(r => r.json())
.then(data => console.log(data));



// ================================
//  ENVIO DO LOGIN PARA O NODE-RED
// ================================
async function enviarLoginParaNodeRed(usuario, senha) {
    try {
        const resposta = await fetch("http://192.168.1.50:1880/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        const dados = await resposta.json();
        console.log("Resposta Node-RED:", dados);

        return dados;

    } catch (erro) {
        console.error("Erro ao enviar login:", erro);
        return { status: "erro" };
    }
}

DOM.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("login-username").value;
    const senha = document.getElementById("login-password").value;

    // Envia para o Node-RED
    const resposta = await enviarLoginParaNodeRed(usuario, senha);

    if (resposta.status === "ok") {
        console.log("Login salvo no Node-RED!");

        // Aqui você libera o dashboard
        DOM.loginPage.classList.add("hidden");
        DOM.dashboardShell.classList.remove("hidden");

        // Atualiza o nome do usuário no painel
        DOM.currentUserSpan.textContent = usuario;

    } else {
        alert("Erro ao fazer login!");
    }
});

const birthdate = document.getElementById("signup-birthdate").value;

body: JSON.stringify({
    nome,
    email,
    birthdate,
    senha
})

const resultBox = document.getElementById("users-result");

// Criar usuário
document.getElementById("btn-create").onclick = () => {
    resultBox.innerHTML = `
        <h3>Criar Usuário</h3>
        <input id="new-name" placeholder="Nome" class="input" />
        <input id="new-email" placeholder="Email" class="input" />
        <input id="new-birth" type="date" class="input" />
        <input id="new-pass" type="password" placeholder="Senha" class="input" />
        <button onclick="sendCreate()">Salvar</button>
    `;
};

function sendCreate() {
    fetch("http://localhost:1880/createUser", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome: document.getElementById("new-name").value,
            email: document.getElementById("new-email").value,
            nascimento: document.getElementById("new-birth").value,
            senha: document.getElementById("new-pass").value,
        })
    })
    .then(r => r.json())
    .then(data => resultBox.innerHTML = JSON.stringify(data, null, 2));
}

// Listar usuários
document.getElementById("btn-list").onclick = () => {
    fetch("http://localhost:1880/listUsers")
    .then(r => r.json())
    .then(data => {
        resultBox.innerHTML = "<h3>Usuários Cadastrados</h3>";
        data.forEach(u => {
            resultBox.innerHTML += `<p>👤 ${u.nome} — ${u.email}</p>`;
        });
    });
};

// Alterar usuário
document.getElementById("btn-edit").onclick = () => {
    resultBox.innerHTML = `
        <h3>Alterar Usuário</h3>
        <input id="edit-email" placeholder="Email do usuário" class="input" />
        <input id="edit-newname" placeholder="Novo nome" class="input" />
        <button onclick="sendEdit()">Salvar Alterações</button>
    `;
};

function sendEdit() {
    fetch("http://localhost:1880/updateUser", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("edit-email").value,
            novoNome: document.getElementById("edit-newname").value,
        })
    })
    .then(r => r.json())
    .then(data => resultBox.innerHTML = JSON.stringify(data, null, 2));
}

// Remover usuário
document.getElementById("btn-remove").onclick = () => {
    resultBox.innerHTML = `
        <h3>Remover Usuário</h3>
        <input id="remove-email" placeholder="Email do usuário" class="input" />
        <button onclick="sendRemove()">Remover</button>
    `;
};


function sendRemove() {
    fetch("http://localhost:1880/deleteUser", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("remove-email").value
        })
    })
    .then(r => r.json())
    .then(data => resultBox.innerHTML = JSON.stringify(data, null, 2));
}

// Buscar dados da bancada SmartSense
document.getElementById("btn-smart").onclick = () => {
    fetch("http://localhost:1880/smartsense")
    .then(r => r.json())
    .then(data => {
        resultBox.innerHTML = "<h3>Dados da Bancada SmartSense</h3>";
        resultBox.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    });
};

