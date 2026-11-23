const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log('  Four Seasons: Building Frontend for Vercel');
console.log('==============================================');

try {
  // 1. Install frontend dependencies
  console.log('> Installing frontend dependencies...');
  execSync('npm install --prefer-offline --no-audit', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  // 2. Build Next.js
  console.log('> Building Next.js application...');
  execSync('npm run build', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  // 3. Mirror .next and public to root
  const srcNext = path.join(__dirname, 'frontend', '.next');
  const destNext = path.join(__dirname, '.next');
  const srcPublic = path.join(__dirname, 'frontend', 'public');
  const destPublic = path.join(__dirname, 'public');

  if (fs.existsSync(srcNext)) {
    fs.cpSync(srcNext, destNext, { recursive: true });
    console.log('> Copied frontend/.next -> .next');
  }

  if (fs.existsSync(srcPublic)) {
    fs.cpSync(srcPublic, destPublic, { recursive: true });
    console.log('> Copied frontend/public -> public');
  }

  console.log('==============================================');
  console.log('✓ Four Seasons Vercel build completed successfully!');
  console.log('==============================================');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
