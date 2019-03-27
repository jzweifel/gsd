jest.mock("fs");
jest.mock("mrm-core/src/util/log", () => ({
  added: jest.fn()
}));
jest.mock("mrm-core/src/npm", () => ({
  install: jest.fn()
}));

const { install } = require("mrm-core");
const { getConfigGetter } = require("mrm");
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

  task(getConfigGetter({}));

  expect(vol.toJSON()).toMatchSnapshot();
  expect(install).toHaveBeenCalledWith(expectedPackages);
});