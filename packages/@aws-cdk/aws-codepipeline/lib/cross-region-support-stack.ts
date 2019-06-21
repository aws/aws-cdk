import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import crypto = require('crypto');

/**
 * Construction properties for {@link CrossRegionSupportStack}.
 * This interface is private to the aws-codepipeline package.
 */
export interface CrossRegionSupportStackProps {
  /**
   * The name of the Stack the Pipeline itself belongs to.
   * Used to generate a more friendly name for the support Stack.
   */
  readonly pipelineStackName: string;

  /**
   * The AWS region this Stack resides in.
   */
  readonly region: string;

  /**
   * The AWS account ID this Stack belongs to.
   *
   * @example '012345678901'
   */
  readonly account: string;
}

/**
 * A Stack containing resources required for the cross-region CodePipeline functionality to work.
 * This class is private to the aws-codepipeline package.
 */
export class CrossRegionSupportStack extends cdk.Stack {
  /**
   * The name of the S3 Bucket used for replicating the Pipeline's artifacts into the region.
   */
  public readonly replicationBucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string, props: CrossRegionSupportStackProps) {
    super(scope, id, {
      stackName: generateStackName(props),
      env: {
        region: props.region,
        account: props.account,
      },
    });

    const replicationBucketName = generateUniqueName('cdk-cross-region-codepipeline-replication-bucket-',
      props.region, props.account, false, 12);

    this.replicationBucket = new s3.Bucket(this, 'CrossRegionCodePipelineReplicationBucket', {
      bucketName: cdk.PhysicalName.of(replicationBucketName),
    });
  }
}

function generateStackName(props: CrossRegionSupportStackProps): string {
  return `${props.pipelineStackName}-support-${props.region}`;
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
