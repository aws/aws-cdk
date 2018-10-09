#!/usr/bin/env node
// Find JSII packages that have a certain field in their package.json. Outputs the directories containing
// jsii.json.
import fs = require('fs');
import path = require('path');
import yargs = require('yargs');

// tslint:disable:no-shadowed-variable
const argv = yargs
  .usage('$0')
  .option('verbose', { alias: 'v', type: 'boolean', desc: 'Turn on verbose logging' })
  .option('key', {
    alias: 'k',
    type: 'string',
    desc: 'Return only packages that have a truthy value in package.json for the given (dot-recursive) key.',
    requiresArg: 'KEY'
  })
  .epilogue([
    'Outputs the JSII directories for all JSII packages that are found.'
  ].join('\n'))
  .argv;

main();

function main() {
  const objectPath = argv.key ? argv.key.split('.') : [];

  // Find the package directories
  const packages = enumeratePackages(process.cwd(), (packageJson) => {
    const isJsii = packageJson.jsii;
    const matches = deepGet(packageJson, objectPath);
    return isJsii && matches;
  });

  // Output the JSII directories
  for (const pkg of packages) {
    process.stdout.write(pkg.directory + '\n');
  }
}

type PackagePredicate = (x: any) => boolean;

interface JSIIPackage {
  directory: string;
  packageJson: any;
}

/**
 * Return all packages from a given root if they match a given predicate
 *
 * Returns list of package directories.
 *
 * (Includes devDependencies only for the root package)
 */
function enumeratePackages(root: string, pred: PackagePredicate): JSIIPackage[] {
  const ret: JSIIPackage[] = [];
  const seen = new Set<string>();

  function recurse(directory: string, includeDevDependencies: boolean) {
    const packageJson = require(path.join(directory, '/package.json'));

    // Make sure we don't keep on doing the same packages over and over.
    // (Use name instead of dir so we dedupe even if they live in different directories).
    if (seen.has(packageJson.name)) { return; }
    seen.add(packageJson.name);

    debug(`Checking directory: ${directory}`);

    if (pred(packageJson)) {
      debug(`Matches predicate.`);
      ret.push({ directory, packageJson });
    }

    const depNames = Object.keys(packageJson.dependencies || {});
    if (includeDevDependencies) {
      depNames.push(...Object.keys(packageJson.devDependencies || {}));
    }

    debug(`Found dependencies: ${depNames}`);
    for (const depName of depNames) {
      const mainFilePath = findPackageFrom(depName, directory);
      if (!mainFilePath) {
        continue; // skip
      }

      // Result of findPackageFrom() is the 'index.js' file for this library.
      // Find the corresponding package root and recurse from there.
      recurse(findPackageRoot(mainFilePath), false);
    }
  }

  recurse(root, true);
  return ret;
}

/**
 * Emulate require.resolve() with a starting search path
 *
 * For some reason, the actual require.resolve() does not seem to do what I expect
 * it to do on my machine--it seems to ignore 'paths' and always uses the
 * current module scope. That's not good enough, and I've been spending 2 hours
 * on this already.
 *
 * We get the behavior that we want by dregging around in the innards of
 * NodeJS. Probalby not great to depend on private APIs, but since this is
 * a build tool and not shipped, I'm fine with it for now.
 */
function findPackageFrom(packageName: string, relativeTo: string) {
  // tslint:disable-next-line:variable-name
  const Module = module.constructor as any;

  const searchDirs: string[] = Module._nodeModulePaths(relativeTo).concat(Module.globalPaths);
  const ret = Module._findPath(packageName, searchDirs, false);
  if (ret === false) {
    // tslint:disable-next-line:no-console
    console.warn(`Could not find package ${packageName} in scope of ${relativeTo}`);
    return undefined;
  }
  return ret;
}

/**
 * Find the package.json up the tree for the given root file
 */
function findPackageRoot(rootFile: string) {
  let dir = path.dirname(rootFile);

  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const newdir = path.dirname(dir);
    if (newdir === dir) {
      throw new Error(`Did not find a package.json for ${rootFile}`);
    }
    dir = newdir;
  }

  return dir;
}

/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
function deepGet(x: any, path: string[]): any {
  path = path.slice();

  while (path.length > 0 && typeof x === 'object' && x !== null) {
    const key = path.shift()!;
    x = x[key];
  }
  return path.length === 0 ? x : undefined;
}

function debug(s: string) {
  if (argv.verbose) {
    process.stderr.write(`[find-jsii-packages] ${s}\n`);
  }
}
