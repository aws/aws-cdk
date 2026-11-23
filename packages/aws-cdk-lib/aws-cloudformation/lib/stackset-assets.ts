import type { Construct } from 'constructs';
import type * as s3 from '../../aws-s3';
import { Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * The buckets a StackSet copies its file assets to, so that its stack instances can read them
 */
export abstract class StackSetAssets {
  /**
   * Uses one existing bucket per region
   *
   * The name of each bucket must be known at synth time, and its objects must be kept for as
   * long as the StackSet uses them.
   *
   * @param buckets the bucket of each region, keyed by region name (for example `us-east-1`)
   */
  public static fromRegionalBuckets(buckets: { [region: string]: s3.IBucket }): StackSetAssets {
    return new RegionalBucketAssets(buckets);
  }

  /**
   * Binds the asset buckets to the StackSet that uses them
   *
   * @param stackSet the StackSet
   * @internal
   */
  public abstract _bind(stackSet: Construct): StackSetAssetBuckets;
}

/**
 * The asset buckets of a StackSet, looked up by region
 *
 * @internal
 */
export interface StackSetAssetBuckets {
  /**
   * The regions that have a bucket, sorted
   */
  regions(): string[];

  /**
   * The bucket of a region returned by `regions()`
   */
  bucketFor(region: string): s3.IBucket;

  /**
   * Checks the buckets against the regions the StackSet deploys to
   *
   * @param targetRegions the target regions known at synth time
   * @param allResolved whether every target region is known at synth time
   */
  validate(targetRegions: string[], allResolved: boolean): StackSetAssetsValidation;
}

/**
 * The result of checking the asset buckets of a StackSet
 *
 * @internal
 */
export interface StackSetAssetsValidation {
  /**
   * Errors that fail synthesis
   */
  readonly errors: string[];

  /**
   * Warnings, with the ID to acknowledge each
   */
  readonly warnings: Array<{ readonly id: string; readonly message: string }>;
}

const BUCKET_REGION_NOT_TARGETED = '@aws-cdk/aws-cloudformation:stackSetAssetBucketRegionNotTargeted';

class RegionalBucketAssets extends StackSetAssets {
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

  public _bind(_stackSet: Construct): StackSetAssetBuckets {
    // Sorted, so that the order of the regions doesn't change the template
    const regions = Object.keys(this.buckets).sort();
    return {
      regions: () => regions,
      bucketFor: (region) => this.buckets[region],
      validate: (targetRegions, allResolved) => validateRegions(regions, targetRegions, allResolved),
    };
  }
}

/**
 * Every target region needs a bucket, and every bucket should be in a target region
 */
function validateRegions(bucketRegions: string[], targetRegions: string[], allResolved: boolean): StackSetAssetsValidation {
  const errors = targetRegions
    .filter(region => !bucketRegions.includes(region))
    .map(region => `the StackSet deploys to region ${JSON.stringify(region)} but has no asset bucket for it, add a bucket for ${JSON.stringify(region)} to 'StackSetAssets.fromRegionalBuckets()'`);

  // A token might be any of the regions of the buckets
  const untargeted = bucketRegions.filter(region => !targetRegions.includes(region));
  const warnings = allResolved && untargeted.length > 0
    ? [{
      id: BUCKET_REGION_NOT_TARGETED,
      message: `the StackSet doesn't deploy to the regions of the asset buckets ${JSON.stringify(untargeted)}, remove them from 'StackSetAssets.fromRegionalBuckets()' or add a target with these regions`,
    }]
    : [];

  return { errors, warnings };
}
