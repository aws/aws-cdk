import { Aws, Names, Stack, Tags } from 'aws-cdk-lib/core';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct, IConstruct } from 'constructs';
import { tryFindBucketPolicyForBucket, tryFindKmsKeyConstruct, tryFindKmsKeyforBucket } from '../../mixins/private/reflections';
import { ConstructSelector, Mixins } from '../../core';
import { BucketPolicyStatementsMixin } from '../aws-s3/bucket-policy';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnKey, IKeyRef } from 'aws-cdk-lib/aws-kms';
import { IBucketRef } from 'aws-cdk-lib/aws-lightsail';
import { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';

/**
 * Properties for Delivery Destinations
 */
interface DestinationProps {
  /**
   * Optional Identifer to help identify a delivery destination
   */
  readonly destinationid?: string;
}

/**
 * Properties for Delivery Destinations the participate in Cross Account Delivery
 */
interface CrossAccountDestinationProps extends DestinationProps {
  /**
   * Optional acount id for account the delivery source is in for cross account Vended Logs
   */
  readonly sourceAccountId?: string; // may also need to region for the source as well...
}

/**
 * S3 Vended Logs Permissions version.
 */
export enum S3LogsDeliveryPermissionsVersion {
  /**
   * V1
   */
  V1 = 'V1',
  /**
   * V2
   */
  V2 = 'V2',
}

/**
 * Properties for S3 delivery destination.
 */
export interface S3DeliveryDestinationProps extends CrossAccountDestinationProps {
  /**
   * The S3 bucket to deliver logs to.
   */
  readonly bucket: s3.IBucketRef;
  /**
   * The permissions version ('V1' or 'V2') to be used for this delivery.
   * Depending on the source of the logs, different permissions are required.
   *
   * @default "V2"
   */
  readonly permissionsVersion?: S3LogsDeliveryPermissionsVersion;
  /**
   * KMS key to use for encrypting logs in the S3 bucket.
   * When provided, grants the logs delivery service permissions to use the key.
   *
   * @default - No encryption key is configured
   */
  readonly encryptionKey?: IKeyRef;
}

/**
 * Properties for Firehose delivery destination
 */
interface FirehoseDestinationProps extends CrossAccountDestinationProps {
  /**
   * Delivery stream to delivery logs to
   */
  readonly deliveryStream: IDeliveryStreamRef;
}

/**
 * Properties for Cloudwatch delivery destination
 */
interface CloudwatchDestinationProps extends DestinationProps {
  /**
   * Log group to deliver logs to
   */
  readonly logGroup: logs.ILogGroupRef;
}

/**
 * Creates an S3 delivery destination for CloudWatch Logs.
 */
export class S3DeliveryDestination extends logs.CfnDeliveryDestination {
  private readonly bucket: IBucketRef;
  private readonly permissions: S3LogsDeliveryPermissionsVersion;
  private readonly kmsKey: IKeyRef | undefined;

  constructor(scope: Construct, id: string, props: S3DeliveryDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.bucket.bucketRef.bucketArn,
      name: deliveryDestName('s3', props.destinationid ? props.destinationid : id, scope), // not entirely sure how I feel about this id business...mostly I may need to restrict the length of the id a customer can pass in
      deliveryDestinationType: 'S3',
    });
    this.bucket = props.bucket;
    this.permissions = props.permissionsVersion ? props.permissionsVersion : S3LogsDeliveryPermissionsVersion.V2;
    this.kmsKey = props.encryptionKey;
    const bucketPolicy = this.getOrCreateBucketPolicy(scope);
    this.grantLogsDelivery(bucketPolicy);
    this.node.addDependency(bucketPolicy);

    const kmsKey = this.findEncryptionKey();
    if (kmsKey) {
      this.addToEncryptionKeyPolicy(kmsKey);
    }
  }

  /**
   * Gets or creates a bucket policy for the S3 destination Bucket.
   * @param scope - The construct scope
   * @returns The bucket policy
   */
  private getOrCreateBucketPolicy(scope: IConstruct): s3.CfnBucketPolicy {
    const existingPolicy = tryFindBucketPolicyForBucket(this.bucket);

    return existingPolicy ?? new s3.CfnBucketPolicy(scope, 'BucketPolicy', {
      bucket: this.bucket.bucketRef.bucketName,
      policyDocument: { // needed to create an empty policy document, otherwise a validation error is thrown
        Version: '2012-10-17',
        Statement: [],
      },
    });
  }

  /**
   * Grants permissions for log delivery to the bucket policy.
   * @param policy - The bucket policy
   */
  private grantLogsDelivery(policy: s3.CfnBucketPolicy): void {
    const stack = Stack.of(policy);

    // always required permissions
    const statements = [
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [`${this.bucket.bucketRef.bucketArn}/AWSLogs/${stack.account}/*`],
        conditions: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
            'aws:SourceAccount': stack.account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:delivery-source:*`,
          },
        },
      }),
    ];

    if (this.permissions == 'V1') {
      statements.push(new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [this.bucket.bucketRef.bucketArn],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': stack.account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:*`,
          },
        },
      }));
    }

    Mixins.of(policy, ConstructSelector.onlyItself())
      .apply(new BucketPolicyStatementsMixin(statements));
  }

  private findEncryptionKey(): CfnKey | undefined {
    if (this.kmsKey) {
      return tryFindKmsKeyConstruct(this.kmsKey);
    }
    return tryFindKmsKeyforBucket(this.bucket);
  }

  private addToEncryptionKeyPolicy(key: CfnKey) {
    const existingKeyPolicy = key.keyPolicy;
    const sourceArnPostfix = this.permissions === S3LogsDeliveryPermissionsVersion.V1 ? '*' : 'delivery-source:*';
    const sid = 'AWS CDK: Allow Logs Delivery to use the key';
    const keyStatement = new PolicyStatement({
      sid,
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['kms:Encrypt', 'kms:Decrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*', 'kms:DescribeKey'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': [key.env.account],
        },
        ArnLike: {
          'aws:SourceArn': [`arn:${Aws.PARTITION}:logs:${key.env.region}:${key.env.account}:${sourceArnPostfix}`],
        },
      },
    });
    if (!existingKeyPolicy) {
      key.keyPolicy = new PolicyDocument({
        statements: [keyStatement],
      });
      return;
    }
    // Check if a statement with this SID already exists
    const hasDuplicateSid = existingKeyPolicy.statements.some((stmt: PolicyStatement) => stmt.sid === sid);
    if (hasDuplicateSid) {
      return;
    }

    existingKeyPolicy.addStatements(keyStatement);
  }
}

