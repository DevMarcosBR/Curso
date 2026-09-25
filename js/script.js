/* ============================================ */
/* VARIÁVEIS GLOBAIS                            */
/* ============================================ */

// Nomes dos meses em português
const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Nomes dos dias da semana
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Data atual (usada para marcar "hoje" no calendário)
const today = new Date();

// Mês e ano que estão sendo exibidos no calendário
let displayMonth = today.getMonth();
let displayYear = today.getFullYear();

// Conjunto de datas reservadas (formato: 'YYYY-MM-DD')
const reservedDates = new Set();

/* ============================================ */
/* DATAS RESERVADAS DE EXEMPLO                  */
/* Para apresentação, simulamos algumas datas   */
/* ============================================ */
function generateReservedDates() {
    const year = today.getFullYear();
    const month = today.getMonth();

    // Datas reservadas no mês atual (simulação)
    const reserved = [
        `${year}-${String(month + 1).padStart(2, '0')}-05`,
        `${year}-${String(month + 1).padStart(2, '0')}-06`,
        `${year}-${String(month + 1).padStart(2, '0')}-07`,
        `${year}-${String(month + 1).padStart(2, '0')}-12`,
        `${year}-${String(month + 1).padStart(2, '0')}-13`,
        `${year}-${String(month + 1).padStart(2, '0')}-14`,
        `${year}-${String(month + 1).padStart(2, '0')}-19`,
        `${year}-${String(month + 1).padStart(2, '0')}-20`,
        `${year}-${String(month + 1).padStart(2, '0')}-26`,
        `${year}-${String(month + 1).padStart(2, '0')}-27`,
        `${year}-${String(month + 1).padStart(2, '0')}-28`,
    ];

    // Datas reservadas no próximo mês
    const nextMonth = month + 1 > 11 ? 0 : month + 1;
    const nextYear = month + 1 > 11 ? year + 1 : year;
    reserved.push(
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-02`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-03`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-09`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-10`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-16`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-17`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-23`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-24`,
        `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-25`,
    );

    // Adiciona todas as datas no conjunto
    reserved.forEach(d => reservedDates.add(d));
}

/* ============================================ */
/* PREÇO POR DIA DA SEMANA                      */
/* Fim de semana é mais caro                    */
/* ============================================ */
function getWeekdayPrice(dayOfWeek) {
    // 0 = Domingo, 6 = Sábado
    if (dayOfWeek === 0 || dayOfWeek === 6) return 650;
    return 450;
}

/* ============================================ */
/* RENDERIZAR CALENDÁRIO                        */
/* Cria os dias do mês na tela                  */
/* ============================================ */
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('monthYear');

    // Mostra o nome do mês e ano no topo
    monthYearEl.textContent = `${monthNames[displayMonth]} ${displayYear}`;

    // Limpa o grid antes de criar os dias
    grid.innerHTML = '';

    // Cria os cabeçalhos dos dias da semana (Dom, Seg, Ter...)
    dayNames.forEach(day => {
        const el = document.createElement('div');
        el.className = 'calendar-day-name';
        el.textContent = day;
        grid.appendChild(el);
    });

    // Descobre em que dia da semana cai o dia 1 do mês
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    // Descobre quantos dias tem no mês
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

    // Cria células vazias antes do dia 1 (para alinhar)
    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'calendar-day empty';
        grid.appendChild(el);
    }

    // Contadores para estatísticas
    let availableCount = 0;
    let reservedCount = 0;
    let nextAvail = null;

    // Cria cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const el = document.createElement('div');
        
        // Formata a data como 'YYYY-MM-DD'
        const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Descobre o dia da semana (0=Dom, 6=Sáb)
        const dayOfWeek = new Date(displayYear, displayMonth, day).getDay();
        
        // Verifica se é hoje
        const isToday = (day === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear());
        
        // Verifica se é uma data passada
        const isPast = new Date(displayYear, displayMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Verifica se está reservado
        const isReserved = reservedDates.has(dateStr);

        el.className = 'calendar-day';
        el.textContent = day;

        // Marca o dia de hoje com borda dourada
        if (isToday) el.classList.add('today');

        // Define a cor do dia baseado no status
        if (isPast) {
            el.classList.add('reserved');
            el.style.opacity = '0.3';
            reservedCount++;
        } else if (isReserved) {
            el.classList.add('reserved');
            reservedCount++;
        } else {
            el.classList.add('available');
            availableCount++;
            
            // Guarda a primeira data disponível
            if (!nextAvail) nextAvail = `${day} ${monthNames[displayMonth]}`;

            // Mostra o preço embaixo do dia
            const priceTag = document.createElement('span');
            priceTag.className = 'price-tag';
            priceTag.textContent = `R$${getWeekdayPrice(dayOfWeek)}`;
            el.appendChild(priceTag);
        }

        // Ao clicar no dia, abre o modal
        el.addEventListener('click', () => showDayModal(day, isReserved, isPast, dateStr));
        grid.appendChild(el);
    }

    // Atualiza as estatísticas na tela
    document.getElementById('availableDays').textContent = availableCount;
    document.getElementById('reservedDays').textContent = reservedCount;
    document.getElementById('nextAvailable').textContent = nextAvail || '—';
}

