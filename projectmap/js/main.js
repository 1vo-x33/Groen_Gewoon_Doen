// ============================================================
//  GROEN & GEWOON DOEN — js/main.js
// ============================================================


// ============================================================
//  LOGIN
// ============================================================

async function getInfo() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('./data/users.json');
        if (!res.ok) throw new Error('Kon gebruikerslijst niet laden');
        const users = await res.json();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            console.log(user.username + ' ingelogd als: ' + user.role);
            const popup = document.querySelector('.popup');
            if (popup) popup.style.display = 'none';
            window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
            alert('Onjuiste gebruikersnaam of wachtwoord');
        }
    } catch (err) {
        console.error('Fout bij inloggen:', err);
        alert('Er is een technisch probleem bij het inloggen.');
    }
}


// ============================================================
//  POPUP  (index)
// ============================================================

function initPopup() {
    const btn   = document.getElementById('button');
    const popup = document.querySelector('.popup');
    const close = document.querySelector('.close-btn');
    if (!btn || !popup) return;

    btn.addEventListener('click', e => { e.preventDefault(); popup.style.display = 'flex'; });
    if (close) close.addEventListener('click', () => { popup.style.display = 'none'; });
    popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });
}


// ============================================================
//  SECTION / TAB SWITCHING
// ============================================================

function showSection(id) {
    document.querySelectorAll('.admin-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    const target = document.getElementById(id);
    if (target) { target.style.display = 'block'; target.classList.add('active'); }

    document.querySelectorAll('.forms-nav button[id^="tab-"]').forEach(b => b.classList.remove('tab-active'));
    const tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.add('tab-active');

    document.querySelectorAll('nav ul button[id^="nav-"]').forEach(b => b.classList.remove('nav-active'));
    const nav = document.getElementById('nav-' + id);
    if (nav) nav.classList.add('nav-active');
}


// ============================================================
//  DIENSTEN
// ============================================================

async function loadDiensten() {
    const grid = document.getElementById('dienstenGrid');
    if (!grid) return;

    try {
        const res      = await fetch('./data/diensten.json');
        if (!res.ok) throw new Error('diensten.json niet gevonden');
        const diensten = await res.json();

        grid.innerHTML = '';
        diensten.forEach(d => {
            const div = document.createElement('div');
            div.className = 'dienst';
            div.innerHTML =
                '<div class="dienst-bar"></div>' +
                '<h4>' + d.naam + '</h4>' +
                '<p>'  + d.beschrijving + '</p>';
            grid.appendChild(div);
        });
    } catch (err) {
        console.error('Fout bij laden diensten:', err);
        grid.innerHTML = '<p class="load-error">Diensten konden niet worden geladen.</p>';
    }
}


// ============================================================
//  PAKKETTEN
// ============================================================

async function loadPackages() {
    try {
        const res      = await fetch('./data/packages.json');
        if (!res.ok) throw new Error('packages.json niet gevonden');
        const packages = await res.json();

        const isAdmin = document.body.classList.contains('admin-body');

        if (isAdmin) {
            renderAdminPackageTable(packages);
        } else {
            renderPackageTable(packages);
            renderPackageSelect(packages);
        }
    } catch (err) {
        console.error('Fout bij laden pakketten:', err);
    }
}

function renderPackageTable(packages) {
    const tbody = document.getElementById('packageTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    packages.forEach((pkg, index) => {
        const tr = document.createElement('tr');

        const isAanbevolen = packages.length >= 3
            ? index === Math.floor(packages.length / 2)
            : index === 0;

        if (isAanbevolen) tr.classList.add('tr-featured');

        tr.innerHTML =
            '<td>' +
                '<strong>' + pkg.naam + '</strong>' +
                (isAanbevolen ? '<span class="badge-pop">Aanbevolen</span>' : '') +
            '</td>' +
            '<td class="td-muted">' + pkg.beschrijving + '</td>' +
            '<td>' +
                '<span class="pkg-price">&euro;&nbsp;' + pkg.prijs + '</span>' +
                ' <span class="pkg-unit">/bezoek</span>' +
            '</td>' +
            '<td>' +
                '<button class="btn btn-' + (isAanbevolen ? 'solid' : 'outline') + ' btn-sm"' +
                    ' onclick="selectPkg(' + pkg.id + ')">' +
                    'Kiezen' +
                '</button>' +
            '</td>';

        tbody.appendChild(tr);
    });
}

