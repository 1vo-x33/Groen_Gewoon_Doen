async function getInfo() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch('./data/users.json');
        
        if (!response.ok) {
            throw new Error('Kon gebruikerslijst niet laden');
        }

        const users = await response.json();

        const foundUser = users.find(u => u.username === usernameInput && u.password === passwordInput);

        if (foundUser) {
            console.log(foundUser.username + " ingelogd met rol: " + foundUser.role);
            
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

function fly() {
    const elem = document.getElementById("spitfire");
    if (!elem) return;
    
    elem.style.position = 'absolute';
    let angle = 0;
    const centerX = window.innerWidth / 2 - 50;
    const centerY = window.innerHeight / 2 - 50;
    const radiusX = 200;
    const radiusY = 100;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    function animate() {
        if (angle >= 8 * Math.PI) {
            elem.style.position = '';
            elem.style.top = '';
            elem.style.left = '';
            return;
        }
        
        angle += 0.05;
        const x = centerX + radiusX * Math.sin(angle);
        const y = centerY + radiusY * Math.sin(2 * angle);
        elem.style.left = x + 'px';
        elem.style.top = y + 'px';
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function handlePackageForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedPackage = formData.get('packages');
    
    if (!selectedPackage) {
        alert('Selecteer eerst een pakket');
        return;
    }
    
    console.log('Package ordered:', selectedPackage);
    alert(`Bestelling geplaatst: ${selectedPackage}`);
}

function handleCustomForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
        grass: formData.get('grass') || 0,
        tiles: formData.get('tiles') || 0,
        hedge: formData.get('hedge') || 0,
        options1: formData.get('options1') || '',
        options2: formData.get('options2') || ''
    };
    
    console.log('Custom quote requested:', orderData);
    alert('Offerte aangevraagd! We nemen spoedig contact op.');
}

async function loadPackages() {
    try {
        const response = await fetch('./data/packages.json');
        
        if (!response.ok) throw new Error('JSON bestand niet gevonden');
        
        const packages = await response.json();
        
        const selectElement = document.getElementById('packages');
        const tableBody = document.getElementById('packageTableBody');

        if (selectElement) {
            selectElement.innerHTML = '<option value="">Selecteer...</option>';
            packages.forEach(pkg => {
                const option = document.createElement('option');
                option.value = pkg.naam;
                option.textContent = pkg.naam;
                selectElement.appendChild(option);
            });
        }

        if (tableBody) {
            tableBody.innerHTML = '';
            packages.forEach(pkg => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pkg.naam}</td>
                    <td>${pkg.beschrijving}</td>
                    <td><button type="button" onclick="handlePackageOrder('${pkg.naam}')">Bestel</button></td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        console.log("Pakketten succesvol ingeladen!");
    } catch (error) {
        console.error('Fout bij het laden van pakketten:', error);
    }
}

function handlePackageOrder(packageName) {
    console.log('Package ordered:', packageName);
    alert(`Bestelling geplaatst: ${packageName}`);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll(".admin-section");
    sections.forEach(section => {
        section.style.display = "none";
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = "block";
    }
}

// =====================
// CALENDAR
// =====================

const monthNames = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];

// Simulate some busy days per "month-year" key
const busyDays = {
    "7-2025": [3, 10, 17, 24],
    "8-2025": [5, 12, 19, 26]
};

let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();
let selectedDay  = null;

function renderCalendar() {
    const label = document.getElementById("monthLabel");
    if (!label) return;

    label.innerHTML = monthNames[currentMonth] + '<br><span style="font-size:18px">' + currentYear + '</span>';

    const daysList = document.getElementById("calendarDays");
    daysList.innerHTML = "";

    const firstDay     = new Date(currentYear, currentMonth, 1).getDay();
    const offset       = (firstDay === 0) ? 6 : firstDay - 1; // Monday-first
    const daysInMonth  = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today        = new Date();
    const key          = currentMonth + "-" + currentYear;
    const busy         = busyDays[key] || [];

    // Empty cells before the first day
    for (let i = 0; i < offset; i++) {
        const li = document.createElement("li");
        li.classList.add("empty");
        daysList.appendChild(li);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const li      = document.createElement("li");
        const dayDate = new Date(currentYear, currentMonth, d);
        const isWeekend  = dayDate.getDay() === 0 || dayDate.getDay() === 6;
        const isBusy     = busy.includes(d);
        const isPast     = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday    = dayDate.toDateString() === today.toDateString();
        const isSelected = selectedDay &&
                           selectedDay.d === d &&
                           selectedDay.m === currentMonth &&
                           selectedDay.y === currentYear;

        if (isToday)    li.classList.add("today");
        if (isSelected) li.classList.add("selected");

        if (isBusy || isWeekend || isPast) {
            li.classList.add("busy");
            li.innerHTML = '<span>' + d + '</span>';
        } else {
            li.classList.add("available");
            li.innerHTML = '<span>' + d + '</span>';
            li.addEventListener("click", () => selectDay(d, currentMonth, currentYear, dayDate));
        }

        daysList.appendChild(li);
    }
}

function selectDay(d, m, y, dateObj) {
    selectedDay = { d, m, y };

    const panel = document.getElementById("bookingPanel");
    if (!panel) return;

    const dayNames = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
    panel.innerHTML = `
        <h3>${dayNames[dateObj.getDay()]} ${d} ${monthNames[m]} ${y}</h3>
        <p>Vul uw gegevens in om de afspraak te bevestigen.</p>
        <div class="booking-form">
            <input type="text" placeholder="Uw naam" style="margin-bottom:8px">
            <input type="tel" placeholder="Telefoonnummer" style="margin-bottom:8px">
            <button onclick="confirmBooking()">Afspraak Bevestigen</button>
        </div>
    `;

    renderCalendar();
}

function confirmBooking() {
    const panel = document.getElementById("bookingPanel");
    if (panel) {
        panel.innerHTML = `<h3>Afspraak aangevraagd!</h3><p>We nemen zo snel mogelijk contact met u op om de afspraak te bevestigen.</p>`;
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

// =====================
// P5.JS GRASS BACKGROUND
// =====================

let grass = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    let canvas = document.querySelector('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    for (let i = 0; i < 20; i++) {
        grass.push(new Grass(random(width)));
    }
}

function draw() {
    background(255);
    for (let g of grass) {
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
        if (this.pos.y > height + 100) {
            grass.shift();
        }
    }
}

// =====================
// INIT
// =====================

document.addEventListener('DOMContentLoaded', () => {
    const packageForm = document.getElementById('packageForm');
    const customForm  = document.getElementById('customForm');

    loadPackages();

    if (packageForm) packageForm.addEventListener('submit', handlePackageForm);
    if (customForm)  customForm.addEventListener('submit', handleCustomForm);

    // Render the calendar
    renderCalendar();
});