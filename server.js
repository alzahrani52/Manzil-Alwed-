const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use((req, res, next) => {
  // Try to serve static files first
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  next();
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server running on port ${PORT}`);
});