function renderPackageSelect(packages) {
    const sel = document.getElementById('packages');
    if (!sel) return;

    sel.innerHTML = '<option value="">Selecteer pakket...</option>';
    packages.forEach(pkg => {
        const opt = document.createElement('option');
        opt.value = pkg.id;
        opt.textContent = pkg.naam + ' — \u20ac' + pkg.prijs;
        sel.appendChild(opt);
    });
}

function renderAdminPackageTable(packages) {
    const tbody = document.getElementById('packageTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    packages.forEach(pkg => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td><strong>' + pkg.naam + '</strong></td>' +
            '<td class="td-muted">' + pkg.beschrijving + '</td>' +
            '<td>&euro;&nbsp;' + pkg.prijs + '</td>' +
            '<td><button class="btn btn-ghost btn-sm" onclick="editPackage(' + pkg.id + ')">Bewerken</button></td>' +
            '<td><button class="btn btn-danger btn-sm" onclick="deletePackage(' + pkg.id + ', \'' + pkg.naam + '\')">Verwijder</button></td>' +
            '<td><button class="btn btn-ghost btn-sm" onclick="viewPackageQuestions(' + pkg.id + ')">Vragen</button></td>';
        tbody.appendChild(tr);
    });
}

function selectPkg(id) {
    const sel = document.getElementById('packages');
    if (!sel) return;
    for (let i = 0; i < sel.options.length; i++) {
        if (parseInt(sel.options[i].value) === id) { sel.selectedIndex = i; break; }
    }
    const form = document.getElementById('packageForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function editPackage(id) {
    const naam = prompt('Nieuwe naam:');
    if (!naam) return;
    const beschrijving = prompt('Nieuwe beschrijving:');
    const prijs = prompt('Nieuwe prijs (€):');
    if (!prijs) return;
    try {
        const res = await fetch('/api/packages/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ naam, beschrijving, prijs: parseFloat(prijs) })
        });
        const result = await res.json();
        if (result.success) { alert('Pakket bijgewerkt!'); loadPackages(); }
        else alert('Fout: ' + result.error);
    } catch (err) {
        console.error('Fout bij bewerken pakket:', err);
        alert('Er is een fout opgetreden.');
    }
}

async function deletePackage(id, naam) {
    if (!confirm('Verwijder pakket "' + naam + '"?')) return;
    try {
        const res = await fetch('/api/packages/' + id, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) { alert('Pakket verwijderd!'); loadPackages(); }
        else alert('Fout: ' + result.error);
    } catch (err) {
        console.error('Fout bij verwijderen pakket:', err);
        alert('Er is een fout opgetreden.');
    }
}

function viewPackageQuestions(id) { alert('Vragen voor pakket #' + id + ' (nog te implementeren)'); }

async function handleNewPackage() {
    const naam         = document.getElementById('naam').value;
    const beschrijving = document.getElementById('beschrijving').value;
    const prijs        = document.getElementById('prijs').value;
    try {
        const res = await fetch('/api/packages/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ naam, beschrijving, prijs: parseFloat(prijs) })
        });
        const result = await res.json();
        if (result.success) {
            alert('Pakket "' + naam + '" toegevoegd!');
            document.getElementById('newPackageForm').reset();
            loadPackages();
        } else {
            alert('Fout: ' + result.error);
        }
    } catch (err) {
        console.error('Fout bij toevoegen pakket:', err);
        alert('Er is een fout opgetreden.');
    }
}

function openNewOrderForm() { alert('Nieuwe order formulier (nog te implementeren).'); }


// ============================================================
//  TARIEVEN
// ============================================================

