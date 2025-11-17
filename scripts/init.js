#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";

async function run() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "target",
      message: "Install UI Plugin for which project?",
      choices: ["Admin", "Ecommerce"],
    },
  ]);

  fs.writeFileSync(
    "ui-plugin.config.json",
    JSON.stringify({ target: answers.target }, null, 2)
  );

  console.log(`\n✔ UI Plugin configured for: ${answers.target}`);
}

run();
