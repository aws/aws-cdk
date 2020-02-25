#!/usr/bin/env node
//
// align the version in a package.json file to the version of the repo
//
const fs = require('fs');

const marker = '999.0.0';
const repoVersion = require('../package.json').version;

for (const file of process.argv.splice(2)) {
  const pkg = JSON.parse(fs.readFileSync(file).toString());

  if (pkg.version !== marker) {
    throw new Error(`unexpected - all package.json files in this repo should have a version of 999.0.0: ${file}`);
  }

  pkg.version = repoVersion;

  processSection(pkg.dependencies || { });
  processSection(pkg.devDependencies || { });
  processSection(pkg.peerDependencies || { });

  fs.writeFileSync(file, JSON.stringify(pkg, undefined, 2));
}

function processSection(section) {
  for (const [ name, version ] of Object.entries(section)) {
    if (version.includes(marker)) {
      section[name] = version.replace(marker, repoVersion);
    }
  }
}