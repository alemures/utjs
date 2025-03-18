const fs = require('node:fs');
const path = require('node:path');
const packageJson = require('../package.json');

const declarationFilePath = path.join(__dirname, '../index.d.ts');
fs.writeFileSync(
  declarationFilePath,
  fs
    .readFileSync(declarationFilePath)
    .toString()
    .replace('declare module "index"', `declare module "${packageJson.name}"`)
    .replace(
      /declare module "lib\//g,
      `declare module "${packageJson.name}_internal_do_not_import/`,
    )
    .replace(
      /(require|import)\("lib\//g,
      `$1("${packageJson.name}_internal_do_not_import/`,
    ),
);
