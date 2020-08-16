import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { DependenciesLocation } from './function';

/**
 * Options for bundling
 */
export interface BundlingOptions {
  /**
   * Entry path
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;

  /**
   * The location to install dependencies.
   */
  readonly dependenciesLocation: DependenciesLocation;
}

/**
 * Produce bundled Lambda asset code. When there are no dependencies, we
 * short-circuit and simply create an asset from the directory, leaving the user
 * code alone.
 */
export function bundle(options: BundlingOptions): lambda.AssetCode {
  const { dependenciesLocation, entry } = options;

  if (dependenciesLocation === DependenciesLocation.NONE || !hasDependencies(entry)) {
    return lambda.Code.fromAsset(entry);
  }

  switch (dependenciesLocation) {
    case DependenciesLocation.INLINE:
      return bundleDependenciesInline(options);
    case DependenciesLocation.LAYER:
      return bundleLayerDependentFunction(options);
    default:
      throw new Error(`Unknown dependency location: ${dependenciesLocation}`);
  }
}

/**
 * The location in the docker image where the built function code is stored.
 */
export const IMAGE_FUNCTION_DIR = '/var/task.function';

/**
 * The location in the docker image where the dependencies are stored.
 */
export const IMAGE_LAYER_DIR = '/var/task.layer';

/**
 * Dependency files to exclude from the asset hash.
 */
export const DEPENDENCY_EXCLUDES = ['*.pyc'];

/**
 * Bundles dependencies into an asset that is inline with the user code.
 */
function bundleDependenciesInline(options: BundlingOptions): lambda.AssetCode {
  const { entry, runtime } = options;

  return lambda.Code.fromAsset(entry, {
    bundling: {
      image: cdk.BundlingDockerImage.fromAsset(entry, {
        buildArgs: {
          FROM: runtime.bundlingDockerImage.image,
        },
        file: path.join(__dirname, 'inline-bundler/Dockerfile'),
      }),
    },
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
  });
}

function bundleLayerDependentFunction(options: BundlingOptions): lambda.AssetCode {
  const { entry } = options;

  return lambda.Code.fromAsset(entry, {
    bundling: {
      image: getLayerBundlerImage(options),
      command: ['sh', '-c', `cp -r ${IMAGE_FUNCTION_DIR}/. /asset-output/`],
    },
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
  });
}

export function bundleLayer(options: BundlingOptions): lambda.AssetCode {
  const { entry } = options;

  return lambda.Code.fromAsset(entry, {
    bundling: {
      image: getLayerBundlerImage(options),
      command: ['sh', '-c', `cp -r ${IMAGE_LAYER_DIR}/. /asset-output/`],
    },
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
  });
}

/**
 * Note: This image does a double-duty of building the assets for both the
 * lambda layer and the function. The assets are stored in the built image
 * in dedicated directories. To access the assets, we run the image with a copy
 * command from the right image source directory. We can be pretty liberal about
 * how we call this function, as it hits the docker layer cache.
 */
export function getLayerBundlerImage(options: BundlingOptions): cdk.BundlingDockerImage {
  const { runtime } = options;

  return cdk.BundlingDockerImage.fromAsset(options.entry, {
    buildArgs: {
      FROM: runtime.bundlingDockerImage.image,
    },
    file: path.join(__dirname, 'layer-bundler/Dockerfile'),
  });
}

export function hasDependencies(entry: string): boolean {
  if (fs.existsSync(path.join(entry, 'Pipfile'))) {
    return true;
  }

  if (fs.existsSync(path.join(entry, 'requirements.txt'))) {
    return true;
  }

  return false;
}
