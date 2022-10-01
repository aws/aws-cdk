import { AwsDestination } from './aws-destination';

/**
 * A file asset
 */
export interface FileAsset {
  /**
   * Source description for file assets
   */
  readonly source: FileSource;

  /**
   * Destinations for this file asset
   */
  readonly destinations: { [id: string]: FileDestination };
}

/**
 * Packaging strategy for file assets
 */
export enum FileAssetPackaging {
  /**
   * Upload the given path as a file
   */
  FILE = 'file',

  /**
   * The given path is a directory, zip it and upload
   */
  ZIP_DIRECTORY = 'zip',
}

/**
 * Describe the source of a file asset
 */
export interface FileSource {
  /**
   * External command which will produce the file asset to upload.
   *
   * @default - Exactly one of `executable` and `path` is required.
   */
  readonly executable?: string[];

  /**
   * The filesystem object to upload
   *
   * This path is relative to the asset manifest location.
   *
   * @default - Exactly one of `executable` and `path` is required.
   */
  readonly path?: string;

  /**
   * Packaging method
   *
   * Only allowed when `path` is specified.
   *
   * @default FILE
   */
  readonly packaging?: FileAssetPackaging;

  /**
   * Bundling instructions if asset is not in bundled form in assembly
   *
   * @default - no bundling
   */
  readonly bundling?: BundlingOptions;
}

/**
 * Options for bundling the file asset from source
 */
export interface BundlingOptions {
  /**
   * Image used for bundling unless local bundling is possible
   */
  readonly image: string;

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
}

/**
 * Docker volume to be added to bundling image
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
 * Where in S3 a file asset needs to be published
 */
export interface FileDestination extends AwsDestination {
  /**
   * The name of the bucket
   */
  readonly bucketName: string;

  /**
   * The destination object key
   */
  readonly objectKey: string;
}
