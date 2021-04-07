export interface DockerImageAssetSource {
  /**
   * The hash of the contents of the docker build context. This hash is used
   * throughout the system to identify this image and avoid duplicate work
   * in case the source did not change.
   *
   * NOTE: this means that if you wish to update your docker image, you
   * must make a modification to the source (e.g. add some metadata to your Dockerfile).
   */
  readonly sourceHash: string;

  /**
   * An external command that will produce the packaged asset.
   *
   * The command should produce the name of a local Docker image on `stdout`.
   *
   * @default - Exactly one of `directoryName` and `executable` is required
   */
  readonly executable?: string[];

  /**
   * The directory where the Dockerfile is stored, must be relative
   * to the cloud assembly root.
   *
   * @default - Exactly one of `directoryName` and `executable` is required
   */
  readonly directoryName?: string;

  /**
   * Build args to pass to the `docker build` command.
   *
   * Since Docker build arguments are resolved before deployment, keys and
   * values cannot refer to unresolved tokens (such as `lambda.functionArn` or
   * `queue.queueUrl`).
   *
   * Only allowed when `directoryName` is specified.
   *
   * @default - no build args are passed
   */
  readonly dockerBuildArgs?: { [key: string]: string };

  /**
   * Docker target to build to
   *
   * Only allowed when `directoryName` is specified.
   *
   * @default - no target
   */
  readonly dockerBuildTarget?: string;

  /**
   * Path to the Dockerfile (relative to the directory).
   *
   * Only allowed when `directoryName` is specified.
   *
   * @default - no file
   */
  readonly dockerFile?: string;

  /**
   * ECR repository name
   *
   * Specify this property if you need to statically address the image, e.g.
   * from a Kubernetes Pod. Note, this is only the repository name, without the
   * registry and the tag parts.
   *
   * @default - automatically derived from the asset's ID.
   * @deprecated repository name should be specified at the environment-level and not at the image level
   */
  readonly repositoryName?: string;
}

/**
 * The location of the published docker image. This is where the image can be
 * consumed at runtime.
 */
export interface DockerImageAssetLocation {
  /**
   * The URI of the image in Amazon ECR.
   */
  readonly imageUri: string;

  /**
   * The name of the ECR repository.
   */
  readonly repositoryName: string;
}
