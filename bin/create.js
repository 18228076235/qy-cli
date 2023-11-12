const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const Generator = require("../lib/Generator");

module.exports = async function (name, options) {
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir);
    } else {
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
  }

  const generator = new Generator(name, targetAir);
  generator.create();
};
