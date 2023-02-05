#! /usr/bin/env node

const program = require("commander");
const chalk = require("chalk");

program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f,--force", "overwrite target directory")
  .option("-s, --set <path> <value>")
  .option("-g, --get <path>", "get value form option")
  .option("-d, --delete <path>", "delete option from config")
  .action((name, optios) => {
    require("./create")(name, optios);
  });

program
  .command("ui")
  .description("start add open roc-cli ui")
  .option("-p, --port <port>", "Port used for the UI Server")
  .action((option) => {
    console.log(option);
  });

program
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");
program.on("--help", () => {
  console.log(
    `\n\nRun ${chalk.cyan(
      `qy <command> --help`
    )} for detaied usege of given command\r\n`
  );
});
program.parse(program.argv);
