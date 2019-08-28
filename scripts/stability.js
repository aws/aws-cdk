const path = require('path');
const fs = require('fs');
const packageJsonPath = process.argv[2] || path.join(process.cwd(), 'package.json');
const package = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const libdir = path.join(path.dirname(packageJsonPath), 'lib');
const libsrc = fs.existsSync(libdir) ? fs.readdirSync(libdir).filter(x => !x.endsWith('.generated.ts') && !x.endsWith('.js') && x !== 'index.ts') : [ 'dummy' ];

console.log(`${package.name.replace(/^@aws-cdk\//g, '')},${package.stability || 'unknown'},${libsrc.length === 0 ? 'cfn-only' : ''}`);

