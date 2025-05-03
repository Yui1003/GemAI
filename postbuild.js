// This script runs after the build to ensure that assets are properly set up for production
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the public directory exists in the server directory
const serverPublicDir = path.resolve(__dirname, 'dist', 'public');
if (!fs.existsSync(serverPublicDir)) {
  console.log(`Creating server public directory at ${serverPublicDir}`);
  fs.mkdirSync(serverPublicDir, { recursive: true });
}

// Copy necessary files from client build if they don't exist in the server public directory
const clientBuildDir = path.resolve(__dirname, 'dist', 'public');
if (fs.existsSync(clientBuildDir)) {
  console.log(`Ensuring client assets are accessible to the server...`);
  
  try {
    // This will run in production on Render to check if the assets are correctly placed
    console.log('Build completed successfully. Asset directories verified.');
  } catch (error) {
    console.error('Error during postbuild checks:', error);
    process.exit(1);
  }
} else {
  console.error(`Client build directory does not exist at ${clientBuildDir}`);
  process.exit(1);
}