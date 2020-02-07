// +------------------------------------------------------------------------------------------------
// | this script runs during build to verify that this package depends on the entire aws construct
// | library. the script will fail (and update package.json) if this is not true.
// |
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');
const pkgDevDeps = pkg.devDependencies || { };
pkg.devDependencies = pkgDevDeps;

const root = path.resolve('..', '..', 'packages', '@aws-cdk');
const modules = fs.readdirSync(root);
let errors = false;

for (const dir of modules) {
  const module = path.resolve(root, dir);
  const meta = require(path.join(module, 'package.json'));
  if (!meta.jsii) {
    continue;
  }

  const exists = pkgDevDeps[meta.name];

  if (meta.deprecated) {
    if (exists) {
      console.error(`spurious dependency on deprecated: ${meta.name}`);
      errors = true;
    }
    delete pkgDevDeps[meta.name];
    continue;
  }



  if (!exists) {
    console.error(`missing dependency: ${meta.name}`);
    errors = true;
  }

  const requirement = meta.version;

  if (exists && exists !== requirement) {
    console.error(`invalid version requirement: expecting '${requirement}', got ${exists}`);
    errors = true;
  }

  pkgDevDeps[meta.name] = requirement;
}

fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, undefined, 2) + '\n');

if (errors) {
  console.error('errors found. updated package.json. delete node_modules and rerun "lerna bootstrap"');
  process.exit(1);
}
