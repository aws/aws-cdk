import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface CallSite {
  getThis(): any;
  getTypeName(): string;
  getFunctionName(): string;
  getMethodName(): string;
  getFileName(): string;
  getLineNumber(): number;
  getColumnNumber(): number;
  getFunction(): Function;
  getEvalOrigin(): string;
  isNative(): boolean;
  isToplevel(): boolean;
  isEval(): boolean;
  isConstructor(): boolean;
}

/**
 * Get callsites from the V8 stack trace API
 *
 * https://github.com/sindresorhus/callsites
 */
export function callsites(): CallSite[] {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack?.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return stack as unknown as CallSite[];
}

/**
 * Returns the major version of node installation
 */
export function nodeMajorVersion(): number {
  return parseInt(process.versions.node.split('.')[0], 10);
}

/**
 * Find a file by walking up parent directories
 */
export function findUp(name: string, directory: string = process.cwd()): string | undefined {
  const absoluteDirectory = path.resolve(directory);

  const file = path.join(directory, name);
  if (fs.existsSync(file)) {
    return file;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory === root) {
    return undefined;
  }

  return findUp(name, path.dirname(absoluteDirectory));
}

/**
 * Spawn sync with error handling
 */
export function exec(cmd: string, args: string[], options?: SpawnSyncOptions) {
  const proc = spawnSync(cmd, args, options);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    if (proc.stdout || proc.stderr) {
      throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
    }
    throw new Error(`${cmd} exited with status ${proc.status}`);
  }

  return proc;
}

/**
 * Extract versions for a list of modules.
 *
 * First lookup the version in the package.json and then fallback to requiring
 * the module's package.json. The fallback is needed for transitive dependencies.
 */
export function extractDependencies(pkgPath: string, modules: string[]): { [key: string]: string } {
  const dependencies: { [key: string]: string } = {};

  // Use require for cache
  const pkgJson = require(pkgPath); // eslint-disable-line @typescript-eslint/no-require-imports

  const pkgDependencies = {
    ...pkgJson.dependencies ?? {},
    ...pkgJson.devDependencies ?? {},
    ...pkgJson.peerDependencies ?? {},
  };

  for (const mod of modules) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const version = pkgDependencies[mod] ?? require(`${mod}/package.json`).version;
      dependencies[mod] = version;
    } catch (err) {
      throw new Error(`Cannot extract version for module '${mod}'. Check that it's referenced in your package.json or installed.`);
    }
  }

  return dependencies;
}

/**
 * Returns the installed esbuild version
 */
export function getEsBuildVersion(): string | undefined {
  try {
    // --no-install ensures that we are checking for an installed version
    // (either locally or globally)
    const npx = os.platform() === 'win32' ? 'npx.cmd' : 'npx';
    const esbuild = spawnSync(npx, ['--no-install', 'esbuild', '--version']);

    if (esbuild.status !== 0 || esbuild.error) {
      return undefined;
    }

    return esbuild.stdout.toString().trim();
  } catch (err) {
    return undefined;
  }
}

export enum LockFile {
  NPM = 'package-lock.json',
  YARN = 'yarn.lock'
}
