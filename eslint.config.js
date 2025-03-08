const globals = require('globals');
const pluginJs = require('@eslint/js');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  { files: ['test/**/*.js'], languageOptions: { globals: globals.mocha } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];

// "no-plusplus": "off",
// "no-bitwise": "off",
// "no-nested-ternary": "off",
// "no-underscore-dangle": "off",
// "no-use-before-define": "off",
// "no-param-reassign": "off",
// "no-cond-assign": "off",
// "no-continue": "off",
// "no-restricted-syntax": "off"

// TEST
// "no-unused-expressions": "off",
// "no-new-wrappers": "off",
// "no-new-func": "off"

// BENCHMARK
// "no-console": "off",
// "no-unused-vars": "off",
// "no-shadow": "off"
