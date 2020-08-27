import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { DependenciesLocation } from './function';

/**
 * Options for bundling dependencies
 */
export interface DependenciesBundlingOptions {
  /**
   * Entry path
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;

  /**
   * When bundling a layer from dependencies, exclude these files from the
   * fingerprint. When bundling a layer from files
   *
   * @default string[] Only *.pyc files are excluded
   */
  readonly exclude?: string[],
}

export interface FunctionBundlingOptions extends DependenciesBundlingOptions {
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
export function bundle(options: FunctionBundlingOptions): lambda.AssetCode {
  const { dependenciesLocation, entry } = options;

  if (dependenciesLocation === DependenciesLocation.INLINE && hasDependencies(entry)) {
    return bundleDependenciesInline(options);
  }

  return lambda.Code.fromAsset(entry);
}

/**
 * Dependency files to exclude from the asset hash.
 */
export const DEPENDENCY_EXCLUDES = ['*.pyc'];

/**
 * Bundles dependencies into an asset that is inline with the user code.
 */
function bundleDependenciesInline(options: DependenciesBundlingOptions): lambda.AssetCode {
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

export function bundleDependenciesLayer(options: DependenciesBundlingOptions): lambda.AssetCode {
  const { entry, runtime } = options;
  const exclude = options.exclude ?? DEPENDENCY_EXCLUDES;

  return lambda.Code.fromAsset(entry, {
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude,
    bundling: {
      image: cdk.BundlingDockerImage.fromAsset(options.entry, {
        buildArgs: {
          FROM: runtime.bundlingDockerImage.image,
        },
        file: path.join(__dirname, 'layer-bundler/Dockerfile'),
      }),
    },
  });
}

interface BundlePythonCodeLayerOptions extends cdk.CopyOptions {
  entry: string;
}

export function bundlePythonCodeLayer(options: BundlePythonCodeLayerOptions) {
  // Use local bundling instead of docker to copy the user's code into a
  // subdirectory while respecting the given excludes.
  return lambda.Code.fromAsset(options.entry, {
    bundling: {
      // Local bundling is employed instead of running docker, but the bundler
      // still wants `image`. So, I've rigged the docker component of this
      // bundle to emit an error if the bundler runs docker.
      image: cdk.BundlingDockerImage.fromRegistry('alpine'),
      command: ['sh', '-c', 'echo The bundler attempted to run docker && exit 1'],
      local: new BundlePythonCodeLayerLocalBundler(options),
    },
  });
}

class BundlePythonCodeLayerLocalBundler implements cdk.ILocalBundling {
  constructor(private options: BundlePythonCodeLayerOptions) {}

  tryBundle(outputDir: string) {
    const { entry } = this.options;
    const layerSubDir = path.join(outputDir, 'python');
    try {
      fs.mkdirSync(layerSubDir);
      cdk.FileSystem.copyDirectory(entry, layerSubDir, {
        ...this.options,
      });
      return true;
    } catch (err) {
      throw new Error(`Failed to copy ${entry} to ${layerSubDir}: ${err.toString()}`);
    }
  }
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
