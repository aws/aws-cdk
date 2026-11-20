import { spawnSync } from 'child_process';
import { isAbsolute, join } from 'path';
import type { DockerCacheOption } from './assets';
import { ExecutionError, UnscopedValidationError } from './errors';
import { FileSystem } from './fs';
import { dockerExec } from './private/asset-staging';
import { dockerImageExists, dockerImageIsMissing, isBuiltInCurrentApp, isKnownDockerImage, markBuiltInCurrentApp, rememberDockerImage } from './private/bundling';
import { quiet, reset } from './private/jsii-deprecated';
import { lit } from './private/literal-string';
import { profileFn } from './private/perf';

/**
 * Path inside the bundling container where the host SSH agent socket is mounted
 * when `sshForwarding` is enabled on `DockerRunOptions`.
 */
const SSH_AGENT_CONTAINER_SOCKET = '/run/host-services/ssh-auth.sock';

/**
 * Methods to build Docker CLI arguments for builds using secrets.
 *
 * Docker BuildKit must be enabled to use build secrets.
 *
 * @see https://docs.docker.com/build/buildkit/
 */
export class DockerBuildSecret {
  /**
   * A Docker build secret from a file source
   * @param src The path to the source file, relative to the build directory.
   * @returns The latter half required for `--secret`
   */
  public static fromSrc(src: string): string {
    return `src=${src}`;
  }
}

/**
 * Bundling options
 *
 */
export interface BundlingOptions {
  /**
   * The Docker image where the command will run.
   */
  readonly image: DockerImage;

  /**
   * The entrypoint to run in the Docker container.
   *
   * Example value: `['/bin/sh', '-c']`
   *
   * @see https://docs.docker.com/engine/reference/builder/#entrypoint
   *
   * @default - run the entrypoint defined in the image
   */
  readonly entrypoint?: string[];

  /**
   * The command to run in the Docker container.
   *
   * Example value: `['npm', 'install']`
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
   * Where to mount the specified volumes from
   * @see https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from
   * @default - no containers are specified to mount volumes from
   */
  readonly volumesFrom?: string[];

  /**
   * The environment variables to pass to the Docker container.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * Working directory inside the Docker container.
   *
   * @default /asset-input
   */
  readonly workingDirectory?: string;

  /**
   * The user to use when running the Docker container.
   *
   *   user | user:group | uid | uid:gid | user:gid | uid:group
   *
   * @see https://docs.docker.com/engine/reference/run/#user
   *
   * @default - uid:gid of the current user or 1000:1000 on Windows
   */
  readonly user?: string;

  /**
   * Local bundling provider.
   *
   * The provider implements a method `tryBundle()` which should return `true`
   * if local bundling was performed. If `false` is returned, docker bundling
   * will be done.
   *
   * @default - bundling will only be performed in a Docker container
   *
   */
  readonly local?: ILocalBundling;

  /**
   * The type of output that this bundling operation is producing.
   *
   * @default BundlingOutput.AUTO_DISCOVER
   *
   */
  readonly outputType?: BundlingOutput;

  /**
   * [Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration)
   * when running the docker container.
   *
   * @default - no security options
   */
  readonly securityOpt?: string;
  /**
   * Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network)
   *
   * @default - no networking options
   */
  readonly network?: string;

  /**
   * The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host.
   * @default - BundlingFileAccess.BIND_MOUNT
   */
  readonly bundlingFileAccess?: BundlingFileAccess;

  /**
   * Platform to build for. _Requires Docker Buildx_.
   *
   * Specify this property to build images on a specific platform.
   *
   * @default - no platform specified (the current machine architecture will be used)
   */
  readonly platform?: string;

  /**
   * Forward the host SSH agent into the bundling container.
   *
   * When set to `true`, the host's `$SSH_AUTH_SOCK` is bind-mounted into the
   * bundling container and the in-container `SSH_AUTH_SOCK` env var is pointed
   * at the mount path. This lets bundling commands (for example `pip`, `npm`,
   * or `cargo` resolving private git dependencies over SSH) reuse the host SSH
   * agent without copying private keys into the container.
   *
   * Synthesis fails if `SSH_AUTH_SOCK` is not set on the host when this option
   * is enabled.
   *
   * @default false
   */
  readonly sshForwarding?: boolean;
}

/**
 * The type of output that a bundling operation is producing.
 *
 */
