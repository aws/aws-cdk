import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as crypto from 'crypto';
import * as os from 'os';
import { AssetStaging } from '../asset-staging';
import { BundlingOptions } from '../bundling';

/**
 * Options for Docker based bundling of assets
 */
interface AssetBundlingOptions extends BundlingOptions {
  /**
   * Path where the source files are located
   */
  readonly sourcePath: string;
  /**
   * Path where the output files should be stored
   */
  readonly bundleDir: string;
}

abstract class AssetBundlingBase {
  protected options: AssetBundlingOptions;
  constructor(options: AssetBundlingOptions) {
    this.options = options;
  }
  /**
   * Determines a useful default user if not given otherwise
   */
  protected determineUser() {
    let user: string;
    if (this.options.user) {
      user = this.options.user;
    } else {
      // Default to current user
      const userInfo = os.userInfo();
      user =
        userInfo.uid !== -1 // uid is -1 on Windows
          ? `${userInfo.uid}:${userInfo.gid}`
          : '1000:1000';
    }
    return user;
  }
}

/**
 * Bundles files with bind mount as copy method
 */
export class AssetBundlingBindMount extends AssetBundlingBase {
  /**
   * Bundle files with bind mount as copy method
   */
  public run() {
    this.options.image.run({
      command: this.options.command,
      user: this.determineUser(),
      environment: this.options.environment,
      entrypoint: this.options.entrypoint,
      workingDirectory:
        this.options.workingDirectory ?? AssetStaging.BUNDLING_INPUT_DIR,
      securityOpt: this.options.securityOpt ?? '',
      volumesFrom: this.options.volumesFrom,
      volumes: [
        {
          hostPath: this.options.sourcePath,
          containerPath: AssetStaging.BUNDLING_INPUT_DIR,
        },
        {
          hostPath: this.options.bundleDir,
          containerPath: AssetStaging.BUNDLING_OUTPUT_DIR,
        },
        ...(this.options.volumes ?? []),
      ],
    });
  }
}

/**
 * Provides a helper container for copying bundling related files to specific input and output volumes
 */
export class AssetBundlingVolumeCopy extends AssetBundlingBase {
  /**
   * Name of the Docker volume that is used for the asset input
   */
  private inputVolumeName: string;
  /**
   * Name of the Docker volume that is used for the asset output
   */
  private outputVolumeName: string;
  /**
   * Name of the Docker helper container to copy files into the volume
   */
  public copyContainerName: string;

  constructor(options: AssetBundlingOptions) {
    super(options);
    const copySuffix = crypto.randomBytes(12).toString('hex');
    this.inputVolumeName = `assetInput${copySuffix}`;
    this.outputVolumeName = `assetOutput${copySuffix}`;
    this.copyContainerName = `copyContainer${copySuffix}`;
  }

  /**
   * Creates volumes for asset input and output
   */
  private prepareVolumes() {
    dockerExec(['volume', 'create', this.inputVolumeName]);
    dockerExec(['volume', 'create', this.outputVolumeName]);
  }

  /**
   * Removes volumes for asset input and output
   */
  private cleanVolumes() {
    dockerExec(['volume', 'rm', this.inputVolumeName]);
    dockerExec(['volume', 'rm', this.outputVolumeName]);
  }

  /**
   * runs a helper container that holds volumes and does some preparation tasks
   * @param user The user that will later access these files and needs permissions to do so
   */
  private startHelperContainer(user: string) {
    dockerExec([
      'run',
      '--name',
      this.copyContainerName,
      '-v',
      `${this.inputVolumeName}:${AssetStaging.BUNDLING_INPUT_DIR}`,
      '-v',
      `${this.outputVolumeName}:${AssetStaging.BUNDLING_OUTPUT_DIR}`,
      'alpine',
      'sh',
      '-c',
      `mkdir -p ${AssetStaging.BUNDLING_INPUT_DIR} && chown -R ${user} ${AssetStaging.BUNDLING_OUTPUT_DIR} && chown -R ${user} ${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]);
  }

  /**
   * removes the Docker helper container
   */
  private cleanHelperContainer() {
    dockerExec(['rm', this.copyContainerName]);
  }

  /**
   * copy files from the host where this is executed into the input volume
   * @param sourcePath - path to folder where files should be copied from - without trailing slash
   */
  private copyInputFrom(sourcePath: string) {
    dockerExec([
      'cp',
      `${sourcePath}/.`,
      `${this.copyContainerName}:${AssetStaging.BUNDLING_INPUT_DIR}`,
    ]);
  }

  /**
   * copy files from the the output volume to the host where this is executed
   * @param outputPath - path to folder where files should be copied to - without trailing slash
   */
  private copyOutputTo(outputPath: string) {
    dockerExec([
      'cp',
      `${this.copyContainerName}:${AssetStaging.BUNDLING_OUTPUT_DIR}/.`,
      outputPath,
    ]);
  }

  /**
   * Bundle files with VOLUME_COPY method
   */
  public run() {
    const user = this.determineUser();
    this.prepareVolumes();
    this.startHelperContainer(user); // TODO handle user properly
    this.copyInputFrom(this.options.sourcePath);

    this.options.image.run({
      command: this.options.command,
      user: user,
      environment: this.options.environment,
      entrypoint: this.options.entrypoint,
      workingDirectory:
        this.options.workingDirectory ?? AssetStaging.BUNDLING_INPUT_DIR,
      securityOpt: this.options.securityOpt ?? '',
      volumes: this.options.volumes,
      volumesFrom: [
        this.copyContainerName,
        ...(this.options.volumesFrom ?? []),
      ],
    });

    this.copyOutputTo(this.options.bundleDir);
    this.cleanHelperContainer();
    this.cleanVolumes();
  }
}

export function dockerExec(args: string[], options?: SpawnSyncOptions) {
  const prog = process.env.CDK_DOCKER ?? 'docker';
  const proc = spawnSync(prog, args, options ?? {
    encoding: 'utf-8',
    stdio: [ // show Docker output
      'ignore', // ignore stdio
      process.stderr, // redirect stdout to stderr
      'inherit', // inherit stderr
    ],
  });

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    const reason = proc.signal != null
      ? `signal ${proc.signal}`
      : `status ${proc.status}`;
    const command = [prog, ...args.map((arg) => /[^a-z0-9_-]/i.test(arg) ? JSON.stringify(arg) : arg)].join(' ');

    function prependLines(firstLine: string, text: Buffer | string | undefined): string[] {
      if (!text || text.length === 0) {
        return [];
      }
      const padding = ' '.repeat(firstLine.length);
      return text.toString('utf-8').split('\n').map((line, idx) => `${idx === 0 ? firstLine : padding}${line}`);
    }

    throw new Error([
      `${prog} exited with ${reason}`,
      ...prependLines('--> STDOUT:  ', proc.stdout ) ?? [],
      ...prependLines('--> STDERR:  ', proc.stderr ) ?? [],
      `--> Command: ${command}`,
    ].join('\n'));
  }

  return proc;
}
