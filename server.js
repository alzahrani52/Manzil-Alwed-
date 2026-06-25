const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Try different possible base directories
const possibleDirs = [
  __dirname,
  process.cwd(),
  '/app',
  '/railway/src'
];

let baseDir = __dirname;
for (let dir of possibleDirs) {
  if (fs.existsSync(path.join(dir, 'index.html'))) {
    baseDir = dir;
    console.log(`✓ Found files in: ${baseDir}`);
    break;
  }
}

console.log(`Using directory: ${baseDir}`);
console.log(`Files:`, fs.readdirSync(baseDir).filter(f => f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.js')));

// Serve static files
app.use(express.static(baseDir));

// Root route
app.get('/', (req, res) => {
  const file = path.join(baseDir, 'index.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(500).send('index.html not found');
  }
});

// Catch all
app.get('*', (req, res) => {
  const file = path.join(baseDir, 'index.html');
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.sendFile(path.join(baseDir, 'index.html')).catch(() => {
      res.status(404).send('File not found');
    });
  }
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server running on port ${PORT}`);
});
