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

const violations: Array<{ dep: string; pacmakVersion: string }> = [];

for (const depName of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
  if (bundled.has(depName)) continue;

  const depPkg = readPackageJson(depName);
  if (!depPkg.jsii) continue;

  const depPacmakRange: string | undefined = depPkg.devDependencies?.['jsii-pacmak'];
  if (!depPacmakRange) {
    throw new Error(`Unable to determine jsii-pacmak version of ${depName}`);
  }
  console.log(`${depName}: jsii-pacmak@${depPacmakRange}`);
  const depPacmakVersion = semver.minVersion(depPacmakRange)!.version;

  if (semver.gt(depPacmakVersion, ownPacmakVersion)) {
    violations.push({ dep: `${depName}@${depPkg.version}`, pacmakVersion: depPacmakVersion });
  }
}

if (violations.length > 0) {
  const requiredVersion = violations.map(v => v.pacmakVersion).sort(semver.rcompare)[0];
  const details = violations.map(v => `  ${v.dep} was built with jsii-pacmak@${v.pacmakVersion}`).join('\n');
  throw new Error(`aws-cdk-lib is built with jsii-pacmak@${ownPacmakVersion}, but the following dependencies were built with a newer version:\n\n${details}\n\nUpgrade jsii-pacmak to ${requiredVersion} or later.`);
}

console.log(`All jsii dependencies are compatible with jsii-pacmak@${ownPacmakVersion}.`);

function readPackageJson(name: string) {
  return JSON.parse(fs.readFileSync(require.resolve(`${name}/package.json`, { paths: [pkgDir] }), 'utf-8'));
}
