/**
 * Determines how symlinks are followed.
 */
export enum SymlinkFollowMode {
  /**
   * Copy symlinks themselves (do not follow, preserve the symlink contents).
   *
   * If any of the symlinks point outside the source directory and the Cloud
   * Assembly gets moved to a different computer, the asset may end up pointing
   * to files that don't exist on that other computer.
   */
  NEVER = 'never',

  /**
   * Copy all the files the symlinks point to (always follow).
   *
   * This reads target files even if the symlinks point outside the source
   * directory.  Uses more disk space but is guaranteed to end up with a
   * complete asset directory.
   */
  ALWAYS = 'always',

  /**
   * Materialize symlinks pointing outside, leave symlinks pointing inside
   *
   * If the symlink points to a file outside the source, copy the target file.
   * Otherwise copy the symlink itself.
   *
   * This produces a complete asset bundle, while saving space.
   */
  EXTERNAL = 'external',

  /**
   * Forbids source from having any symlinks pointing outside of the source
   * tree.
   *
   * This is the safest mode of operation as it ensures that copy operations
   * won't materialize files from the user's file system. Internal symlinks are
   * not followed.
   *
   * If the copy operation runs into an external symlink, it will fail.
   */
  BLOCK_EXTERNAL = 'internal-only',
}

/**
 * Determines the ignore behavior to use.
 */
export enum IgnoreMode {
  /**
   * Ignores file paths based on simple glob patterns.
   *
   * This is the default for file assets.
   *
   * It is also the default for Docker image assets, unless the '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport'
   * context flag is set.
   */
  GLOB = 'glob',

  /**
   * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
   */
  GIT = 'git',

  /**
   * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
   *
   * This is the default for Docker image assets if the '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport'
   * context flag is set.
   */
  DOCKER = 'docker',
}

interface FileOptions {
  /**
   * File paths matching the patterns will be excluded. See `ignoreMode` to set the matching behavior.
   *
   * ## Without bundling
   *
   * When used without the `bundling` property, the asset is just a regular file
   * copy operation. In that case, this controls the files that will be included
   * in the copy. Files matching the `exclude` patterns will not be included in
   * the copy.
   *
   * ## With bundling
   *
   * When used with the `bundling` property, the asset is produced by a
   * bundling operation. In that case, the value of `exclude` is only meaningful
   * if the `assetHashType` is set to `AssetHashType.SOURCE`, and ignored for
   * other asset hash types. The `exclude` patterns will be used to determine
   * which files contribute to the asset, and the bundling command is skipped
   * if the source files have not changed since the last bundling operation.
   *
   * **NOTE:** The bundling operation still has access to all files in the source path,
   * regardless of the `exclude` patterns. It is your responsibility to ensure
   * the `exclude` pattern accurately matches the files the bundling operation
   * will *actually* access and base its final output on.
   *
   * For `OUTPUT` or `CUSTOM` asset hash types, the `exclude` pattern is ignored.
   *
   * @default - nothing is excluded
   */
  readonly exclude?: string[];

  /**
   * What syntax the `exclude` patterns are written in.
   *
   * @default - IgnoreMode.GLOB for file assets, `IgnoreMode.DOCKER` for image assets (requires that the `@aws-cdk/aws-ecr-assets:dockerIgnoreSupport` feature flag is set, which is recommended)
   */
  readonly ignoreMode?: IgnoreMode;
}

/**
 * Options applied when copying directories
 */
export interface CopyOptions extends FileOptions {
  /**
   * A strategy for how to handle symlinks.
   *
   * Symlinks may be copied, materialized or rejected. Note that if symlinks are
   * copied they should be relative; absolute symlinks will lose their
   * meaning if the cloud assembly is moved to another machine.
   *
   * ## Without bundling
   *
   * When used without the `bundling` property, the asset is just a regular file
   * copy operation. In that case, symlinks are materialized or blocked with respect
   * to the source path root as they are being copied.
   *
   * ## With bundling
   *
   * When used with the `bundling` property, the asset is produced by a
   * bundling operation. In that case, the bundling command is fully
   * in charge of producing a set of files in an output directory, and
   * the `AssetStaging` construct will never affect symlink materialization.
   *
   * If the `assetHashType` is `AssetHashType.SOURCE`, this flag affects what
   * the source hash is based on, and the recommended value is one of
   * `SymlinkFollowMode.EXTERNAL` or `SymlinkFollowMode.BLOCK_EXTERNAL`.
   *
   * If the `SymlinkFollowMode.BLOCK_EXTERNAL` mode is used:
   *
   * - Symlinks pointing outside the source tree will be blocked, but only
   *   if using `AssetHashType.SOURCE` (not for any of the other asset hash types).
   * - Symlinks pointing outside the bundle output will be blocked.
   *
   * @default SymlinkFollowMode.EXTERNAL
   */
  readonly follow?: SymlinkFollowMode;
}

/**
 * Options applied when copying directories into the staging location.
 */
export interface FileCopyOptions extends FileOptions {
  /**
   * A strategy for how to handle symlinks.
   *
   * Symlinks may be copied, materialized or rejected. Note that if symlinks are
   * copied they should be relative; absolute symlinks will lose their
   * meaning if the cloud assembly is moved to another machine.
   *
   * ## Without bundling
   *
   * When used without the `bundling` property, the asset is just a regular file
   * copy operation. In that case, symlinks are materialized or blocked with respect
   * to the `sourcePath` directory as they are being copied.
   *
   * ## With bundling
   *
   * When used with the `bundling` property, the asset is produced by a
   * bundling operation. In that case, the bundling command is fully
   * in charge of producing a set of files in an output directory, and
   * the `AssetStaging` construct will never affect symlink materialization.
   *
   * If the `assetHashType` is `AssetHashType.SOURCE`, this flag affects what
   * the source hash is based on, and the recommended value is one of
   * `SymlinkFollowMode.EXTERNAL` or `SymlinkFollowMode.BLOCK_EXTERNAL`.
   *
   * If the `SymlinkFollowMode.BLOCK_EXTERNAL` mode is used:
   * - symlinks pointing outside the source tree will be blocked if using `AssetHashType.SOURCE`.
   * - symlinks pointing outside the bundle output will be blocked.
   *
   * @default SymlinkFollowMode.EXTERNAL
   */
  readonly followSymlinks?: SymlinkFollowMode;
}

interface ExtraHashOptions {
  /**
   * Extra information to encode into the fingerprint (e.g. build instructions
   * and other inputs)
   *
   * @default - hash is only based on the file fingerprint
   */
  readonly extraHash?: string;
}

/**
 * Options related to calculating source hash.
 */
export interface FingerprintOptions extends CopyOptions, ExtraHashOptions {
}

/**
 * Options related to calculating source hash.
 */
export interface FileFingerprintOptions extends FileCopyOptions, ExtraHashOptions {
}

