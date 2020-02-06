/**
 * A file asset
 */
export interface DockerImageAsset {
  /**
   * Source description for file assets
   */
  source: DockerImageSource;

  /**
   * Destinations for this file asset
   */
  destinations: Record<string, DockerImageDestination>;
}

/**
 * Properties for how to produce a Docker image from a source
 */
export interface DockerImageSource {
  /**
   * The directory containing the Docker image build instructions
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
export interface DockerImageDestination {
  /**
   * The region where this asset will need to be published
   */
  readonly region: string;

  /**
   * The role that needs to be assumed while publishing this asset
   *
   * @default - No role will be assumed
   */
  readonly assumeRoleArn?: string;

  /**
   * The ExternalId that needs to be supplied while assuming this role
   *
   * @default - No ExternalId will be supplied
   */
  readonly assumeRoleExternalId?: string;

  /**
   * Name of the ECR repository to publish to
   */
  readonly repositoryName: string;

  /**
   * Tag of the image to publish
   */
  readonly imageTag: string;

  /**
   * Full Docker tag coordinates (registry and repository and tag)
   *
   * Example:
   *
   * ```
   * 1234.dkr.ecr.REGION.amazonaws.com/REPO:TAG
   * ```
   */
  readonly imageUri: string;
}
