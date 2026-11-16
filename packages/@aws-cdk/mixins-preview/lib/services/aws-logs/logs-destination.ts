import type { IEnvironmentAware } from 'aws-cdk-lib/core';
import { Aws, Names, Stack, Tags } from 'aws-cdk-lib/core';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct, IConstruct } from 'constructs';
import type { Grant, IEncryptedResource } from 'aws-cdk-lib/aws-iam';
import { AccountPrincipal, Effect, EncryptedResources, PolicyDocument, PolicyStatement, PrincipalWithConditions, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnKey, KeyGrants, type IKeyRef } from 'aws-cdk-lib/aws-kms';
import type { IBucketRef } from 'aws-cdk-lib/aws-lightsail';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import * as xray from './xray-policy';
import { S3LogsDeliveryPermissionsVersion } from './logs-delivery';

/**
 * Properties that are shared between most delivery destinations
 */
interface DeliveryDestinationProps {
  /**
   * Format of the logs that are sent to this delivery destination
   */
  readonly outputFormat?: string;
}

/**
 * Properties for Delivery Destinations the participate in Cross Account Delivery
 */
interface CrossAccountDestinationProps extends DeliveryDestinationProps {
  /**
   * Optional acount id for account the delivery source is in for cross account Vended Logs
   */
  readonly sourceAccountId?: string;
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
export interface FirehoseDeliveryDestinationProps extends CrossAccountDestinationProps {
  /**
   * Delivery stream to delivery logs to
   */
  readonly deliveryStream: IDeliveryStreamRef;
}

/**
 * Properties for Cloudwatch delivery destination
 */
export interface CloudwatchDeliveryDestinationProps extends DeliveryDestinationProps {
  /**
   * Log group to deliver logs to
   */
  readonly logGroup: logs.ILogGroupRef;
}

/**
 * Properties for XRay delivery destination
 */
export interface XRayDeliveryDestinationProps {
  /**
   * Arn of the source resource
   */
  readonly sourceResource: string;
}

/**
 * Creates an S3 delivery destination for CloudWatch Logs.
 */
export class S3DeliveryDestination extends logs.CfnDeliveryDestination {
  private readonly bucket: IBucketRef;
  private readonly permissions: S3LogsDeliveryPermissionsVersion;
  private readonly sourceAccount: string | undefined;

  constructor(scope: Construct, id: string, props: S3DeliveryDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.bucket.bucketRef.bucketArn,
      name: deliveryDestName('s3', id, scope),
      deliveryDestinationType: 'S3',
      outputFormat: props.outputFormat,
      deliveryDestinationPolicy: props.sourceAccountId ? {
        deliveryDestinationPolicy: deliveryDestCrossAccPolicy(props.sourceAccountId, props.bucket),
      } : undefined,
    });
    this.bucket = props.bucket;
    this.permissions = props.permissionsVersion ? props.permissionsVersion : S3LogsDeliveryPermissionsVersion.V2;
    this.sourceAccount = props.sourceAccountId;
    const bucketPolicy = this.grantLogsDelivery();
    this.node.addDependency(bucketPolicy);

