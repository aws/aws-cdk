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
