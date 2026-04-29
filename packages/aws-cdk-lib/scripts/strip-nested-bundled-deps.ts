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
 * We can run this command either before compilation or before packing. We choose
 * to run it as early as possible to improve the chances of us detecting any
 * problems with it.
 */
import * as fs from 'fs';

function main() {
  const pj = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const bundledDeps = pj.bundleDependencies as string[];

  // A bundled dependency cannot be bundled under any other bundled depencency.
  for (const outerDep of bundledDeps) {
    for (const unwantedDep of bundledDeps) {
      const conflictPath = `node_modules/${outerDep}/node_modules/${unwantedDep}`;
      // { force: true } will make this not error if the path doesn't exist.
      fs.rmSync(conflictPath, { recursive: true, force: true });
    }
  }
}

main();
