import type { SpawnSyncOptions } from 'child_process';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Runtime } from '../../aws-lambda';
import { UnscopedValidationError } from '../../core';

/**
 * Shell metacharacters that could be used for command injection
 * Covers: ; & | ` $ ( ) < > \ ' "
 */
export const SHELL_METACHARACTERS = /[;&|`$()<>\\'"]/;

/**
 * Valid npm package name pattern
 * - Must start with alphanumeric or @
 * - Can contain: alphanumeric, @, /, -, _, .
 * - Examples: lodash, @aws-sdk/client-s3, @types/node
 * - Rejects: names with spaces, shell metacharacters, or starting with . or -
 */
export const NPM_PACKAGE_NAME_PATTERN = /^[@a-z0-9][a-z0-9._\/-]*$/i;

/**
 * Valid external module pattern for esbuild --external flag
 * Same as NPM_PACKAGE_NAME_PATTERN but allows a trailing * for glob patterns
/* , lodash
 */
export const EXTERNAL_MODULE_PATTERN = /^[@a-z0-9][a-z0-9._\/-]*\*?$/i;

/**
 * Valid file extension pattern for esbuild loaders
 * - Must start with a dot followed by alphanumeric characters
 * - Allows multiple dot-separated segments for compound extensions
 * - Examples: .txt, .json, .css, .d.ts, .module.css, .test.js
 * - Rejects: extensions with special characters or spaces
 */
export const FILE_EXTENSION_PATTERN = /^(\.[a-z0-9]+)+$/i;

/**
 * Valid JavaScript identifier pattern for esbuild define keys
 * - Must start with letter, underscore, or dollar sign
 * - Can contain: letters, digits, underscores, dollar signs, dots
 * - Examples: FOO, process.env.NODE_ENV, __dirname, $jQuery
 * - Rejects: identifiers starting with digits or containing spaces/special chars
 */
export const JS_IDENTIFIER_PATTERN = /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/;

/**
 * Valid CLI flag name pattern for esbuild arguments
 * - Must start with a letter
 * - Can contain: letters, digits, hyphens
 * - Examples: minify, source-map, keep-names
 * - Rejects: flags with underscores, special characters, or starting with digits
 */
export const CLI_FLAG_NAME_PATTERN = /^[a-z][a-z0-9-]*$/i;

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
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
  return findUpMultiple([name], directory)[0];
}

/**
 * Find the lowest of multiple files by walking up parent directories. If
 * multiple files exist at the same level, they will all be returned.
 */
export function findUpMultiple(names: string[], directory: string = process.cwd()): string[] {
  const absoluteDirectory = path.resolve(directory);

  const files = [];
  for (const name of names) {
    const file = path.join(directory, name);
    if (fs.existsSync(file)) {
      files.push(file);
    }
  }

  if (files.length > 0) {
    return files;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory === root) {
    return [];
  }

  return findUpMultiple(names, path.dirname(absoluteDirectory));
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
      throw new UnscopedValidationError(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
    }
    throw new UnscopedValidationError(`${cmd} ${args.join(' ')} ${options?.cwd ? `run in directory ${options.cwd}` : ''} exited with status ${proc.status}`);
  }

  return proc;
}

/**
 * Validates that a string is a valid npm package name.
 * Used for fields like `nodeModules` where values must be installable package names.
 * Does not allow glob wildcards — use `validateExternalModule` for esbuild external patterns.
 */
export function validatePackageName(name: string, fieldName: string): void {
  if (!NPM_PACKAGE_NAME_PATTERN.test(name)) {
    throw new UnscopedValidationError(
      `Invalid ${fieldName}: "${name}". Package names must contain only alphanumeric characters, @, /, -, _, and . to prevent command injection.`,
    );
  }

  if (SHELL_METACHARACTERS.test(name)) {
    throw new UnscopedValidationError(
      `Invalid ${fieldName}: "${name}". Package names cannot contain shell metacharacters (;&|` + '`$()<>\\\'"' + ') to prevent command injection.',
    );
  }
}

/**
 * Validates that a string is a valid esbuild external module pattern
/* ) in addition to standard package names
 */
