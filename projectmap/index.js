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

<<<<<<< HEAD
// Dit stuurt je index.html naar de browser
=======
>>>>>>> parent of cab1d92 (Merge branch 'development' of https://github.com/1vo-x33/Groen_Gewoon_Doen into development)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});