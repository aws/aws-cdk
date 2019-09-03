#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error(`usage: ${path.basename(process.argv[1])} module1/package.json module2/package.json module3/package.json ...`);
  process.exit(1);
}

for (const packageJsonPath of dirs) {
  const moduledir = path.dirname(packageJsonPath);
  const metadata = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const components = [
    metadata.name.replace(/^@aws-cdk\//g, ''), // module
    metadata.stability || 'unknown',           // stability
    cfnOnly(moduledir) ? 'cfn-only' : ''       // cfn-only
  ]

  console.log(components.join(','));
}

function cfnOnly(dir) {
  const libdir = path.join(dir, 'lib');
  const libsrc = fs.existsSync(libdir) ? fs.readdirSync(libdir).filter(x => !x.endsWith('.generated.ts') && !x.endsWith('.js') && x !== 'index.ts') : [ 'dummy' ];
  return libsrc.length === 0;
}