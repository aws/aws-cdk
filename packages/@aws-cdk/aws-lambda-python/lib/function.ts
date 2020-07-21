import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Bundling } from './bundling';
import { parseStackTrace } from './util';

/**
 * Properties for a PythonFunction
 */
export interface PythonFunctionProps extends lambda.FunctionOptions {
  /**
   * Path to the (Python) entry file.
   *
   * @default - Derived from the name of the defining file and the construct's id.
   * If the `PythonFunction` is defined in `stack.ts` with `my-handler` as id
   * (`new PythonFunction(this, 'my-handler')`), the construct will look at `stack.my-handler.py`.
   */
  readonly entry?: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * @default lambda_handler
   */
  readonly handler?: string;

  /**
   * The runtime environment. Only runtimes of the Python family are
   * supported.
   *
   * @default - `PYTHON_3_7`
   */
  readonly runtime?: lambda.Runtime;
}

/**
 * A Python Lambda function
 */
export class PythonFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: PythonFunctionProps = {}) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.PYTHON) {
      throw new Error('Only `PYTHON` runtimes are supported.');
    }

    // Entry and defaults
    const entry = path.resolve(findEntry(id, props.entry));
    const handler = props.handler ?? 'lambda_handler';
    const runtime = props.runtime ?? lambda.Runtime.PYTHON_3_7;

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...props,
        entry,
        runtime,
      }),
      handler: `lambda_function.${handler}`,
    });
  }
}

/**
 * Searches for an entry file. Preference order is the following:
 * 1. Given entry file
 * 2. A .py file named as the defining file with id as suffix (defining-file.id.py)
 */
function findEntry(id: string, entry?: string): string {
  if (entry) {
    if (!/\.py$/.test(entry)) {
      throw new Error('Only Python (.py) entry files are supported.');
    }
    if (!fs.existsSync(entry)) {
      throw new Error(`Cannot find entry file at ${entry}`);
    }
    return entry;
  }

  const definingFile = findDefiningFile();
  const extname = path.extname(definingFile);

  const pyHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.py`);
  if (fs.existsSync(pyHandlerFile)) {
    return pyHandlerFile;
  }

  throw new Error('Cannot find entry file.');
}

/**
 * Finds the name of the file where the `PythonFunction` is defined
 */
function findDefiningFile(): string {
  const stackTrace = parseStackTrace();
  const functionIndex = stackTrace.findIndex(s => /PythonFunction/.test(s.methodName || ''));

  if (functionIndex === -1 || !stackTrace[functionIndex + 1]) {
    throw new Error('Cannot find defining file.');
  }

  return stackTrace[functionIndex + 1].file;
}
