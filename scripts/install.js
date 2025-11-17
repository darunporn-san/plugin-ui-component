#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Which application type are you installing for?',
      choices: ['admin', 'ecommerce']
    }
  ])
  .then(answers => {
    const type = answers.type;
    console.log(`You selected "${type}". Configuring accordingly...`);
    const envFile = path.resolve(process.cwd(), '.env.local');
    let content = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
    content += `\nAPP_TYPE=${type}\n`;
    fs.writeFileSync(envFile, content, 'utf8');
    console.log('✅ Done!');
  })
  .catch(err => {
    console.error('Error during postinstall:', err);
    process.exit(1);
  });
