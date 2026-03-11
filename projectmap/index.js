const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

<<<<<<< HEAD
<<<<<<< HEAD
=======
// Dit vertelt de server dat hij alle bestanden in de huidige map mag laten zien (CSS, plaatjes, etc.)
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
=======
// Dit vertelt de server dat hij alle bestanden in de huidige map mag laten zien (CSS, plaatjes, etc.)
>>>>>>> parent of 542de71 (Added tarieven.json and fixed agenda)
app.use(express.static(__dirname));

// Dit stuurt je index.html naar de browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});