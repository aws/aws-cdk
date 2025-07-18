import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

/**
 * Return the package JSON for the current package
 */
export function currentPackageJson(): any {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(process.cwd(), 'package.json'));
}

/**
 * Return the CDK build options
 */
export function cdkBuildOptions(): CDKBuildOptions {
  // These could have been in a separate cdk-build.json but for
  // now it's easiest to just read them from the package JSON.
  // Our package directories are littered with .json files enough
  // already.
  return currentPackageJson()['cdk-build'] || {};
}

/**
 * Return the cdk-package options
 */
export function cdkPackageOptions(): CDKPackageOptions {
  return currentPackageJson()['cdk-package'] || {};
}

/**
 * Whether this is a jsii package
 */
export function isJsii(): boolean {
  return currentPackageJson().jsii !== undefined;
}

/**
 * Whether this is a private package
 */
export function isPrivate(): boolean {
  return currentPackageJson().private;
}

export interface File {
  filename: string;
  path: string;
}

export async function listFiles(dirName: string, predicate: (x: File) => boolean): Promise<File[]> {
  try {
    const files = (await readdir(dirName)).map(filename => ({ filename, path: path.join(dirName, filename) }));

    const ret: File[] = [];
    for (const file of files) {
      const s = await stat(file.path);
      if (s.isDirectory()) {
        // Recurse
        ret.push(...await listFiles(file.path, predicate));
      } else {
        if (predicate(file)) {
          ret.push(file);
        }
      }
    }

    return ret;
  } catch (e: any) {
    if (e.code === 'ENOENT') { return []; }
    throw e;
  }
}

/**
 * Return the unit test files for this package
 */
export async function unitTestFiles(): Promise<File[]> {
  return listFiles('test', f => f.filename.endsWith('.test.js'));
}

export async function hasIntegTests(): Promise<boolean> {
  if (currentPackageJson().name === '@aws-cdk/integ-runner') return false;
  const files = await listFiles('test', f => f.filename.startsWith('integ.') && f.filename.endsWith('.js'));
  return files.length > 0;
}

export interface CompilerOverrides {
  eslint?: string;
  jsii?: string;
  tsc?: string;
}

/**
 * Return the compiler for this package (either tsc or jsii)
 */
export function packageCompiler(compilers: CompilerOverrides, options?: CDKBuildOptions): string[] {
  if (isJsii()) {
    const args = ['--silence-warnings=reserved-word', '--add-deprecation-warnings'];
    if (options?.compressAssembly) {
      args.push('--compress-assembly');
    }
    if (options?.stripDeprecated) {
      // This package is not published to npm so the linter rule is invalid
      // eslint-disable-next-line @cdklabs/no-invalid-path
      args.push(`--strip-deprecated ${path.join(__dirname, '..', '..', '..', '..', 'deprecated_apis.txt')}`);
    }
    return [compilers.jsii || require.resolve('jsii/bin/jsii'), ...args];
  } else {
    return [compilers.tsc || require.resolve('typescript/bin/tsc'), '--build'];
  }
}

/**
 * Return the command defined in scripts.gen if exists
 */
export function genScript(): string | undefined {
  return currentPackageJson().scripts?.gen;
}

export interface CDKBuildOptions {
  /**
   * What CloudFormation scope to generate resources for, if any
   */
  cloudformation?: string | string[];

  /**
   * Options passed to `eslint` invocations.
   */
  eslint?: {
    /**
     * Disable linting
     * @default false
     */
    disable?: boolean;
  };

  pkglint?: {
    disable?: boolean;
  };

  /**
   * Optional commands (formatted as a list of strings, which will be joined together with the && operator) to run before building
   *
   * (Typically a code generator)
   */
  pre?: string[];

  /**
   * Optional commands (formatted as a list of strings, which will be joined together with the && operator) to run after building
   *
   * (Schema generator for example)
   */
  post?: string[];

  /**
   * An optional command (formatted as a list of strings) to run before testing.
   */
  test?: string[];

  /**
   * Whether the package uses Jest for tests.
   * The default is NodeUnit,
   * but we want to eventually move all of them to Jest.
   */
  jest?: boolean;

  /**
   * Environment variables to be passed to 'cdk-build' and all of its child processes.
   */
  env?: NodeJS.ProcessEnv;

  /**
   * Whether deprecated symbols should be stripped from the jsii assembly and typescript declaration files.
   * @see https://aws.github.io/jsii/user-guides/lib-author/toolchain/jsii/#-strip-deprecated
   */
  stripDeprecated?: boolean;

  /**
   * Whether the jsii assembly should be compressed into a .jsii.gz file or left uncompressed as a .jsii file.
   */
  compressAssembly?: boolean;
}

export interface CDKPackageOptions {
  /**
   * Optional commands (formatted as a list of strings, which will be joined together with the && operator) to run before packaging
   */
  pre?: string[];

  /*
   * Optional commands (formatted as a list of strings, which will be joined together with the && operator) to run after packaging
  */
  post?: string[];

  /**
   * Also package private packages for local usage.
   * @default false
   */
  private?: boolean;
}

/**
 * Return a full path to the config file in this package
 *
 * The addressed file is cdk-build-tools/config/FILE.
 */
export function configFilePath(fileName: string) {
  return path.resolve(__dirname, '..', 'config', fileName);
}
