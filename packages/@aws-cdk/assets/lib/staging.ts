import { AssetStaging } from '@aws-cdk/core';
import { toSymlinkFollow } from './compat';
import { FingerprintOptions } from './fs/options';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Deprecated
 * @deprecated use `core.AssetStagingProps`
 */
export interface StagingProps extends FingerprintOptions {
  /**
   * Local file or directory to stage.
   */
  readonly sourcePath: string;
}

/**
 * Deprecated
 * @deprecated use `core.AssetStaging`
 */
export class Staging extends AssetStaging {
  constructor(scope: Construct, id: string, props: StagingProps) {
    super(scope, id, {
      sourcePath: props.sourcePath,
      exclude: props.exclude,
      ignoreMode: props.ignoreMode,
      extraHash: props.extraHash,
      follow: toSymlinkFollow(props.follow),
    });
  }
}
