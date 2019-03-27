const { install } = require("mrm-core");

function task() {
  const packages = ["prettier"];
  // Dependencies
  install(packages);
}

task.description = "Adds Prettier";
module.exports = task;
