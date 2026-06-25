const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dir = __dirname;

// List files in directory
console.log('=== FILES IN DIRECTORY ===');
try {
  const files = fs.readdirSync(dir);
  console.log('Files found:', files);
} catch (err) {
  console.error('Error reading directory:', err);
}

// Check if index.html exists
const indexPath = path.join(dir, 'index.html');
console.log('Index path:', indexPath);
console.log('Index exists:', fs.existsSync(indexPath));

app.use(express.static(dir));

app.get('/', (req, res) => {
  res.send(`
    <pre>
    منازل الود - Server is running!
    
    Directory: ${dir}
    
    Files in directory:
    ${fs.readdirSync(dir).join('\n')}
    
    Index.html exists: ${fs.existsSync(indexPath)}
    </pre>
  `);
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
