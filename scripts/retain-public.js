#!/usr/bin/env node
/**
 * Filters package.json files to retain only non-private packages.
 * 
 * Usage:
 *   retain-public.js <package.json> [<package.json> ...]
 * 
 * Outputs the paths of non-private packages, one per line.
 * Useful for finding publishable packages in a monorepo.
 */
const path = require('path');
const fs = require('fs');

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('Usage: retain-public.js <package.json> [<package.json> ...]');
  console.error('\nFilters to show only non-private packages.');
  process.exit(1);
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Error: File not found: ${file}`);
    process.exit(1);
  }

  try {
    const pkgJson = JSON.parse(fs.readFileSync(path.resolve(file), 'utf-8'));

    if (!pkgJson.private) {
      console.log(file);
    }
  } catch (error) {
    console.error(`Error parsing ${file}: ${error.message}`);
    process.exit(1);
  }
}