export class FirehoseDelvieryDestination extends logs.CfnDeliveryDestination {
  constructor(scope: Construct, id: string, props: FirehoseDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: deliveryDestName('fh', props.destinationid ? props.destinationid : id, scope),
      deliveryDestinationType: 'FH',
    });

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
  }
}

export class CloudwatchDeliveryDestination extends logs.CfnDeliveryDestination {
  private readonly logGroup: logs.ILogGroupRef;

  constructor(scope: Construct, id: string, props: CloudwatchDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.logGroup.logGroupRef.logGroupArn,
      name: deliveryDestName('cwl', props.destinationid ? props.destinationid : id, scope),
      deliveryDestinationType: 'CWL',
    });
    this.logGroup = props.logGroup;

    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope);
    this.grantLogsDelivery(logGroupPolicy);
    this.node.addDependency(logGroupPolicy);
  }

  /**
   * Gets or creates a singleton Logs Resource Policy.
   * @param scope - The construct scope
   * @returns The resource policy
   */
  private getOrCreateLogsResourcePolicy(scope: IConstruct): logs.ResourcePolicy {
    const stack = Stack.of(scope);
    const policyId = 'CdkLogGroupLogsDeliveryPolicy';

    // Singleton policy per stack
    const existingPolicy = stack.node.tryFindChild(policyId) as logs.ResourcePolicy;

    return existingPolicy ?? new logs.ResourcePolicy(stack, policyId, {
      resourcePolicyName: Names.uniqueResourceName(scope, { maxLength: 255 }),
    });
  }

  /**
   * Grants permissions for log delivery to the resource policy.
   * @param policy - The resource policy
   */
  private grantLogsDelivery(policy: logs.ResourcePolicy): void {
    const stack = Stack.of(policy);

    policy.document.addStatements(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${this.logGroup.logGroupRef.logGroupArn}:log-stream:*`],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': stack.account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:*`,
        },
      },
    }));
  }
}

function deliveryDestName(destType: string, id: string, scope: IConstruct) {
  const prefix = `cdk-${destType}-${id}-dest-`;
  return `${prefix}${Names.uniqueResourceName(scope, { maxLength: 60 - prefix.length })}`;
}
