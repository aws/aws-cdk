import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { bundle } from './bundling';

/**
 * Properties for PythonLayerVersion
 */
export interface PythonLayerVersionProps extends lambda.LayerVersionOptions {
  /**
   * The path to the root directory of the lambda layer.
   */
  readonly entry: string;

  /**
   * The runtimes compatible with the python layer.
   *
   * @default - All runtimes are supported.
   */
  readonly compatibleRuntimes?: lambda.Runtime[];
}

/**
 * A lambda layer version.
 *
 * @experimental
 */
export class PythonLayerVersion extends lambda.LayerVersion {
  constructor(scope: Construct, id: string, props: PythonLayerVersionProps) {
    const compatibleRuntimes = props.compatibleRuntimes ?? [lambda.Runtime.PYTHON_3_7];

    // Ensure that all compatible runtimes are python
    for (const runtime of compatibleRuntimes) {
      if (runtime && runtime.family !== lambda.RuntimeFamily.PYTHON) {
        throw new Error('Only `PYTHON` runtimes are supported.');
      }
    }

    // Entry and defaults
    const entry = path.resolve(props.entry);
    // Pick the first compatibleRuntime to use for bundling or PYTHON_3_7
    const runtime = compatibleRuntimes[0] ?? lambda.Runtime.PYTHON_3_7;

    super(scope, id, {
      ...props,
      compatibleRuntimes,
      code: bundle({
        entry,
        runtime,
        outputPathSuffix: 'python',
      }),
    });
  }
}