export enum BundlingOutput {
  /**
   * The bundling output directory includes a single .zip or .jar file which
   * will be used as the final bundle. If the output directory does not
   * include exactly a single archive, bundling will fail.
   */
  ARCHIVED = 'archived',

  /**
   * The bundling output directory contains one or more files which will be
   * archived and uploaded as a .zip file to S3.
   */
  NOT_ARCHIVED = 'not-archived',

  /**
   * If the bundling output directory contains a single archive file (zip or jar)
   * it will be used as the bundle output as-is. Otherwise, all the files in the bundling output directory will be zipped.
   */
  AUTO_DISCOVER = 'auto-discover',

  /**
   * The bundling output directory includes a single file which
   * will be used as the final bundle. If the output directory does not
   * include exactly a single file, bundling will fail.
   *
   * Similar to ARCHIVED but for non-archive files
   */
  SINGLE_FILE = 'single-file',
}

/**
 * Local bundling
 *
 */
export interface ILocalBundling {
  /**
   * This method is called before attempting docker bundling to allow the
   * bundler to be executed locally. If the local bundler exists, and bundling
   * was performed locally, return `true`. Otherwise, return `false`.
   *
   * @param outputDir the directory where the bundled asset should be output
   * @param options bundling options for this asset
   */
  tryBundle(outputDir: string, options: BundlingOptions): boolean;
}

/**
 * The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host
 */
export enum BundlingFileAccess {
  /**
   * Creates temporary volumes and containers to copy files from the host to the bundling container and back.
   * This is slower, but works also in more complex situations with remote or shared docker sockets.
   */
  VOLUME_COPY = 'VOLUME_COPY',

  /**
   * The source and output folders will be mounted as bind mount from the host system
   * This is faster and simpler, but less portable than `VOLUME_COPY`.
   */
  BIND_MOUNT = 'BIND_MOUNT',
}

/**
 * A Docker image used for asset bundling
 *
 * @deprecated use DockerImage
 */
export class BundlingDockerImage {
  /**
   * Reference an image on DockerHub or another online registry.
   *
   * @param image the image name
   */
  public static fromRegistry(image: string) {
    return new DockerImage(image);
  }

  /**
   * Reference an image that's built directly from sources on disk.
   *
   * @param path The path to the directory containing the Docker file
   * @param options Docker build options
   *
   * @deprecated use DockerImage.fromBuild()
   */
  public static fromAsset(path: string, options: DockerBuildOptions = {}): BundlingDockerImage {
    return DockerImage.fromBuild(path, options);
  }

  /** @param image The Docker image */
  protected constructor(public readonly image: string, private readonly _imageHash?: string) { }

  /**
   * Provides a stable representation of this image for JSON serialization.
   *
   * @return The overridden image name if set or image hash name in that order
   */
  public toJSON() {
    return this._imageHash ?? this.image;
  }

  /**
   * Build the image, if it is built from a Docker file and hasn't been built yet
   *
   * Does nothing for other images, such as images from a registry. Running the
   * image or copying files out of it calls this automatically. Call it yourself
   * before you pass `image` to your own `docker` commands.
   */
  public buildImage(): void {
    // Only images from `DockerImage.fromBuildV2()` are built, see `DockerImage.buildImage()`
  }

