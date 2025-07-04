const express = require('express');
const app = express();

// Get port from environment
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/healthz', (req, res) => {
  res.send('OK');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Keto Diet Tracker</title></head>
      <body>
        <h1>🥑 Keto Diet Tracker</h1>
        <p>Your keto tracking app is running successfully!</p>
        <p>Server is ready for deployment.</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});