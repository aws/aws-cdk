import type { Construct } from 'constructs';
import type * as s3 from '../../aws-s3';
import { Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * The buckets a StackSet copies its file assets to, so that its stack instances can read them
 */
export abstract class StackSetAssetBuckets {
  /**
   * Uses one existing bucket per region
   *
   * The name of each bucket must be known at synth time, and its objects must be kept for as
   * long as the StackSet uses them.
   *
   * @param buckets the bucket of each region, keyed by region name (for example `us-east-1`)
   */
  public static fromRegionalBuckets(buckets: { [region: string]: s3.IBucket }): StackSetAssetBuckets {
    return new RegionalBuckets(buckets);
  }

  /**
   * Binds the asset buckets to the StackSet that uses them
   *
   * @param scope the StackSet
   * @internal
   */
  public abstract _bind(scope: Construct): StackSetAssetBucketsConfig;
}

/**
 * The asset buckets of a StackSet
 *
 * @internal
 */
export interface StackSetAssetBucketsConfig {
  /**
   * The bucket of each region, keyed by region name
   */
  readonly buckets: { [region: string]: s3.IBucket };
}

class RegionalBuckets extends StackSetAssetBuckets {
  constructor(private readonly buckets: { [region: string]: s3.IBucket }) {
    super();

    const regions = Object.keys(buckets);
    if (regions.length === 0) {
      throw new UnscopedValidationError(lit`StackSetAssetBucketsEmpty`, 'fromRegionalBuckets requires at least one region and bucket');
    }
    for (const region of regions) {
      if (Token.isUnresolved(region)) {
        throw new UnscopedValidationError(lit`StackSetAssetBucketRegionUnresolved`,
          `the regions of the asset buckets must be region names known at synth time, got ${JSON.stringify(region)}`);
      }
    }
  }

  public _bind(_scope: Construct): StackSetAssetBucketsConfig {
    return { buckets: { ...this.buckets } };
  }
}
