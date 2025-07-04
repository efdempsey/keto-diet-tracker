const express = require('express');
const path = require('path');
const app = express();

// Get port from various possible sources
const PORT = process.env.PORT || process.env.REPLIT_PORT || 3000;

// Middleware for production deployment
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Primary health check endpoint (required for deployment)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Alternative health check endpoints for different deployment platforms
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/status', (req, res) => {
  res.status(200).json({ 
    status: 'running',
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint with deployment information
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Keto Diet Tracker - Deployed Successfully</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container { 
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            text-align: center;
          }
          h1 { 
            color: #2d5a2d; 
            margin-bottom: 20px;
            font-size: 2.5em;
          }
          .status { 
            background: #e8f5e8;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
          }
          .success { 
            color: #4caf50;
            font-weight: bold;
            font-size: 1.2em;
          }
          .btn {
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin: 10px;
            transition: background 0.3s;
          }
          .btn:hover { background: #45a049; }
          .info { 
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-size: 0.9em;
          }
          ul { text-align: left; margin: 20px 0; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🥑 Keto Diet Tracker</h1>
          
          <div class="status">
            <div class="success">✅ DEPLOYMENT SUCCESSFUL</div>
            <p>Your ketogenic diet tracking application is now live and running!</p>
          </div>

          <div class="info">
            <strong>Server Information:</strong><br>
            Port: ${PORT}<br>
            Environment: ${process.env.NODE_ENV || 'production'}<br>
            Uptime: ${Math.floor(process.uptime())} seconds<br>
            Node.js: ${process.version}
          </div>

          <h3>Application Features:</h3>
          <ul>
            <li>🥗 Macro tracking and nutritional monitoring</li>
            <li>📋 Comprehensive meal planning</li>
            <li>🧾 Smart grocery list generation</li>
            <li>⚖️ Weight tracking with BMI calculation</li>
            <li>⏰ Intermittent fasting support</li>
            <li>💊 Personalized supplement recommendations</li>
            <li>📊 Detailed analytics dashboard</li>
            <li>🔐 Secure user authentication</li>
          </ul>

          <div style="margin-top: 30px;">
            <a href="/health" class="btn">Health Check</a>
            <a href="/status" class="btn">Server Status</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server with comprehensive error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Keto Diet Tracker production server started`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`⚡ Process ID: ${process.pid}`);
  console.log(`✅ Ready to handle requests`);
});

// Handle server startup errors
server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`❌ Permission denied to bind to port ${PORT}`);
  }
  
  process.exit(1);
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Force shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});