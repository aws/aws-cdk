import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

/**
 * Dependency files to exclude from the asset hash.
 */
export const DEPENDENCY_EXCLUDES = ['*.pyc'];

/**
 * The location in the image that the bundler image caches dependencies.
 */
export const BUNDLER_DEPENDENCIES_CACHE = '/var/dependencies';

export interface BundleOptions {
  entry: string;
  runtime: lambda.Runtime;
  depsCommand: string;
}

export function bundle(options: BundleOptions) {
  const { entry, runtime, depsCommand } = options;

  // Determine which bundling image to use.
  let image: cdk.BundlingDockerImage;
  if (hasDependencies(entry)) {
    // When dependencies are present, we use a Dockerfile that can create a
    // cacheable layer. We can't use this Dockerfile if there aren't
    // dependencies or the Dockerfile will complain about missing sources.
    image = cdk.BundlingDockerImage.fromAsset(entry, {
      buildArgs: {
        IMAGE: runtime.bundlingDockerImage.image,
      },
      file: path.join(__dirname, 'Dockerfile.dependencies'),
    });
  } else {
    // When dependencies aren't present, we can use the default Dockerfile that
    // doesn't need to create a cacheable layer.
    image = cdk.BundlingDockerImage.fromAsset(entry, {
      buildArgs: {
        IMAGE: runtime.bundlingDockerImage.image,
      },
      file: path.join(__dirname, 'Dockerfile'),
    });
  }

  return lambda.Code.fromAsset(entry, {
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
    bundling: {
      image,
      command: ['bash', '-c', depsCommand],
    },
  });
}

export interface BundleFunctionOptions {
  readonly entry: string;
  readonly runtime: lambda.Runtime;
}

export function bundleFunction(options: BundleFunctionOptions): lambda.AssetCode {
  const { entry, runtime } = options;

  const depsCommand = chain([
    hasDependencies(entry) ? `rsync -r ${BUNDLER_DEPENDENCIES_CACHE}/. ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}` : '',
    `rsync -r . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}`,
  ]);

  return bundle({
    entry,
    runtime,
    depsCommand,
  });
}

export interface BundleDependencyLayerOptions {
  readonly entry: string;
  readonly runtime: lambda.Runtime;
}

export function bundleDependenciesLayer(options: BundleDependencyLayerOptions): lambda.AssetCode {
  const { entry, runtime } = options;

  const depsCommand = chain([
    `rsync -r ${BUNDLER_DEPENDENCIES_CACHE} ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/python`,
  ]);

  return bundle({
    entry,
    runtime,
    depsCommand,
  });
}

export interface BundleFilesLayerOptions extends cdk.CopyOptions {
  readonly entry: string;
}

export function bundleFilesLayer(options: BundleFilesLayerOptions) {
  // Use local bundling instead of docker to copy the user's code into a
  // subdirectory while respecting the given excludes. We can't easily do this
  // in the container as the container doesn't have access to
  // `FileSystem.copyDirectory` that accepts the excludes.
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
  constructor(private options: BundleFilesLayerOptions) {}

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

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
