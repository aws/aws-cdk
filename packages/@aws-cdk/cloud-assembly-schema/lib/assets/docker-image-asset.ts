import { AwsDestination } from './aws-destination';

/**
 * A file asset
 */
export interface DockerImageAsset {
  /**
   * Source description for file assets
   */
  readonly source: DockerImageSource;

  /**
   * Destinations for this file asset
   */
  readonly destinations: { [id: string]: DockerImageDestination };
}

/**
 * Properties for how to produce a Docker image from a source
 */
export interface DockerImageSource {
  /**
   * The directory containing the Docker image build instructions.
   *
   * This path is relative to the asset manifest location.
   *
   * @default - Exactly one of `directory` and `executable` is required
   */
  readonly directory?: string;

  /**
   * A command-line executable that returns the name of a local
   * Docker image on stdout after being run.
   *
   * @default - Exactly one of `directory` and `executable` is required
   */
  readonly executable?: string[];

  /**
   * The name of the file with build instructions
   *
   * Only allowed when `directory` is set.
   *
   * @default "Dockerfile"
   */
  readonly dockerFile?: string;

  /**
   * Target build stage in a Dockerfile with multiple build stages
   *
   * Only allowed when `directory` is set.
   *
   * @default - The last stage in the Dockerfile
   */
  readonly dockerBuildTarget?: string;

  /**
   * Additional build arguments
   *
   * Only allowed when `directory` is set.
   *
   * @default - No additional build arguments
   */
  readonly dockerBuildArgs?: { [name: string]: string };

  /**
   * Additional build secrets
   *
   * Requires BuildKit to be enabled.
   *
   * @default - No additional build secrets
   */
  readonly dockerBuildSecrets?: { [name: string]: string };

  /**
   * Networking mode for the RUN commands during build. _Requires Docker Engine API v1.25+_.
   *
   * Specify this property to build images on a specific networking mode.
   *
   * @default - no networking mode specified
   */
  readonly networkMode?: string;

  /**
   * Platform to build for. _Requires Docker Buildx_.
   *
   * Specify this property to build images on a specific platform/architecture.
   *
   * @default - current machine platform
   */
  readonly platform?: string;
}

/**
 * Where to publish docker images
 */
export interface DockerImageDestination extends AwsDestination {
  /**
   * Name of the ECR repository to publish to
   */
  readonly repositoryName: string;

  /**
   * Tag of the image to publish
   */
  readonly imageTag: string;
}
