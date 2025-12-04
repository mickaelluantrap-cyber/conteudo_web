// Dados Mock (Simulando o sistema ProdFlow)
let appData = {
    // Dados de Módulos, Ambiente, Usuário, Status e Pedidos (MANTIDOS)
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

// Referências DOM - Variáveis globais para os elementos que disparam ações
const dashboardShell = document.getElementById('dashboard-shell');
const loginPage = document.getElementById('login-page');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const showLoginText = document.getElementById('show-login-text');
const logoutBtn = document.getElementById('logout-btn');

const bancadaContainer = document.getElementById('bancada-container');
const statusGridResumo = document.querySelector('.status-grid-resumo');
const pedidosTableBody = document.getElementById('pedidos-table-body');
const updateButton = document.querySelector('.btn-primary');
const userRoleSpan = document.getElementById('user-role');
const currentUserSpan = document.getElementById('current-user');

const profileForm = document.getElementById('profile-form');
const profileNameInput = document.getElementById('profile-name');
const profileEmailInput = document.getElementById('profile-email');
const profileLanguageSelect = document.getElementById('profile-language');


// ------------------------------------
// 1. Funções de Autenticação
// ------------------------------------

function handleLogin(event) {
    if (event) event.preventDefault();
    
    // Verificações de segurança
    if (!loginForm || !dashboardShell || !loginPage) return;

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    
    // Simulação: Aceita qualquer coisa preenchida
    if (usernameInput && usernameInput.value && passwordInput && passwordInput.value) {
        appData.isLoggedIn = true;
        
        // Atualiza usuário com base no login
        const rawUsername = usernameInput.value;
        appData.usuario.nome = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1).split('@')[0];
        appData.usuario.tipo = 'Operador'; // Default
        
        loginPage.classList.add('hidden');
        dashboardShell.classList.remove('hidden');
        initializeApp();
    } else {
        alert("Preencha Usuário e Senha para simular o Login.");
    }
}

function handleRegistration(event) {
    if (event) event.preventDefault();
    alert("Usuário registrado com sucesso (Simulação). Faça login agora.");
    showLoginForm();
}

function handleLogout() {
    if (!dashboardShell || !loginPage) return;
    
    appData.isLoggedIn = false;
    dashboardShell.classList.add('hidden');
    loginPage.classList.remove('hidden');
    
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    
    showLoginForm();
}

function showRegisterForm() {
    if (!loginForm || !registerForm || !showRegisterLink || !showLoginText) return;
    
    loginForm.classList.add('hidden');
    // Encontrar o <p> pai do link "show-register" e escondê-lo
    const switchTextLogin = showRegisterLink.closest('p');
    if (switchTextLogin) switchTextLogin.classList.add('hidden');
    
    registerForm.classList.remove('hidden');
    showLoginText.classList.remove('hidden');
}

function showLoginForm() {
    if (!loginForm || !registerForm || !showRegisterLink || !showLoginText) return;

    registerForm.classList.add('hidden');
    showLoginText.classList.add('hidden');
    loginForm.classList.remove('hidden');
    
    // Mostrar o <p> pai do link "show-register"
    const switchTextLogin = showRegisterLink.closest('p');
    if (switchTextLogin) switchTextLogin.classList.remove('hidden');
}

// ------------------------------------
// 2. Funções de Personalização de Perfil
// ------------------------------------

function loadProfileData() {
    if (!profileNameInput || !profileEmailInput || !profileLanguageSelect) return;
    
    profileNameInput.value = appData.usuario.nome;
    profileEmailInput.value = appData.usuario.email;
    
    const roleInput = document.getElementById('profile-role');
    if (roleInput) roleInput.value = appData.usuario.tipo;
    
    profileLanguageSelect.value = appData.usuario.language;
    
    const themeInput = document.querySelector(`input[name="theme"][value="${appData.usuario.theme}"]`);
    if (themeInput) themeInput.checked = true;
}

function applyTheme(event) {
    if (event) event.preventDefault();
    if (!profileForm || !profileNameInput || !profileEmailInput || !currentUserSpan) return;
    
    // Salva os dados no objeto appData
    appData.usuario.nome = profileNameInput.value;
    appData.usuario.email = profileEmailInput.value;
    appData.usuario.language = profileLanguageSelect.value;
    
    const checkedTheme = document.querySelector('input[name="theme"]:checked');
    if(checkedTheme) appData.usuario.theme = checkedTheme.value;
    
    // Atualiza o nome na sidebar imediatamente
    currentUserSpan.textContent = appData.usuario.nome;
    
    alert("Perfil atualizado com sucesso!");
}

// ------------------------------------
// 3. Funções de Renderização e Interatividade
// ------------------------------------

function renderEstoque(modulo) {
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
        basesHTML += `<div class="base-item" title="Espaço Vazio" style="background-color: #f0f0f0;"></div>`;
    }
    basesHTML += '</div>';
    return basesHTML;
}

function renderExpedicao(modulo) {
    const prontos = modulo.expedicao.filter(e => e.pronto).length;
    let expedicaoHTML = `<p class="stock-summary">Prontos: <strong>${prontos}</strong>/12</p><div class="expedicao-espacos">`;
    modulo.expedicao.forEach((espaco) => {
        const content = espaco.pronto ? `<i class="fas fa-box"></i>` : `Vazio`;
        expedicaoHTML += `<div class="espaco-expedicao ${espaco.pronto ? 'pronto' : 'vazio'}" title="${espaco.pronto ? 'Pedido Pronto' : 'Espaço Vazio'}">${content}</div>`;
    });
    expedicaoHTML += '</div>';
    return expedicaoHTML;
}

