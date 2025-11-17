#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const main = async () => {
  try {
    let type = 'admin'; // default fallback

    // 🔹 ถ้า terminal เป็น interactive ให้ถามผู้ใช้
    if (process.stdin.isTTY) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Which application type are you installing for?',
          choices: ['admin', 'ecommerce'],
        },
      ]);
      type = answers.type;
    } else {
      console.log('Non-interactive terminal detected, using default: admin');
    }

    const envFile = path.resolve(process.cwd(), '.env.local');
    let content = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';

    // เพิ่มหรืออัปเดต APP_TYPE
    if (!content.includes('APP_TYPE=')) {
      content += `\nAPP_TYPE=${type}\n`;
    } else {
      content = content.replace(/APP_TYPE=.*/g, `APP_TYPE=${type}`);
    }

    fs.writeFileSync(envFile, content, 'utf8');
    console.log(`✅ .env.local updated with APP_TYPE=${type}`);
  } catch (err) {
    console.error('Error during installation:', err);
    process.exit(1);
  }
};

main();
