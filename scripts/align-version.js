#!/usr/bin/env node
//
// align the version in a package.json file to the version of the repo
//
const fs = require('fs');

const ver = require('./resolve-version');
const marker = ver.marker;

const files = process.argv.splice(2);
const packageVersionMap = files.reduce((accum, file) => {
  const pkg = JSON.parse(fs.readFileSync(file).toString());
  const version = pkg.stability !== 'stable' ? ver.alphaVersion : ver.version;

  return {
    ...accum,
    [pkg.name]: version,
  };
}, {});

for (const file of files) {
  const pkg = JSON.parse(fs.readFileSync(file).toString());

  if (pkg.version !== marker) {
    throw new Error(`unexpected - all package.json files in this repo should have a version of ${marker}: ${file}`);
  }

  const version = packageVersionMap[pkg.name]
  pkg.version = version;

  processSection(pkg.dependencies || { }, file);
  processSection(pkg.devDependencies || { }, file);
  processSection(pkg.peerDependencies || { }, file);
  processSection(pkg.jsiiRosetta?.exampleDependencies ?? { }, file);

  console.error(`${file} => ${version}`);
  fs.writeFileSync(file, JSON.stringify(pkg, undefined, 2));
}

function processSection(section, file) {
  for (const [ name, version ] of Object.entries(section)) {
    if (version === marker || version === '^' + marker) {
      const newVersion = packageVersionMap[name];
      if (!newVersion) {
        throw new Error(`No package found ${name} within repository, which has version 0.0.0`);
      }

      section[name] = version.replace(marker, newVersion);
    }
  }
}
