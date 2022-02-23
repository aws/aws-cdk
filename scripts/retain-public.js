#!/usr/bin/env node
//
// From a set of package.jsons on the command-line, retain only the non-private ones
//
const path = require('path');

for (const file of process.argv.splice(2)) {
  const pkgJson = require(path.resolve(file));

  if (!pkgJson.private) {
    console.log(file);
  }
}
