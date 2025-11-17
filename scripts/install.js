#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";

async function run() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "target",
      message: "Install for which project?",
      choices: ["Admin", "Ecommerce"],
    },
  ]);

  fs.writeFileSync(
    "./plugin-ui.config.json",
    JSON.stringify({ target: answers.target }, null, 2)
  );

  console.log(`\n✔ Installed for ${answers.target}`);
}

run();
