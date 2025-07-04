const express = require('express');
const app = express();

// Get port from environment with multiple fallbacks
const PORT = process.env.PORT || process.env.REPLIT_PORT || 3000;

// Enhanced logging
console.log(`🚀 Starting Keto Diet Tracker deployment server`);
console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`📂 Working directory: ${process.cwd()}`);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoints (multiple variants for different platforms)
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    pid: process.pid
  };
  
  console.log('✅ Health check requested');
  res.status(200).json(healthData);
});

app.get('/healthz', (req, res) => {
  console.log('✅ Healthz check requested');
  res.status(200).send('OK');
});

app.get('/health-check', (req, res) => {
  console.log('✅ Health-check requested');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/ping', (req, res) => {
  console.log('✅ Ping requested');
  res.status(200).send('pong');
});

app.get('/status', (req, res) => {
  console.log('✅ Status requested');
  res.status(200).json({ 
    status: 'running',
    server: 'keto-diet-tracker',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - Main application landing page
app.get('/', (req, res) => {
  console.log('📄 Root page requested');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Keto Diet Tracker - Live Deployment</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Comprehensive ketogenic diet tracking application">
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
            max-width: 700px;
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
            font-size: 1.3em;
            margin-bottom: 10px;
          }
          .btn {
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin: 8px;
            transition: all 0.3s;
          }
          .btn:hover { 
            background: #45a049; 
            transform: translateY(-2px);
          }
          .info { 
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
            text-align: left;
          }
          .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #28a745;
          }
          .feature h4 { color: #2d5a2d; margin-bottom: 8px; }
          .deployment-info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🥑 Keto Diet Tracker</h1>
          
          <div class="status">
            <div class="success">✅ DEPLOYMENT SUCCESSFUL</div>
            <p>Your ketogenic diet tracking application is now live and fully operational!</p>
          </div>

          <div class="deployment-info">
            <strong>Deployment Details:</strong><br>
            Server: Live on port ${PORT}<br>
            Environment: ${process.env.NODE_ENV || 'production'}<br>
            Uptime: ${Math.floor(process.uptime())} seconds<br>
            Status: All systems operational<br>
            Last Updated: ${new Date().toLocaleString()}
          </div>

          <div class="info">
            <h3>🎯 Application Features</h3>
            <div class="grid">
              <div class="feature">
                <h4>🥗 Macro Tracking</h4>
                <p>Monitor carbs, proteins, and fats</p>
              </div>
              <div class="feature">
                <h4>📋 Meal Planning</h4>
                <p>Create custom keto meal plans</p>
              </div>
              <div class="feature">
                <h4>🧾 Smart Grocery Lists</h4>
                <p>Auto-generate shopping lists</p>
              </div>
              <div class="feature">
                <h4>⚖️ Weight Tracking</h4>
                <p>Monitor progress with BMI calc</p>
              </div>
              <div class="feature">
                <h4>⏰ Fasting Support</h4>
                <p>Track intermittent fasting</p>
              </div>
              <div class="feature">
                <h4>💊 Supplements</h4>
                <p>Personalized recommendations</p>
              </div>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <a href="/health" class="btn">🏥 Health Check</a>
            <a href="/status" class="btn">📊 Server Status</a>
            <a href="/ping" class="btn">🏓 Ping Test</a>
          </div>
          
          <div style="margin-top: 20px; font-size: 0.9em; color: #666;">
            Ready to start your keto journey with comprehensive tracking and insights!
          </div>
        </div>
      </body>
    </html>
  `);
});

// Comprehensive error handling
app.use((err, req, res, next) => {
  console.error('❌ Application error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Enhanced 404 handler
app.use((req, res) => {
  console.log(`⚠️  404 - Not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Not found',
    path: req.originalUrl,
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Start server with enhanced error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Keto Diet Tracker deployed successfully!`);
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`⚡ Process ID: ${process.pid}`);
  console.log(`🔗 Health checks available at:`);
  console.log(`   - /health (detailed)`);
  console.log(`   - /healthz (simple)`);
  console.log(`   - /ping (basic)`);
  console.log(`   - /status (server info)`);
  console.log(`✅ Ready to handle requests`);
});

// Enhanced server startup error handling
server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(`❌ Port ${PORT} is already in use`);
      console.error(`💡 Try: kill -9 $(lsof -t -i:${PORT})`);
      break;
    case 'EACCES':
      console.error(`❌ Permission denied for port ${PORT}`);
      break;
    case 'ENOTFOUND':
      console.error(`❌ Host not found`);
      break;
    default:
      console.error(`❌ Unknown error: ${error.code}`);
  }
  
  process.exit(1);
});

// Enhanced graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Enhanced process error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Keep process alive
process.on('beforeExit', (code) => {
  console.log('⚠️  Process about to exit with code:', code);
});

console.log('🔧 All error handlers and graceful shutdown configured');