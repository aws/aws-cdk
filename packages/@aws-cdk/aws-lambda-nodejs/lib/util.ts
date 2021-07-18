import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as fs from 'fs';
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

export function tryGetTsConfig(tsConfigRelativePath?: string, entryToResolveFrom: string = ''): {
  compilerOptions?: {
    baseUrl?: string
  }
  awsCdkCompilerOptions?: {
    enableTscCompilation?: boolean;
    outDir?: string
  }
} | undefined {
  const tsConfigPath = tsConfigRelativePath
    ? path.resolve(tsConfigRelativePath)
    : path.resolve(findUp('tsconfig.json', path.dirname(entryToResolveFrom)) || '');

  if (!tsConfigPath) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const relativeTsConfig = require(tsConfigPath);

    if (relativeTsConfig.extends) {
      // recursively merge all extended tsConfig paths
      const tsConfigBasePath = path.resolve(tsConfigPath, relativeTsConfig.extends);
      const baseTsConfig = tryGetTsConfig(tsConfigBasePath);

      return {
        ...baseTsConfig,
        ...relativeTsConfig,
      };
    } else {
      return relativeTsConfig;
    }
  } catch (err) {
    return;
  }
}

/**
 * Returns a module version by requiring its package.json file
 */
export function tryGetModuleVersion(mod: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`${mod}/package.json`).version;
  } catch (err) {
    return undefined;
  }
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
    const version = pkgDependencies[mod] ?? tryGetModuleVersion(mod);
    if (!version) {
      throw new Error(`Cannot extract version for module '${mod}'. Check that it's referenced in your package.json or installed.`);
    }
    dependencies[mod] = version;
  }

  return dependencies;
}
