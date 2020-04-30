import { AssetStaging, Construct, SymlinkFollowMode } from '@aws-cdk/core';
import { FollowMode } from './fs/follow-mode';
import { FingerprintOptions } from './fs/options';

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
      extraHash: props.extraHash,
      follow: toSymlinkFollow(props.follow),
    });
  }
}

function toSymlinkFollow(follow?: FollowMode): SymlinkFollowMode | undefined {
  if (!follow) {
    return undefined;
  }

  switch (follow) {
    case FollowMode.NEVER: return SymlinkFollowMode.NEVER;
    case FollowMode.ALWAYS: return SymlinkFollowMode.ALWAYS;
    case FollowMode.BLOCK_EXTERNAL: return SymlinkFollowMode.BLOCK_EXTERNAL;
    case FollowMode.EXTERNAL: return SymlinkFollowMode.EXTERNAL;
    default:
      throw new Error(`unknown follow mode: ${follow}`);
  }
}