/**
 * Validates that bundled dependencies satisfy their peer dependency requirements.
 * This prevents peer dependency warnings when users install packages with bundled dependencies.
 * 
 * Usage: ts-node check-peer-dependencies.ts <package-directory>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

function main() {
  const packageDir = process.argv[2] || process.cwd();
  const packageJsonPath = path.join(packageDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Error: package.json not found at ${packageJsonPath}`);
    process.exit(1);
  }
  
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = pkg.name || 'unknown';
  
  console.log(`Checking peer dependencies for ${packageName}...`);
  const bundled = new Set(pkg.bundleDependencies || pkg.bundledDependencies || []);
  const deps = pkg.dependencies || {};
  
  const errors = [];
  
  for (const [depName, depVersion] of Object.entries(deps)) {
    if (!bundled.has(depName)) continue;
    
    const depPkgPath = path.join(packageDir, 'node_modules', depName, 'package.json');
    if (!fs.existsSync(depPkgPath)) continue;
    
    const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
    const peerDeps = depPkg.peerDependencies || {};
    
    for (const [peerName, peerRange] of Object.entries(peerDeps)) {
      const installedRange = deps[peerName] as string | undefined;
      const peerRangeStr = peerRange as string;
      if (!installedRange) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but ${packageName} does not include it`);
        continue;
      }
      
      // Check if the minimum version of the installed range satisfies the peer dependency
      const minVersion = semver.minVersion(installedRange);
      if (!minVersion) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but ${packageName} has invalid range ${installedRange}`);
        continue;
      }
      
      if (!semver.satisfies(minVersion.version, peerRangeStr, { includePrerelease: true })) {
        errors.push(`${depName} requires peer ${peerName}@${peerRangeStr}, but ${packageName} has ${installedRange} (min: ${minVersion.version})`);
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
