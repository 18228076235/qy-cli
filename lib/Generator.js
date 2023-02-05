const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const downloadGitRepo = require("download-git-repo");
const path = require("path");

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail("Request failed,refetch...");
  }
}
class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  async getRepo() {
    const repoList = await wrapLoading(getRepoList, "waiting fatch template");
    if (!repoList) return;
    const repos = repoList.map((item) => item.name);
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "Please choose a template to create project",
    });
    return repo;
  }
  async getTag(repo) {
    const tags = await wrapLoading(getTagList, "waitting fetch tag", repo);
    if (!tags) return;
    const tagList = tags.map((item) => item.name);
    const { tag } = await inquirer.prompt({
      name: "tag",
      type: "list",
      choices: tagList,
      message: "please chose a tag to create project",
    });
    return tag;
  }

  async download(repo, tag) {
    const requestUrl = `zhurong-cli/${repo}${tag ? "#" + tag : ""}`;
    console.log(requestUrl);
    await wrapLoading(
      this.downloadGitRepo,
      "waiting dowload template",
      requestUrl,
      path.resolve(process.cwd(), this, this.targetDir)
    );
  }
  async create() {
    const repo = await this.getRepo();
    const tag = await this.getTag(repo);
    await this.download(repo, tag);
    console.log("用户选择了，repo=" + repo + ",tag=" + tag);
    console.log(" npm run dev\r\n");
  }
}

module.exports = Generator;
