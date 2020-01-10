import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Properties for a NodejsFunction
 */
export interface NodejsFunctionProps extends lambda.FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @default - `index.ts` or `index.js` in the folder named as the construct's id.
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
   * @default Runtime.NODEJS_12_X
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
   * @default - `.cache` in the root directory
   */
  readonly cacheDir?: string;
}

/**
 * A Node.js Lambda function bundled using Parcel
 */
export class NodejsFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: NodejsFunctionProps = {}) {
    let entry: string;
    if (props.entry) {
      if (!/\.(js|ts)$/.test(props.entry)) {
        throw new Error('Only JavaScript or TypeScript entry files are supported.');
      }
      if (!fs.existsSync(props.entry)) {
        throw new Error(`Cannot find entry file at ${props.entry}`);
      }
      entry = props.entry;
    } else if (fs.existsSync(path.join(id, 'index.ts'))) {
      entry = path.join(id, 'index.ts');
    } else if (fs.existsSync(path.join(id, 'index.js'))) {
      entry = path.join(id, 'index.js');
    } else {
      throw new Error('Cannot find entry file.');
    }

    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.NODEJS) {
      throw new Error('Only `NODEJS` runtimes are supported.');
    }

    const handler = props.handler || 'handler';
    const filename = path.basename(entry, path.extname(entry));

    // Build with Parcel
    const buildDir = build({
      entry,
      global: handler,
      minify: props.minify,
      sourceMaps: props.sourceMaps,
      buildDir: props.buildDir,
      cacheDir: props.cacheDir
    });

    super(scope, id, {
      ...props,
      runtime: props.runtime || lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(buildDir),
      handler: `${filename}.${handler}`,
    });
  }
}

interface BuildOptions {
  entry: string;
  global: string;
  minify?: boolean;
  sourceMaps?: boolean;
  buildDir?: string;
  cacheDir?: string;
}

function build(options: BuildOptions): string {
  const buildDir = path.join(path.dirname(options.entry), '.build');

  const args = [
    'build',
    options.entry,
    '-d',
    options.buildDir || buildDir,
    '--global',
    options.global,
    '--target',
    'node',
    '--bundle-node-modules',
    '--log-level',
    '2',
    !options.minify && '--no-minify',
    !options.sourceMaps && '--no-source-maps',
    ...options.cacheDir
      ? ['--cache-dir', options.cacheDir]
      : [],
  ].filter(Boolean) as string[];

  const parcel = spawnSync('parcel', args);

  if (parcel.error) {
    throw parcel.error;
  }

  if (parcel.status !== 0) {
    throw new Error(parcel.stderr.toString().trim());
  }

  return buildDir;
}
