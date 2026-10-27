/**
 * Verify that no jsii dependency was built with a newer jsii-pacmak than the one aws-cdk-lib is built with.
 *
 * jsii-pacmak makes every generated package depend on the jsii runtime at `>= <pacmak version>`. If a
 * dependency requires a newer runtime than aws-cdk-lib does, package managers in some languages can't
 * reconcile the two. For example, NuGet resolves the lowest applicable version, so .NET consumers get a
 * "Detected package downgrade" (NU1605) error for `Amazon.JSII.Runtime`.
 *
 * The jsii-pacmak version a dependency was built with is read from the minimum of its published
 * `devDependencies['jsii-pacmak']` range, which projen keeps in sync with the version used for the build.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

const pkgDir = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
const bundled = new Set<string>(pkg.bundleDependencies ?? []);

const ownPacmakVersion: string = readPackageJson('jsii-pacmak').version;

const violations: string[] = [];

for (const depName of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
  if (bundled.has(depName)) continue;

  const depPkg = readPackageJson(depName);
  if (!depPkg.jsii) continue;

  const depPacmakRange: string | undefined = depPkg.devDependencies?.['jsii-pacmak'];
  const depPacmakVersion = depPacmakRange ? semver.minVersion(depPacmakRange)?.version : undefined;
  if (!depPacmakVersion) {
    console.log(`Skipping ${depName}@${depPkg.version}: cannot determine the jsii-pacmak version it was built with`);
    continue;
  }

  if (semver.gt(depPacmakVersion, ownPacmakVersion)) {
    violations.push(`${depName}@${depPkg.version} was built with jsii-pacmak@${depPacmakVersion}`);
  }
}

if (violations.length > 0) {
  console.error(`aws-cdk-lib is built with jsii-pacmak@${ownPacmakVersion}, but the following dependencies were built with a newer version:\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  console.error('\nTheir generated packages require a newer jsii runtime than aws-cdk-lib does, which breaks some package managers (e.g. NuGet error NU1605). Upgrade jsii-pacmak to at least the highest version listed above.');
  process.exitCode = 1;
} else {
  console.log(`All jsii dependencies are compatible with jsii-pacmak@${ownPacmakVersion}.`);
}

function readPackageJson(name: string) {
  return JSON.parse(fs.readFileSync(require.resolve(`${name}/package.json`, { paths: [pkgDir] }), 'utf-8'));
}