async function loadRates() {
    try {
        const res = await fetch('./data/tarieven.json');
        if (!res.ok) throw new Error('tarieven.json niet gevonden');
        const rates = await res.json();

        window.rates = rates;

        setText('eGRate', fmt(rates.gras));
        setText('eTRate', fmt(rates.tegels));
        setText('eHRate', fmt(rates.heg));

        setVal('tGras',      rates.gras);
        setVal('tTegels',    rates.tegels);
        setVal('tHeg',       rates.heg);
        setVal('tUurtarief', rates.uurtarief);

        calculateQuote();
    } catch (err) {
        console.error('Fout bij laden rates:', err);
    }
}

async function saveTarieven() {
    const data = {
        gras:      parseFloat(document.getElementById('tGras').value)      || 0,
        tegels:    parseFloat(document.getElementById('tTegels').value)    || 0,
        heg:       parseFloat(document.getElementById('tHeg').value)       || 0,
        uurtarief: parseFloat(document.getElementById('tUurtarief').value) || 0
    };
    try {
        const res = await fetch('/api/tarieven', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) { alert('Tarieven opgeslagen!'); window.rates = { ...data }; }
        else alert('Fout: ' + result.error);
    } catch (err) {
        console.error('Fout bij opslaan tarieven:', err);
        alert('Er is een fout opgetreden bij het opslaan.');
    }
}


// ============================================================
//  ORDERS  (admin)
// ============================================================

async function loadOrders() {
    const tbody    = document.getElementById('ordersTableBody');
    const statsDiv = document.getElementById('orderStats');
    if (!tbody) return;

    try {
        const res    = await fetch('./data/orders.json');
        if (!res.ok) throw new Error('orders.json niet gevonden');
        const orders = await res.json();

        renderOrderStats(orders, statsDiv);
        renderOrdersTable(orders, tbody);

        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            // Remove old listener by replacing the element
            const fresh = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(fresh, searchInput);
            fresh.addEventListener('input', function () {
                const q = this.value.toLowerCase();
                const filtered = orders.filter(o =>
                    String(o.id).toLowerCase().includes(q) ||
                    o.klant.toLowerCase().includes(q)
                );
                renderOrdersTable(filtered, tbody);
            });
        }
    } catch (err) {
        console.error('Fout bij laden orders:', err);
        tbody.innerHTML = '<tr><td colspan="6" class="load-error">Orders konden niet worden geladen.</td></tr>';
    }
}

function renderOrderStats(orders, container) {
    if (!container) return;

    const afwachting = orders.filter(o => o.status === 'In afwachting').length;
    const ingepland  = orders.filter(o => o.status === 'Ingepland').length;
    const afgerond   = orders.filter(o => o.status === 'Klaar').length;
    const omzet      = orders
        .filter(o => o.status === 'Klaar')
        .reduce((sum, o) => sum + (parseFloat(o.offerte) || 0), 0);

    container.innerHTML =
        statCard('In afwachting', afwachting,           afwachting > 0 ? 'warn' : 'ok', 'Wacht op beoordeling') +
        statCard('Ingepland',     ingepland,             'ok', 'Deze week') +
        statCard('Afgerond',      afgerond,              'ok', 'Deze maand') +
        statCard('Omzet',         '&euro;' + fmt(omzet), 'ok', 'Afgeronde orders');
}

function statCard(label, value, modifier, sub) {
    return '<div class="stat-card">' +
        '<div class="stat-label">'               + label + '</div>' +
        '<div class="stat-value">'               + value + '</div>' +
        '<div class="stat-sub ' + modifier + '">' + sub  + '</div>' +
    '</div>';
}

const STATUS_BADGE = {
    'In afwachting':  'badge-yellow',
    'Geaccepteerd':   'badge-green',
    'Afgewezen':      'badge-red',
    'Nieuw':          'badge-blue',
    'In behandeling': 'badge-blue',
    'Ingepland':      'badge-blue',
    'Wachtend':       'badge-yellow',
    'Klaar':          'badge-green',
    'Geannuleerd':    'badge-red'
};

