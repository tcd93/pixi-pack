module.exports = {
    env: {
        es6: true,
        node: true,
        browser: true,
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off"
    }
};