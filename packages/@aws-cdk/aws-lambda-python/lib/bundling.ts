import * as path from 'path';
import { Architecture, AssetCode, Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetStaging, BundlingOptions as CdkBundlingOptions, DockerImage } from '@aws-cdk/core';
import { Packaging, DependenciesFile } from './packaging';
import { BundlingOptions } from './types';

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
export interface BundlingProps extends BundlingOptions {
  /**
   * Entry path
   */
  readonly entry: string;

  /**
   * The runtime environment.
   */
  readonly runtime: Runtime;

  /**
   * The system architecture of the lambda function
   *
   * @default Architecture.X86_64
   */
  readonly architecture?: Architecture;
}

/**
 * Produce bundled Lambda asset code
 */
export class Bundling implements CdkBundlingOptions {
  public static bundle(options: BundlingProps): AssetCode {
    return Code.fromAsset(options.entry, {
      assetHash: options.assetHash,
      assetHashType: options.assetHashType,
      exclude: DEPENDENCY_EXCLUDES,
      bundling: new Bundling(options),
    });
  }

  public readonly image: DockerImage;
  public readonly command: string[];

  constructor(props: BundlingProps) {
    const {
      entry,
      runtime,
      architecture = Architecture.X86_64,
      outputPathSuffix = '',
      image,
    } = props;

    const outputPath = path.join(AssetStaging.BUNDLING_OUTPUT_DIR, outputPathSuffix);

    const bundlingCommands = this.createBundlingCommand({
      entry,
      inputDir: AssetStaging.BUNDLING_INPUT_DIR,
      outputDir: outputPath,
    });

    const defaultImage = DockerImage.fromBuild(path.join(__dirname, '../lib'), {
      buildArgs: {
        ...props.buildArgs ?? {},
        IMAGE: runtime.bundlingImage.image,
      },
      platform: architecture.dockerPlatform,
    });
    this.image = image ?? defaultImage;
    this.command = ['bash', '-c', chain(bundlingCommands)];
  }

  private createBundlingCommand(options: BundlingCommandOptions): string[] {
    const packaging = Packaging.fromEntry(options.entry);
    let bundlingCommands: string[] = [];
    bundlingCommands.push(packaging.exportCommand ?? '');
    if (packaging.dependenciesFile) {
      bundlingCommands.push(`python -m pip install -r ${DependenciesFile.PIP} -t ${options.outputDir}`);
    }
    bundlingCommands.push(`cp -rT ${options.inputDir}/ ${options.outputDir}`);
    return bundlingCommands;
  }
}

interface BundlingCommandOptions {
  readonly entry: string;
  readonly inputDir: string;
  readonly outputDir: string;
}

/**
 * Chain commands
 */
function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
