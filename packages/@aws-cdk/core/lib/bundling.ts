import { spawnSync } from 'child_process';

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

  /**
   * The user to use when running the container.
   *
   *   user | user:group | uid | uid:gid | user:gid | uid:group
   *
   * @see https://docs.docker.com/engine/reference/run/#user
   *
   * @default - uid:gid of the current user or 1000:1000 on Windows
   */
  readonly user?: string;
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

    const docker = dockerExec(dockerArgs);

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

    const dockerArgs: string[] = [
      'run', '--rm',
      ...options.user
        ? ['-u', options.user]
        : [],
      ...flatten(volumes.map(v => ['-v', `${v.hostPath}:${v.containerPath}`])),
      ...flatten(Object.entries(environment).map(([k, v]) => ['--env', `${k}=${v}`])),
      ...options.workingDirectory
        ? ['-w', options.workingDirectory]
        : [],
      this.image,
      ...command,
    ];

    dockerExec(dockerArgs);
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

  /**
   * The user to use when running the container.
   *
   * @default - root or image default
   */
  readonly user?: string;
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

function dockerExec(args: string[]) {
  const prog = process.env.CDK_DOCKER ?? 'docker';
  const proc = spawnSync(prog, args);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
  }

  return proc;
}
