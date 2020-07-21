import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { findUp } from './util';

/**
 * Options for bundling
 */
export interface BundlingOptions {
  /**
   * The root of the project. This will be used as the source for the volume
   * mounted in the Docker container. If you specify this prop, ensure that
   * this path includes `entry` and any module/dependencies used by your
   * function otherwise bundling will not be possible.
   *
   * @default - the closest path containing a .git folder
   */
  readonly projectRoot?: string;

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
    // Find project root
    const projectRoot = options.projectRoot ?? findUp(`.git${path.sep}`);
    if (!projectRoot) {
      throw new Error('Cannot find project root. Please specify it with `projectRoot`.');
    }

    // Entry file path relative to container path
    const containerEntryPath = path.join(cdk.AssetStaging.BUNDLING_INPUT_DIR, path.relative(projectRoot, path.resolve(options.entry)));
    let installer = options.runtime === lambda.Runtime.PYTHON_2_7 ? Installer.PIP : Installer.PIP3;

    let entryDir = path.dirname(options.entry);
    let entryFilename = path.basename(options.entry);
    let hasRequirements = fs.existsSync(path.join(entryDir, 'requirements.txt'));

    let depsCommand = chain([
      hasRequirements ? `${installer} install -r requirements.txt -t ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}` : '',
      `rsync -r . ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}`,
      `mv ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/${entryFilename} ${cdk.AssetStaging.BUNDLING_OUTPUT_DIR}/lambda_function.py`,
    ]);

    return lambda.Code.fromAsset(projectRoot, {
      assetHashType: cdk.AssetHashType.BUNDLE,
      bundling: {
        image: options.runtime.bundlingDockerImage,
        command: ['bash', '-c', depsCommand],
        workingDirectory: path.dirname(containerEntryPath).replace(/\\/g, '/'), // Always use POSIX paths in the container
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