  /**
   * Runs a Docker image
   */
  @profileFn('BundlingDockerImage.run', { telemetry: true })
  public run(options: DockerRunOptions = {}) {
    const volumes = [...(options.volumes ?? [])];
    const environment = { ...(options.environment ?? {}) };

    if (options.sshForwarding) {
      const sshAuthSock = process.env.SSH_AUTH_SOCK;
      if (!sshAuthSock) {
        throw new UnscopedValidationError(
          lit`SshForwardingRequiresSshAuthSock`,
          "'sshForwarding' is enabled but the SSH_AUTH_SOCK environment variable is not set on the host. Start an SSH agent and export SSH_AUTH_SOCK before synthesizing.",
        );
      }
      volumes.push({ hostPath: sshAuthSock, containerPath: SSH_AGENT_CONTAINER_SOCKET });
      environment.SSH_AUTH_SOCK = SSH_AGENT_CONTAINER_SOCKET;
    }

    const entrypoint = options.entrypoint?.[0] || null;
    const command = [
      ...options.entrypoint?.[1]
        ? [...options.entrypoint.slice(1)]
        : [],
      ...options.command
        ? [...options.command]
        : [],
    ];

    const dockerArgs: string[] = [
      'run', '--rm',
      ...options.securityOpt
        ? ['--security-opt', options.securityOpt]
        : [],
      ...options.network
        ? ['--network', options.network]
        : [],
      ...options.platform
        ? ['--platform', options.platform]
        : [],
      ...options.user
        ? ['-u', options.user]
        : [],
      ...options.volumesFrom
        ? flatten(options.volumesFrom.map(v => ['--volumes-from', v]))
        : [],
      ...flatten(volumes.map(v => ['-v', `${v.hostPath}:${v.containerPath}:${isSeLinux() ? 'z,' : ''}${v.consistency ?? DockerVolumeConsistency.DELEGATED}`])),
      ...flatten(Object.entries(environment).map(([k, v]) => ['--env', `${k}=${v}`])),
      ...options.workingDirectory
        ? ['-w', options.workingDirectory]
        : [],
      ...entrypoint
        ? ['--entrypoint', entrypoint]
        : [],
      this.image,
      ...command,
    ];

    dockerExec(dockerArgs, undefined, (status) => missingImageHint(this, status));
  }

  /**
   * Copies a file or directory out of the Docker image to the local filesystem.
   *
   * If `outputPath` is omitted the destination path is a temporary directory.
   *
   * @param imagePath the path in the Docker image
   * @param outputPath the destination path for the copy operation
   * @returns the destination path
   */
  @profileFn('BundlingDockerImage.cp', { telemetry: true })
  public cp(imagePath: string, outputPath?: string): string {
    const { stdout } = dockerExec(['create', this.image], {}, (status) => missingImageHint(this, status)); // Empty options to avoid stdout redirect here
    const match = stdout.toString().match(/([0-9a-f]{16,})/);
    if (!match) {
      throw new ExecutionError(lit`FailedToFailedExtractContainer`, 'Failed to extract container ID from Docker create output');
    }

    const containerId = match[1];
    const containerPath = `${containerId}:${imagePath}`;
    const destPath = outputPath ?? FileSystem.mkdtemp('cdk-docker-cp-');
    try {
      dockerExec(['cp', containerPath, destPath]);
      return destPath;
    } catch (err) {
      throw new ExecutionError(lit`FailedToFailedCopyFiles`, `Failed to copy files from ${containerPath} to ${destPath}: ${err}`);
    } finally {
      dockerExec(['rm', '-v', containerId]);
    }
  }
}

/**
 * A Docker image
 */
export class DockerImage extends BundlingDockerImage {
  /**
   * Builds a Docker image
   *
   * The image is built right away, even if it is never used.
   *
   * Use `DockerImage.fromBuildV2()` instead. It builds the same image under the
   * same tag, but only when the image is first needed, so assets whose bundled
   * output already exists, or that skip bundling, never pay for the build. If
   * you need the image right away, call `buildImage()` on it.
   *
   * @param path The path to the directory containing the Docker file
   * @param options Docker build options
   */
  @profileFn('DockerImage.fromBuild', { telemetry: true })
  public static fromBuild(path: string, options: DockerBuildOptions = {}) {
    const { tag, hash } = DockerImage.tagAndHash(path, options);
    DockerImage.buildIfMissing(tag, DockerImage.dockerBuild(path, tag, options));
    return new DockerImage(tag, hash);
  }

  /**
   * Reference a Docker image that is built from a Docker file when it is first needed
   *
   * The image is built when `buildImage()` is called, when it first runs, or when
   * files are first copied out of it. Asset bundling builds the image right
   * before it runs the bundling container, so assets whose bundled output
   * already exists, or that skip bundling, never build it.
   *
   * Until the image is built, `image` names a tag that may not exist in the
   * local Docker daemon yet. Call `buildImage()` before you pass the tag to
   * your own `docker` commands. Errors in the Docker file are reported when the
   * image is built, for example while an asset is bundled, not when this
   * method is called.
   *
   * The tag and the `docker build` command are computed from the Docker file
   * directory and the build options when this method is called, so later
   * changes to the options have no effect. Don't change the Docker file
   * directory afterwards, because the image would no longer match its tag.
   *
   * Images with the same tag are only built or checked once until the next
   * `App` is created, unless they use `buildContexts`. After that, the local
   * Docker daemon is checked again.
   *
   * The image has the same tag and hash as one built with `DockerImage.fromBuild()`
   * from the same arguments, so switching between the two doesn't change asset hashes.
   *
   * @param path The path to the directory containing the Docker file
   * @param options Docker build options
   */
  @profileFn('DockerImage.fromBuildV2', { telemetry: true })
  public static fromBuildV2(path: string, options: DockerBuildOptions = {}) {
    const { tag, hash } = DockerImage.tagAndHash(path, options);
    const image = new DockerImage(tag, hash);
    onDemandBuilds.set(image, DockerImage.dockerBuild(path, tag, options));
    return image;
  }

