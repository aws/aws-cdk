import * as path from 'path';
import * as assets from '@aws-cdk/assets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { bundleDependenciesLayer, hasDependencies } from './bundling';

/**
 * Properties for PythonDependenciesLayer
 */
export interface PythonDependenciesLayerProps {
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
}

/**
 * A lambda layer constructed from dependencies bundled by a supported
 * dependency system. (requirements.txt, Pipfile*)
 *
 * @experimental
 */
export class PythonDependenciesLayer extends lambda.LayerVersion {
  constructor(scope: cdk.Construct, id: string, props: PythonDependenciesLayerProps) {
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

    if (!hasDependencies(entry)) {
      throw new Error(`There are no dependencies at ${entry}`);
    }

    super(scope, id, {
      ...props,
      compatibleRuntimes: [runtime],
      code: bundleDependenciesLayer({
        entry,
        runtime,
      }),
    });
  }
}

/**
 * Properties for PythonSharedCodeLayer
 */
export interface PythonSharedCodeLayerProps extends PythonDependenciesLayerProps, assets.CopyOptions {
}

/**
 * A Python lambda layer for shared code.
 *
 * @experimental
 */
export class PythonSharedCodeLayer extends lambda.LayerVersion {
  constructor(scope: cdk.Construct, id: string, props: PythonSharedCodeLayerProps) {
    super(scope, id, {
      ...props,
      code: lambda.Code.fromAsset(props.entry, {
        ...props,
        bundling: {
          image: cdk.BundlingDockerImage.fromRegistry('alpine'),
          command: ['sh', '-c', 'cp -r /asset-input /asset-output/python'],
        },
      }),
    });
  }
}
