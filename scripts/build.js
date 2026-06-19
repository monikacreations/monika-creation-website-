const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Building frontend Vite app...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, '..', 'frontend'),
    stdio: 'inherit'
  });

  const publicDir = path.join(__dirname, '..', 'public');
  const distDir = path.join(__dirname, '..', 'frontend', 'dist');

  console.log('Cleaning up old public directory...');
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }

  console.log('Moving frontend dist to public directory...');
  fs.renameSync(distDir, publicDir);
  
  console.log('✓ Build and assets migration completed successfully!');
} catch (error) {
  console.error('❌ Build script failed:', error.message);
  process.exit(1);
}
