#!/usr/bin/env node
//
// align the version in a package.json file to the version of the repo
//
const fs = require('fs');

const marker = require('./get-version-marker');
const repoVersion = require('./get-version');

for (const file of process.argv.splice(2)) {
  const pkg = JSON.parse(fs.readFileSync(file).toString());

  if (pkg.version !== marker) {
    throw new Error(`unexpected - all package.json files in this repo should have a version of ${marker}: ${file}`);
  }

  pkg.version = repoVersion;

  processSection(pkg.dependencies || { }, file);
  processSection(pkg.devDependencies || { }, file);
  processSection(pkg.peerDependencies || { }, file);

  console.error(`${file} => ${repoVersion}`);
  fs.writeFileSync(file, JSON.stringify(pkg, undefined, 2));
}

function processSection(section, file) {
  for (const [ name, version ] of Object.entries(section)) {
    if (version === marker || version === '^' + marker) {
      section[name] = version.replace(marker, repoVersion);
    }
  }
}
