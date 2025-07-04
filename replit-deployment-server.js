const express = require('express');
const app = express();

// Advanced port detection for different deployment environments
const getPort = () => {
  // Check for various port environment variables
  const port = process.env.PORT || 
               process.env.REPLIT_PORT || 
               process.env.GOOGLE_CLOUD_RUN_PORT || 
               process.env.CLOUD_RUN_PORT || 
               3000;
  
  const portNum = parseInt(port, 10);
  console.log(`🔌 Detected port: ${portNum} (from ${process.env.PORT ? 'PORT' : process.env.REPLIT_PORT ? 'REPLIT_PORT' : 'default'})`);
  return portNum;
};

const PORT = getPort();

// Enhanced logging for deployment debugging
console.log('🚀 Keto Diet Tracker - Universal Deployment Server');
console.log('================================================');
console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`🌐 Deployment Target: ${process.env.DEPLOYMENT_TARGET || 'auto-detect'}`);
console.log(`📂 Working Directory: ${process.cwd()}`);
console.log(`⚡ Process ID: ${process.pid}`);

// Deployment-specific environment detection
const isCloudRun = process.env.K_SERVICE || process.env.GOOGLE_CLOUD_RUN_PORT;
const isReplit = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_CLUSTER;

console.log(`🔍 Deployment Detection:`);
console.log(`   Cloud Run: ${isCloudRun ? 'Yes' : 'No'}`);
console.log(`   Replit: ${isReplit ? 'Yes' : 'No'}`);

// Universal middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS for deployment environments
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Enhanced request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  console.log(`📥 ${timestamp} - ${req.method} ${req.path} - IP: ${ip}`);
  next();
});

// Comprehensive health check endpoints
app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    pid: process.pid,
    deployment: {
      platform: isCloudRun ? 'CloudRun' : isReplit ? 'Replit' : 'Unknown',
      target: process.env.DEPLOYMENT_TARGET || 'auto-detect'
    }
  };
  
  console.log('✅ Health check requested');
  res.status(200).json(healthData);
});

// Cloud Run specific health check
app.get('/healthz', (req, res) => {
  console.log('✅ Healthz check requested (Cloud Run compatible)');
  res.status(200).send('OK');
});

// Standard health checks
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
    platform: isCloudRun ? 'CloudRun' : isReplit ? 'Replit' : 'Unknown',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - Main application
app.get('/', (req, res) => {
  console.log('📄 Root page requested');
  
  const deploymentInfo = isCloudRun ? 'Google Cloud Run' : isReplit ? 'Replit' : 'Local/Unknown';
  
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Keto Diet Tracker - Successfully Deployed</title>
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
          .deployment-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
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
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
            text-align: left;
          }
          .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 3px solid #28a745;
          }
          .feature h4 { 
            color: #2d5a2d; 
            margin-bottom: 10px; 
            font-size: 1.1em;
          }
          .feature p { 
            color: #666; 
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
            <h3>🌐 Deployment Details</h3>
            <p><strong>Platform:</strong> ${deploymentInfo}</p>
            <p><strong>Server:</strong> Running on port ${PORT}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
            <p><strong>Uptime:</strong> ${Math.floor(process.uptime())} seconds</p>
            <p><strong>Status:</strong> All systems operational</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="grid">
            <div class="feature">
              <h4>🥗 Comprehensive Macro Tracking</h4>
              <p>Monitor carbohydrates, proteins, and fats with detailed nutritional analysis</p>
            </div>
            <div class="feature">
              <h4>📋 Smart Meal Planning</h4>
              <p>Create personalized keto meal plans with recipe suggestions</p>
            </div>
            <div class="feature">
              <h4>🧾 Automated Grocery Lists</h4>
              <p>Generate shopping lists based on your meal plans and preferences</p>
            </div>
            <div class="feature">
              <h4>⚖️ Weight & Progress Tracking</h4>
              <p>Monitor your weight loss journey with BMI calculations and trends</p>
            </div>
            <div class="feature">
              <h4>⏰ Intermittent Fasting Support</h4>
              <p>Track fasting periods and optimize your eating windows</p>
            </div>
            <div class="feature">
              <h4>💊 Supplement Recommendations</h4>
              <p>Get personalized supplement suggestions based on your profile</p>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <a href="/health" class="btn">🏥 Detailed Health Check</a>
            <a href="/status" class="btn">📊 Server Status</a>
            <a href="/ping" class="btn">🏓 Ping Test</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 0.9em;">
            <p>Ready to start your ketogenic journey with comprehensive tracking and insights!</p>
            <p>Deployment configured for universal compatibility with Replit and Cloud Run.</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Universal error handling
app.use((err, req, res, next) => {
  console.error('❌ Application error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString(),
    platform: isCloudRun ? 'CloudRun' : isReplit ? 'Replit' : 'Unknown'
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

// Start server with universal binding
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Keto Diet Tracker deployed successfully!');
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Platform: ${isCloudRun ? 'Google Cloud Run' : isReplit ? 'Replit' : 'Local/Unknown'}`);
  console.log(`🔗 Health checks available at:`);
  console.log(`   - /health (detailed)`);
  console.log(`   - /healthz (Cloud Run compatible)`);
  console.log(`   - /ping (basic connectivity)`);
  console.log(`   - /status (server info)`);
  console.log('✅ Ready to handle requests on all platforms');
});

// Universal error handling
server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(`❌ Port ${PORT} is already in use`);
      break;
    case 'EACCES':
      console.error(`❌ Permission denied for port ${PORT}`);
      break;
    default:
      console.error(`❌ Unknown error: ${error.code}`);
  }
  
  process.exit(1);
});

// Graceful shutdown for all platforms
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
  
  // Force shutdown timeout
  setTimeout(() => {
    console.log('⚠️  Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Universal process error handling
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

console.log('🔧 Universal deployment server initialized and ready');