import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');

export class CrossRegionSupportConstruct extends cdk.Construct {
  public readonly replicationBucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const encryptionKey = new kms.Key(this, 'CrossRegionCodePipelineReplicationBucketEncryptionKey');
    const encryptionAlias = new kms.Alias(this, 'CrossRegionCodePipelineReplicationBucketEncryptionAlias', {
      targetKey: encryptionKey,
      aliasName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    this.replicationBucket = new s3.Bucket(this, 'CrossRegionCodePipelineReplicationBucket', {
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      encryptionKey: encryptionAlias,
    });
  }
}

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

    const crossRegionSupportConstruct = new CrossRegionSupportConstruct(this, 'Default');
    this.replicationBucket = crossRegionSupportConstruct.replicationBucket;
  }
}

function generateStackName(props: CrossRegionSupportStackProps): string {
  return `${props.pipelineStackName}-support-${props.region}`;
}
