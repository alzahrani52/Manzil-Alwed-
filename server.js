const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, SVG, etc)
app.use(express.static(__dirname));

// Main route - serve index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      res.status(500).send('Error loading page');
      return;
    }
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(data);
  });
});

// Checkin route
app.get('/checkin', (req, res) => {
  const checkinPath = path.join(__dirname, 'checkin.html');
  fs.readFile(checkinPath, 'utf8', (err, data) => {
    if (err) {
      // Fall back to index.html
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (!err) {
          res.set('Content-Type', 'text/html; charset=utf-8');
          res.send(data);
        }
      });
      return;
    }
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(data);
  });
});

// Catch-all - serve index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      res.status(500).send('Error loading page');
      return;
    }
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server running on port ${PORT}`);
  console.log(`✓ Serving from: ${__dirname}`);
});
