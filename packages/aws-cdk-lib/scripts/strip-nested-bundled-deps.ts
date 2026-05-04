#!/usr/bin/env node
/**
 * Node.js fully doesn't survive if the same dependency is bundled at multiple
 * levels. Since we bundle `@aws-cdk/cloud-assembly-api` and that package
 * bundles some dependencies that `aws-cdk-lib` also bundles, we tickle that
 * bug.
 *
 * Get rid of that problem by deleting all bundled dependencies from deeper
 * `node_modules` directories that we already bundle ourselves as well.
 *
 * After removing a nested bundled dep, we also update the outer dep's
 * package.json constraints to be compatible with the top-level version that
 * will be used instead. This prevents `npm ls` from reporting ELSPROBLEMS
 * when the top-level version doesn't satisfy the (now-removed) nested dep's
 * declared constraint (e.g. jsonschema@~1.4.1 vs the top-level 1.5.0).
 *
 * We can run this command either before compilation or before packing. We choose
 * to run it as early as possible to improve the chances of us detecting any
 * problems with it.
 */
import * as fs from 'fs';

/**
 * Return true if `version` satisfies `range`.
 *
 * Supports the common `~X.Y.Z` (tilde) and `^X.Y.Z` (caret) prefixes used in
 * this package's dependency tree. Falls back to strict equality for all other
 * forms.
 */
function satisfies(version: string, range: string): boolean {
  const v = version.split('.').map(Number);
  if (range.startsWith('~')) {
    // ~X.Y.Z: same major AND minor; patch must be >=
    const c = range.slice(1).split('.').map(Number);
    return v[0] === c[0] && v[1] === c[1] && (v[2] ?? 0) >= (c[2] ?? 0);
  }
  if (range.startsWith('^')) {
    // ^X.Y.Z: same major; minor.patch must be >= constraint
    const c = range.slice(1).split('.').map(Number);
    if (v[0] !== c[0]) return false;
    if (v[1] > c[1]) return true;
    if (v[1] < c[1]) return false;
    return (v[2] ?? 0) >= (c[2] ?? 0);
  }
  return version === range;
}

function main() {
  const pj = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const bundledDeps = pj.bundleDependencies as string[];

  // Collect the installed version of each top-level bundled dependency.
  const topLevelVersions: Record<string, string> = {};
  for (const dep of bundledDeps) {
    try {
      const pkg = JSON.parse(fs.readFileSync(`node_modules/${dep}/package.json`, 'utf-8'));
      topLevelVersions[dep] = pkg.version;
    } catch {
      // Not installed yet; skip.
    }
  }

  // A bundled dependency cannot be bundled under any other bundled depencency.
  for (const outerDep of bundledDeps) {
    let outerPkg: Record<string, any> | undefined;
    const outerPkgPath = `node_modules/${outerDep}/package.json`;
    try {
      outerPkg = JSON.parse(fs.readFileSync(outerPkgPath, 'utf-8'));
    } catch {
      // Outer dep not installed yet; nothing to patch.
    }

    let modified = false;
    for (const unwantedDep of bundledDeps) {
      const conflictPath = `node_modules/${outerDep}/node_modules/${unwantedDep}`;
      // { force: true } will make this not error if the path doesn't exist.
      fs.rmSync(conflictPath, { recursive: true, force: true });

      // If the outer dep declares a constraint on the dep we just removed, and
      // the top-level version that will now be used doesn't satisfy that
      // constraint, relax the constraint so npm ls exits cleanly.
      const topVersion = topLevelVersions[unwantedDep];
      const outerConstraint = outerPkg?.dependencies?.[unwantedDep];
      if (topVersion && outerConstraint && !satisfies(topVersion, outerConstraint)) {
        outerPkg!.dependencies[unwantedDep] = `^${topVersion}`;
        modified = true;
      }
    }

    if (modified && outerPkg) {
      fs.writeFileSync(outerPkgPath, JSON.stringify(outerPkg, null, 2) + '\n');
    }
  }
}

main();
