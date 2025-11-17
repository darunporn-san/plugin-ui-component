#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\x1b[36m%s\x1b[0m', '\n🔧 UI Plugin Installation\n');

rl.question('Is this installation for \x1b[33madmin\x1b[0m or \x1b[33mecommerce\x1b[0m? (admin/ecommerce): ', (answer) => {
  const appType = answer.trim().toLowerCase();
  
  if (appType !== 'admin' && appType !== 'ecommerce') {
    console.log('\x1b[31m❌ Invalid selection. Please choose either "admin" or "ecommerce".\x1b[0m');
    process.exit(1);
  }

  // Create or update environment file
  const envContent = `NEXT_PUBLIC_APP_TYPE=${appType}\n`;
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Check if file exists and read existing content
  let existingContent = '';
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add the APP_TYPE
  const envLines = existingContent.split('\n');
  const appTypeIndex = envLines.findIndex(line => line.startsWith('NEXT_PUBLIC_APP_TYPE='));
  
  if (appTypeIndex !== -1) {
    envLines[appTypeIndex] = `NEXT_PUBLIC_APP_TYPE=${appType}`;
  } else {
    envLines.push(`NEXT_PUBLIC_APP_TYPE=${appType}`);
  }

  // Write back to file
  fs.writeFileSync(envPath, envLines.join('\n'));
  
  console.log(`\n✅ Successfully set up for \x1b[32m${appType}\x1b[0m`);
  console.log('\x1b[36m%s\x1b[0m', '\n🚀 Installation complete! You can now start using the UI components.');
  
  rl.close();
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\nInstallation cancelled.');
  process.exit(0);
});
