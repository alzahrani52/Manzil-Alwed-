const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false
}));

// Route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

// Route for checkin
app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkin.html'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

// Route for checkin.html
app.get('/checkin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkin.html'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✓ منازل الود server running on port ${PORT}`);
});
