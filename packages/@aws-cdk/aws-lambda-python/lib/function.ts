import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { bundle } from './bundling';

/**
 * Properties for a PythonFunction
 */
export interface PythonFunctionProps extends lambda.FunctionOptions {
  /**
   * Path to the (Python) entry file.
   */
  readonly entry: string;

  /**
   * The name of the exported handler in the entry file.
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
  constructor(scope: cdk.Construct, id: string, props: PythonFunctionProps) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.PYTHON) {
      throw new Error('Only `PYTHON` runtimes are supported.');
    }

    // Entry and defaults
    const entry = resolveEntry(props.entry);
    const handler = props.handler ?? 'handler';
    const runtime = props.runtime ?? lambda.Runtime.PYTHON_3_7;
    const entryFilename = path.basename(props.entry, '.py');

    super(scope, id, {
      ...props,
      runtime,
      code: bundle({
        ...props,
        entry,
        runtime,
      }),
      handler: `${entryFilename}.${handler}`,
    });
  }
}

/**
 * Resolves the given entry file.
 */
function resolveEntry(entry: string): string {
  if (!/\.py$/.test(entry)) {
    throw new Error('Only Python (.py) entry files are supported.');
  }
  if (!fs.existsSync(entry)) {
    throw new Error(`Cannot find entry file at ${entry}`);
  }
  return path.resolve(entry);
}
