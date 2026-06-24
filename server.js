const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve checkin.html
app.get('/checkin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkin.html'));
});

// For SPA routing: if a file doesn't exist, serve index.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server running on port ${PORT}`);
});
