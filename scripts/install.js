#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const VALID_TYPES = ['admin', 'ecommerce'];

function normalizeType(raw) {
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  return VALID_TYPES.includes(lower) ? lower : undefined;
}

function getTypeFromArgs() {
  const arg = process.argv
    .slice(2)
    .find((candidate) => candidate.startsWith('--type='));

  return arg ? arg.split('=')[1] : undefined;
}

async function resolveType() {
  const typeFromEnv = normalizeType(
    process.env.APP_TYPE || process.env.npm_config_app_type,
  );
  if (typeFromEnv) {
    console.log(`Detected APP_TYPE from environment: "${typeFromEnv}".`);
    return typeFromEnv;
  }

  const typeFromArgs = normalizeType(getTypeFromArgs());
  if (typeFromArgs) {
    console.log(`Detected APP_TYPE from arguments: "${typeFromArgs}".`);
    return typeFromArgs;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    const fallback = VALID_TYPES[0];
    console.warn(
      `TTY unavailable. Defaulting APP_TYPE to "${fallback}". ` +
        'Set APP_TYPE env or pass --type=<admin|ecommerce> to override.',
    );
    return fallback;
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Which application type are you installing for?',
      choices: VALID_TYPES,
    },
  ]);

  return type;
}

function writeEnv(type) {
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
}

async function run() {
  try {
    const type = await resolveType();
    console.log(`Configuring for "${type}"...`);
    writeEnv(type);
    console.log('✅ Done!');
  } catch (error) {
    console.error('Error during postinstall:', error);
    process.exit(1);
  }
}

run();
