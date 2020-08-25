import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

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
}

/**
 * Produce bundled Lambda asset code
 */
export function bundle(options: BundlingOptions): lambda.AssetCode {
  // Bundling image derived from runtime bundling image (AWS SAM docker image)
  const image = cdk.BundlingDockerImage.fromAsset(__dirname, {
    buildArgs: {
      IMAGE: options.runtime.bundlingDockerImage.image,
    },
  });

  let installer = options.runtime === lambda.Runtime.PYTHON_2_7 ? Installer.PIP : Installer.PIP3;

  let hasRequirements = fs.existsSync(path.join(options.entry, 'requirements.txt'));

  let depsCommand = chain([
    hasRequirements ? `${installer} install -r requirements.txt -t ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}` : '',
    `rsync -r . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}`,
  ]);

  return lambda.Code.fromAsset(options.entry, {
    bundling: {
      image,
      command: ['bash', '-c', depsCommand],
    },
  });
}

enum Installer {
  PIP = 'pip',
  PIP3 = 'pip3',
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
