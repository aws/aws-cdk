/**
 * The minimum necessary fields to create an asset
 */
export interface AssetSource {
  /**
   * The disk location of the asset.
   *
   * The path should refer to one of the following:
   * - A regular file or a .zip file, in which case the file will be uploaded as-is to S3.
   * - A directory, in which case it will be archived into a .zip file and uploaded to S3.
   */
  readonly path: string;

  /**
   * Specify a custom hash for this asset. If `assetHashType` is set it must
   * be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
   * be SHA256 hashed and encoded as hex. The resulting hash will be the asset
   * hash.
   *
   * NOTE: the hash is used in order to identify a specific revision of the asset, and
   * used for optimizing and caching deployment activities related to this asset such as
   * packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
   * need to make sure it is updated every time the asset changes, or otherwise it is
   * possible that some deployments will not be invalidated.
   *
   * @default - Based on the content of the source path
   */
  readonly assetHash?: string;
}