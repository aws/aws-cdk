import * as path from 'path';
import { Architecture, AssetCode, Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetStaging, BundlingFileAccess, BundlingOptions as CdkBundlingOptions, DockerImage, DockerVolume } from '@aws-cdk/core';
import { Packaging, DependenciesFile } from './packaging';
import { BundlingOptions, ICommandHooks } from './types';

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
   * Whether or not the bundling process should be skipped
   *
   * @default - Does not skip bundling
   */
  readonly skip?: boolean;

  /**
   * Which option to use to copy the source files to the docker container and output files back
   * @default - BundlingFileAccess.BIND_MOUNT
   */
  bundlingFileAccess?: BundlingFileAccess
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
  public readonly entrypoint?: string[]
  public readonly command: string[];
  public readonly volumes?: DockerVolume[];
  public readonly volumesFrom?: string[];
  public readonly environment?: { [key: string]: string };
  public readonly workingDirectory?: string;
  public readonly user?: string;
  public readonly securityOpt?: string;
  public readonly network?: string;
  public readonly bundlingFileAccess?: BundlingFileAccess;

  constructor(props: BundlingProps) {
    const {
      entry,
      runtime,
      architecture = Architecture.X86_64,
      outputPathSuffix = '',
      image,
      poetryIncludeHashes,
      commandHooks,
      assetExcludes = [],
    } = props;

    const outputPath = path.posix.join(AssetStaging.BUNDLING_OUTPUT_DIR, outputPathSuffix);

    const bundlingCommands = this.createBundlingCommand({
      entry,
      inputDir: AssetStaging.BUNDLING_INPUT_DIR,
      outputDir: outputPath,
      poetryIncludeHashes,
      commandHooks,
      assetExcludes,
    });

    this.image = image ?? DockerImage.fromBuild(path.join(__dirname, '../lib'), {
      buildArgs: {
        ...props.buildArgs,
        IMAGE: runtime.bundlingImage.image,
      },
      platform: architecture.dockerPlatform,
    });
    this.command = props.command ?? ['bash', '-c', chain(bundlingCommands)];
    this.entrypoint = props.entrypoint;
    this.volumes = props.volumes;
    this.volumesFrom = props.volumesFrom;
    this.environment = props.environment;
    this.workingDirectory = props.workingDirectory;
    this.user = props.user;
    this.securityOpt = props.securityOpt;
    this.network = props.network;
    this.bundlingFileAccess = props.bundlingFileAccess;
  }

  private createBundlingCommand(options: BundlingCommandOptions): string[] {
    const packaging = Packaging.fromEntry(options.entry, options.poetryIncludeHashes);
    let bundlingCommands: string[] = [];
    bundlingCommands.push(...options.commandHooks?.beforeBundling(options.inputDir, options.outputDir) ?? []);
    const exclusionStr = options.assetExcludes?.map(item => `--exclude='${item}'`).join(' ');
    bundlingCommands.push([
      'rsync', '-rLv', exclusionStr ?? '', `${options.inputDir}/`, options.outputDir,
    ].filter(item => item).join(' '));
    bundlingCommands.push(`cd ${options.outputDir}`);
    bundlingCommands.push(packaging.exportCommand ?? '');
    if (packaging.dependenciesFile) {
      bundlingCommands.push(`python -m pip install -r ${DependenciesFile.PIP} -t ${options.outputDir}`);
    }
    bundlingCommands.push(...options.commandHooks?.afterBundling(options.inputDir, options.outputDir) ?? []);
    return bundlingCommands;
  }
}

interface BundlingCommandOptions {
  readonly entry: string;
  readonly inputDir: string;
  readonly outputDir: string;
  readonly assetExcludes?: string[];
  readonly poetryIncludeHashes?: boolean;
  readonly commandHooks?: ICommandHooks;
}

/**
 * Chain commands
 */
function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
