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
 * Whether this is a jsii package
 */
export function isJsii(): boolean {
  return currentPackageJson().jsii !== undefined;
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
  } catch (e) {
    if (e.code === 'ENOENT') { return []; }
    throw e;
  }
}

/**
 * Return the unit test files for this package
 */
export async function unitTestFiles(): Promise<File[]> {
  return listFiles('test', f => f.filename.startsWith('test.') && f.filename.endsWith('.js'));
}

export async function hasIntegTests(): Promise<boolean> {
  const files = await listFiles('test', f => f.filename.startsWith('integ.') && f.filename.endsWith('.js'));
  return files.length > 0;
}

export interface CompilerOverrides {
  eslint?: string;
  jsii?: string;
  tsc?: string;
  tslint?: string;
}

/**
 * Return the compiler for this package (either tsc or jsii)
 */
export function packageCompiler(compilers: CompilerOverrides): string[] {
  if (isJsii()) {
    return [compilers.jsii || require.resolve('jsii/bin/jsii'), '--project-references', '--silence-warnings=reserved-word'];
  } else {
    return [compilers.tsc || require.resolve('typescript/bin/tsc'), '--build'];
  }
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

  tslint?: {
    disable?: boolean;
  };

  pkglint?: {
    disable?: boolean;
  };

  /**
   * An optional command (formatted as a list of strings) to run before building
   *
   * (Typically a code generator)
   */
  pre?: string[];

  /**
   * An optional command (formatted as a list of strings) to run after building
   *
   * (Schema generator for example)
   */
  post?: string[];

  /**
   * An optional command (formatted as a list of strings) to run before testing.
   */
  test?: string[];
}

/**
 * Return a full path to the config file in this package
 *
 * The addressed file is cdk-build-tools/config/FILE.
 */
export function configFilePath(fileName: string) {
  return path.resolve(__dirname, '..', 'config', fileName);
}
