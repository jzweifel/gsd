module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:jest/recommended"
  ],
  plugins: ["prettier", "import", "jest"],
  rules: {
    "prettier/prettier": "error"
  },
  env: {
    "jest/globals": true
  }
};
