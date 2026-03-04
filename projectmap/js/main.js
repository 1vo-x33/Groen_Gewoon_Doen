// ============================================================
//  GROEN & GEWOON DOEN — js/main.js
// ============================================================

// ============================================================
//  LOGIN
// ============================================================

async function getInfo() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch('./data/users.json');

        if (!response.ok) throw new Error('Kon gebruikerslijst niet laden');

        const users = await response.json();
        const foundUser = users.find(u => u.username === usernameInput && u.password === passwordInput);

        if (foundUser) {
            console.log(foundUser.username + ' ingelogd met rol: ' + foundUser.role);

            const popup = document.querySelector('.popup');
            if (popup) popup.style.display = 'none';

            if (foundUser.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert('Onjuiste gebruikersnaam of wachtwoord');
            console.log('Login mislukt');
        }
    } catch (error) {
        console.error('Fout bij inloggen:', error);
        alert('Er is een technisch probleem bij het inloggen.');
    }
}

// ============================================================
//  POPUP OPEN / CLOSE  (index.html)
// ============================================================

function initPopup() {
    const loginBtn = document.getElementById('button');
    const popup    = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');

    if (!loginBtn || !popup) return;

    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        popup.style.display = 'flex';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            popup.style.display = 'none';
        });
    }

    popup.addEventListener('click', function (e) {
        if (e.target === popup) popup.style.display = 'none';
    });
}

// ============================================================
//  TAB / SECTION SWITCHING
//  Works on both index (tab buttons) and admin (sidebar nav)
// ============================================================

function showSection(sectionId) {
    // Hide all admin sections
    document.querySelectorAll('.admin-section').forEach(function (s) {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    // Show the requested one
    var target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    // Update index tab buttons
    document.querySelectorAll('nav ul button[id^="tab-"]').forEach(function (b) {
        b.classList.remove('tab-active');
    });
    var tab = document.getElementById('tab-' + sectionId);
    if (tab) tab.classList.add('tab-active');

    // Update admin sidebar buttons
    document.querySelectorAll('nav ul button[id^="nav-"]').forEach(function (b) {
        b.classList.remove('nav-active');
    });
    var navBtn = document.getElementById('nav-' + sectionId);
    if (navBtn) navBtn.classList.add('nav-active');
}

// ============================================================
//  PACKAGE FORMS  (index.html)
// ============================================================

function handlePackageForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedPackage = formData.get('packages');

    if (!selectedPackage) {
        alert('Selecteer eerst een pakket');
        return;
    }

    console.log('Package ordered:', selectedPackage);
    alert('Bestelling geplaatst: ' + selectedPackage);
}

function handleCustomForm(e) {
    e.preventDefault();

    // Sync visible inputs → hidden inputs before reading FormData
    syncVisibleToHidden();

    const formData = new FormData(e.target);
    const orderData = {
        grass:    formData.get('grass')    || 0,
        tiles:    formData.get('tiles')    || 0,
        hedge:    formData.get('hedge')    || 0,
        options1: formData.get('options1') || '',
        options2: formData.get('options2') || ''
    };

    console.log('Custom quote requested:', orderData);
    alert('Offerte aangevraagd! We nemen spoedig contact op.');
}

function handlePackageOrder(packageName) {
    console.log('Package ordered:', packageName);
    alert('Bestelling geplaatst: ' + packageName);
}

// Select a package by keyword and scroll to the order form
function selectPkg(val) {
    var sel = document.getElementById('packages');
    if (!sel) return;
    for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value.toLowerCase().includes(val)) {
            sel.selectedIndex = i;
            break;
        }
    }
    var form = document.getElementById('packageForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================================
//  PACKAGES — load from JSON  (index + admin)
// ============================================================

async function loadPackages() {
    try {
        const response = await fetch('./data/packages.json');
        if (!response.ok) throw new Error('JSON bestand niet gevonden');

        const packages = await response.json();

        const selectElement = document.getElementById('packages');
        const tableBody     = document.getElementById('packageTableBody');

        if (selectElement) {
            selectElement.innerHTML = '<option value="">Selecteer...</option>';
            packages.forEach(function (pkg) {
                var option = document.createElement('option');
                option.value       = pkg.naam;
                option.textContent = pkg.naam;
                selectElement.appendChild(option);
            });
        }

        if (tableBody) {
            tableBody.innerHTML = '';
            packages.forEach(function (pkg) {
                var row = document.createElement('tr');
                row.innerHTML =
                    '<td>' + pkg.naam + '</td>' +
                    '<td>' + pkg.beschrijving + '</td>' +
                    '<td><button type="button" onclick="handlePackageOrder(\'' + pkg.naam + '\')">Bestel</button></td>';
                tableBody.appendChild(row);
            });
        }

        console.log('Pakketten succesvol ingeladen!');
    } catch (error) {
        console.error('Fout bij het laden van pakketten:', error);
    }
}

// ============================================================
//  PRICE CALCULATOR  (index.html — custom offerte)
// ============================================================

var rates = { grass: 1.20, tiles: 0.80, hedge: 2.50 };

function fmt(n) {
    return n.toFixed(2).replace('.', ',');
}

// Mirror visible inputs to the hidden inputs that handleCustomForm reads
function syncVisibleToHidden() {
    var map = { grassV: 'grass', tilesV: 'tiles', hedgeV: 'hedge', options1V: 'options1' };
    Object.keys(map).forEach(function (visId) {
        var vis    = document.getElementById(visId);
        var hidden = document.getElementById(map[visId]);
        if (vis && hidden) hidden.value = vis.value;
    });
}

function updateCalc() {
    syncVisibleToHidden();

    var g = parseFloat(document.getElementById('grassV').value)  || 0;
    var t = parseFloat(document.getElementById('tilesV').value)  || 0;
    var h = parseFloat(document.getElementById('hedgeV').value)  || 0;

    var gp = g * rates.grass;
    var tp = t * rates.tiles;
    var hp = h * rates.hedge;

    setText('eGM', g);
    setText('eTM', t);
    setText('eHM', h);
    setText('eGP', fmt(gp));
    setText('eTP', fmt(tp));
    setText('eHP', fmt(hp));
    setText('eTot', fmt(gp + tp + hp));
}

function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
}

