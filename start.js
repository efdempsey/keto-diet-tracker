#!/usr/bin/env node

// Deployment startup script for Cloud Run
// This script handles the server startup for deployment

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Keto Diet Tracker for deployment...');

// Set environment variables for deployment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || process.env.GOOGLE_CLOUD_RUN_PORT || 8080;

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${process.env.PORT}`);

// Start the server
const serverPath = path.join(__dirname, 'simple-server.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle server process events
server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

console.log('✅ Deployment startup script initialized');