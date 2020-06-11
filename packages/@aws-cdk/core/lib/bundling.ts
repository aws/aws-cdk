import { spawnSync } from 'child_process';
import * as os from 'os';

export const BUNDLING_INPUT_DIR = '/asset-input';
export const BUNDLING_OUTPUT_DIR = '/asset-output';

/**
 * Bundling options
 *
 * @experimental
 */
export interface BundlingOptions {
  /**
   * The Docker image where the command will run.
   */
  readonly image: BundlingDockerImage;

  /**
   * The command to run in the container.
   *
   * @example ['npm', 'install']
   *
   * @see https://docs.docker.com/engine/reference/run/
   *
   * @default - run the command defined in the image
   */
  readonly command?: string[];

  /**
   * Additional Docker volumes to mount.
   *
   * @default - no additional volumes are mounted
   */
  readonly volumes?: DockerVolume[];

  /**
   * The environment variables to pass to the container.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string; };

  /**
   * Working directory inside the container.
   *
   * @default /asset-input
   */
  readonly workingDirectory?: string;
}

/**
 * A Docker image used for asset bundling
 */
export class BundlingDockerImage {
  /**
   * Reference an image on DockerHub or another online registry.
   *
   * @param image the image name
   */
  public static fromRegistry(image: string) {
    return new BundlingDockerImage(image);
  }

  /**
   * Reference an image that's built directly from sources on disk.
   *
   * @param path The path to the directory containing the Docker file
   * @param options Docker build options
   */
  public static fromAsset(path: string, options: DockerBuildOptions = {}) {
    const buildArgs = options.buildArgs || {};

    const dockerArgs: string[] = [
      'build',
      ...flatten(Object.entries(buildArgs).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
      path,
    ];

    const docker = exec('docker', dockerArgs);

    const match = docker.stdout.toString().match(/Successfully built ([a-z0-9]+)/);

    if (!match) {
      throw new Error('Failed to extract image ID from Docker build output');
    }

    return new BundlingDockerImage(match[1]);
  }

  /** @param image The Docker image */
  private constructor(public readonly image: string) {}

  /**
   * Runs a Docker image
   *
   * @internal
   */
  public _run(options: DockerRunOptions = {}) {
    const volumes = options.volumes || [];
    const environment = options.environment || {};
    const command = options.command || [];

    // Get uid and gid of current user.
    const { uid, gid } = os.userInfo();

    const dockerArgs: string[] = [
      'run', '--rm',
      ...flatten(volumes.map(v => ['-v', `${v.hostPath}:${v.containerPath}`])),
      ...flatten(Object.entries(environment).map(([k, v]) => ['--env', `${k}=${v}`])),
      ...options.workingDirectory
        ? ['-w', options.workingDirectory]
        : [],
      // On Windows, uid and gid are -1 and docker always runs as the current user
      ...(uid !== -1 && gid !== -1)
        ? ['-u', `${uid}:${gid}`]
        : [],
      this.image,
      ...command,
    ];

    exec('docker', dockerArgs);
  }
}

/**
 * A Docker volume
 */
export interface DockerVolume {
  /**
   * The path to the file or directory on the host machine
   */
  readonly hostPath: string;

  /**
   * The path where the file or directory is mounted in the container
   */
  readonly containerPath: string;
}

/**
 * Docker run options
 */
interface DockerRunOptions {
  /**
   * The command to run in the container.
   *
   * @default - run the command defined in the image
   */
  readonly command?: string[];

  /**
   * Docker volumes to mount.
   *
   * @default - no volumes are mounted
   */
  readonly volumes?: DockerVolume[];

  /**
   * The environment variables to pass to the container.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string; };

  /**
   * Working directory inside the container.
   *
   * @default - image default
   */
  readonly workingDirectory?: string;
}

/**
 * Docker build options
 */
export interface DockerBuildOptions {
  /**
   * Build args
   *
   * @default - no build args
   */
  readonly buildArgs?: { [key: string]: string };
}

function flatten(x: string[][]) {
  return Array.prototype.concat([], ...x);
}

function exec(cmd: string, args: string[]) {
  const proc = spawnSync(cmd, args);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
  }

  return proc;
}