function initPriceCalc() {
    ['grassV', 'tilesV', 'hedgeV'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCalc);
    });

    var opt = document.getElementById('options1V');
    if (opt) {
        opt.addEventListener('input', function () {
            var hidden = document.getElementById('options1');
            if (hidden) hidden.value = opt.value;
        });
    }
}

// ============================================================
//  CALENDAR
// ============================================================

var monthNames = [
    'Januari','Februari','Maart','April','Mei','Juni',
    'Juli','Augustus','September','Oktober','November','December'
];

// Simulate some busy days per "month-year" key
var busyDays = {
    '7-2025': [3, 10, 17, 24],
    '8-2025': [5, 12, 19, 26]
};

var currentMonth = new Date().getMonth();
var currentYear  = new Date().getFullYear();
var selectedDay  = null;

function renderCalendar() {
    var label = document.getElementById('monthLabel');
    if (!label) return;

    label.innerHTML = monthNames[currentMonth] +
        '<br><span class="month-year">' + currentYear + '</span>';

    var daysList = document.getElementById('calendarDays');
    daysList.innerHTML = '';

    var firstDay    = new Date(currentYear, currentMonth, 1).getDay();
    var offset      = (firstDay === 0) ? 6 : firstDay - 1;
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today       = new Date();
    var key         = currentMonth + '-' + currentYear;
    var busy        = busyDays[key] || [];

    for (var i = 0; i < offset; i++) {
        var empty = document.createElement('li');
        empty.classList.add('empty');
        daysList.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
        var li      = document.createElement('li');
        var dayDate = new Date(currentYear, currentMonth, d);
        var isWeekend  = dayDate.getDay() === 0 || dayDate.getDay() === 6;
        var isBusy     = busy.includes(d);
        var isPast     = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var isToday    = dayDate.toDateString() === today.toDateString();
        var isSelected = selectedDay &&
                         selectedDay.d === d &&
                         selectedDay.m === currentMonth &&
                         selectedDay.y === currentYear;

        if (isToday)    li.classList.add('today');
        if (isSelected) li.classList.add('selected');

        if (isBusy || isWeekend || isPast) {
            li.classList.add('busy');
            li.innerHTML = '<span>' + d + '</span>';
        } else {
            li.classList.add('available');
            li.innerHTML = '<span>' + d + '</span>';
            (function (day, month, year, date) {
                li.addEventListener('click', function () {
                    selectDay(day, month, year, date);
                });
            })(d, currentMonth, currentYear, dayDate);
        }

        daysList.appendChild(li);
    }
}