/* ============================================ */
/* NAVEGAR ENTRE MESES                          */
/* ============================================ */
function changeMonth(delta) {
    displayMonth += delta;
    
    // Se passar de dezembro, volta para janeiro do próximo ano
    if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
    }
    // Se passar de janeiro, volta para dezembro do ano anterior
    if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
    }
    
    renderCalendar();
}

/* ============================================ */
/* MODAL AO CLICAR NO DIA                       */
/* ============================================ */
function showDayModal(day, isReserved, isPast, dateStr) {
    const modal = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
    const btn = document.getElementById('modalBtn');

    // Formata a data para exibir (ex: "15 de Outubro de 2025")
    const formattedDate = `${day} de ${monthNames[displayMonth]} de ${displayYear}`;

    if (isPast) {
        // Data que já passou
        title.textContent = 'Data Passada';
        text.textContent = `O dia ${formattedDate} já passou. Selecione uma data futura para reservar.`;
        btn.style.display = 'none';
    } else if (isReserved) {
        // Data já reservada
        title.textContent = 'Data Reservada';
        text.textContent = `O dia ${formattedDate} já está reservado. Por favor, escolha outra data disponível (em verde) no calendário.`;
        btn.textContent = 'Ver Datas Disponíveis';
        btn.href = '#disponibilidade';
        btn.style.display = 'inline-block';
        btn.onclick = closeModal;
    } else {
        // Data disponível
        const dayOfWeek = new Date(displayYear, displayMonth, day).getDay();
        const price = getWeekdayPrice(dayOfWeek);
        title.textContent = 'Data Disponível!';
        text.textContent = `${formattedDate} está disponível para reserva. Valor da diária: R$ ${price}. Entre em contato pelo WhatsApp para garantir sua data!`;
        btn.textContent = 'Reservar pelo WhatsApp';
        btn.href = `https://wa.me/5547996115448?text=Olá! Gostaria de reservar o dia ${day}/${String(displayMonth + 1).padStart(2, '0')}/${displayYear} no Chalé Grein.`;
        btn.target = '_blank';
        btn.style.display = 'inline-block';
        btn.onclick = null;
    }

    modal.classList.add('active');
}

/* ============================================ */
/* FECHAR MODAL                                 */
/* ============================================ */
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Fecha o modal ao clicar fora dele
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

/* ============================================ */
/* MENU MOBILE (HAMBÚRGUER)                     */
/* ============================================ */
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('mobile-open');
}

// Fecha o menu mobile ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('mobile-open');
    });
});

/* ============================================ */
/* NAVBAR MUDA AO ROLAR                         */
/* ============================================ */
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    // Adiciona a classe 'scrolled' se rolou mais de 50px
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ============================================ */
/* ANIMAÇÃO AO ROLAR (REVEAL)                   */
/* Elementos aparecem suavemente                */
/* ============================================ */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        // Se o elemento está a menos de 100px do fundo da tela
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

/* ============================================ */
/* INICIALIZAÇÃO                                */
/* Roda quando a página carrega                 */
/* ============================================ */
window.addEventListener('load', () => {
    generateReservedDates(); // Cria as datas de exemplo
    renderCalendar();        // Desenha o calendário
    revealOnScroll();        // Verifica animações
});