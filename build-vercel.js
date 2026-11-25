const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log('  Four Seasons: Building Frontend for Vercel');
console.log('==============================================');

const env = {
  ...process.env,
  CI: '1',
  NEXT_TELEMETRY_DISABLED: '1',
  NODE_ENV: 'production',
};

const frontendDir = path.join(__dirname, 'frontend');
const srcNext = path.join(frontendDir, '.next');
const destNext = path.join(__dirname, '.next');
const srcPublic = path.join(frontendDir, 'public');
const destPublic = path.join(__dirname, 'public');

try {
  // 0. Clean prior cache to prevent stale hash / route-cache mismatch
  console.log('> Cleaning previous build cache...');
  if (fs.existsSync(srcNext)) {
    fs.rmSync(srcNext, { recursive: true, force: true });
  }
  if (fs.existsSync(destNext)) {
    fs.rmSync(destNext, { recursive: true, force: true });
  }

  // 1. Install frontend dependencies
  console.log('> Installing frontend dependencies...');
  execSync('npm install --include=dev --legacy-peer-deps --no-audit', {
    cwd: frontendDir,
    stdio: 'inherit',
  });

  // 2. Build Next.js
  console.log('> Building Next.js application...');
  execSync('npx next build', {
    cwd: frontendDir,
    stdio: 'inherit',
    env,
  });

  // 3. Clean and mirror fresh .next and public to root
  if (fs.existsSync(destNext)) {
    fs.rmSync(destNext, { recursive: true, force: true });
  }
  if (fs.existsSync(srcNext)) {
    fs.cpSync(srcNext, destNext, { recursive: true });
    console.log('> Copied frontend/.next -> .next');
  }

  if (fs.existsSync(srcPublic)) {
    if (fs.existsSync(destPublic)) {
      fs.rmSync(destPublic, { recursive: true, force: true });
    }
    fs.cpSync(srcPublic, destPublic, { recursive: true });
    console.log('> Copied frontend/public -> public');
  }

  console.log('==============================================');
  console.log('✓ Four Seasons Vercel build completed successfully!');
  console.log('==============================================');
} catch (error) {
  console.error('Build execution failed:', error.message || error);
  process.exit(1);
}
