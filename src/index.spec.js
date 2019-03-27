jest.mock("fs");
jest.mock("mrm-core/src/util/log", () => ({
  added: jest.fn()
}));
jest.mock("mrm-core/src/npm", () => ({
  install: jest.fn()
}));

const { install } = require("mrm-core");
const { vol } = require("memfs");
const task = require("./index");

const stringify = o => JSON.stringify(o, null, "  ");

const packageJson = stringify({
  name: "unicorn",
  scripts: {
    test: "jest"
  }
});

afterEach(() => {
  vol.reset();
  install.mockClear();
});

it("should install the expected packages", () => {
  const expectedPackages = {
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

  vol.fromJSON({
    "/package.json": packageJson
  });

  task();

  expect(install).toHaveBeenCalledWith(expectedPackages);
});

it("should set up commitlint to extend config-conventional", () => {
  vol.fromJSON({
    "/package.json": packageJson
  });

  task();

  const actualPackageJson = JSON.parse(vol.toJSON()["/package.json"]);

  expect(actualPackageJson.commitlint.extends).toEqual([
    "@commitlint/config-conventional"
  ]);
});

it("should set up husky to run commitlint on the commit-msg hook", () => {
  vol.fromJSON({
    "/package.json": packageJson
  });

  task();

  const actualPackageJson = JSON.parse(vol.toJSON()["/package.json"]);

  expect(actualPackageJson.husky.hooks["commit-msg"]).toEqual(
    "commitlint -e $HUSKY_GIT_PARAMS"
  );
});

it("should set up husky to run test script on the pre-push hook", () => {
  vol.fromJSON({
    "/package.json": packageJson
  });

  task();

  const actualPackageJson = JSON.parse(vol.toJSON()["/package.json"]);

  expect(actualPackageJson.husky.hooks["pre-push"]).toEqual("npm test");
});

it("should set up husky to run lint-staged and test script on the pre-commit hook", () => {
  vol.fromJSON({
    "/package.json": packageJson
  });

  task();

  const actualPackageJson = JSON.parse(vol.toJSON()["/package.json"]);

  expect(actualPackageJson.husky.hooks["pre-commit"]).toEqual(
    "lint-staged && npm test"
  );
});