function selectDay(d, m, y, dateObj) {
    selectedDay = { d: d, m: m, y: y };

    var panel = document.getElementById('bookingPanel');
    if (!panel) return;

    var dayNames = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
    panel.innerHTML =
        '<h3>' + dayNames[dateObj.getDay()] + ' ' + d + ' ' + monthNames[m] + ' ' + y + '</h3>' +
        '<p>Vul uw gegevens in om de afspraak te bevestigen.</p>' +
        '<div class="booking-form">' +
            '<input type="text" placeholder="Uw naam">' +
            '<input type="tel"  placeholder="Telefoonnummer">' +
            '<button onclick="confirmBooking()">Afspraak Bevestigen</button>' +
        '</div>';

    renderCalendar();
}

function confirmBooking() {
    var panel = document.getElementById('bookingPanel');
    if (panel) {
        panel.innerHTML =
            '<h3>Afspraak aangevraagd!</h3>' +
            '<p>We nemen zo snel mogelijk contact met u op om de afspraak te bevestigen.</p>';
    }
    selectedDay = null;
    renderCalendar();
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
    renderCalendar();
}

// ============================================================
//  P5.JS GRASS BACKGROUND
// ============================================================

var grass = [];
var animationId;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    var canvas = document.querySelector('canvas');
    if (!canvas) return;
    canvas.style.position = 'fixed';
    canvas.style.top      = '0';
    canvas.style.left     = '0';
    canvas.style.zIndex   = '-1';
    for (var i = 0; i < 20; i++) {
        grass.push(new Grass(random(width)));
    }
}

function draw() {
    background(255);
    for (var g of grass) {
        g.show();
        g.update();
    }
    if (grass.length < 50) {
        grass.push(new Grass(random(width)));
    }
}

class Grass {
    constructor(x) {
        this.pos   = createVector(x, random(-30, 0));
        this.vel   = createVector(0, random(7, 10));
        this.len   = random(15, 30);
        this.color = color(34, 139, 34);
    }
    show() {
        stroke(this.color);
        strokeWeight(2);
        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y - this.len);
    }
    update() {
        this.pos.add(this.vel);
        if (this.pos.y > height + 100) grass.shift();
    }
}

// ============================================================
//  SPITFIRE  (easter egg)
// ============================================================

function fly() {
    var elem = document.getElementById('spitfire');
    if (!elem) return;

    elem.style.position = 'absolute';
    var angle   = 0;
    var centerX = window.innerWidth  / 2 - 50;
    var centerY = window.innerHeight / 2 - 50;
    var radiusX = 200;
    var radiusY = 100;

    if (animationId) cancelAnimationFrame(animationId);

    function animate() {
        if (angle >= 8 * Math.PI) {
            elem.style.position = '';
            elem.style.top      = '';
            elem.style.left     = '';
            return;
        }
        angle += 0.05;
        elem.style.left = (centerX + radiusX * Math.sin(angle))      + 'px';
        elem.style.top  = (centerY + radiusY * Math.sin(2 * angle))  + 'px';
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

// ============================================================
//  ADMIN SECTION INIT
// ============================================================

function initAdmin() {
    // Default to orders section
    showSection('orders');
}

// ============================================================
//  BOOT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // --- Index page ---
    initPopup();
    loadPackages();
    initPriceCalc();

    var packageForm = document.getElementById('packageForm');
    var customForm  = document.getElementById('customForm');
    if (packageForm) packageForm.addEventListener('submit', handlePackageForm);
    if (customForm)  customForm.addEventListener('submit', handleCustomForm);

    // Show standaard tab by default on index
    if (document.getElementById('standaard')) {
        showSection('standaard');
    }

    // Render calendar if present
    if (document.getElementById('calendarDays')) {
        renderCalendar();
    }

    // --- Admin page ---
    if (document.querySelector('.admin-body')) {
        initAdmin();
    }
});