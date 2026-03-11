const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Helper to read/write JSON files
const dataDir = path.join(__dirname, 'data');

function readJson(filename) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filename, data) {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET tarieven
app.get('/api/tarieven', (req, res) => {
    const data = readJson('tarieven.json');
    if (!data) return res.status(404).json({ error: 'Tarieven niet gevonden' });
    res.json(data);
});

// POST tarieven (admin update)
app.post('/api/tarieven', (req, res) => {
    const { gras, tegels, heg, uurtarief } = req.body;
    if (gras === undefined || tegels === undefined || heg === undefined || uurtarief === undefined) {
        return res.status(400).json({ error: 'Alle tarieven zijn verplicht' });
    }
    writeJson('tarieven.json', { gras, tegels, heg, uurtarief });
    res.json({ success: true, message: 'Tarieven opgeslagen' });
});

// GET packages
app.get('/api/packages', (req, res) => {
    const data = readJson('packages.json');
    if (!data) return res.status(404).json({ error: 'Packages niet gevonden' });
    res.json(data);
});

// POST packages (admin update)
app.post('/api/packages', (req, res) => {
    const packages = req.body;
    if (!Array.isArray(packages)) {
        return res.status(400).json({ error: 'Packages moeten een array zijn' });
    }
    for (const pkg of packages) {
        if (!pkg.id || !pkg.naam || pkg.prijs === undefined) {
            return res.status(400).json({ error: 'Elk pakket moet id, naam en prijs hebben' });
        }
    }
    writeJson('packages.json', packages);
    res.json({ success: true, message: 'Packages opgeslagen' });
});

// POST single package (add new)
app.post('/api/packages/add', (req, res) => {
    const { naam, beschrijving, prijs } = req.body;
    if (!naam || prijs === undefined) {
        return res.status(400).json({ error: 'Naam en prijs zijn verplicht' });
    }
    const packages = readJson('packages.json') || [];
    const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    packages.push({ id: newId, naam, beschrijving: beschrijving || '', prijs: parseFloat(prijs) });
    writeJson('packages.json', packages);
    res.json({ success: true, message: 'Pakket toegevoegd', id: newId });
});

// PUT update single package
app.put('/api/packages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { naam, beschrijving, prijs } = req.body;
    const packages = readJson('packages.json') || [];
    const index = packages.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Pakket niet gevonden' });
    packages[index] = { ...packages[index], naam, beschrijving, prijs: parseFloat(prijs) };
    writeJson('packages.json', packages);
    res.json({ success: true, message: 'Pakket bijgewerkt' });
});

// DELETE package
app.delete('/api/packages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let packages = readJson('packages.json') || [];
    const index = packages.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Pakket niet gevonden' });
    packages.splice(index, 1);
    writeJson('packages.json', packages);
    res.json({ success: true, message: 'Pakket verwijderd' });
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});