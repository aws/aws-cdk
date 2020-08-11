import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { installDependenciesCommands } from './dependencies';

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
   * Install dependencies while bundling
   */
  readonly installDependencies: boolean;
}

/**
 * Produce bundled Lambda asset code
 */
export function bundle(options: BundlingOptions): lambda.AssetCode {
  const installDependencies = options.installDependencies;

  const runtime = options.runtime;
  const entry = options.entry;
  const outputPath = cdk.AssetStaging.BUNDLING_OUTPUT_DIR;

  const conditionalInlineDependencyInstallCommands = installDependencies
    ? installDependenciesCommands({ runtime, entry, outputPath })
    : [];

  const depsCommand = chain([
    ...conditionalInlineDependencyInstallCommands,
    `cp -au . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}`,
  ]);

  return lambda.Code.fromAsset(options.entry, {
    bundling: {
      image: options.runtime.bundlingDockerImage,
      command: ['bash', '-c', depsCommand],
    },
  });
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}

export interface DependencyBundlingOptions {
  /**
   * Entry path
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;
}

export function bundleDependencies(options: DependencyBundlingOptions): lambda.AssetCode {
  const runtime = options.runtime;
  const entry = options.entry;

  const outputPath = `${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/python`;

  const depsCommand = chain(installDependenciesCommands({ runtime, entry, outputPath }));

  return lambda.Code.fromAsset(options.entry, {
    bundling: {
      image: options.runtime.bundlingDockerImage,
      command: ['bash', '-c', depsCommand],
    },
    exclude: ['*', '!requirements.txt'],
  });
}