function renderOrdersTable(orders, tbody) {
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="td-empty">Geen orders gevonden.</td></tr>';
        return;
    }

    orders.forEach(o => {
        const badge  = STATUS_BADGE[o.status] || 'badge-blue';
        const acties = buildOrderActions(o);
        const tr     = document.createElement('tr');
        tr.style.cursor = 'pointer';

        tr.innerHTML =
            '<td><strong>#' + o.id + '</strong></td>' +
            '<td>' + o.klant + '</td>' +
            '<td class="td-muted">' + (o.datum || '–') + '</td>' +
            '<td>&euro;&nbsp;' + parseFloat(o.offerte || 0).toFixed(2).replace('.', ',') + '</td>' +
            '<td><span class="badge ' + badge + '">' + o.status + '</span></td>' +
            '<td class="td-btns" onclick="event.stopPropagation()">' + acties + '</td>';

        tr.addEventListener('click', () => openOrderModal(o));
        tbody.appendChild(tr);
    });
}

function buildOrderActions(order) {
    switch (order.status) {
        case 'In afwachting':
            return btn('solid',  'Accepteren', 'acceptOrder(' + order.id + ')') +
                   btn('danger', 'Afwijzen',   'rejectOrder('  + order.id + ')');
        case 'Geaccepteerd':
        case 'Nieuw':
        case 'In behandeling':
            return btn('warn',  'Inplannen', 'planOrder('     + order.id + ')') +
                   btn('ghost', 'Bewerken',  'editOrder('     + order.id + ')');
        case 'Ingepland':
        case 'Wachtend':
            return btn('solid',  'Afgerond',  'completeOrder(' + order.id + ')') +
                   btn('ghost',  'Bewerken',  'editOrder('     + order.id + ')');
        case 'Klaar':
            return btn('ghost',  'Factuur',   'invoiceOrder('  + order.id + ')') +
                   btn('danger', 'Verwijder', 'deleteOrder('   + order.id + ')');
        default:
            return btn('ghost',  'Bewerken',  'editOrder('     + order.id + ')');
    }
}

function btn(style, label, onclick) {
    return '<button class="btn btn-' + style + ' btn-sm" onclick="' + onclick + '">' + label + '</button>';
}

// ── Order detail modal ─────────────────────────────────────

function openOrderModal(o) {
    const existing = document.getElementById('orderModal');
    if (existing) existing.remove();

    const badge  = STATUS_BADGE[o.status] || 'badge-blue';
    const acties = buildOrderActions(o);

    const modal = document.createElement('div');
    modal.id = 'orderModal';
    modal.className = 'order-modal-overlay';
    modal.innerHTML =
        '<div class="order-modal">' +
            '<div class="order-modal-head">' +
                '<div>' +
                    '<h3>Order #' + o.id + '</h3>' +
                    '<span class="badge ' + badge + '">' + o.status + '</span>' +
                '</div>' +
                '<button class="order-modal-close" onclick="closeOrderModal()">&times;</button>' +
            '</div>' +
            '<div class="order-modal-body">' +
                '<div class="order-modal-section">' +
                    '<h4>Klantgegevens</h4>' +
                    modalRow('Naam',     o.klant    || '–') +
                    modalRow('E-mail',   o.email    || '–') +
                    modalRow('Telefoon', o.telefoon || '–') +
                    modalRow('Adres',    o.adres    || '–') +
                '</div>' +
                '<div class="order-modal-section">' +
                    '<h4>Opdracht</h4>' +
                    modalRow('Datum',   o.datum   || '–') +
                    modalRow('Details', o.details || o.pakket || '–') +
                    modalRow('Offerte', '€ ' + parseFloat(o.offerte || 0).toFixed(2).replace('.', ',')) +
                '</div>' +
            '</div>' +
            '<div class="order-modal-foot">' +
                acties +
            '</div>' +
        '</div>';

    modal.addEventListener('click', e => { if (e.target === modal) closeOrderModal(); });
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
}

function modalRow(label, value) {
    return '<div class="modal-row">' +
        '<span class="modal-label">' + label + '</span>' +
        '<span class="modal-value">' + value + '</span>' +
    '</div>';
}

