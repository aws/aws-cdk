import type { Construct } from 'constructs';
import { toSymlinkFollow } from './compat';
import type { FingerprintOptions } from './fs/options';
import { AssetStaging } from '../../core';

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
