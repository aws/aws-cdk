import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import crypto = require('crypto');

/**
 * Construction properties for {@link CrossRegionScaffoldStack}.
 */
export interface CrossRegionScaffoldStackProps {
  /**
   * The AWS region this Stack resides in.
   */
  region: string;

  /**
   * The AWS account ID this Stack belongs to.
   *
   * @example '012345678901'
   */
  account: string;
}

/**
 * A Stack containing resources required for the cross-region CodePipeline functionality to work.
 */
export class CrossRegionScaffoldStack extends cdk.Stack {
  /**
   * The name of the S3 Bucket used for replicating the Pipeline's artifacts into the region.
   */
  public readonly replicationBucketName: string;

  constructor(parent?: cdk.App, props: CrossRegionScaffoldStackProps = defaultCrossRegionScaffoldStackProps()) {
    super(parent, generateStackName(props), {
      env: {
        region: props.region,
        account: props.account,
      },
    });

    const replicationBucketName = generateUniqueName('cdk-cross-region-codepipeline-replication-bucket-',
      props.region, props.account, false, 12);

    new s3.Bucket(this, 'CrossRegionCodePipelineReplicationBucket', {
      bucketName: replicationBucketName,
    });
    this.replicationBucketName = replicationBucketName;
  }
}

function generateStackName(props: CrossRegionScaffoldStackProps): string {
  return `aws-cdk-codepipeline-cross-region-scaffolding-${props.region}`;
}

function generateUniqueName(baseName: string, region: string, account: string,
                            toUpperCase: boolean, hashPartLen: number = 8): string {
  const sha256 = crypto.createHash('sha256')
    .update(baseName)
    .update(region)
    .update(account);

  const hash = sha256.digest('hex').slice(0, hashPartLen);

  return baseName + (toUpperCase ? hash.toUpperCase() : hash.toLowerCase());
}

// purely to defeat the limitation that a required argument cannot follow an optional one
function defaultCrossRegionScaffoldStackProps(): CrossRegionScaffoldStackProps {
  throw new Error('The props argument when creating a CrossRegionScaffoldStack is required');
}