async function updateOrderStatus(id, newStatus) {
    try {
        const res = await fetch('/api/orders/' + id, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: newStatus })
        });
        const result = await res.json();
        if (result.success) loadOrders();
        else alert('Fout: ' + result.error);
    } catch (err) {
        console.error('Fout bij bijwerken status:', err);
        alert('Er is een technisch probleem opgetreden.');
    }
}

function acceptOrder(id) {
    if (confirm('Order #' + id + ' accepteren?')) {
        closeOrderModal();
        updateOrderStatus(id, 'Geaccepteerd');
    }
}
function rejectOrder(id) {
    if (confirm('Order #' + id + ' afwijzen?')) {
        closeOrderModal();
        updateOrderStatus(id, 'Afgewezen');
    }
}
function planOrder(id)     { alert('Inplannen: order #' + id + ' (nog te implementeren)'); }
function editOrder(id)     { alert('Bewerken: order #'  + id + ' (nog te implementeren)'); }
function completeOrder(id) { alert('Afgerond: order #'  + id + ' (nog te implementeren)'); }
function invoiceOrder(id)  { alert('Factuur: order #'   + id + ' (nog te implementeren)'); }
function deleteOrder(id)   { if (confirm('Order #' + id + ' verwijderen?')) alert('Verwijderd (nog te implementeren)'); }



//  BESTELFORMULIER  (index)


function handlePackageForm(e) {
    e.preventDefault();

    if (!selectedDay) {
        highlightDateError();
        alert('Selecteer eerst een datum in de kalender.');
        return;
    }

    const pkgId = new FormData(e.target).get('packages');
    if (!pkgId) { alert('Selecteer eerst een pakket'); return; }

    console.log('Bestelling pakket id:', pkgId, 'datum:', getSelectedDateString());
    alert('Bestelling geplaatst! (nog te implementeren in backend)');
}

// ── Validation: at least one m² field must be filled ──────

function validateCustomForm() {
    const fields = ['grassV', 'tilesV', 'hedgeV'];

    // Clear previous errors
    fields.forEach(function (id) {
        const input = document.getElementById(id);
        if (!input) return;
        input.classList.remove('error');
        const old = input.parentElement.querySelector('.error-msg');
        if (old) old.remove();
    });

    const grassV = parseFloat(document.getElementById('grassV').value) || 0;
    const tilesV = parseFloat(document.getElementById('tilesV').value) || 0;
    const hedgeV = parseFloat(document.getElementById('hedgeV').value) || 0;

    if (grassV === 0 && tilesV === 0 && hedgeV === 0) {
        fields.forEach(function (id) {
            const input = document.getElementById(id);
            if (!input) return;
            input.classList.add('error');
            const msg = document.createElement('span');
            msg.className = 'error-msg';
            msg.textContent = 'Vul minimaal een veld in';
            input.parentElement.appendChild(msg);
        });
        return false;
    }

    return true;
}

// ── Single, authoritative handleCustomForm ─────────────────

function handleCustomForm(e) {
    e.preventDefault();

    // 1. Date required
    if (!selectedDay) {
        highlightDateError();
        alert('Selecteer eerst een datum in de kalender.');
        return;
    }

    // 2. At least one service field required
    if (!validateCustomForm()) return;

    syncVisibleToHidden();

    const order = {
        klant:    document.getElementById('cNaam')  ? document.getElementById('cNaam').value  : '',
        email:    document.getElementById('cEmail') ? document.getElementById('cEmail').value : '',
        telefoon: document.getElementById('cTel')   ? document.getElementById('cTel').value   : '',
        adres:    document.getElementById('cAdres') ? document.getElementById('cAdres').value : '',
        datum:    getSelectedDateString(),
        details:
            'Gras: '   + (document.getElementById('grass').value  || 0) + 'm², ' +
            'Tegels: ' + (document.getElementById('tiles').value  || 0) + 'm², ' +
            'Heg: '    + (document.getElementById('hedge').value  || 0) + 'm',
        offerte: document.getElementById('eTot')
                    ? document.getElementById('eTot').textContent.replace(',', '.')
                    : '0',
        status: 'In afwachting'
    };

    fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(order)
    })
    .then(function (res) { return res.json(); })
    .then(function (result) {
        if (result.success) {
            alert('Offerte aangevraagd! We nemen spoedig contact op.');
            document.getElementById('customForm').reset();
            calculateQuote();
            selectedDay = null;
            renderCalendar();
            updateDateDisplay();
        } else {
            alert('Fout: ' + result.error);
        }
    })
    .catch(function (err) {
        console.error('Fout bij versturen:', err);
        alert('Er is een technisch probleem opgetreden.');
    });
}


