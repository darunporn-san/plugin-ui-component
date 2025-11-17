#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const main = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Which application type are you installing for?',
        choices: ['admin', 'ecommerce'],
      },
    ]);

    const type = answers.type;
    console.log(`You selected "${type}". Configuring accordingly...`);

    const envFile = path.resolve(process.cwd(), '.env.local');
    let content = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
    content += `\nAPP_TYPE=${type}\n`;
    fs.writeFileSync(envFile, content, 'utf8');

    console.log('✅ Done!');
  } catch (err) {
    console.error('Error during postinstall:', err);
    process.exit(1);
  }
};

main();
