const fs = require('node:fs');
const path = require('node:path');
const packageJson = require('../package.json');

const declarationFilePath = path.join(__dirname, '../index.d.ts');
fs.writeFileSync(
  declarationFilePath,
  fs
    .readFileSync(declarationFilePath)
    .toString()
    .replace('"index"', `"${packageJson.name}"`),
);
