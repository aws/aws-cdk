import * as path from 'path';
import type { AssetCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Architecture, Code } from 'aws-cdk-lib/aws-lambda';
import type { BundlingFileAccess, BundlingOptions as CdkBundlingOptions, DockerVolume, ILocalBundling } from 'aws-cdk-lib/core';
import { AssetStaging, DockerImage } from 'aws-cdk-lib/core';
import { LocalBundling } from './local-bundling';
import { Packaging, DependenciesFile } from './packaging';
import type { BundlingOptions, ICommandHooks } from './types';

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
  bundlingFileAccess?: BundlingFileAccess;
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
  public readonly entrypoint?: string[];
  public readonly command: string[];
  public readonly volumes?: DockerVolume[];
  public readonly volumesFrom?: string[];
  public readonly environment?: { [key: string]: string };
  public readonly workingDirectory?: string;
  public readonly user?: string;
  public readonly securityOpt?: string;
  public readonly network?: string;
  public readonly bundlingFileAccess?: BundlingFileAccess;
  public readonly local?: ILocalBundling;

  constructor(props: BundlingProps) {
    const {
      entry,
      runtime,
      architecture = Architecture.X86_64,
      outputPathSuffix = '',
      image,
      poetryIncludeHashes,
      poetryWithoutUrls,
      commandHooks,
      assetExcludes = [],
    } = props;

    const outputPath = path.posix.join(AssetStaging.BUNDLING_OUTPUT_DIR, outputPathSuffix);
    const packaging = Packaging.fromEntry(entry, poetryIncludeHashes, poetryWithoutUrls);
    const excludes = effectiveExcludes(assetExcludes, packaging);

    const bundlingCommands = createBundlingCommand({
      inputDir: AssetStaging.BUNDLING_INPUT_DIR,
      outputDir: outputPath,
      packaging,
      excludes,
      commandHooks,
    });

    this.image = image ?? DockerImage.fromBuild(path.join(__dirname, '..', 'lib'), {
      buildArgs: {
        ...props.buildArgs,
        IMAGE: runtime.bundlingImage.image,
      },
      platform: architecture.dockerPlatform,
      network: props.network,
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

    if (props.local === true) {
      this.local = new LocalBundling({
        entry,
        runtime,
        architecture,
        packaging,
        excludes,
        manyLinuxTags: props.manyLinuxTags,
        commandHooks,
      });
    }
  }
}

function createBundlingCommand(options: BundlingCommandOptions): string[] {
  const { packaging, excludes, inputDir, outputDir } = options;
  const bundlingCommands: string[] = [];
  bundlingCommands.push(...options.commandHooks?.beforeBundling(inputDir, outputDir) ?? []);

  const exclusionStr = excludes.map(item => `--exclude='${item}'`).join(' ');
  bundlingCommands.push([
    'rsync', '-rLv', exclusionStr, `${inputDir}/`, outputDir,
  ].filter(item => item).join(' '));
  bundlingCommands.push(`cd ${outputDir}`);
  bundlingCommands.push(packaging.exportCommand ?? '');

  if (packaging.dependenciesFile == DependenciesFile.UV) {
    bundlingCommands.push(`uv pip install -r ${DependenciesFile.PIP} --target ${outputDir}`);
  } else if (packaging.dependenciesFile) {
    bundlingCommands.push(`python -m pip install -r ${DependenciesFile.PIP} -t ${outputDir}`);
  }

  bundlingCommands.push(...options.commandHooks?.afterBundling(inputDir, outputDir) ?? []);
  return bundlingCommands;
}

interface BundlingCommandOptions {
  readonly inputDir: string;
  readonly outputDir: string;
  readonly packaging: Packaging;
  readonly excludes: string[];
  readonly commandHooks?: ICommandHooks;
}

function effectiveExcludes(assetExcludes: string[], packaging: Packaging): string[] {
  const excludes = [...assetExcludes];
  if (packaging.dependenciesFile === DependenciesFile.UV && !excludes.includes('.python-version')) {
    excludes.push('.python-version');
  }
  return excludes;
}

/**
 * Chain commands
 */
function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}