    this.addToEncryptionKeyPolicy(EncryptedResources.of(this.bucket));
  }

  /**
   * Grants permissions for log delivery to the bucket policy.
   * @param policy - The bucket policy
   */
  private grantLogsDelivery(): Grant {
    const account = this.sourceAccount ? this.sourceAccount : this.bucket.env.account;
    const principal = new PrincipalWithConditions(new ServicePrincipal('delivery.logs.amazonaws.com'), {
      StringEquals: {
        's3:x-amz-acl': 'bucket-owner-full-control',
        'aws:SourceAccount': account,
      },
      ArnLike: {
        'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${this.bucket.env.region}:${account}:delivery-source:*`,
      },
    });
    const bucketGrants = s3.BucketGrants.fromBucket(this.bucket).actionsOnObjectKeys(principal, `AWSLogs/${account}/*`, 's3:PutObject');

    if (this.permissions == 'V1') {
      const v1Principal = new PrincipalWithConditions(new ServicePrincipal('delivery.logs.amazonaws.com'), {
        StringEquals: {
          'aws:SourceAccount': account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${this.bucket.env.region}:${account}:*`,
        },
      });
      s3.BucketGrants.fromBucket(this.bucket).actionsOnBucketAndObjectKeys(v1Principal, undefined, 's3:GetBucketAcl', 's3:ListBucket');
    }

    return bucketGrants;
  }

  private addToEncryptionKeyPolicy(encryptedKey: IEncryptedResource | undefined) {
    if (!encryptedKey) {
      return;
    }
    const sourceArnPostfix = this.permissions === S3LogsDeliveryPermissionsVersion.V1 ? '*' : 'delivery-source:*';
    const account = this.sourceAccount ? this.sourceAccount : encryptedKey.env.account;
    const principal = new PrincipalWithConditions(new ServicePrincipal('delivery.logs.amazonaws.com'), {
      StringEquals: {
        'aws:SourceAccount': [account],
      },
      ArnLike: {
        'aws:SourceArn': [`arn:${Aws.PARTITION}:logs:${encryptedKey.env.region}:${account}:${sourceArnPostfix}`],
      },
    },
    );
    const actions = this.sourceAccount ? ['kms:GenerateDataKey*'] : ['kms:Encrypt', 'kms:Decrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*', 'kms:DescribeKey'];
    if (encryptedKey instanceof CfnKey) {
      const keyGrant = KeyGrants.fromKey(encryptedKey);
      keyGrant.actions(principal, ...actions);
    } else {
      encryptedKey.grantOnKey(principal, ...actions);
    }
  }
}

/**
 * Firehose delivery destination for CloudWatch Logs.
 */
export class FirehoseDeliveryDestination extends logs.CfnDeliveryDestination {
  constructor(scope: Construct, id: string, props: FirehoseDeliveryDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: deliveryDestName('fh', id, scope),
      deliveryDestinationType: 'FH',
      outputFormat: props.outputFormat,
      deliveryDestinationPolicy: props.sourceAccountId ? {
        deliveryDestinationPolicy: deliveryDestCrossAccPolicy(props.sourceAccountId, props.deliveryStream),
      } : undefined,
    });

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
  }
}

/**
 * CloudWatch delivery destination for CloudWatch Logs.
 */
export class CloudwatchDeliveryDestination extends logs.CfnDeliveryDestination {
  private readonly logGroup: logs.ILogGroupRef;

  constructor(scope: Construct, id: string, props: CloudwatchDeliveryDestinationProps) {
    super(scope, id, {
      destinationResourceArn: props.logGroup.logGroupRef.logGroupArn,
      name: deliveryDestName('cwl', id, scope),
      deliveryDestinationType: 'CWL',
      outputFormat: props.outputFormat,
    });
    this.logGroup = props.logGroup;

    const logPolicy = this.grantLogsDelivery();
    this.node.addDependency(logPolicy);
  }

  /**
   * Grants permissions for log delivery to the resource policy.
   * @param policy - The resource policy
   */
  private grantLogsDelivery(): Grant {
    const stack = Stack.of(this.logGroup);
    const principal = new PrincipalWithConditions(new ServicePrincipal('delivery.logs.amazonaws.com'), {
      StringEquals: {
        'aws:SourceAccount': stack.account,
      },
      ArnLike: {
        'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:*`,
      },
    });
    const logGrants = logs.LogGroupGrants.fromLogGroup(this.logGroup);
    return logGrants.write(principal);
  }
}

/**
 * XRay delivery destination for XRay traces.
 */
export class XRayDeliveryDestination extends logs.CfnDeliveryDestination {
  constructor(scope: Construct, id: string, props: XRayDeliveryDestinationProps) {
    super(scope, id, {
      name: deliveryDestName('xray', id, scope),
      deliveryDestinationType: 'XRAY',
    });

    const xrayResourcePolicy = this.getOrCreateResourcePolicy(scope);
    this.grantLogsDelivery(xrayResourcePolicy, props.sourceResource);
    this.node.addDependency(xrayResourcePolicy);
  }

  /**
   * Gets or creates a singleton X-Ray resource policy.
   *
   * @param scope - The construct scope
   * @returns The X-Ray resource policy
   */
  private getOrCreateResourcePolicy(scope: IConstruct): xray.ResourcePolicy {
    const stack = Stack.of(scope);
    const policyId = 'CdkXRayLogsDeliveryPolicy';

    // Singleton policy per stack
    const existingPolicy = stack.node.tryFindChild(policyId) as xray.ResourcePolicy;

    return existingPolicy ?? new xray.ResourcePolicy(stack, policyId);
  }

  /**
   * Grants permissions for log delivery to resource policy.
   * @param policy - The resource policy
   */
  private grantLogsDelivery(policy: xray.ResourcePolicy, sourceResourceArn: string): void {
    const stack = Stack.of(policy);

    policy.document.addStatements( new PolicyStatement({
      sid: 'CDKLogsDeliveryWrite',
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['xray:PutTraceSegments'],
      resources: ['*'],
      conditions: {
        'ForAllValues:ArnLike': {
          'logs:LogGeneratingResourceArns': [sourceResourceArn],
        },
        'StringEquals': {
          'aws:SourceAccount': stack.account,
        },
        'ArnLike': {
          'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:delivery-source:*`,
        },
      },
    }));
  }
}

function deliveryDestName(destType: string, id: string, scope: IConstruct) {
  const prefix = `cdk-${destType}-${id}-dest-`;
  return `${prefix}${Names.uniqueResourceName(scope, { maxLength: 60 - prefix.length })}`;
}

function deliveryDestCrossAccPolicy(sourceAccount: string, destEnv: IEnvironmentAware) {
  return new PolicyDocument({
    statements: [new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new AccountPrincipal(sourceAccount)],
      actions: ['logs:CreateDelivery'],
      resources: [`arn:${Aws.PARTITION}:logs:${destEnv.env.region}:${destEnv.env.account}:delivery-destination:*`],
    })],
  }).toJSON();
}