function renderBancada() {
    if (!bancadaContainer) return;
    bancadaContainer.innerHTML = '';
    appData.modulos.forEach((modulo, index) => {
        let moduloContent = '';
        const ambiente = appData.ambiente[index];
        const ambienteHTML = `
            <div class="ambiente-data">
                <div><i class="fas fa-thermometer-half"></i> ${ambiente.temp}°C</div>
                <div><i class="fas fa-tint"></i> ${ambiente.umidade}%</div>
            </div>
        `;
        // Lógica de renderização omitida por brevidade...
        if (modulo.nome === "Estoque") {
            moduloContent += renderEstoque(modulo);
        } else if (modulo.nome === "Expedição") {
            moduloContent += renderExpedicao(modulo);
        } else {
            const atividade = modulo.processo_atual || modulo.montagem_atual;
            moduloContent += `<p class="stock-summary">Atividade: <strong>${atividade.split('(')[0]}</strong></p>`;
            moduloContent += `<p class="stock-summary">Progresso: <strong>${atividade.includes('(') ? atividade.match(/\((.*?)\)/)[1] : 'N/A'}</strong></p>`;
        }
        
        const moduloHTML = `
            <div class="modulo-card">
                <h3>${modulo.nome} <span class="status-indicator">${modulo.info}</span></h3>
                ${moduloContent}
                ${ambienteHTML}
            </div>
        `;
        bancadaContainer.innerHTML += moduloHTML;
    });
}

function getStatusClass(status, prefix = '') {
    const statusMap = { 'Não iniciado': 'secondary', 'Aguardando módulo': 'warning', 'Em processo': 'info', 'Finalizado': 'success', 'Cancelado': 'danger' };
    return `${prefix}${statusMap[status] || 'secondary'}`;
}

function renderStatusResumo() {
    if (!statusGridResumo) return;
    statusGridResumo.innerHTML = '';
    
    for (const [status, count] of Object.entries(appData.statusContagem)) {
        const statusClass = getStatusClass(status, 'status-');
        const itemHTML = `<div class="status-item ${statusClass}" data-status="${status}"><span class="count">${count}</span><span class="label">${status}</span></div>`;
        statusGridResumo.innerHTML += itemHTML;
    }
    
    // Listener para os cards de status
    document.querySelectorAll('.status-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            alert(`Simulação: Indo para Listagem de Pedidos (RF04) e filtrando por: "${status}".`);
        });
    });
}

function renderPedidosTable() {
    if (!pedidosTableBody) return;
    pedidosTableBody.innerHTML = '';
    appData.pedidos.forEach(pedido => {
        const statusClass = getStatusClass(pedido.status, 'status-table-');
        const row = `<tr><td>${pedido.id}</td><td><span class="table-status ${statusClass}">${pedido.status}</span></td><td>${pedido.modulo}</td><td>${pedido.prioridade}</td><td>${pedido.previsao}</td></tr>`;
        pedidosTableBody.innerHTML += row;
    });
}

window.simulateDataUpdate = function() { // Tornando global para o onclick no HTML
    if (!updateButton) return;
    
    appData.ambiente.forEach(a => {
        a.temp = parseFloat((a.temp + (Math.random() * 1 - 0.5)).toFixed(1));
        a.umidade = parseFloat((a.umidade + (Math.random() * 2 - 1)).toFixed(0));
    });
    renderBancada();
    const initialText = updateButton.innerHTML;
    updateButton.innerHTML = `<i class="fas fa-check"></i> Dados Atualizados!`;
    setTimeout(() => { updateButton.innerHTML = initialText; }, 1500);
}

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.view');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');
            if (!targetView) return; 

            const targetViewId = targetView + '-view';

            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            views.forEach(v => v.classList.remove('active-view'));
            const viewElement = document.getElementById(targetViewId);
            if (viewElement) {
                viewElement.classList.add('active-view');
                if (targetView === 'perfil') {
                    loadProfileData(); // Carrega os dados ao entrar na tela de perfil
                }
            }
        });
    });
}

function initializeApp() {
    if (!appData.isLoggedIn) {
        showLoginForm();
        return;
    }
    
    // Atualiza o nome e cargo na sidebar
    if (currentUserSpan) currentUserSpan.textContent = appData.usuario.nome;
    if (userRoleSpan) userRoleSpan.textContent = appData.usuario.tipo;

    // Renderiza o dashboard
    renderBancada();
    renderStatusResumo();
    renderPedidosTable(); 

    setupNavigation();
}

// ------------------------------------
// 4. LISTENERS (GARANTINDO FUNCIONAMENTO DOS BOTÕES)
// ------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. AUTENTICAÇÃO
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegistration);
    
    // Links de Troca
    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
    
    // Botão Sair
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // 2. PERFIL
    if (profileForm) profileForm.addEventListener('submit', handleProfileSave);

    // Inicia a aplicação
    initializeApp();
});

// ------------------------------------
// Função de Gerenciamento de Tema
// ------------------------------------
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}