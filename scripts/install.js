#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Which application type are you installing for?',
        choices: ['admin', 'ecommerce'],
      },
    ]);

    console.log(`You selected "${type}". Configuring accordingly...`);

    const envFile = path.resolve(process.cwd(), '.env.local');
    const existingContent = fs.existsSync(envFile)
      ? fs.readFileSync(envFile, 'utf8')
      : '';

    const filteredContent = existingContent
      .split('\n')
      .filter((line) => !line.startsWith('APP_TYPE='))
      .join('\n')
      .trimEnd();

    const nextContent = `${filteredContent}\nAPP_TYPE=${type}\n`;
    fs.writeFileSync(envFile, nextContent, 'utf8');

    console.log('✅ Done!');
  } catch (error) {
    console.error('Error during postinstall:', error);
    process.exit(1);
  }
}

run();