export function validateExternalModule(name: string, fieldName: string): void {
  if (!EXTERNAL_MODULE_PATTERN.test(name)) {
    throw new UnscopedValidationError(
      `Invalid ${fieldName}: "${name}". External modules must be valid package names or glob patterns (e.g. @aws-sdk/*).`,
    );
  }
}

/**
 * Returns a module version by requiring its package.json file
 */
export function tryGetModuleVersionFromRequire(mod: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`${mod}/package.json`).version;
  } catch (err) {
    return undefined;
  }
}

/**
 * Gets module version from package.json content
 */
export function tryGetModuleVersionFromPkg(mod: string, pkgJson: { [key: string]: any }, pkgPath: string): string | undefined {
  const dependencies = {
    ...pkgJson.dependencies ?? {},
    ...pkgJson.devDependencies ?? {},
    ...pkgJson.peerDependencies ?? {},
  };

  if (!dependencies[mod]) {
    return undefined;
  }

  // If it's a "file:" version, make it absolute
  const fileMatch = dependencies[mod].match(/file:(.+)/);
  if (fileMatch && !path.isAbsolute(fileMatch[1])) {
    const absoluteFilePath = path.join(path.dirname(pkgPath), fileMatch[1]);
    return `file:${absoluteFilePath}`;
  }

  return dependencies[mod];
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

  for (const mod of modules) {
    const version = tryGetModuleVersionFromPkg(mod, pkgJson, pkgPath)
      ?? tryGetModuleVersionFromRequire(mod);
    if (!version) {
      throw new UnscopedValidationError(`Cannot extract version for module '${mod}'. Check that it's referenced in your package.json or installed.`);
    }
    dependencies[mod] = version;
  }

  return dependencies;
}

export function getTsconfigCompilerOptions(tsconfigPath: string): string {
  const compilerOptions = extractTsConfig(tsconfigPath);
  const excludedCompilerOptions = [
    'composite',
    'charset',
    'noEmit',
    'tsBuildInfoFile',
  ];

  const options: Record<string, any> = {
    ...compilerOptions,
    // Overrides
    incremental: false,
    // Intentionally Setting rootDir and outDir, so that the compiled js file always end up next to .ts file.
    rootDir: './',
    outDir: './',
  };

  let compilerOptionsString = '';
  Object.keys(options).sort().forEach((key: string) => {
    if (excludedCompilerOptions.includes(key)) {
      return;
    }

    const value = options[key];
    const option = '--' + key;
    const type = typeof value;

    if (type === 'boolean') {
      if (value) {
        compilerOptionsString += option + ' ';
      } else {
        compilerOptionsString += option + ' false ';
      }
    } else if (type === 'string') {
      compilerOptionsString += option + ' ' + value + ' ';
    } else if (type === 'object') {
      if (Array.isArray(value)) {
        compilerOptionsString += option + ' ' + value.join(',') + ' ';
      }
    } else {
      throw new UnscopedValidationError(`Missing support for compilerOption: [${key}]: { ${type}, ${value}} \n`);
    }
  });

  return compilerOptionsString.trim();
}

function extractTsConfig(tsconfigPath: string, previousCompilerOptions?: Record<string, any>): Record<string, any> | undefined {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { extends: extendedConfig, compilerOptions } = require(tsconfigPath);
  const updatedCompilerOptions = {
    ...compilerOptions,
    ...(previousCompilerOptions ?? {}),
  };
  if (extendedConfig) {
    return extractTsConfig(
      path.resolve(tsconfigPath.replace(/[^\/]+$/, ''), extendedConfig),
      updatedCompilerOptions,
    );
  }
  return updatedCompilerOptions;
}

/**
 * Detect if a given Node.js runtime uses SDKv2
 */
export function isSdkV2Runtime(runtime: Runtime): boolean {
  const sdkV2RuntimeList = [
    Runtime.NODEJS,
    Runtime.NODEJS_4_3,
    Runtime.NODEJS_6_10,
    Runtime.NODEJS_8_10,
    Runtime.NODEJS_10_X,
    Runtime.NODEJS_12_X,
    Runtime.NODEJS_14_X,
    Runtime.NODEJS_16_X,
  ];

  return sdkV2RuntimeList.some((r) => {return r.family === runtime.family && r.name === runtime.name;});
}
