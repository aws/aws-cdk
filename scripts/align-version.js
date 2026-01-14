#!/usr/bin/env node
/**
 * Aligns package.json versions to the repository version.
 * 
 * This script ensures all packages in the monorepo use consistent versions,
 * respecting stability levels (stable vs alpha).
 */
const fs = require('fs');
const path = require('path');

const ver = require('./resolve-version');
const marker = ver.marker;

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('Usage: align-version.js <package.json> [<package.json> ...]');
  console.error('\nAligns package versions to repository version.');
  process.exit(1);
}
const packageVersionMap = files.reduce((accum, file) => {
  const pkg = JSON.parse(fs.readFileSync(file).toString());
  const version = pkg.stability !== 'stable' ? ver.alphaVersion : ver.version;

  return {
    ...accum,
    [pkg.name]: version,
  };
}, {});

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Error: File not found: ${file}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(file, 'utf-8');
    const pkg = JSON.parse(content);

    if (!pkg.name) {
      throw new Error(`Missing 'name' field in package.json`);
    }

    if (pkg.version !== marker) {
      throw new Error(`Unexpected version marker. Expected '${marker}', got '${pkg.version}'`);
    }

    const version = packageVersionMap[pkg.name];
    if (!version) {
      throw new Error(`No version mapping found for package '${pkg.name}'`);
    }

    pkg.version = version;

    processSection(pkg.dependencies || {}, file);
    processSection(pkg.devDependencies || {}, file);
    processSection(pkg.peerDependencies || {}, file);
    processSection(pkg.jsiiRosetta?.exampleDependencies ?? {}, file);

    console.error(`✓ ${path.basename(file)} => ${version}`);
    fs.writeFileSync(file, JSON.stringify(pkg, undefined, 2) + '\n');
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Processes a dependency section (dependencies, devDependencies, etc.)
 * and updates versions for internal packages.
 * 
 * @param {object} section - The dependency section to process
 * @param {string} file - The package.json file being processed (for error messages)
 */
function processSection(section, file) {
  for (const [name, version] of Object.entries(section)) {
    if (version === marker || version === '^' + marker) {
      const newVersion = packageVersionMap[name];
      if (!newVersion) {
        throw new Error(
          `Package '${name}' not found in repository. ` +
          `It's referenced in ${path.basename(file)} but not in the version map.`
        );
      }

      section[name] = version.replace(marker, newVersion);
    }
  }
}
