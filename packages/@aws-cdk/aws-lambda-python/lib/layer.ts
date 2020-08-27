import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { bundleDependenciesLayer, hasDependencies, bundlePythonCodeLayer } from './bundling';

/**
 * Properties for PythonDependenciesLayer
 */
export interface PythonLayerVersionProps extends cdk.CopyOptions {
  /**
   * The path to the root directory of the lambda layer.
   */
  readonly entry: string;

  /**
   * The runtimes compatible with this Layer.
   *
   * @default - All runtimes are supported.
   */
  readonly compatibleRuntimes?: lambda.Runtime[];

  /**
   * The description the this Lambda Layer.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The SPDX licence identifier or URL to the license file for this layer.
   *
   * @default - No license information will be recorded.
   */
  readonly license?: string;

  /**
   * The name of the layer.
   *
   * @default - A name will be generated.
   */
  readonly layerVersionName?: string;

  /**
   * Specify how the layer should bundle the files it finds in the `entry`
   * directory.
   *
   * @default FILES
   */
  readonly bundlingStrategy?: BundlingStrategy;
}

/**
 * Specifies the approach that bundling should take with the files
 */
export enum BundlingStrategy {
  /**
   * Bundle the files by treating them as dependencies
   */
  DEPENDENCIES = 'dependencies',

  /**
   * Bundle the files by copying them directly into the layer
   */
  FILES = 'files',
}

/**
 * A lambda layer version.
 *
 * @experimental
 */
export class PythonLayerVersion extends lambda.LayerVersion {
  constructor(scope: cdk.Construct, id: string, props: PythonLayerVersionProps) {
    const compatibleRuntimes = props.compatibleRuntimes ?? [lambda.Runtime.PYTHON_3_7];

    // Ensure that all compatible runtimes are python
    for (const runtime of compatibleRuntimes) {
      if (runtime && runtime.family !== lambda.RuntimeFamily.PYTHON) {
        throw new Error('Only `PYTHON` runtimes are supported.');
      }
    }

    // Entry and defaults
    const entry = path.resolve(props.entry);
    // Pick the first compatibleRuntime or PYTHON_3_7
    const runtime = compatibleRuntimes[0] ?? lambda.Runtime.PYTHON_3_7;
    const bundlingStrategy = props.bundlingStrategy ?? BundlingStrategy.DEPENDENCIES;

    let code: lambda.AssetCode;
    if (bundlingStrategy == BundlingStrategy.DEPENDENCIES) {
      if (!hasDependencies(entry)) {
        throw new Error(`No dependencies were detected in ${entry}`);
      }

      code = bundleDependenciesLayer({
        entry,
        runtime,
        exclude: props.exclude,
      });
    } else {
      code = bundlePythonCodeLayer({
        entry: props.entry,
        exclude: props.exclude,
        follow: props.follow,
      });
    }

    super(scope, id, {
      ...props,
      compatibleRuntimes,
      code,
    });
  }
}
