import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { BundlingOptions } from './types';
import { callsites, findUp, LockFile, nodeMajorVersion } from './util';

/**
 * Properties for a NodejsFunction
 */
export interface NodejsFunctionProps extends lambda.FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @default - Derived from the name of the defining file and the construct's id.
   * If the `NodejsFunction` is defined in `stack.ts` with `my-handler` as id
   * (`new NodejsFunction(this, 'my-handler')`), the construct will look at `stack.my-handler.ts`
   * and `stack.my-handler.js`.
   */
  readonly entry?: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * The runtime environment. Only runtimes of the Node.js family are
   * supported.
   *
   * @default - `NODEJS_12_X` if `process.versions.node` >= '12.0.0',
   * `NODEJS_10_X` otherwise.
   */
  readonly runtime?: lambda.Runtime;

  /**
   * Whether to automatically reuse TCP connections when working with the AWS
   * SDK for JavaScript.
   *
   * This sets the `AWS_NODEJS_CONNECTION_REUSE_ENABLED` environment variable
   * to `1`.
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html
   *
   * @default true
   */
  readonly awsSdkConnectionReuse?: boolean;

  /**
   * The path to the dependencies lock file (`yarn.lock` or `package-lock.json`).
   *
   * This will be used as the source for the volume mounted in the Docker
   * container.
   *
   * Modules specified in `nodeModules` will be installed using the right
   * installer (`npm` or `yarn`) along with this lock file.
   *
   * @default - the path is found by walking up parent directories searching for
   *   a `yarn.lock` or `package-lock.json` file
   */
  readonly depsLockFilePath?: string;

  /**
   * Bundling options
   *
   * @default - use default bundling options: no minify, no sourcemap, all
   *   modules are bundled.
   */
  readonly bundling?: BundlingOptions;
}

/**
 * A Node.js Lambda function bundled using esbuild
 */
export class NodejsFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps = {}) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.NODEJS) {
      throw new Error('Only `NODEJS` runtimes are supported.');
    }

    // Find lock file
    let depsLockFilePath: string;
    if (props.depsLockFilePath) {
      if (!fs.existsSync(props.depsLockFilePath)) {
        throw new Error(`Lock file at ${props.depsLockFilePath} doesn't exist`);
      }
      if (!fs.statSync(props.depsLockFilePath).isFile()) {
        throw new Error('`depsLockFilePath` should point to a file');
      }
      depsLockFilePath = path.resolve(props.depsLockFilePath);
    } else {
      const lockFile = findUp(LockFile.YARN) ?? findUp(LockFile.NPM);
      if (!lockFile) {
        throw new Error('Cannot find a package lock file (`yarn.lock` or `package-lock.json`). Please specify it with `depsFileLockPath`.');
      }
      depsLockFilePath = lockFile;
    }

    // Entry and defaults
    const entry = path.resolve(findEntry(id, props.entry));
    const handler = props.handler ?? 'handler';
    const defaultRunTime = nodeMajorVersion() >= 12
      ? lambda.Runtime.NODEJS_12_X
      : lambda.Runtime.NODEJS_10_X;
    const runtime = props.runtime ?? defaultRunTime;

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...props.bundling ?? {},
        entry,
        runtime,
        depsLockFilePath,
      }),
      handler: `index.${handler}`,
    });

    // Enable connection reuse for aws-sdk
    if (props.awsSdkConnectionReuse ?? true) {
      this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
    }
  }
}

/**
 * Searches for an entry file. Preference order is the following:
 * 1. Given entry file
 * 2. A .ts file named as the defining file with id as suffix (defining-file.id.ts)
 * 3. A .js file name as the defining file with id as suffix (defining-file.id.js)
 */
function findEntry(id: string, entry?: string): string {
  if (entry) {
    if (!/\.(jsx?|tsx?)$/.test(entry)) {
      throw new Error('Only JavaScript or TypeScript entry files are supported.');
    }
    if (!fs.existsSync(entry)) {
      throw new Error(`Cannot find entry file at ${entry}`);
    }
    return entry;
  }

  const definingFile = findDefiningFile();
  const extname = path.extname(definingFile);

  const tsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.ts`);
  if (fs.existsSync(tsHandlerFile)) {
    return tsHandlerFile;
  }

  const jsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.js`);
  if (fs.existsSync(jsHandlerFile)) {
    return jsHandlerFile;
  }

  throw new Error('Cannot find entry file.');
}

/**
 * Finds the name of the file where the `NodejsFunction` is defined
 */
function findDefiningFile(): string {
  let definingIndex;
  const sites = callsites();
  for (const [index, site] of sites.entries()) {
    if (site.getFunctionName() === 'NodejsFunction') {
      // The next site is the site where the NodejsFunction was created
      definingIndex = index + 1;
      break;
    }
  }

  if (!definingIndex || !sites[definingIndex]) {
    throw new Error('Cannot find defining file.');
  }

  return sites[definingIndex].getFileName();
}
