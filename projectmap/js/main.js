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

    document.querySelectorAll('nav ul button[id^="tab-"]').forEach(b => b.classList.remove('tab-active'));
    const tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.add('tab-active');

    document.querySelectorAll('nav ul button[id^="nav-"]').forEach(b => b.classList.remove('nav-active'));
    const nav = document.getElementById('nav-' + id);
    if (nav) nav.classList.add('nav-active');
}


// ============================================================
//  DIENSTEN  (index) — data/diensten.json
<<<<<<< HEAD
<<<<<<< HEAD
=======
//  Velden: { id, naam, beschrijving }
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
=======
//  Velden: { id, naam, beschrijving }
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
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
//  PACKAGES  (index + admin) — data/packages.json
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

<<<<<<< HEAD
function editPackage(id)                     { alert('Bewerken: pakket #' + id + ' (nog te implementeren)'); }
function deletePackage(id, naam)             { if (confirm('Verwijder pakket "' + naam + '"?')) alert('Verwijderd (nog te implementeren)'); }
function viewPackageQuestions(id)            { alert('Vragen voor pakket #' + id + ' (nog te implementeren)'); }
=======
function editPackage(id)          { alert('Bewerken: pakket #' + id + ' (nog te implementeren)'); }
function deletePackage(id, naam)  { if (confirm('Verwijder pakket "' + naam + '"?')) alert('Verwijderd (nog te implementeren)'); }
function viewPackageQuestions(id) { alert('Vragen voor pakket #' + id + ' (nog te implementeren)'); }
>>>>>>> parent of cab1d92 (Merge branch 'development' of https://github.com/1vo-x33/Groen_Gewoon_Doen into development)

function handleNewPackage() {
    const naam         = document.getElementById('naam').value;
    const beschrijving = document.getElementById('beschrijving').value;
    const prijs        = document.getElementById('prijs').value;
    console.log('Nieuw pakket:', { naam, beschrijving, prijs });
    alert('Pakket "' + naam + '" toegevoegd (nog te implementeren in backend).');
}

function openNewOrderForm() {
    alert('Nieuwe order formulier (nog te implementeren).');
}


// ============================================================
//  TARIEVEN  (index + admin) — data/tarieven.json
<<<<<<< HEAD
=======
//  Velden: { gras, tegels, heg, uurtarief }
>>>>>>> 1267fd0e25bd7b4b1d16ab152ceede1ea62496c1
// ============================================================

var rates = { gras: 0, tegels: 0, heg: 0, uurtarief: 0 };

async function loadTarieven() {
    try {
        const res      = await fetch('./data/tarieven.json');
        if (!res.ok) throw new Error('tarieven.json niet gevonden');
        const tarieven = await res.json();

        rates.gras      = tarieven.gras      || 0;
        rates.tegels    = tarieven.tegels    || 0;
        rates.heg       = tarieven.heg       || 0;
        rates.uurtarief = tarieven.uurtarief || 0;

        setText('eGRate', fmt(rates.gras));
        setText('eTRate', fmt(rates.tegels));
        setText('eHRate', fmt(rates.heg));

        setVal('tGras',      tarieven.gras);
        setVal('tTegels',    tarieven.tegels);
        setVal('tHeg',       tarieven.heg);
        setVal('tUurtarief', tarieven.uurtarief);

        updateCalc();
    } catch (err) {
        console.error('Fout bij laden tarieven:', err);
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
async function loadRates() {
    try {
        const res   = await fetch('./data/rates.json');
        if (!res.ok) throw new Error('rates.json niet gevonden');
        const rates = await res.json();

        // Store rates globally so calculateQuote() can use them
        window.rates = rates;

        // Display rates in the HTML
        // TODO: Update eGRate with rates.gras
        // TODO: Update eTRate with rates.tegels
        // TODO: Update eHRate with rates.heg

        // Trigger calculation
        calculateQuote();

    } catch (err) {
        console.error('Fout bij laden rates:', err);
    }
}

function calculateQuote() {
    // Get input values

    const grassV = parseFloat(document.getElementById('grassV').value) || 0;
    const tilesV = parseFloat(document.getElementById('tilesV').value) || 0;
    const hedgeV = parseFloat(document.getElementById('hedgeV').value) || 0;

     // Get rates (from window.rates set by loadRates)
    const rates = window.rates || { gras: 0, tegels: 0, heg: 0 };

    // TODO: Calculate totals
    // TODO: Update HTML elements with amounts and prices
    // TODO: Calculate and show grand total
}

=======
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
=======
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
=======
>>>>>>> parent of cab1d92 (Merge branch 'development' of https://github.com/1vo-x33/Groen_Gewoon_Doen into development)
=======
>>>>>>> 1267fd0e25bd7b4b1d16ab152ceede1ea62496c1
function saveTarieven() {
    const data = {
        gras:      parseFloat(document.getElementById('tGras').value)      || 0,
        tegels:    parseFloat(document.getElementById('tTegels').value)    || 0,
        heg:       parseFloat(document.getElementById('tHeg').value)       || 0,
        uurtarief: parseFloat(document.getElementById('tUurtarief').value) || 0
    };
    console.log('Tarieven opslaan:', data);
    alert('Tarieven opgeslagen (nog te implementeren in backend).\n' + JSON.stringify(data, null, 2));
}


// ============================================================
//  ORDERS  (admin) — data/orders.json
<<<<<<< HEAD
//  Velden: { id, klant, pakket, details, offerte, status }
=======
>>>>>>> parent of cab1d92 (Merge branch 'development' of https://github.com/1vo-x33/Groen_Gewoon_Doen into development)
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
            searchInput.addEventListener('input', function () {
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

    const nieuw     = orders.filter(o => o.status === 'Nieuw').length;
    const ingepland = orders.filter(o => o.status === 'Ingepland').length;
    const afgerond  = orders.filter(o => o.status === 'Klaar').length;
    const omzet     = orders
        .filter(o => o.status === 'Klaar')
        .reduce((sum, o) => sum + (parseFloat(o.offerte) || 0), 0);

    container.innerHTML =
        statCard('Nieuw',     nieuw,                     nieuw > 0 ? 'warn' : 'ok', 'Wacht op verwerking') +
        statCard('Ingepland', ingepland,                 'ok', 'Deze week') +
        statCard('Afgerond',  afgerond,                  'ok', 'Deze maand') +
        statCard('Omzet',     '&euro;' + fmt(omzet),     'ok', 'Afgeronde orders');
}

function statCard(label, value, modifier, sub) {
    return '<div class="stat-card">' +
        '<div class="stat-label">'              + label + '</div>' +
        '<div class="stat-value">'              + value + '</div>' +
        '<div class="stat-sub ' + modifier + '">' + sub + '</div>' +
    '</div>';
}

const STATUS_BADGE = {
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

        tr.innerHTML =
            '<td><strong>#' + o.id + '</strong></td>' +
            '<td>' + o.klant + '</td>' +
            '<td class="td-muted">' + (o.details || o.pakket || '–') + '</td>' +
            '<td>&euro;&nbsp;' + parseFloat(o.offerte || 0).toFixed(2).replace('.', ',') + '</td>' +
            '<td><span class="badge ' + badge + '">' + o.status + '</span></td>' +
            '<td class="td-btns">' + acties + '</td>';

        tbody.appendChild(tr);
    });
}

function buildOrderActions(order) {
    switch (order.status) {
        case 'Nieuw':
        case 'In behandeling':
            return btn('warn',   'Inplannen', 'planOrder('     + order.id + ')') +
                   btn('ghost',  'Bewerken',  'editOrder('     + order.id + ')');
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

function planOrder(id)     { alert('Inplannen: order #' + id + ' (nog te implementeren)'); }
function editOrder(id)     { alert('Bewerken: order #'  + id + ' (nog te implementeren)'); }
function completeOrder(id) { alert('Afgerond: order #'  + id + ' (nog te implementeren)'); }
function invoiceOrder(id)  { alert('Factuur: order #'   + id + ' (nog te implementeren)'); }
function deleteOrder(id)   { if (confirm('Order #' + id + ' verwijderen?')) alert('Verwijderd (nog te implementeren)'); }

//  BESTELFORMULIER  (index)
// ============================================================

function handlePackageForm(e) {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('#packageForm .error').forEach(el => el.classList.remove('error'));

    const pkgId = new FormData(e.target).get('packages');
    const date  = document.getElementById('orderDate').value;
    const name  = document.getElementById('orderName').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();

    let hasError = false;

    if (!pkgId) {
        document.getElementById('packages').classList.add('error');
        hasError = true;
    }
    if (!date) {
        document.getElementById('chosenDateStandaard').classList.add('error');
        hasError = true;
    }
    if (!name) {
        document.getElementById('orderName').classList.add('error');
        hasError = true;
    }
    if (!phone) {
        document.getElementById('orderPhone').classList.add('error');
        hasError = true;
    }

    if (hasError) return;

    console.log('Bestelling pakket id:', pkgId, 'datum:', date);
    alert('Bestelling geplaatst voor ' + date + '! (nog te implementeren in backend)');
}

function handleCustomForm(e) {
    e.preventDefault();
    syncVisibleToHidden();

    // Reset errors
    document.querySelectorAll('#customForm .error').forEach(el => el.classList.remove('error'));

    const date  = document.getElementById('customDate').value;
    const naam  = document.getElementById('cNaam').value.trim();
    const email = document.getElementById('cEmail').value.trim();

    let hasError = false;

    if (!naam) {
        document.getElementById('cNaam').classList.add('error');
        hasError = true;
    }
    if (!email) {
        document.getElementById('cEmail').classList.add('error');
        hasError = true;
    }
    if (!date) {
        document.getElementById('chosenDateCustom').classList.add('error');
        hasError = true;
    }

    if (hasError) return;

    const order = {
        grass:    document.getElementById('grass').value    || 0,
        tiles:    document.getElementById('tiles').value    || 0,
        hedge:    document.getElementById('hedge').value    || 0,
        options1: document.getElementById('options1').value || '',
        date:     date
    };
    console.log('Offerte aangevraagd:', order);
    alert('Offerte aangevraagd voor ' + date + '! We nemen spoedig contact op.');
}

// ... rest of the code remains the same ...
    const gp = g * rates.gras;
    const tp = t * rates.tegels;
    const hp = h * rates.heg;

    setText('eGM',  g);
    setText('eTM',  t);
    setText('eHM',  h);
    setText('eGP',  fmt(gp));
    setText('eTP',  fmt(tp));
    setText('eHP',  fmt(hp));
    setText('eTot', fmt(gp + tp + hp));
}

function initPriceCalc() {
    ['grassV', 'tilesV', 'hedgeV'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCalc);
    });
    const opt1 = document.getElementById('options1V');
    if (opt1) opt1.addEventListener('input', () => {
        const h = document.getElementById('options1');
        if (h) h.value = opt1.value;
    });
}


// ============================================================
//  KALENDER — twee onafhankelijke inline kalenders
//  context: 'standaard' | 'custom'
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

// State per kalender
const calState = {
    standaard: {
        month:    new Date().getMonth(),
        year:     new Date().getFullYear(),
        selected: null
    },
    custom: {
        month:    new Date().getMonth(),
        year:     new Date().getFullYear(),
        selected: null
    }
};

function renderCalendar(context) {
    const s        = calState[context];
    const labelId  = 'monthLabel'  + capitalize(context);
    const daysId   = 'calDays'     + capitalize(context);
    const label    = document.getElementById(labelId);
    const list     = document.getElementById(daysId);
    if (!label || !list) return;

    label.innerHTML = MAANDEN[s.month] + '<br><span class="month-year">' + s.year + '</span>';

    list.innerHTML    = '';
    const firstDay    = new Date(s.year, s.month, 1).getDay();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(s.year, s.month + 1, 0).getDate();
    const today       = new Date();
    const busy        = busyDays[s.month + '-' + s.year] || [];

    for (let i = 0; i < offset; i++) {
        const li = document.createElement('li');
        li.className = 'empty';
        list.appendChild(li);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const li      = document.createElement('li');
        const dayDate = new Date(s.year, s.month, d);
        const isWeekend  = dayDate.getDay() === 0 || dayDate.getDay() === 6;
        const isBusy     = busy.includes(d);
        const isPast     = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday    = dayDate.toDateString() === today.toDateString();
        const isSelected = s.selected &&
                           s.selected.d === d &&
                           s.selected.m === s.month &&
                           s.selected.y === s.year;

        if (isToday)    li.classList.add('today');
        if (isSelected) li.classList.add('selected');

        if (isBusy || isWeekend || isPast) {
            li.classList.add('busy');
        } else {
            li.classList.add('available');
            li.addEventListener('click', () => selectDay(d, s.month, s.year, dayDate, context));
        }

        li.innerHTML = '<span>' + d + '</span>';
        list.appendChild(li);
    }
}

function selectDay(d, m, y, dateObj, context) {
    const s = calState[context];
    s.selected = { d, m, y };

    // Format date nicely
    const dateStr = DAGEN[dateObj.getDay()] + ' ' + d + ' ' + MAANDEN[m] + ' ' + y;
    const isoStr  = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');

    // Update the display box and hidden input
    if (context === 'standaard') {
        const display = document.getElementById('chosenDateStandaard');
        const hidden  = document.getElementById('orderDate');
        if (display) display.innerHTML = '<span class="date-chosen">✓ ' + dateStr + '</span>';
        if (hidden)  hidden.value = isoStr;
    } else {
        const display = document.getElementById('chosenDateCustom');
        const hidden  = document.getElementById('customDate');
        if (display) display.innerHTML = '<span class="date-chosen">✓ ' + dateStr + '</span>';
        if (hidden)  hidden.value = isoStr;
    }

    renderCalendar(context);
}

function changeMonth(dir, context) {
    const s = calState[context];
    s.month += dir;
    if (s.month > 11) { s.month = 0; s.year++; }
    if (s.month < 0)  { s.month = 11; s.year--; }
    renderCalendar(context);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
        await Promise.all([ loadPackages(), loadOrders(), loadTarieven() ]);
        showSection('orders');
    } else {
        initPopup();
        initPriceCalc();

        await Promise.all([ loadDiensten(), loadPackages(), loadTarieven() ]);

        const packageForm = document.getElementById('packageForm');
        const customForm  = document.getElementById('customForm');
        if (packageForm) packageForm.addEventListener('submit', handlePackageForm);
        if (customForm)  customForm.addEventListener('submit', handleCustomForm);

        showSection('standaard');

        // Render both inline calendars
        renderCalendar('standaard');
        renderCalendar('custom');
    }
});