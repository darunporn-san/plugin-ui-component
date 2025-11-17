#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SRC_DIR = path.join(__dirname, '../src');
const TARGET_DIR = process.cwd();

console.log('\n📦 UI Plugin Installation');
console.log('----------------------');

rl.question('\nPlease select module to install (admin/ecommerce): ', (answer) => {
  const module = answer.trim().toLowerCase();
  
  if (module !== 'admin' && module !== 'ecommerce') {
    console.error('❌ Invalid selection. Please choose either "admin" or "ecommerce".');
    process.exit(1);
  }

  const sourceDir = path.join(SRC_DIR, module);
  const targetDir = path.join(TARGET_DIR, 'src', module);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(path.dirname(targetDir))) {
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  }

  // Copy files
  try {
    copyFolderRecursiveSync(sourceDir, targetDir);
    console.log(`\n✅ Successfully installed ${module} module to ${targetDir}`);
    console.log('✨ Installation completed!');
  } catch (error) {
    console.error('❌ Error during installation:', error.message);
    process.exit(1);
  }

  rl.close();
});

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}
