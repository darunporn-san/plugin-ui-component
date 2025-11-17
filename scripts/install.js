#!/usr/bin/env node
const inquirer = require('inquirer');
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
      // Interactive mode - ask the user with inquirer
      try {
        console.log('\n\x1b[36m╔═══════════════════════════════════════════════════════════╗\x1b[0m');
        console.log('\x1b[36m║  Are you installing for:                                    ║\x1b[0m');
        console.log('\x1b[36m╚═══════════════════════════════════════════════════════════╝\x1b[0m\n');
        
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'target',
            message: 'Select project type:',
            choices: [
              {
                name: '1) Admin - สำหรับส่วนจัดการหลังบ้าน',
                value: 'admin'
              },
              {
                name: '2) Ecommerce - สำหรับส่วนหน้าร้านค้าออนไลน์',
                value: 'ecommerce'
              }
            ],
          },
        ]);

        appType = answers.target;
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
