import * as fs from 'fs';
import * as path from 'path';
import { Function, FunctionOptions, Runtime, RuntimeFamily } from '@aws-cdk/aws-lambda';
import { Bundling } from './bundling';
import { BundlingOptions } from './types';


// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Properties for a PythonFunction
 */
export interface PythonFunctionProps extends FunctionOptions {
  /**
   * Path to the source of the function or the location for dependencies.
   */
  readonly entry: string;


  /**
   * The runtime environment. Only runtimes of the Python family are
   * supported.
   *
   * @default Runtime.PYTHON_3_7
   */
  readonly runtime: Runtime;

  /**
   * The path (relative to entry) to the index file containing the exported handler.
   *
   * @default index.py
   */
  readonly index?: string;

  /**
   * The name of the exported handler in the index file.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * Bundling options to use for this function. Use this to specify custom bundling options like
   * the bundling Docker image, asset hash type, custom hash, architecture, etc.
   *
   * @default - Use the default bundling Docker image, with x86_64 architecture.
   */
  readonly bundling?: BundlingOptions;
}

/**
 * A Python Lambda function
 */
export class PythonFunction extends Function {
  constructor(scope: Construct, id: string, props: PythonFunctionProps) {
    const { index = 'index.py', handler = 'handler', runtime } = props;
    if (props.index && !/\.py$/.test(props.index)) {
      throw new Error('Only Python (.py) index files are supported.');
    }

    // Entry
    const entry = path.resolve(props.entry);
    const resolvedIndex = path.resolve(entry, index);
    if (!fs.existsSync(resolvedIndex)) {
      throw new Error(`Cannot find index file at ${resolvedIndex}`);
    }

    const resolvedHandler =`${index.slice(0, -3)}.${handler}`.replace('/', '.');

    if (props.runtime && props.runtime.family !== RuntimeFamily.PYTHON) {
      throw new Error('Only `PYTHON` runtimes are supported.');
    }

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        entry,
        runtime,
        ...props.bundling,
      }),
      handler: resolvedHandler,
    });
  }
}
