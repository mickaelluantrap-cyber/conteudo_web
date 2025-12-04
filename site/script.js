// Exemplo de como você atualizaria a temperatura dinamicamente
document.getElementById('dado-temperatura').textContent = '28.1 °C';

// Exemplo de como você mudaria o status da Bancada para Ocioso
const statusBancada = document.getElementById('status-bancada');
statusBancada.textContent = 'Ocioso';
statusBancada.classList.remove('trabalhando');
statusBancada.classList.add('ocioso');

// Na vida real, você buscará esses dados de um servidor/API.