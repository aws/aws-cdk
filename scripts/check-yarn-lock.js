/**
 * Yarn v1 doesn't respect --frozen-lockfile entirely when using yarn workspaces.
 * The net effect is that if a dependency in one of our packages is not in the yarn.lock file,
 * yarn will happily install any/latest version of that package, even when --frozen-lockfile
 * is provided.
 *
 * This script manually verifies that all dependencies listed in our package.json files are
 * present in yarn.lock, and will fail if not.
 *
 * See:
 * https://github.com/yarnpkg/yarn/issues/4098
 * https://github.com/yarnpkg/yarn/issues/6291
 */

const fs = require('fs');
const path = require('path');
const { Project } = require("@lerna/project");
const lockfileParser = require('@yarnpkg/lockfile');

function repoRoot() {
  return path.join(__dirname, '..');
}

function yarnLockPackages() {
  const lockfilePath = path.join(repoRoot(), 'yarn.lock');
  
  if (!fs.existsSync(lockfilePath)) {
    throw new Error(`yarn.lock file not found at ${lockfilePath}`);
  }
  
  const yarnLockfile = fs.readFileSync(lockfilePath, 'utf8');
  const lockfileResult = lockfileParser.parse(yarnLockfile);

  if (lockfileResult.type !== 'success') {
    throw new Error(`Error finding or parsing lockfile: ${lockfileResult.type}`);
  }

  return new Set(Object.keys(lockfileResult.object));
}

async function main() {
  console.log('🔍 Checking yarn.lock integrity...');
  
  const yarnPackages = yarnLockPackages();
  const projects = await new Project(repoRoot()).getPackages();

  const localPackageNames = new Set(projects.map(p => p.name));
  
  let missingDependencies = [];

  function errorIfNotInYarnLock(package, dependencyName, dependencyVersion) {
    const dependencyId = `${dependencyName}@${dependencyVersion}`;
    const isLocalDependency = localPackageNames.has(dependencyName);
    if (!isLocalDependency && !yarnPackages.has(dependencyId)) {
      missingDependencies.push({
        package: package.name,
        dependency: dependencyId
      });
    }
  }

  projects.forEach((p) => {
    Object.entries(p.devDependencies || {}).forEach(([depName, depVersion]) => errorIfNotInYarnLock(p, depName, depVersion));
    Object.entries(p.dependencies || {}).forEach(([depName, depVersion]) => errorIfNotInYarnLock(p, depName, depVersion));
  });
  
  if (missingDependencies.length > 0) {
    console.error('\n❌ ERROR! The following dependencies are not present in yarn.lock:\n');
    missingDependencies.forEach(({ package, dependency }) => {
      console.error(`  - ${dependency} (from ${package})`);
    });
    console.error('\n💡 Please run "yarn install" and try again!\n');
    throw new Error(`Found ${missingDependencies.length} missing dependencies in yarn.lock`);
  }
  
  console.log(`✅ All dependencies verified! Checked ${projects.length} packages.`);
}

main().catch(e => {
  console.error(e)
  process.exitCode = 1;
});
