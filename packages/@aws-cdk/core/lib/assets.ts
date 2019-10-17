/**
 * Represents the source for a file asset.
 */
export interface FileAssetSource {
  /**
   * A hash on the content source. This hash is used to uniquely identify this
   * asset throughout the system. If this value doesn't change, the asset will
   * not be rebuilt or republished.
   */
  readonly sourceHash: string;

  /**
   * The path, relative to the root of the cloud assembly, in which this asset
   * source resides. This can be a path to a file or a directory, dependning on the
   * packaging type.
   */
  readonly fileName: string;

  /**
   * Which type of packaging to perform.
   */
  readonly packaging: FileAssetPackaging;
}

export interface DockerImageAssetSource {
  /**
   * The id for the image.
   *
   * This will be used to construct the repository name if `repositoryName`
   * is not specified.
   */
  readonly id: string;

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
   * The directory where the Dockerfile is stored, must be relative
   * to the cloud assembly root.
   */
  readonly directoryName: string;

  /**
   * Build args to pass to the `docker build` command.
   *
   * Since Docker build arguments are resolved before deployment, keys and
   * values cannot refer to unresolved tokens (such as `lambda.functionArn` or
   * `queue.queueUrl`).
   *
   * @default - no build args are passed
   */
  readonly dockerBuildArgs?: { [key: string]: string };

  /**
   * Docker target to build to
   *
   * @default - no target
   */
  readonly dockerBuildTarget?: string;

  /**
   * ECR repository name
   *
   * Specify this property if you need to statically address the image, e.g.
   * from a Kubernetes Pod. Note, this is only the repository name, without the
   * registry and the tag parts.
   *
   * @default - automatically derived from the asset's ID.
   */
  readonly repositoryName?: string;
}

/**
 * Packaging modes for file assets.
 */
export enum FileAssetPackaging {
  /**
   * The asset source path points to a directory, which should be archived using
   * zip and and then uploaded to Amazon S3.
   */
  ZIP_DIRECTORY = 'zip',

  /**
   * The asset source path points to a single file, which should be uploaded
   * to Amazon S3.
   */
  FILE = 'file'
}

/**
 * The location of the published file asset. This is where the asset
 * can be consumed at runtime.
 */
export interface FileAssetLocation {
  /**
   * The name of the Amazon S3 bucket.
   */
  readonly bucketName: string;

  /**
   * The Amazon S3 object key.
   */
  readonly objectKey: string;

  /**
   * The HTTP URL of this asset on Amazon S3.
   *
   * @example https://s3-us-east-1.amazonaws.com/mybucket/myobject
   */
  readonly s3Url: string;
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