  /**
   * Reference an image on DockerHub or another online registry.
   *
   * @param image the image name
   */
  public static override fromRegistry(image: string) {
    return new DockerImage(image);
  }

  /**
   * The tag and hash of an image built from this directory with these options
   */
  private static tagAndHash(path: string, options: DockerBuildOptions): { tag: string; hash: string } {
    if (options.file && isAbsolute(options.file)) {
      throw new UnscopedValidationError(lit`MustBeFileRelativeDocker`, `"file" must be relative to the docker build directory. Got ${options.file}`);
    }

    const hash = DockerImage.buildHash(path, options);
    return { tag: `cdk-${hash}`, hash };
  }

  /**
   * The content-addressed hash of an image built from this directory with these options
   */
  private static buildHash(path: string, options: DockerBuildOptions): string {
    // Fingerprints the directory containing the Dockerfile we're building and
    // differentiates the fingerprint based on build arguments. We do this so
    // we can provide a stable image hash. Otherwise, the image ID will be
    // different every time the Docker layer cache is cleared, due primarily to
    // timestamps.
    return FileSystem.fingerprint(path, { extraHash: JSON.stringify(options) });
  }

  /**
   * Build an image if it is built on demand and hasn't been built in the current app yet
   */
  private static buildOnce(image: DockerImage) {
    const dockerBuild = onDemandBuilds.get(image);
    if (!dockerBuild || isBuiltInCurrentApp(image)) {
      return;
    }

    if (!isKnownDockerImage(image.image)) {
      DockerImage.buildIfMissing(image.image, dockerBuild);
    }
    markBuiltInCurrentApp(image);
  }

