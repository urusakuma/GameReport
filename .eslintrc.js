module.exports = {
  env: {
    browser: true,
    jQuery: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["google", "prettier"],
  rules: {},
};
