import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// From https://github.com/errwischt/stacktrace-parser/blob/master/src/stack-trace-parser.js
const STACK_RE = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

/**
 * A parsed stack trace line
 */
export interface StackTrace {
  readonly file: string;
  readonly methodName?: string;
  readonly lineNumber: number;
  readonly column: number;
}

/**
 * Parses the stack trace of an error
 */
export function parseStackTrace(error?: Error): StackTrace[] {
  const err = error || new Error();

  if (!err.stack) {
    return [];
  }

  const lines = err.stack.split('\n');

  const stackTrace: StackTrace[] = [];

  for (const line of lines) {
    const results = STACK_RE.exec(line);
    if (results) {
      stackTrace.push({
        file: results[2],
        methodName: results[1],
        lineNumber: parseInt(results[3], 10),
        column: parseInt(results[4], 10),
      });
    }
  }

  return stackTrace;
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

  if (fs.existsSync(path.join(directory, name))) {
    return directory;
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
 * Extract dependencies from a package.json
 */
export function extractDependencies(pkgPath: any, modules: string[]): { [key: string]: string } {
  const dependencies: { [key: string]: string } = {};

  // Use require for cache
  const pkgJson = require(pkgPath); // eslint-disable-line @typescript-eslint/no-require-imports

  const pkgDependencies = {
    ...pkgJson.dependencies ?? {},
    ...pkgJson.devDependencies ?? {},
    ...pkgJson.peerDependencies ?? {},
  };

  for (const mod of modules) {
    if (!pkgDependencies[mod]) {
      throw new Error(`Cannot extract version for module '${mod}' in package.json`);
    }
    dependencies[mod] = pkgDependencies[mod];
  }

  return dependencies;
}

/**
 * Finds the project root
 */
export function findProjectRoot(projectRoot?: string): string | undefined {
  return projectRoot
    ?? findUp(`.git${path.sep}`)
    ?? findUp(LockFile.YARN)
    ?? findUp(LockFile.NPM)
    ?? findUp('package.json');
}

/**
 * Finds the lock file of a project
 */
export function findLockFile(projectRoot: string): LockFile | undefined {
  if (fs.existsSync(path.join(projectRoot, LockFile.YARN))) {
    return LockFile.YARN;
  }

  if (fs.existsSync(path.join(projectRoot, LockFile.NPM))) {
    return LockFile.NPM;
  }

  return undefined;
}

/**
 * Returns the installed esbuild version
 */
export function getEsBuildVersion(): string | undefined {
  try {
    // --no-install ensures that we are checking for an installed version
    // (either locally or globally)
    const esbuild = spawnSync('npx', ['--no-install', 'esbuild', '--version']);

    if (esbuild.status !== 0) {
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
