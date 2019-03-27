const { install, packageJson } = require("mrm-core");

function task() {
  const packages = {
    "@commitlint/cli": "^7.5.2",
    "@commitlint/config-conventional": "^7.5.0",
    eslint: "^5.15.3",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-config-prettier": "^4.1.0",
    "eslint-plugin-import": "^2.16.0",
    "eslint-plugin-prettier": "^3.0.1",
    husky: "^1.3.1",
    "lint-staged": "^8.1.5",
    "markdownlint-cli": "^0.14.1",
    prettier: "^1.16.4"
  };

  const commitlintConfig = {
    commitlint: {
      extends: ["@commitlint/config-conventional"]
    }
  };

  const huskyConfig = {
    husky: {
      hooks: {
        "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS",
        "pre-push": "npm test"
      }
    }
  };

  const pkg = packageJson();

  pkg
    .merge({
      ...commitlintConfig,
      ...huskyConfig
    })
    .save();

  // Dependencies
  install(packages);
}

task.description = "Opinionated git hooks to guard your code base 🐶";
module.exports = task;
