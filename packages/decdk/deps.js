// +------------------------------------------------------------------------------------------------
// | this script runs during build to verify that this package depends on the entire aws construct
// | library. the script will fail (and update package.json) if this is not true.
// |
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');
const deps = pkg.dependencies || {};

const root = path.resolve('..', '..', 'packages', '@aws-cdk');
const modules = fs.readdirSync(root);
let errors = false;

for (const dir of modules) {
  const module = path.resolve(root, dir);
  if (!fs.existsSync(path.join(module, '.jsii'))) {
    continue;
  }
  const meta = require(path.join(module, 'package.json'));

  const exists = deps[meta.name];
  if (!exists) {
    console.error(`missing dependency: ${meta.name}`);
    errors = true;
  }

  const requirement = `^${meta.version}`;

  if (exists && exists !== requirement) {
    console.error(`invalid version requirement: expecting '${requirement}', got ${exists}`);
    errors = true;
  }

  deps[meta.name] = requirement;
}

fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, undefined, 2));

if (errors) {
  console.error('errors found. updated package.json');
  process.exit(1);
}