const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

app.get('/', (req, res) => {
  res.send('Keto Diet Tracker - Deployment Test');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});