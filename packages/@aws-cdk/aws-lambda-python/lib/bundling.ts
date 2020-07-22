import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

/**
 * Options for bundling
 */
export interface BundlingOptions {
  /**
   * Entry file
   */
  readonly entry: string;

  /**
   * The runtime of the lambda function
   */
  readonly runtime: lambda.Runtime;
}

/**
 * Bundling
 */
export class Bundling {
  /**
   * Produce bundled Lambda asset code
   */
  public static bundle(options: BundlingOptions): lambda.AssetCode {
    let installer = options.runtime === lambda.Runtime.PYTHON_2_7 ? Installer.PIP : Installer.PIP3;

    let entryDir = path.dirname(options.entry);
    let entryFilename = path.basename(options.entry);
    let hasRequirements = fs.existsSync(path.join(entryDir, 'requirements.txt'));

    let depsCommand = chain([
      hasRequirements ? `${installer} install -r requirements.txt -t ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}` : '',
      `rsync -r . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}`,
      `mv ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/${entryFilename} ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/lambda_function.py`,
    ]);

    return lambda.Code.fromAsset(entryDir, {
      bundling: {
        image: options.runtime.bundlingDockerImage,
        command: ['bash', '-c', depsCommand],
      },
    });
  }
}

enum Installer {
  PIP = 'pip',
  PIP3 = 'pip3',
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
