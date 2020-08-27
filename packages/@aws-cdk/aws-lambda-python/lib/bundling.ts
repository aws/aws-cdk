import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

/**
 * Options for bundleFunction
 */
export interface BundleFunctionOptions {
  /**
   * User-provided location containing the function code
   */
  readonly entry: string;

  /**
   * Allow the function to install dependencies inline with the function code
   */
  readonly installDependenciesInline: boolean;

  /**
   * The Lambda runtime to install dependencies from
   * */
  readonly runtime: lambda.Runtime;
}

/**
 * Produce bundled Lambda function code. When instructed to install dependencies
 * inline, and if we detect recognize the dependencies, we bundle them inline.
 */
export function bundleFunction(options: BundleFunctionOptions): lambda.AssetCode {
  const { entry } = options;

  if (options.installDependenciesInline && hasDependencies(entry)) {
    return bundleDependenciesInline(options);
  }

  return lambda.Code.fromAsset(entry);
}

/**
 * Dependency files to exclude from the asset hash.
 */
export const DEPENDENCY_EXCLUDES = ['*.pyc'];

/**
 * Options for bundleDependenciesInline
 */
export interface BundleDependenciesInlineOptions {
  readonly entry: string;
  readonly runtime: lambda.Runtime;
}

/**
 * Bundles dependencies into an asset that is inline with the function code.
 */
export function bundleDependenciesInline(options: BundleDependenciesInlineOptions): lambda.AssetCode {
  const { entry, runtime } = options;

  return lambda.Code.fromAsset(entry, {
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
    bundling: {
      image: cdk.BundlingDockerImage.fromAsset(entry, {
        buildArgs: {
          FROM: runtime.bundlingDockerImage.image,
        },
        file: path.join(__dirname, 'inline-bundler/Dockerfile'),
      }),
    },
  });
}

/**
 * Options for bundleDependenciesLayer
 */
export interface BundleDependencyLayerOptions {
  /**
   * Base directory containing the dependency specification.
   */
  readonly entry: string;

  /**
   * The python runtime to install the dependencies from.
   */
  readonly runtime: lambda.Runtime;

  /**
   * Files to exclude from the bundled asset fingerprint.
   */
  readonly exclude?: string[],
}

/**
 * Bundles an asset for a python dependencies layer.
 */
export function bundleDependenciesLayer(options: BundleDependencyLayerOptions): lambda.AssetCode {
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

/**
 * Options for bundlePythonCodeLayer
 */
export interface BundlePythonCodeLayerOptions extends cdk.CopyOptions {
  /**
   * The base directory containing the code to create a lambda layer asset from.
   */
  readonly entry: string;
}

/**
 * Bundles an asset containing python code.
 */
export function bundlePythonCodeLayer(options: BundlePythonCodeLayerOptions) {
  // Use local bundling instead of docker to copy the user's code into a
  // subdirectory while respecting the given excludes.
  return lambda.Code.fromAsset(options.entry, {
    assetHashType: cdk.AssetHashType.BUNDLE,
    bundling: {
      // Local bundling is employed instead of running docker, but the bundler
      // still wants `image`. So, I've rigged the docker component of this
      // bundle to emit an error if the bundler runs docker.
      image: cdk.BundlingDockerImage.fromRegistry('alpine'),
      command: ['sh', '-c', 'echo The bundler attempted to run docker && exit 1'],
      local: new PythonCodeLocalBundler(options),
    },
  });
}

/**
 * A local bundling implementation which copies files to a python subdirectory
 * in the emitted asset.
 */
export class PythonCodeLocalBundler implements cdk.ILocalBundling {
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

/**
 * Checks to see if the `entry` directory contains a type of dependency that
 * we know how to install.
 */
export function hasDependencies(entry: string): boolean {
  if (fs.existsSync(path.join(entry, 'Pipfile'))) {
    return true;
  }

  if (fs.existsSync(path.join(entry, 'requirements.txt'))) {
    return true;
  }

  return false;
}
