#! /usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const ejs = require("ejs");

module.exports = (async function () {
  let { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Your project name",
      default: "my-node-cli",
    },
  ]);
  const cwdUrl = process.cwd();
  const targetAir = path.join(cwdUrl, name);
  if (fs.existsSync(targetAir)) {
    let { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Target directory aleady exists Pick an anction:",
        choices: [
          { name: "overwhrite", value: "overwhrite" },
          { name: "Cancel", value: false },
        ],
      },
    ]);
    if (!action) {
      return;
    } else if (action === "overwhrite") {
      console.log("\r\nRemoving...");
      await fs.remove(targetAir);
    }
  }
  fs.mkdirSync(targetAir);
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "userName",
      message: "Your userName",
    },
    {
      type: "password",
      name: "password",
      message: "Your password",
    },
  ]);
  const destUrl = path.join(__dirname, "../templates");
  fs.readdir(destUrl, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      ejs
        .renderFile(path.join(destUrl, file), { ...answers, name })
        .then((data) => {
          fs.writeFileSync(path.join(targetAir, file), data);
        });
    });
  });
})();
