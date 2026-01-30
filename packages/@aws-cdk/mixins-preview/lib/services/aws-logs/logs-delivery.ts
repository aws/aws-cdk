import { Names, Stack } from 'aws-cdk-lib/core';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct, type IConstruct } from 'constructs';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import { tryFindDeliverySourceForResource } from '../../mixins/private/reflections';
import * as xray from '../aws-xray/policy';
import { IKeyRef } from 'aws-cdk-lib/aws-kms';
import { CloudwatchDeliveryDestination, FirehoseDelvieryDestination, S3DeliveryDestination } from './logs-destination';

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
   * Binds the log delivery to a source resource and creates a delivery connection between the source and destination.
   * @param scope - The construct scope
   * @param logType - The type of logs that the delivery source will produce
   * @param sourceResourceArn - The Arn of the source resource
   * @returns The delivery reference
   */
  bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig;
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
 * Properties for S3 logs destination configuration.
 */
export interface IS3LogsDestinationProps {
  /**
   * KMS key to use for encrypting logs in the S3 bucket.
   *
   * @default - No encryption key is configured
   */
  readonly encryptionKey?: IKeyRef;
}

/**
 * Props for S3LogsDelivery
 */
export interface S3LogsDeliveryProps {
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
  readonly kmsKey?: IKeyRef;
}

/**
 * Delivers vended logs to an S3 Bucket.
 */
export class S3LogsDelivery implements ILogsDelivery {
  private readonly bucket: s3.IBucketRef;
  private readonly permissions: S3LogsDeliveryPermissionsVersion;
  private readonly kmsKey: IKeyRef | undefined;

  /**
   * Creates a new S3 Bucket delivery.
   */
  constructor(bucket: s3.IBucketRef, props: S3LogsDeliveryProps = {}) {
    this.bucket = bucket;
    this.permissions = props.permissionsVersion ?? S3LogsDeliveryPermissionsVersion.V2;
    this.kmsKey = props.kmsKey;
  }

  /**
   * Binds S3 Bucket to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('S3', logType, scope, this.bucket));

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const deliverySourceRef = deliverySource.deliverySourceRef;

    const deliveryDestination = new S3DeliveryDestination(container, 'Dest', {
      bucket: this.bucket, 
      permissionsVersion: this.permissions, 
      encryptionKey: this.kmsKey,
      destinationid: logType.split('_').map(word => word.toLowerCase()).join('-'),
    });

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySourceRef.deliverySourceName,
    });

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
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
   * Binds Firehose Delivery Stream to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('Firehose', logType, scope, this.deliveryStream));

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);

    const deliveryDestination = new FirehoseDelvieryDestination(container, 'Dest', {
      deliveryStream: this.deliveryStream,
      destinationid: logType.split('_').map(word => word.toLowerCase()).join('-'),
    });

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

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
   * Binds Log Group to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('LogGroup', logType, scope, this.logGroup));

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const deliverySourceRef = deliverySource.deliverySourceRef;

    const deliveryDestination= new CloudwatchDeliveryDestination(container, 'Dest', {
      logGroup: this.logGroup,
      destinationid: logType.split('_').map(word => word.toLowerCase()).join('-'),
    });

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.deliveryDestinationRef.deliveryDestinationArn,
      deliverySourceName: deliverySourceRef.deliverySourceName,
    });

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
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
   * Binds X-Ray Destination to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const container = new Construct(scope, deliveryId('XRay', logType, scope, deliverySource));

    const xrayResourcePolicy = this.getOrCreateResourcePolicy(container);
    this.grantLogsDelivery(xrayResourcePolicy, sourceResourceArn);

    const deliveryDestination = new logs.CfnDeliveryDestination(container, 'Dest', {
      name: deliveryDestName('xray', logType, container),
      deliveryDestinationType: 'XRAY',
    });

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });

    deliveryDestination.node.addDependency(xrayResourcePolicy);

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

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

function deliveryId(destType: string, logType: string, ...scopes: IConstruct[]) {
  return `Cdk${destType}${logType.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join('')}Delivery${scopes.map(s => Names.uniqueId(s)).join('')}`;
}

function deliveryDestName(destType: string, logType: string, scope: IConstruct) {
  const prefix = `cdk-${destType}-${logType.split('_').map(word => word.toLowerCase()).join('-')}-dest-`;
  return `${prefix}${Names.uniqueResourceName(scope, { maxLength: 60 - prefix.length })}`;
}

function getOrCreateDeliverySource(logType: string, resource: IConstruct, sourceArn: string) {
  const sourceResource = tryFindDeliverySourceForResource(resource, sourceArn, logType);

  if (!sourceResource) {
    const prefix = `cdk-${logType.split('_').map(word => word.toLowerCase()).join('')}-source-`;
    const newSource = new logs.CfnDeliverySource(resource, `CDKSource${logType}${Names.uniqueId(resource)}`, {
      name: `${prefix}${Names.uniqueResourceName(resource, { maxLength: 60 - prefix.length })}`,
      logType,
      resourceArn: sourceArn,
    });
    return newSource;
  }
  return sourceResource;
}