// ============================================================
//  PRIJSSCHATTER  (index)
// ============================================================

function syncVisibleToHidden() {
    const map = { grassV: 'grass', tilesV: 'tiles', hedgeV: 'hedge', options1V: 'options1' };
    Object.entries(map).forEach(([visId, hidId]) => {
        const vis = document.getElementById(visId);
        const hid = document.getElementById(hidId);
        if (vis && hid) hid.value = vis.value;
    });
}

function calculateQuote() {
    syncVisibleToHidden();

    const grassV = parseFloat(document.getElementById('grassV')?.value) || 0;
    const tilesV = parseFloat(document.getElementById('tilesV')?.value) || 0;
    const hedgeV = parseFloat(document.getElementById('hedgeV')?.value) || 0;

    const rates = window.rates || { gras: 0, tegels: 0, heg: 0 };

    const grassTotal = grassV * rates.gras;
    const tilesTotal = tilesV * rates.tegels;
    const hedgeTotal = hedgeV * rates.heg;

    setText('eGM',  grassV);
    setText('eTM',  tilesV);
    setText('eHM',  hedgeV);
    setText('eGP',  fmt(grassTotal));
    setText('eTP',  fmt(tilesTotal));
    setText('eHP',  fmt(hedgeTotal));
    setText('eTot', fmt(grassTotal + tilesTotal + hedgeTotal));
}

function initPriceCalc() {
    ['grassV', 'tilesV', 'hedgeV'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculateQuote);
            // Clear error state when user starts typing
            el.addEventListener('input', function () {
                this.classList.remove('error');
                const msg = this.parentElement.querySelector('.error-msg');
                if (msg) msg.remove();
            });
        }
    });
    const opt1 = document.getElementById('options1V');
    if (opt1) opt1.addEventListener('input', () => {
        const h = document.getElementById('options1');
        if (h) h.value = opt1.value;
    });
}


// ============================================================
//  KALENDER
// ============================================================

const MAANDEN = [
    'Januari','Februari','Maart','April','Mei','Juni',
    'Juli','Augustus','September','Oktober','November','December'
];
const DAGEN = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

const busyDays = {
    '7-2025': [3, 10, 17, 24],
    '8-2025': [5, 12, 19, 26]
};

let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();
let selectedDay  = null;

function renderCalendar() {
    const label = document.getElementById('monthLabel');
    if (!label) return;

    label.innerHTML = MAANDEN[currentMonth] + '<br><span class="month-year">' + currentYear + '</span>';

    const list        = document.getElementById('calendarDays');
    list.innerHTML    = '';
    const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today       = new Date();
    const busy        = busyDays[currentMonth + '-' + currentYear] || [];

    for (let i = 0; i < offset; i++) {
        const li = document.createElement('li');
        li.className = 'empty';
        list.appendChild(li);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const li      = document.createElement('li');
        const dayDate = new Date(currentYear, currentMonth, d);
        const isWeekend  = dayDate.getDay() === 0 || dayDate.getDay() === 6;
        const isBusy     = busy.includes(d);
        const isPast     = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday    = dayDate.toDateString() === today.toDateString();
        const isSelected = selectedDay &&
                           selectedDay.d === d &&
                           selectedDay.m === currentMonth &&
                           selectedDay.y === currentYear;

        if (isToday)    li.classList.add('today');
        if (isSelected) li.classList.add('selected');

        if (isBusy || isWeekend || isPast) {
            li.classList.add('busy');
        } else {
            li.classList.add('available');
            li.addEventListener('click', () => selectDay(d, currentMonth, currentYear, dayDate));
        }

        li.innerHTML = '<span>' + d + '</span>';
        list.appendChild(li);
    }
}

