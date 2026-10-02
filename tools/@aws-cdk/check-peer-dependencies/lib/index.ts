/**
 * Validates that bundled dependencies satisfy their peer dependency requirements.
 * This prevents peer dependency warnings when users install packages with bundled dependencies.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

/**
 * Check that every bundled dependency's peer dependencies are satisfied by the
 * package's own (production) dependencies.
 *
 * @param packageDir directory containing the `package.json` to check
 * @returns a list of human-readable validation errors (empty if everything is satisfied)
 * @throws if no `package.json` exists in `packageDir`
 */
export function checkPeerDependencies(packageDir: string): string[] {
  const packageJsonPath = path.join(packageDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = pkg.name || 'unknown';

  const bundled = new Set<string>(pkg.bundleDependencies || pkg.bundledDependencies || []);
  const deps: Record<string, string> = pkg.dependencies || {};

  const errors: string[] = [];

  for (const depName of Object.keys(deps)) {
    if (!bundled.has(depName)) continue;

    const depPkgPath = path.join(packageDir, 'node_modules', depName, 'package.json');
    if (!fs.existsSync(depPkgPath)) continue;

    const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
    const peerDeps: Record<string, string> = depPkg.peerDependencies || {};

    for (const [peerName, peerRange] of Object.entries(peerDeps)) {
      const installedRange = deps[peerName];
      if (!installedRange) {
        errors.push(`${depName} requires peer ${peerName}@${peerRange}, but ${packageName} does not include it`);
        continue;
      }

      // Check if the minimum version of the installed range satisfies the peer dependency.
      // semver.minVersion returns null for a valid-but-empty range and throws for an
      // unparseable one; treat both as an invalid range.
      let minVersion: semver.SemVer | null = null;
      try {
        minVersion = semver.minVersion(installedRange);
      } catch {
        minVersion = null;
      }
      if (!minVersion) {
        errors.push(`${depName} requires peer ${peerName}@${peerRange}, but ${packageName} has invalid range ${installedRange}`);
        continue;
      }

      if (!semver.satisfies(minVersion.version, peerRange, { includePrerelease: true })) {
        errors.push(`${depName} requires peer ${peerName}@${peerRange}, but ${packageName} has ${installedRange} (min: ${minVersion.version})`);
      }
    }
  }

  return errors;
}
