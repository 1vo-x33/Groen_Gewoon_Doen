// ── 1. IMPORTS ──────────────────────────────────────────────
// express  = the framework that handles HTTP requests
// fs       = built-in Node module to read/write files on disk
// path     = built-in Node module to build safe file paths
const express = require('express');
const fs      = require('fs');
const path    = require('path');

// ── 2. CREATE THE APP ───────────────────────────────────────
const app  = express();
const PORT = 3000;

// Path to orders.json (where all orders are stored)
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// ── 3. MIDDLEWARE ───────────────────────────────────────────
// express.json() tells Express to automatically parse JSON
// bodies in incoming requests (POST/PUT with JSON data).
// Without this, req.body would be undefined.
app.use(express.json());

// express.static() serves all your HTML, CSS, JS, and images.
// Any file inside "projectmap/" is accessible in the browser.
// Example: projectmap/index.html  ->  http://localhost:3000/index.html
app.use(express.static(__dirname));

// ── 4. HELPER: READ ORDERS FROM FILE ───────────────────────
// Reads orders.json and returns it as a JavaScript array.
// If the file doesn't exist or is broken, returns an empty array.
function readOrders() {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// ── 5. HELPER: WRITE ORDERS TO FILE ────────────────────────
// Takes a JavaScript array and saves it to orders.json.
// JSON.stringify with (null, 2) makes it pretty-printed (indented).
function writeOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// ── HELPER: READ / WRITE ANY JSON FILE ─────────────────────
function readJson(filename) {
    const filePath = path.join(__dirname, 'data', filename);
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (err) { return null; }
}

function writeJson(filename, data) {
    const filePath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ── TARIEVEN API ───────────────────────────────────────────
app.get('/api/tarieven', (req, res) => {
    const data = readJson('tarieven.json');
    if (!data) return res.status(404).json({ error: 'Tarieven niet gevonden' });
    res.json(data);
});

app.post('/api/tarieven', (req, res) => {
    const { gras, tegels, heg, uurtarief } = req.body;
    writeJson('tarieven.json', { gras, tegels, heg, uurtarief });
    res.json({ success: true });
});

// ── PACKAGES API ───────────────────────────────────────────
app.post('/api/packages/add', (req, res) => {
    const { naam, beschrijving, prijs } = req.body;
    if (!naam || prijs === undefined) {
        return res.status(400).json({ success: false, error: 'Naam en prijs zijn verplicht' });
    }
    const packages = readJson('packages.json') || [];
    const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    packages.push({ id: newId, naam, beschrijving: beschrijving || '', prijs: parseFloat(prijs) });
    writeJson('packages.json', packages);
    res.json({ success: true, id: newId });
});

app.put('/api/packages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { naam, beschrijving, prijs } = req.body;
    const packages = readJson('packages.json') || [];
    const index = packages.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Pakket niet gevonden' });
    packages[index] = { ...packages[index], naam, beschrijving, prijs: parseFloat(prijs) };
    writeJson('packages.json', packages);
    res.json({ success: true });
});

app.delete('/api/packages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const packages = readJson('packages.json') || [];
    const index = packages.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Pakket niet gevonden' });
    packages.splice(index, 1);
    writeJson('packages.json', packages);
    res.json({ success: true });
});

// ── 6. POST /api/orders — CREATE A NEW ORDER ───────────────
// This runs when the customer submits the "Offerte aanvragen" form.
// req.body contains the order data sent from handleCustomForm().
app.post('/api/orders', (req, res) => {
    // Read current orders from file
    const orders = readOrders();

    // Create new order object
    const newOrder = {
        id:       orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
        klant:    req.body.klant    || 'Onbekend',
        email:    req.body.email    || '',
        telefoon: req.body.telefoon || '',
        adres:    req.body.adres    || '',
        datum:    req.body.datum    || '',
        details:  req.body.details  || '',
        offerte:  req.body.offerte  || 0,
        status:   req.body.status   || 'In afwachting'
    };

    // Add to array and save
    orders.push(newOrder);
    writeOrders(orders);

    // Send success response back to the browser
    res.json({ success: true, order: newOrder });
});

// ── 7. PUT/PATCH /api/orders/:id — UPDATE AN ORDER ─────────
// Supports both PUT and PATCH. Updates any provided fields.
function handleOrderUpdate(req, res) {
    const orders = readOrders();
    const order  = orders.find(o => o.id === parseInt(req.params.id));

    if (!order) {
        return res.status(404).json({ success: false, error: 'Order niet gevonden' });
    }

    // Update any fields that are present in the request body
    const allowed = ['status', 'klant', 'email', 'telefoon', 'adres', 'details', 'offerte', 'datum', 'pakket'];
    allowed.forEach(field => {
        if (req.body[field] !== undefined) order[field] = req.body[field];
    });

    writeOrders(orders);
    res.json({ success: true, order: order });
}

app.put('/api/orders/:id',   handleOrderUpdate);
app.patch('/api/orders/:id', handleOrderUpdate);

// ── 8. DELETE /api/orders/:id — DELETE AN ORDER ─────────────
// This runs when the admin clicks "Verwijderen".
app.delete('/api/orders/:id', (req, res) => {
    let orders = readOrders();
    const id = parseInt(req.params.id);

    // Filter out the order with this id (keeps everything except that one)
    const filtered = orders.filter(o => o.id !== id);

    if (filtered.length === orders.length) {
        return res.status(404).json({ success: false, error: 'Order niet gevonden' });
    }

    writeOrders(filtered);
    res.json({ success: true });
});

// ── 9. START THE SERVER ─────────────────────────────────────
// Tells Express to start listening for requests on port 3000.
// Once running, open http://localhost:3000/index.html in your browser.
app.listen(PORT, () => {
    console.log('Server draait op http://localhost:3000');
});