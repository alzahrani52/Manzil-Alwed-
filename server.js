const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Server starting...');
console.log('Directory:', __dirname);

// Serve all static files
app.use(express.static(__dirname, { 
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Root route
app.get('/', (req, res) => {
  console.log('GET / requested');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes
app.get('*', (req, res) => {
  console.log('GET * requested:', req.path);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server listening on port ${PORT}`);
});