function selectDay(d, m, y, dateObj) {
    selectedDay = { d, m, y, dateObj };
    updateDateDisplay();
    renderCalendar();
}

function updateDateDisplay() {
    const display = document.getElementById('chosenDateDisplay');
    if (!display) return;

    if (selectedDay) {
        display.textContent = DAGEN[selectedDay.dateObj.getDay()] + ' ' +
                              selectedDay.d + ' ' +
                              MAANDEN[selectedDay.m] + ' ' +
                              selectedDay.y;
        display.classList.remove('error');
    } else {
        display.textContent = 'Geen datum geselecteerd';
        display.classList.remove('error');
    }
}

function highlightDateError() {
    const display = document.getElementById('chosenDateDisplay');
    if (display) {
        display.textContent = 'Kies een datum om door te gaan';
        display.classList.add('error');
        display.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function getSelectedDateString() {
    if (!selectedDay) return '';
    return DAGEN[selectedDay.dateObj.getDay()] + ' ' +
           selectedDay.d + ' ' +
           MAANDEN[selectedDay.m] + ' ' +
           selectedDay.y;
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
    renderCalendar();
}


// ============================================================
//  P5.JS GRAS ACHTERGROND
// ============================================================

let grass = [];
let animationId;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    const c = document.querySelector('canvas');
    if (!c) return;
    c.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;';
    for (let i = 0; i < 20; i++) grass.push(new Grass(random(width)));
}

function draw() {
    background(255);
    for (const g of grass) { g.show(); g.update(); }
    if (grass.length < 50) grass.push(new Grass(random(width)));
}

class Grass {
    constructor(x) {
        this.pos   = createVector(x, random(-30, 0));
        this.vel   = createVector(0, random(7, 10));
        this.len   = random(15, 30);
        this.color = color(34, 139, 34);
    }
    show()   { stroke(this.color); strokeWeight(2); line(this.pos.x, this.pos.y, this.pos.x, this.pos.y - this.len); }
    update() { this.pos.add(this.vel); if (this.pos.y > height + 100) grass.shift(); }
}

function fly() {
    const elem = document.getElementById('spitfire');
    if (!elem) return;
    elem.style.position = 'absolute';
    let angle = 0;
    const cx = window.innerWidth / 2 - 50, cy = window.innerHeight / 2 - 50;
    if (animationId) cancelAnimationFrame(animationId);
    function animate() {
        if (angle >= 8 * Math.PI) { elem.style.cssText = ''; return; }
        angle += 0.05;
        elem.style.left = (cx + 200 * Math.sin(angle))     + 'px';
        elem.style.top  = (cy + 100 * Math.sin(2 * angle)) + 'px';
        animationId = requestAnimationFrame(animate);
    }
    animate();
}


// ============================================================
//  HULPFUNCTIES
// ============================================================

function fmt(n)        { return Number(n).toFixed(2).replace('.', ','); }
function setText(id, v){ const el = document.getElementById(id); if (el) el.textContent = v; }
function setVal(id, v) { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; }


// ============================================================
//  OPSTARTEN
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = document.body.classList.contains('admin-body');

    if (isAdmin) {
        await Promise.all([ loadPackages(), loadOrders(), loadRates() ]);
        showSection('orders');
    } else {
        initPopup();
        initPriceCalc();

        await Promise.all([ loadDiensten(), loadPackages(), loadRates() ]);

        const packageForm = document.getElementById('packageForm');
        const customForm  = document.getElementById('customForm');
        if (packageForm) packageForm.addEventListener('submit', handlePackageForm);
        if (customForm)  customForm.addEventListener('submit', handleCustomForm);

        showSection('standaard');
        renderCalendar();
        updateDateDisplay();
    }
});