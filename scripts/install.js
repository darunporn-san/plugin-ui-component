#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const TARGET_DIR = process.cwd();

console.log('\n📦 UI Plugin Installation');
console.log('----------------------');

// Function to get module from various sources
function getModule() {
  // 1. Check command line arguments
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const argModule = args[0].trim().toLowerCase();
    if (argModule === 'admin' || argModule === 'ecommerce') {
      return argModule;
    }
  }

  // 2. Check environment variable
  const envModule = process.env.NEXT_PUBLIC_APP_TYPE?.trim().toLowerCase();
  if (envModule === 'admin' || envModule === 'ecommerce') {
    return envModule;
  }

  // 3. Check config file
  const configPath = path.join(TARGET_DIR, 'ui-plugin.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const configModule = config.target?.trim().toLowerCase();
      if (configModule === 'admin' || configModule === 'ecommerce') {
        return configModule;
      }
    } catch (error) {
      // Ignore config file errors
    }
  }

  return null;
}

// Function to install module
function installModule(module) {
  if (module !== 'admin' && module !== 'ecommerce') {
    console.error('❌ Invalid module. Please choose either "admin" or "ecommerce".');
    process.exit(1);
  }

  const sourceDir = path.join(SRC_DIR, module);
  const targetDir = path.join(TARGET_DIR, 'src', module);

  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

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
}

// Check if non-interactive mode is requested
const isNonInteractive = process.argv.includes('--non-interactive') || 
                         process.env.UI_PLUGIN_NON_INTERACTIVE === 'true';

// Try to get module non-interactively
const module = getModule();

if (module && isNonInteractive) {
  // Non-interactive installation (only when explicitly requested)
  installModule(module);
  rl.close();
} else {
  // Interactive installation (default behavior)
  // Show suggested module if available
  const suggestedModule = module ? ` (suggested: ${module})` : '';
  rl.question(`\nPlease select module to install (admin/ecommerce)${suggestedModule}: `, (answer) => {
    const selectedModule = answer.trim().toLowerCase() || module;
    installModule(selectedModule);
    rl.close();
  });
}

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
