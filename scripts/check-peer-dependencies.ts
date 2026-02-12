/**
 * Validates that bundled dependencies in aws-cdk-lib satisfy their peer dependency requirements.
 * This prevents peer dependency warnings when users install aws-cdk-lib.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

const repoRoot = path.join(__dirname, '..');
const cdkLibDir = path.join(repoRoot, 'packages/aws-cdk-lib');
const cdkLibPackageJson = path.join(cdkLibDir, 'package.json');

function main() {
  console.log('Checking peer dependencies...');
  
  const pkg = JSON.parse(fs.readFileSync(cdkLibPackageJson, 'utf8'));
  const bundled = new Set(pkg.bundleDependencies || []);
  const deps = pkg.dependencies || {};
  
  const errors = [];
  
  for (const [depName, depVersion] of Object.entries(deps)) {
    if (!bundled.has(depName)) continue;
    
    const depPkgPath = path.join(cdkLibDir, 'node_modules', depName, 'package.json');
    if (!fs.existsSync(depPkgPath)) continue;
    
    const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
    const peerDeps = depPkg.peerDependencies || {};
    
    for (const [peerName, peerRange] of Object.entries(peerDeps)) {
      const installedRange = deps[peerName] as string | undefined;
      const peerRangeStr = peerRange as string;
      if (!installedRange) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but it's not in aws-cdk-lib dependencies`);
        continue;
      }
      
      // Check if the minimum version of the installed range satisfies the peer dependency
      const minVersion = semver.minVersion(installedRange);
      if (!minVersion) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but aws-cdk-lib has invalid range ${installedRange}`);
        continue;
      }
      
      if (!semver.satisfies(minVersion.version, peerRangeStr, { includePrerelease: true })) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but aws-cdk-lib has ${installedRange} (min: ${minVersion.version})`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('Peer dependency validation failed:\n');
    errors.forEach(err => console.error(`  * ${err}`));
    process.exit(1);
  }
  
  console.log('All peer dependencies satisfied');
}

main();
