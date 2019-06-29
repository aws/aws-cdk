import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');

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

    this.replicationBucket = new s3.Bucket(this, 'CrossRegionCodePipelineReplicationBucket', {
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
  }
}

function generateStackName(props: CrossRegionSupportStackProps): string {
  return `${props.pipelineStackName}-support-${props.region}`;
}
