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
  readonly destinations: Record<string, DockerImageDestination>;
}

/**
 * Properties for how to produce a Docker image from a source
 */
export interface DockerImageSource {
  /**
   * The directory containing the Docker image build instructions.
   *
   * This path is relative to the asset manifest location.
   */
  readonly directory: string;

  /**
   * The name of the file with build instructions
   *
   * @default "Dockerfile"
   */
  readonly dockerFile?: string;

  /**
   * Target build stage in a Dockerfile with multiple build stages
   *
   * @default - The last stage in the Dockerfile
   */
  readonly dockerBuildTarget?: string;

  /**
   * Additional build arguments
   *
   * @default - No additional build arguments
   */
  readonly dockerBuildArgs?: Record<string, string>;
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
