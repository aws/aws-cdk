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

  /**
   * Where to mount the specified volumes from
   * Docker [volumes-from option](https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from)
   * @default - no volumes-from options
   */
  readonly volumesFrom?: string;

  /**
   * Whether or not the bundling process should be skipped
   *
   * @default - Does not skip bundling
   */
  readonly skip?: boolean;
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
      bundling: options.skip ? undefined : new Bundling(options),
    });
  }

  public readonly image: DockerImage;
  public readonly command: string[];
  public readonly environment?: { [key: string]: string };
  public readonly volumesFrom?: string | undefined;

  constructor(props: BundlingProps) {
    const {
      entry,
      runtime,
      architecture = Architecture.X86_64,
      outputPathSuffix = '',
      image,
    } = props;

    const outputPath = path.posix.join(AssetStaging.BUNDLING_OUTPUT_DIR, outputPathSuffix);

    const bundlingCommands = this.createBundlingCommand({
      entry,
      inputDir: AssetStaging.BUNDLING_INPUT_DIR,
      outputDir: outputPath,
    });

    this.image = image ?? DockerImage.fromBuild(path.join(__dirname, '../lib'), {
      buildArgs: {
        ...props.buildArgs,
        IMAGE: runtime.bundlingImage.image,
      },
      platform: architecture.dockerPlatform,
    });
    this.command = ['bash', '-c', chain(bundlingCommands)];
    this.environment = props.environment;
    this.volumesFrom = props.volumesFrom;
  }

  private createBundlingCommand(options: BundlingCommandOptions): string[] {
    const packaging = Packaging.fromEntry(options.entry);
    let bundlingCommands: string[] = [];
    bundlingCommands.push(`cp -rTL ${options.inputDir}/ ${options.outputDir}`);
    bundlingCommands.push(`cd ${options.outputDir}`);
    bundlingCommands.push(packaging.exportCommand ?? '');
    if (packaging.dependenciesFile) {
      bundlingCommands.push(`python -m pip install -r ${DependenciesFile.PIP} -t ${options.outputDir}`);
    }
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
