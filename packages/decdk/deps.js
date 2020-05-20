// +------------------------------------------------------------------------------------------------
// | this script runs during build to verify that this package depends on the entire aws construct
// | library. the script will fail (and update package.json) if this is not true.
// |
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');
const deps = pkg.dependencies || (pkg.dependencies = {});

const root = path.resolve('..', '..', 'packages', '@aws-cdk');
const modules = fs.readdirSync(root);
let errors = false;

for (const dir of modules) {
  const module = path.resolve(root, dir);
  const meta = require(path.join(module, 'package.json'));

  // skip non-jsii modules
  if (!meta.jsii) {
    continue;
  }

  // skip the `@aws-cdk/cloudformation-include` module
  if (dir === 'cloudformation-include') {
    continue;
  }

  const exists = deps[meta.name];

  if (meta.deprecated) {
    if (exists) {
      console.error(`spurious dependency on deprecated: ${meta.name}`);
      errors = true;
    }
    delete deps[meta.name];
    continue;
  }
  // skip private packages
  if (meta.private) {
    continue;
  }

  if (!exists) {
    console.error(`missing dependency: ${meta.name}`);
    errors = true;
  }

  const requirement = `${meta.version}`;

  if (exists && exists !== requirement) {
    console.error(`invalid version requirement: expecting '${requirement}', got ${exists}`);
    errors = true;
  }

  deps[meta.name] = requirement;
}

fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, undefined, 2) + '\n');

if (errors) {
  console.error('errors found. updated package.json');
  process.exit(1);
}
