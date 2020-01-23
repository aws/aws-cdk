import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { build } from './build';
import { nodeMajorVersion, parseStackTrace } from './util';

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
   * Whether to minify files when bundling.
   *
   * @default false
   */
  readonly minify?: boolean;

  /**
   * Whether to include source maps when bundling.
   *
   * @default false
   */
  readonly sourceMaps?: boolean;

  /**
   * The build directory
   *
   * @default - `.build` in the entry file directory
   */
  readonly buildDir?: string;

  /**
   * The cache directory
   *
   * Parcel uses a filesystem cache for fast rebuilds.
   *
   * @default - `.cache` in the root directory
   */
  readonly cacheDir?: string;
}

/**
 * A Node.js Lambda function bundled using Parcel
 */
export class NodejsFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: NodejsFunctionProps = {}) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.NODEJS) {
      throw new Error('Only `NODEJS` runtimes are supported.');
    }

    const entry = findEntry(id, props.entry);
    const handler = props.handler || 'handler';
    const buildDir = props.buildDir || path.join(path.dirname(entry), '.build');
    const handlerDir = path.join(buildDir, crypto.createHash('sha256').update(entry).digest('hex'));
    const defaultRunTime = nodeMajorVersion() >= 12
    ? lambda.Runtime.NODEJS_12_X
    : lambda.Runtime.NODEJS_10_X;
    const runtime = props.runtime || defaultRunTime;

    // Build with Parcel
    build({
      entry,
      outDir: handlerDir,
      global: handler,
      minify: props.minify,
      sourceMaps: props.sourceMaps,
      cacheDir: props.cacheDir,
      nodeVersion: extractVersion(runtime),
    });

    super(scope, id, {
      ...props,
      runtime,
      code: lambda.Code.fromAsset(handlerDir),
      handler: `index.${handler}`,
    });
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
    if (!/\.(js|ts)$/.test(entry)) {
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
  const stackTrace = parseStackTrace();
  const functionIndex = stackTrace.findIndex(s => /NodejsFunction/.test(s.methodName || ''));

  if (functionIndex === -1 || !stackTrace[functionIndex + 1]) {
    throw new Error('Cannot find defining file.');
  }

  return stackTrace[functionIndex + 1].file;
}

/**
 * Extracts the version from the runtime
 */
function extractVersion(runtime: lambda.Runtime): string | undefined {
  const match = runtime.name.match(/nodejs(\d+)/);

  if (!match) {
    return undefined;
  }

  return match[1];
}
