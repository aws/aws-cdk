import { Names, Stack, Tags } from 'aws-cdk-lib/core';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import { tryFindBucketPolicyForBucket } from '../../mixins/private/reflections';
import { ConstructSelector, Mixins } from '../../core';
import { BucketPolicyStatementsMixins } from '../../mixins/private/s3';
import * as xray from '../aws-xray/policy';

/**
 * The individual elements of a logs delivery integration.
 */
export interface ILogsDeliveryConfig {
  /**
   * The logs delivery source.
   */
  readonly deliverySource: logs.IDeliverySourceRef;
  /**
   *  The logs delivery destination.
   */
  readonly deliveryDestination: logs.IDeliveryDestinationRef;
  /**
   *  The logs delivery
   */
  readonly delivery: logs.IDeliveryRef;
}

/**
 * Represents the delivery of vended logs to a destination.
 */
export interface ILogsDelivery {
  /**
   * Binds the destination to a delivery source and creates a delivery connection between the source and destination.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @param sourceResourceArn - The Arn of the source resource
   * @returns The delivery reference
   */
  bind(scope: IConstruct, deliverySource: logs.IDeliverySourceRef, sourceResourceArn: string): ILogsDeliveryConfig;
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
 * Props for S3LogsDelivery
 */
export interface S3LogsDeliveryProps {
  /**
   * The permissions version ('V1' or 'V2') to be used for this delivery.
   * Depending on the source of the logs, different permissions are required.
   *
   * @default "V2
   */
  readonly permissionsVersion?: S3LogsDeliveryPermissionsVersion;
}

/**
 * Delivers vended logs to an S3 Bucket.
 */
export class S3LogsDelivery implements ILogsDelivery {
  private readonly bucket: s3.IBucketRef;
  private readonly permissions: 'V1' | 'V2';

  /**
   * Creates a new S3 Bucket delivery.
   */
  constructor(bucket: s3.IBucketRef, props: S3LogsDeliveryProps = {}) {
    this.bucket = bucket;
    this.permissions = props.permissionsVersion ?? 'V2';
  }

  /**
   * Binds the S3 destination to a delivery source and creates a delivery connection between them.
   */
  public bind(scope: IConstruct, deliverySource: logs.IDeliverySourceRef, _sourceResourceArn: string): ILogsDeliveryConfig {
    const bucketPolicy = this.getOrCreateBucketPolicy(scope);
    this.grantLogsDelivery(bucketPolicy);

    const destinationNamePrefix = 'cdk-s3-dest-';
    const deliveryDestination = new logs.CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(this.bucket)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.bucket.bucketRef.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'S3',
    });
    deliveryDestination.node.addDependency(bucketPolicy);

    const delivery = new logs.CfnDelivery(scope, `CDKS3Delivery${Names.uniqueId(this.bucket)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
  }

  /**
   * Gets or creates a bucket policy for the S3 destination Bucket.
   * @param scope - The construct scope
   * @returns The bucket policy
   */
  private getOrCreateBucketPolicy(scope: IConstruct): s3.CfnBucketPolicy {
    const existingPolicy = tryFindBucketPolicyForBucket(this.bucket);

    return existingPolicy ?? new s3.CfnBucketPolicy(scope, `CDKS3DestPolicy${Names.uniqueId(this.bucket)}`, {
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
      .apply(new BucketPolicyStatementsMixins(statements));
  }
}

/**
 * Delivers vended logs to a Firehose Delivery Stream.
 */
export class FirehoseLogsDelivery implements ILogsDelivery {
  private readonly deliveryStream: IDeliveryStreamRef;

  /**
   * Creates a new Firehose delivery.
   * @param stream - The Kinesis Data Firehose delivery stream
   */
  constructor(stream: IDeliveryStreamRef) {
    this.deliveryStream = stream;
  }

  /**
   * Binds the Firehose destination to a delivery source and creates a delivery connection between them.
   */
  public bind(scope: IConstruct, deliverySource: logs.IDeliverySourceRef, _sourceResourceArn: string): ILogsDeliveryConfig {
    // Firehose uses a service-linked role to deliver logs
    // This tag marks the destination stream as an allowed destination for the service-linked role
    Tags.of(this.deliveryStream).add('LogDeliveryEnabled', 'true');

    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new logs.CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'FH',
    });

    const delivery = new logs.CfnDelivery(scope, `CDKFHDelivery${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
  }
}

/**
 * Delivers vended logs to a CloudWatch Log Group.
 */
export class LogGroupLogsDelivery implements ILogsDelivery {
  private readonly logGroup: logs.ILogGroupRef;

  /**
   * Creates a new log group delivery.
   * @param logGroup - The CloudWatch Logs log group reference
   */
  constructor(logGroup: logs.ILogGroupRef) {
    this.logGroup = logGroup;
  }

  /**
   * Binds the log group destination to a delivery source and creates a delivery connection between them.
   */
  public bind(scope: IConstruct, deliverySource: logs.IDeliverySourceRef, _sourceResourceArn: string): ILogsDeliveryConfig {
    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope);
    this.grantLogsDelivery(logGroupPolicy);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new logs.CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(this.logGroup)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.logGroup.logGroupRef.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'CWL',
    });
    deliveryDestination.node.addDependency(logGroupPolicy);

    const delivery = new logs.CfnDelivery(scope, `CDKCWLDelivery${Names.uniqueId(this.logGroup)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
  }

  /**
   * Gets or creates a singleton Logs Resource Policy.
   * @param scope - The construct scope
   * @returns The resource policy
   */
  private getOrCreateLogsResourcePolicy(scope: IConstruct): logs.ResourcePolicy {
    const stack = Stack.of(scope);
    const policyId = 'CDKCWLDestPolicy';

    // Singleton policy per stack
    const existingPolicy = stack.node.tryFindChild(policyId) as logs.ResourcePolicy;

    return existingPolicy ?? new logs.ResourcePolicy(stack, policyId, {
      resourcePolicyName: 'LogGroupLogsDeliveryPolicy',
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

/**
 * Delivers vended logs to AWS X-Ray.
 */
export class XRayLogsDelivery implements ILogsDelivery {
  /**
   * Creates a new X-Ray delivery.
   */
  constructor() {}

  /**
   * Binds the X-Ray destination to a delivery source and creates a delivery connection between them.
   */
  public bind(scope: IConstruct, deliverySource: logs.IDeliverySourceRef, sourceResourceArn: string): ILogsDeliveryConfig {
    const xrayResourcePolicy = this.getOrCreateResourcePolicy(scope);
    this.grantLogsDelivery(xrayResourcePolicy, sourceResourceArn);

    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new logs.CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(scope)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });

    const delivery = new logs.CfnDelivery(scope, `CDKXRAYDelivery${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
  }

  /**
   * Gets or creates a singleton X-Ray resource policy.
   *
   * @param scope - The construct scope
   * @returns The X-Ray resource policy
   */
  private getOrCreateResourcePolicy(scope: IConstruct): xray.ResourcePolicy {
    const stack = Stack.of(scope);
    const policyId = 'CDKXRAYDestPolicy';

    // Singleton policy per stack
    const existingPolicy = stack.node.tryFindChild(policyId) as xray.ResourcePolicy;

    return existingPolicy ?? new xray.ResourcePolicy(stack, policyId, {
      resourcePolicyName: 'XRayLogsDeliveryPolicy',
    });
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
