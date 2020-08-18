import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Bundling, ParcelBaseOptions } from './bundling';
import { PackageJsonManager } from './package-json-manager';
import { nodeMajorVersion, parseStackTrace } from './util';

/**
 * Properties for a NodejsFunction
 */
export interface NodejsFunctionProps extends lambda.FunctionOptions, ParcelBaseOptions {
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
}

/**
 * A Node.js Lambda function bundled using Parcel
 */
export class NodejsFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: NodejsFunctionProps = {}) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.NODEJS) {
      throw new Error('Only `NODEJS` runtimes are supported.');
    }

    // Entry and defaults
    const entry = path.resolve(findEntry(id, props.entry));
    const handler = props.handler ?? 'handler';
    const defaultRunTime = nodeMajorVersion() >= 12
      ? lambda.Runtime.NODEJS_12_X
      : lambda.Runtime.NODEJS_10_X;
    const runtime = props.runtime ?? defaultRunTime;

    // Look for the closest package.json starting in the directory of the entry
    // file. We need to restore it after bundling.
    const packageJsonManager = new PackageJsonManager(path.dirname(entry));

    try {
      super(scope, id, {
        ...props,
        runtime,
        code: Bundling.parcel({
          ...props,
          entry,
          runtime,
        }),
        handler: `index.${handler}`,
      });

      // Enable connection reuse for aws-sdk
      if (props.awsSdkConnectionReuse ?? true) {
        this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1');
      }
    } finally {
      // We can only restore after the code has been bound to the function
      packageJsonManager.restore();
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
  const stackTrace = parseStackTrace();
  const functionIndex = stackTrace.findIndex(s => /NodejsFunction/.test(s.methodName || ''));

  if (functionIndex === -1 || !stackTrace[functionIndex + 1]) {
    throw new Error('Cannot find defining file.');
  }

  return stackTrace[functionIndex + 1].file;
}
