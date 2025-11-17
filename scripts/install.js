#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Find the root project directory (where package.json exists, not in node_modules)
function findProjectRoot(startDir) {
  let currentDir = path.resolve(startDir);
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    // Check if this is not a node_modules directory and has package.json
    if (fs.existsSync(packageJsonPath) && !currentDir.includes('node_modules')) {
      // Make sure it's not the ui-plugin package itself
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.name !== 'ui-plugin') {
          return currentDir;
        }
      } catch (e) {
        // Continue searching
      }
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback to current working directory
  return process.cwd();
}

function askQuestion(query) {
  return new Promise((resolve, reject) => {
    // Ensure stdin is readable
    if (process.stdin.isPaused()) {
      process.stdin.resume();
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true, // Force terminal mode
    });

    // Set a timeout to detect if stdin is not responding
    const timeout = setTimeout(() => {
      rl.close();
      reject(new Error('Timeout waiting for input'));
    }, 30000); // 30 second timeout

    rl.question(query, (answer) => {
      clearTimeout(timeout);
      rl.close();
      resolve(answer);
    });

    // Handle Ctrl+C
    rl.on('SIGINT', () => {
      clearTimeout(timeout);
      rl.close();
      console.log('\n\n\x1b[31m❌ Installation cancelled.\x1b[0m');
      process.exit(0);
    });

    // Handle close
    rl.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '\n🔧 UI Plugin Installation\n');

  // Find the project root (where the consumer's package.json is)
  const projectRoot = findProjectRoot(__dirname);
  const envPath = path.join(projectRoot, '.env.local');
  
  let existingAppType = null;
  
  if (fs.existsSync(envPath)) {
    const existingContent = fs.readFileSync(envPath, 'utf8');
    const appTypeMatch = existingContent.match(/^NEXT_PUBLIC_APP_TYPE=(.+)$/m);
    if (appTypeMatch) {
      existingAppType = appTypeMatch[1].trim();
    }
  }

  // Check environment variable
  if (!existingAppType && process.env.NEXT_PUBLIC_APP_TYPE) {
    existingAppType = process.env.NEXT_PUBLIC_APP_TYPE;
  }

  let appType;

  // If already set, use it
  if (existingAppType && (existingAppType === 'admin' || existingAppType === 'ecommerce')) {
    console.log(`\x1b[33mℹ️  พบการตั้งค่าที่มีอยู่แล้ว (Found existing configuration): \x1b[0m\x1b[32m${existingAppType.toUpperCase()}\x1b[0m`);
    console.log(`\x1b[36m   ใช้การตั้งค่านี้ (Using this configuration)\x1b[0m\n`);
    appType = existingAppType;
  } else {
    // Check if running in non-interactive mode
    const isNonInteractive = !process.stdin.isTTY || process.env.CI === 'true';
    
    if (isNonInteractive) {
      // Try to use environment variable or prompt anyway
      if (process.env.NEXT_PUBLIC_APP_TYPE) {
        appType = process.env.NEXT_PUBLIC_APP_TYPE;
      } else {
        // Non-interactive mode - show instructions
        console.log('\x1b[33m⚠️  Running in non-interactive mode.\x1b[0m');
        console.log('\x1b[36m💡 Please run the following command after installation:\x1b[0m');
        console.log('   \x1b[32mnpx -y ui-plugin install-ui\x1b[0m');
        console.log('   \x1b[32mor\x1b[0m');
        console.log('   \x1b[32myarn install:ui\x1b[0m');
        console.log('\n\x1b[36m💡 Or set NEXT_PUBLIC_APP_TYPE environment variable:\x1b[0m');
        console.log('   \x1b[32mNEXT_PUBLIC_APP_TYPE=admin yarn add ...\x1b[0m');
        console.log('   \x1b[32mor\x1b[0m');
        console.log('   \x1b[32mNEXT_PUBLIC_APP_TYPE=ecommerce yarn add ...\x1b[0m');
        process.exit(0);
      }
    } else {
      // Interactive mode - ask the user
      // Force stdin to be readable even in non-TTY mode
      if (!process.stdin.isTTY) {
        // Try to resume stdin if it's paused
        if (process.stdin.isPaused()) {
          process.stdin.resume();
        }
        // Set raw mode if possible
        if (process.stdin.setRawMode) {
          try {
            process.stdin.setRawMode(true);
          } catch (e) {
            // Ignore if setRawMode fails
          }
        }
      }

      try {
        console.log('\n\x1b[36m╔═══════════════════════════════════════════════════════════╗\x1b[0m');
        console.log('\x1b[36m║  กรุณาเลือกประเภทแอปพลิเคชัน (Please select app type)      ║\x1b[0m');
        console.log('\x1b[36m╚═══════════════════════════════════════════════════════════╝\x1b[0m\n');
        console.log('  \x1b[32m1)\x1b[0m Admin - สำหรับส่วนจัดการหลังบ้าน');
        console.log('  \x1b[32m2)\x1b[0m Ecommerce - สำหรับส่วนหน้าร้านค้าออนไลน์\n');
        
        let answer = '';
        let attempts = 0;
        const maxAttempts = 5;
        
        while (answer !== '1' && answer !== '2' && answer !== 'admin' && answer !== 'ecommerce' && attempts < maxAttempts) {
          try {
            answer = await askQuestion('\x1b[33m👉 เลือกประเภท (1/2 หรือ admin/ecommerce): \x1b[0m');
            answer = answer.trim().toLowerCase();
            
            if (answer === '1') {
              appType = 'admin';
            } else if (answer === '2') {
              appType = 'ecommerce';
            } else if (answer === 'admin' || answer === 'ecommerce') {
              appType = answer;
            } else {
              console.log('\x1b[31m❌ ตัวเลือกไม่ถูกต้อง กรุณาเลือก 1, 2, admin, หรือ ecommerce\x1b[0m');
              console.log('\x1b[33m   (Invalid choice. Please enter 1, 2, admin, or ecommerce)\x1b[0m\n');
              attempts++;
            }
          } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
              throw error;
            }
            // Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        if (!appType) {
          throw new Error('Failed to get user input');
        }
      } catch (error) {
        // If stdin is not available, show instructions
        console.log('\x1b[33m⚠️  Cannot read from stdin. Running in non-interactive mode.\x1b[0m');
        console.log('\x1b[36m💡 Please run the following command after installation:\x1b[0m');
        console.log('   \x1b[32mnpx -y ui-plugin install-ui\x1b[0m');
        console.log('   \x1b[32mor\x1b[0m');
        console.log('   \x1b[32myarn install:ui\x1b[0m');
        console.log('\n\x1b[36m💡 Or set NEXT_PUBLIC_APP_TYPE environment variable:\x1b[0m');
        console.log('   \x1b[32mNEXT_PUBLIC_APP_TYPE=admin yarn add ...\x1b[0m');
        console.log('   \x1b[32mor\x1b[0m');
        console.log('   \x1b[32mNEXT_PUBLIC_APP_TYPE=ecommerce yarn add ...\x1b[0m');
        process.exit(0);
      }
    }
  }

  if (!appType) {
    console.log('\x1b[31m❌ No app type selected. Installation cancelled.\x1b[0m');
    process.exit(1);
  }

  // Create or update environment file
  let existingContent = '';
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add the APP_TYPE
  const envLines = existingContent.split('\n').filter(line => line.trim() !== '');
  const appTypeIndex = envLines.findIndex(line => line.startsWith('NEXT_PUBLIC_APP_TYPE='));
  
  if (appTypeIndex !== -1) {
    envLines[appTypeIndex] = `NEXT_PUBLIC_APP_TYPE=${appType}`;
  } else {
    envLines.push(`NEXT_PUBLIC_APP_TYPE=${appType}`);
  }

  // Write back to file
  fs.writeFileSync(envPath, envLines.join('\n') + '\n');
  
  console.log('\n\x1b[32m╔═══════════════════════════════════════════════════════════╗\x1b[0m');
  console.log(`\x1b[32m║  ✅ ติดตั้งสำเร็จสำหรับ: \x1b[1m${appType.toUpperCase()}\x1b[0m\x1b[32m                        ║\x1b[0m`);
  console.log(`\x1b[32m║  ✅ Successfully set up for: \x1b[1m${appType.toUpperCase()}\x1b[0m\x1b[32m                  ║\x1b[0m`);
  console.log('\x1b[32m╚═══════════════════════════════════════════════════════════╝\x1b[0m');
  console.log(`\x1b[36m📝 Configuration saved to: \x1b[0m${envPath}`);
  console.log('\x1b[36m🚀 Installation complete! You can now start using the UI components.\x1b[0m\n');
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n\x1b[31m❌ Installation cancelled.\x1b[0m');
  process.exit(0);
});

main().catch((error) => {
  console.error('\x1b[31m❌ Error during installation:', error.message, '\x1b[0m');
  process.exit(1);
});