  /**
   * The `docker build` command for an image built from this directory with these options
   */
  private static dockerBuild(path: string, tag: string, options: DockerBuildOptions): DockerBuild {
    const buildArgs = options.buildArgs || {};

    // NOTE: we don't support properly hashing all possible types of `--build-context`
    // yet, so if we detect any of those we skip the cache check and hope the `docker
    // build` itself is fairly quick in figuring out caching.
    const usingBuildContexts = Object.keys(options.buildContexts ?? {}).length > 0;

    const dockerArgs: string[] = [
      'build', '-t', tag,
      ...(options.file ? ['-f', join(path, options.file)] : []),
      ...(options.platform ? ['--platform', options.platform] : []),
      ...(options.network ? ['--network', options.network] : []),
      ...(options.targetStage ? ['--target', options.targetStage] : []),
      ...(options.cacheFrom ? [...options.cacheFrom.map(cacheFrom => ['--cache-from', this.cacheOptionToFlag(cacheFrom)]).flat()] : []),
      ...(options.cacheTo ? ['--cache-to', this.cacheOptionToFlag(options.cacheTo)] : []),
      ...(options.cacheDisabled ? ['--no-cache'] : []),
      ...flatten(Object.entries(buildArgs).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
      ...flatten(Object.entries(options.buildContexts || {}).map(([k, v]) => ['--build-context', `${k}=${v}`])),
      path,
    ];

    return { dockerArgs, usingBuildContexts };
  }

  /**
   * Build the image, unless it exists already
   */
  @profileFn('DockerImage.buildIfMissing', { telemetry: true })
  private static buildIfMissing(tag: string, dockerBuild: DockerBuild) {
    // Skip the build if the image already exists in the local Docker daemon.
    // The tag is content-addressed from the build context and all options,
    // so an existing image with this tag is guaranteed to be up-to-date.
    if (dockerBuild.usingBuildContexts || !dockerImageExists(tag)) {
      dockerExec([...dockerBuild.dockerArgs]);
    }

    if (!dockerBuild.usingBuildContexts) {
      rememberDockerImage(tag);
    }
  }
  private static cacheOptionToFlag(option: DockerCacheOption): string {
    let flag = `type=${option.type}`;
    if (option.params) {
      flag += ',' + Object.entries(option.params).map(([k, v]) => `${k}=${v}`).join(',');
    }
    return flag;
  }

  /** The Docker image */
  public readonly image: string;

  constructor(image: string, _imageHash?: string) {
    // It is preferable for the deprecated class to inherit a non-deprecated class.
    // However, in this case, the opposite has occurred which is incompatible with
    // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
    const deprecated = quiet();

    super(image, _imageHash);

    reset(deprecated);
    this.image = image;
  }

  /**
   * Provides a stable representation of this image for JSON serialization.
   *
   * @return The overridden image name if set or image hash name in that order
   */
  public toJSON() {
    // It is preferable for the deprecated class to inherit a non-deprecated class.
    // However, in this case, the opposite has occurred which is incompatible with
    // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
    const deprecated = quiet();

    const json = super.toJSON();

    reset(deprecated);
    return json;
  }

  public override buildImage(): void {
    DockerImage.buildOnce(this);
  }

  /**
   * Runs a Docker image
   *
   * Builds the image first if it is built on demand and hasn't been built yet.
   */
  public run(options: DockerRunOptions = {}) {
    this.buildImage();

    // It is preferable for the deprecated class to inherit a non-deprecated class.
    // However, in this case, the opposite has occurred which is incompatible with
    // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
    const deprecated = quiet();

    const result = super.run(options);

    reset(deprecated);
    return result;
  }

  /**
   * Copies a file or directory out of the Docker image to the local filesystem.
   *
   * If `outputPath` is omitted the destination path is a temporary directory.
   *
   * Builds the image first if it is built on demand and hasn't been built yet.
   *
   * @param imagePath the path in the Docker image
   * @param outputPath the destination path for the copy operation
   * @returns the destination path
   */
  public cp(imagePath: string, outputPath?: string): string {
    this.buildImage();

    // It is preferable for the deprecated class to inherit a non-deprecated class.
    // However, in this case, the opposite has occurred which is incompatible with
    // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
    const deprecated = quiet();

    const result = super.cp(imagePath, outputPath);

    reset(deprecated);
    return result;
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

  /**
   * Mount consistency. Only applicable for macOS
   *
   * @default DockerConsistency.DELEGATED
   * @see https://docs.docker.com/storage/bind-mounts/#configure-mount-consistency-for-macos
   */
  readonly consistency?: DockerVolumeConsistency;
}

/**
 * Supported Docker volume consistency types. Only valid on macOS due to the way file storage works on Mac
 */
export enum DockerVolumeConsistency {
  /**
   * Read/write operations inside the Docker container are applied immediately on the mounted host machine volumes
   */
  CONSISTENT = 'consistent',
  /**
   * Read/write operations on mounted Docker volumes are first written inside the container and then synchronized to the host machine
   */
  DELEGATED = 'delegated',
  /**
   * Read/write operations on mounted Docker volumes are first applied on the host machine and then synchronized to the container
   */
  CACHED = 'cached',
}

/**
 * Docker run options
 */
export interface DockerRunOptions {
  /**
   * The entrypoint to run in the container.
   *
   * @default - run the entrypoint defined in the image
   */
  readonly entrypoint?: string[];

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
   * Where to mount the specified volumes from
   * @see https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from
   * @default - no containers are specified to mount volumes from
   */
  readonly volumesFrom?: string[];

  /**
   * The environment variables to pass to the container.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string };

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

  /**
   * [Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration)
   * when running the docker container.
   *
   * @default - no security options
   */
  readonly securityOpt?: string;

  /**
   * Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network)
   *
   * @default - no networking options
   */
  readonly network?: string;

  /**
   * Set platform if server is multi-platform capable. _Requires Docker Engine API v1.38+_.
   *
   * Example value: `linux/amd64`
   *
   * @default - no platform specified
   */
  readonly platform?: string;

  /**
   * Forward the host SSH agent into the bundling container.
   *
   * When set to `true`, the host's `$SSH_AUTH_SOCK` is bind-mounted into the
   * container and the `SSH_AUTH_SOCK` environment variable inside the container
   * is set to that mount path. This lets bundling commands (for example, `pip`,
   * `npm`, or `cargo` resolving private git dependencies over SSH) reuse the
   * host SSH agent without copying private keys into the container.
   *
   * Synthesis will fail if `SSH_AUTH_SOCK` is not set on the host when this
   * option is enabled.
   *
   * @default false
   */
  readonly sshForwarding?: boolean;
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

  /**
   * Build contexts to pass to the `docker build` command.
   *
   * Build contexts can be used to specify additional directories or images
   * to use during the build. Each entry specifies a named build context
   * and its source (a directory path, a URL, or a docker image).
   *
   * @see https://docs.docker.com/build/building/context/#additional-build-contexts
   *
   * @default - no additional build contexts
   */
  readonly buildContexts?: { [key: string]: string };

  /**
   * Name of the Dockerfile, must relative to the docker build path.
   *
   * @default `Dockerfile`
   */
  readonly file?: string;

  /**
   * Docker [Networking options](https://docs.docker.com/reference/cli/docker/buildx/build/#network)
   *
   * @default - no networking options
   */
  readonly network?: string;

  /**
   * Set platform if server is multi-platform capable. _Requires Docker Engine API v1.38+_.
   *
   * Example value: `linux/amd64`
   *
   * @default - no platform specified
   */
  readonly platform?: string;

  /**
   * Set build target for multi-stage container builds. Any stage defined afterwards will be ignored.
   *
   * Example value: `build-env`
   *
   * @default - Build all stages defined in the Dockerfile
   */
  readonly targetStage?: string;

  /**
   * Cache from options to pass to the `docker build` command.
   *
   * @default - no cache from args are passed
   */
  readonly cacheFrom?: DockerCacheOption[];

  /**
   * Cache to options to pass to the `docker build` command.
   *
   * @default - no cache to args are passed
   */
  readonly cacheTo?: DockerCacheOption;

  /**
   * Disable the cache and pass `--no-cache` to the `docker build` command.
   *
   * @default - cache is used
   */
  readonly cacheDisabled?: boolean;
}

function flatten(x: string[][]) {
  return Array.prototype.concat([], ...x);
}

function isSeLinux(): boolean {
  if (process.platform != 'linux') {
    return false;
  }
  const prog = 'selinuxenabled';
  const proc = spawnSync(prog, [], {
    stdio: [ // show selinux status output
      'pipe', // get value of stdio
      process.stderr, // redirect stdout to stderr
      'inherit', // inherit stderr
    ],
  });
  if (proc.error) {
    // selinuxenabled not a valid command, therefore not enabled
    return false;
  }
  if (proc.status == 0) {
    // selinux enabled
    return true;
  } else {
    // selinux not enabled
    return false;
  }
}

/**
 * If this symbol is present on the `BundlingOptions`, it will be used as the source of an additional timer measurement.
 */
export const PERF_BUNDLING_SRC_SYM = Symbol.for('@aws-cdk/core.bundlingSource');

/**
 * A `docker build` command, computed when the image is created
 */
interface DockerBuild {
  /** The arguments to the Docker program */
  readonly dockerArgs: readonly string[];
  /** Whether the build uses build contexts, which the image's tag doesn't cover */
  readonly usingBuildContexts: boolean;
}

/**
 * The `docker build` commands of images from `DockerImage.fromBuildV2()`
 */
const onDemandBuilds = new WeakMap<BundlingDockerImage, DockerBuild>();

/**
 * The exit code of `docker run` and `docker create` when Docker itself fails to create
 * the container, rather than the command running in it
 */
const DOCKER_DAEMON_ERROR_STATUS = 125;

/**
 * Explain a failed Docker command whose image disappeared after it was built
 *
 * Built images are remembered for the rest of the app and not checked again.
 * If one is removed in the meantime, Docker can't create the container and tries
 * to pull the image from a registry instead, which fails with a confusing error.
 * The hint is only added when Docker failed to create the container and the
 * Docker daemon confirms that the image is missing.
 */
function missingImageHint(image: BundlingDockerImage, status: number | null): string | undefined {
  if (status !== DOCKER_DAEMON_ERROR_STATUS || !isBuiltInCurrentApp(image) || !dockerImageIsMissing(image.image)) {
    return undefined;
  }
  return `Docker could not create the container because the image ${image.image} is no longer in the local Docker daemon. `
    + 'The image was built earlier in this app and removed since. Run the command again to rebuild it.';
}
