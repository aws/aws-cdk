import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');

const REQUIRED_ALIAS_PREFIX = 'alias/';

/**
 * A class needed to work around CodePipeline's extremely small (100 characters)
 * limit for the name/ARN of the key in the ArtifactStore.
 * Limits the length of the alias' auto-generated name to 50 characters.
 */
class AliasWithShorterGeneratedName extends kms.Alias {
  protected generatePhysicalName(): string {
    let baseName = super.generatePhysicalName();
    if (baseName.startsWith(REQUIRED_ALIAS_PREFIX)) {
      // remove the prefix, because we're taking the last characters of the name below
      baseName = baseName.substring(REQUIRED_ALIAS_PREFIX.length);
    }
    const maxLength = 50 - REQUIRED_ALIAS_PREFIX.length;
    // take the last characters, as they include the hash,
    // and so have a higher chance of not colliding
    return REQUIRED_ALIAS_PREFIX + lastNCharacters(baseName, maxLength);
  }
}

function lastNCharacters(str: string, n: number) {
  const startIndex = Math.max(str.length - n, 0);
  return str.substring(startIndex);
}

export class CrossRegionSupportConstruct extends cdk.Construct {
  public readonly replicationBucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const encryptionKey = new kms.Key(this, 'CrossRegionCodePipelineReplicationBucketEncryptionKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const encryptionAlias = new AliasWithShorterGeneratedName(this, 'CrossRegionCodePipelineReplicationBucketEncryptionAlias', {
      targetKey: encryptionKey,
      aliasName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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
