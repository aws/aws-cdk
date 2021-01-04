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
   * Output path suffix ('python' for a layer, '.' otherwise)
   */
  readonly outputPathSuffix: string;
}

/**
 * Produce bundled Lambda asset code
 */
export function bundle(options: BundlingOptions): lambda.AssetCode {
  const { entry, runtime, outputPathSuffix } = options;

  const hasDeps = hasDependencies(entry);

  const depsCommand = chain([
    hasDeps ? `rsync -r ${BUNDLER_DEPENDENCIES_CACHE}/. ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/${outputPathSuffix}` : '',
    `rsync -r . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/${outputPathSuffix}`,
  ]);

  // Determine which dockerfile to use. When dependencies are present, we use a
  // Dockerfile that can create a cacheable layer. We can't use this Dockerfile
  // if there aren't dependencies or the Dockerfile will complain about missing
  // sources.
  const dockerfile = hasDeps
    ? 'Dockerfile.dependencies'
    : 'Dockerfile';

  const image = cdk.BundlingDockerImage.fromAsset(entry, {
    buildArgs: {
      IMAGE: runtime.bundlingDockerImage.image,
    },
    file: path.join(__dirname, dockerfile),
  });

  return lambda.Code.fromAsset(entry, {
    assetHashType: cdk.AssetHashType.BUNDLE,
    exclude: DEPENDENCY_EXCLUDES,
    bundling: {
      image,
      command: ['bash', '-c', depsCommand],
    },
  });
}

/**
 * Checks to see if the `entry` directory contains a type of dependency that
 * we know how to install.
 */
export function hasDependencies(entry: string): boolean {
  if (fs.existsSync(path.join(entry, 'Pipfile'))) {
    return true;
  }

  if (fs.existsSync(path.join(entry, 'poetry.lock'))) {
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
