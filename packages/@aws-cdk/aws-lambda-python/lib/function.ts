import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { bundle } from './bundling';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Properties for a PythonFunction
 */
export interface PythonFunctionProps extends lambda.FunctionOptions {
  /**
   * The path to the root directory of the function.
   */
  readonly entry: string;

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
   * The runtime environment. Only runtimes of the Python family are
   * supported.
   *
   * @default lambda.Runtime.PYTHON_3_7
   */
  readonly runtime?: lambda.Runtime;
}

/**
 * A Python Lambda function
 */
export class PythonFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props: PythonFunctionProps) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.PYTHON) {
      throw new Error('Only `PYTHON` runtimes are supported.');
    }
    if (props.index && !/\.py$/.test(props.index)) {
      throw new Error('Only Python (.py) index files are supported.');
    }

    // Entry and defaults
    const entry = path.resolve(props.entry);
    const index = props.index ?? 'index.py';

    const resolvedIndex = path.resolve(entry, index);
    if (!fs.existsSync(resolvedIndex)) {
      throw new Error(`Cannot find index file at ${resolvedIndex}`);
    }

    const handler = props.handler ?? 'handler';
    const runtime = props.runtime ?? lambda.Runtime.PYTHON_3_7;

    super(scope, id, {
      ...props,
      runtime,
      code: bundle({
        runtime,
        entry,
        outputPathSuffix: '.',
      }),
      handler: `${index.slice(0, -3)}.${handler}`,
    });
  }
}
