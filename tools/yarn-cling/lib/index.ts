import * as lockfile from '@yarnpkg/lockfile';
import { promises as fs } from 'fs';
import * as path from 'path';
import { hoistDependencies } from './hoisting';
import { PackageJson, PackageLock, PackageLockEntry, PackageLockPackage, YarnLock } from './types';

export interface ShrinkwrapOptions {
  /**
   * The package.json file to start scanning for dependencies
   */
  packageJsonFile: string;

  /**
   * The output lockfile to generate
   *
   * @default - Don't generate the file, just return the calculated output
   */
  outputFile?: string;

  /**
   * Whether to hoist dependencies
   *
   * @default true
   */
  hoist?: boolean;
}

export async function generateShrinkwrap(options: ShrinkwrapOptions): Promise<PackageLock> {
  // No args (yet)
  const packageJsonFile = options.packageJsonFile;
  const packageJsonDir = path.dirname(packageJsonFile);

  const yarnLockLoc = await findYarnLock(packageJsonDir);
  const yarnLock: YarnLock = lockfile.parse(await fs.readFile(yarnLockLoc, { encoding: 'utf8' }));
  const pkgJson = await loadPackageJson(packageJsonFile);

  const lock = await generateLockFile(pkgJson, yarnLock, packageJsonDir);

  if (options.hoist ?? true) {
    hoistDependencies(lock.dependencies || {});
  }

  if (options.outputFile) {
    // Write the shrinkwrap file
    await fs.writeFile(options.outputFile, JSON.stringify(lock, undefined, 2), { encoding: 'utf8'} );
  }

  return lock;
}

async function generateLockFile(pkgJson: PackageJson, yarnLock: YarnLock, rootDir: string): Promise<PackageLock> {
  return {
    name: pkgJson.name,
    version: pkgJson.version,
    lockfileVersion: 1,
    requires: true,
    dependencies: await dependenciesFor(pkgJson.dependencies || {}, yarnLock, rootDir),
  };
}

// eslint-disable-next-line max-len
async function dependenciesFor(deps: Record<string, string>, yarnLock: YarnLock, rootDir: string): Promise<Record<string, PackageLockPackage>> {
  const ret: Record<string, PackageLockPackage> = {};

  // Get rid of any monorepo symlinks
  rootDir = await fs.realpath(rootDir);

  for (const [depName, versionRange] of Object.entries(deps)) {
    const depPkgJsonFile = require.resolve(`${depName}/package.json`, { paths: [rootDir] });
    const depPkgJson = await loadPackageJson(depPkgJsonFile);
    const depDir = path.dirname(depPkgJsonFile);
    const yarnKey = `${depName}@${versionRange}`;

    // Sanity check
    if (depPkgJson.name !== depName) {
      throw new Error(`Looking for '${depName}' from ${rootDir}, but found '${depPkgJson.name}' in ${depDir}`);
    }

    const yarnResolved = yarnLock.object[yarnKey];
    if (yarnResolved) {
      // Resolved by Yarn
      ret[depName] = {
        version: yarnResolved.version,
        integrity: yarnResolved.integrity,
        resolved: yarnResolved.resolved,
        requires: depPkgJson.dependencies,
        dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir),
      };
    } else {
      // Comes from monorepo, just use whatever's in package.json
      ret[depName] = {
        version: depPkgJson.version,
        requires: depPkgJson.dependencies,
        dependencies: await dependenciesFor(depPkgJson.dependencies || {}, yarnLock, depDir),
      };
    }

    // Simplify by removing useless entries
    if (Object.keys(ret[depName].requires ?? {}).length === 0) { delete ret[depName].requires; }
    if (Object.keys(ret[depName].dependencies ?? {}).length === 0) { delete ret[depName].dependencies; }
  }

  return ret;
}

async function findYarnLock(start: string) {
  return findUp('yarn.lock', start);
}

async function findUp(fileName: string, start: string) {
  start = path.resolve(start);
  let dir = start;
  const yarnLockHere = () => path.join(dir, fileName);
  while (!await fileExists(yarnLockHere())) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`No ${fileName} found upwards from ${start}`);
    }
    dir = parent;
  }

  return yarnLockHere();
}

async function loadPackageJson(fileName: string): Promise<PackageJson> {
  return JSON.parse(await fs.readFile(fileName, { encoding: 'utf8' }));
}

async function fileExists(fullPath: string): Promise<boolean> {
  try {
    await fs.stat(fullPath);
    return true;
  } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'ENOTDIR') { return false; }
    throw e;
  }
}

export function formatPackageLock(entry: PackageLockEntry) {
  const lines = new Array<string>();
  recurse([], entry);
  return lines.join('\n');

  function recurse(names: string[], thisEntry: PackageLockEntry) {
    if (names.length > 0) {
      // eslint-disable-next-line no-console
      lines.push(`${names.join(' -> ')} @ ${thisEntry.version}`);
    }
    for (const [depName, depEntry] of Object.entries(thisEntry.dependencies || {})) {
      recurse([...names, depName], depEntry);
    }
  }
}