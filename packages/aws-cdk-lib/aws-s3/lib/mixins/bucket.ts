import type { IConstruct } from 'constructs';
import { Mixin } from '../../../core/lib/mixins';
import { BlockPublicAccess, type BlockPublicAccessOptions } from '../bucket';
import { CfnBucket } from '../s3.generated';

/**
 * S3-specific mixin for enabling versioning.
 */
export class BucketVersioning extends Mixin {
  constructor(private readonly enabled = true) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    construct.versioningConfiguration = {
      status: this.enabled ? 'Enabled' : 'Suspended',
    };
  }
}

/**
 * S3-specific mixin for blocking public-access.
 */
export class BucketBlockPublicAccess extends Mixin {
  private readonly configOptions: BlockPublicAccessOptions;

  constructor(publicAccessConfig: BlockPublicAccess = BlockPublicAccess.BLOCK_ALL) {
    super();
    this.configOptions = {
      blockPublicAcls: publicAccessConfig.blockPublicAcls,
      blockPublicPolicy: publicAccessConfig.blockPublicPolicy,
      ignorePublicAcls: publicAccessConfig.ignorePublicAcls,
      restrictPublicBuckets: publicAccessConfig.restrictPublicBuckets,
    };
  }

  public supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    construct.publicAccessBlockConfiguration = {
      blockPublicAcls: this.configOptions.blockPublicAcls ?? true,
      blockPublicPolicy: this.configOptions.blockPublicPolicy ?? true,
      ignorePublicAcls: this.configOptions.ignorePublicAcls ?? true,
      restrictPublicBuckets: this.configOptions.restrictPublicBuckets ?? true,
    };
  }
}
