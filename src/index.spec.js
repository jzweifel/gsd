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

it("should add Prettier", () => {
  vol.fromJSON({
    "/package.json": packageJson
  });

  task(getConfigGetter({}));

  expect(vol.toJSON()).toMatchSnapshot();
  expect(install).toHaveBeenCalledWith(["prettier"]);
});
