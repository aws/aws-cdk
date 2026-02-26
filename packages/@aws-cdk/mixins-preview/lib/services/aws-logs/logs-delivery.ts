import { Aws, Names, Stack, Tags } from 'aws-cdk-lib/core';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct, type IConstruct } from 'constructs';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import { tryFindBucketPolicyForBucket, tryFindDeliverySourceForResource, tryFindKmsKeyConstruct, tryFindKmsKeyforBucket } from '../../mixins/private/reflections';
import { ConstructSelector, Mixins } from '../../core';
import * as xray from '../aws-xray/policy';
import { BucketPolicyStatementsMixin } from '../aws-s3/bucket-policy';
import type { CfnKey, IKeyRef } from 'aws-cdk-lib/aws-kms';

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
 * Props for RecordFields involved in log delivery
 */
export interface RecordFieldDeliveryProps {
  /**
   * RecordFields the user has defined to be used in log delivery
   *
   * @defualt - no fields were provided
   */
  readonly providedFields?: string[];
  /**
   * Any recordFields that a mandatory to be included in a log delivery of a certain log type
   *
   * @default - log type has no mandatory fields
   */
  readonly mandatoryFields?: string[];
}

/**
 * Props for Log Deliveries
 */
export interface DeliveryProps extends RecordFieldDeliveryProps {
  /**
   * Format of the logs that are sent to the delivery destination specified
   *
   * @defualt - undefined, use whatever default the delivery destination specifies
   */
  readonly outputFormat?: string;
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
export interface S3LogsDeliveryProps extends DeliveryProps {
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
  private readonly outputFormat: string | undefined;
  private readonly providedFields: string[] | undefined;
  private readonly mandatoryFields: string[] | undefined;

  /**
   * Creates a new S3 Bucket delivery.
   */
  constructor(bucket: s3.IBucketRef, props: S3LogsDeliveryProps = {}) {
    this.bucket = bucket;
    this.permissions = props.permissionsVersion ?? S3LogsDeliveryPermissionsVersion.V2;
    this.kmsKey = props.kmsKey;
    this.outputFormat = props.outputFormat;
    this.providedFields = props.providedFields;
    this.mandatoryFields = props.mandatoryFields;
  }

  /**
   * Binds S3 Bucket to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('S3', logType, scope, this.bucket));

    const bucketPolicy = this.getOrCreateBucketPolicy(container);
    this.grantLogsDelivery(bucketPolicy);

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const deliverySourceRef = deliverySource.deliverySourceRef;

    const kmsKey = this.findEncryptionKey();
    if (kmsKey) {
      this.addToEncryptionKeyPolicy(kmsKey);
    }

    const deliveryDestination = new logs.CfnDeliveryDestination(container, 'Dest', {
      destinationResourceArn: this.bucket.bucketRef.bucketArn,
      name: deliveryDestName('s3', logType, container),
      deliveryDestinationType: 'S3',
      outputFormat: this.outputFormat,
    });

    const recordFields = computeRecordFields(this.providedFields, this.mandatoryFields);

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySourceRef.deliverySourceName,
      recordFields,
    });

    deliveryDestination.node.addDependency(bucketPolicy);

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

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

/**
 * Delivers vended logs to a Firehose Delivery Stream.
 */
export class FirehoseLogsDelivery implements ILogsDelivery {
  private readonly deliveryStream: IDeliveryStreamRef;
  private readonly outputFormat: string | undefined;
  private readonly providedFields: string[] | undefined;
  private readonly mandatoryFields: string[] | undefined;

  /**
   * Creates a new Firehose delivery.
   * @param stream - The Kinesis Data Firehose delivery stream
   */
  constructor(stream: IDeliveryStreamRef, props: DeliveryProps = {}) {
    this.deliveryStream = stream;
    this.outputFormat = props.outputFormat;
    this.providedFields = props.providedFields;
    this.mandatoryFields = props.mandatoryFields;
  }

  /**
   * Binds Firehose Delivery Stream to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('Firehose', logType, scope, this.deliveryStream));

    // Firehose uses a service-linked role to deliver logs
    // This tag marks the destination stream as an allowed destination for the service-linked role
    Tags.of(this.deliveryStream).add('LogDeliveryEnabled', 'true');

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);

    const deliveryDestination = new logs.CfnDeliveryDestination(container, 'Dest', {
      destinationResourceArn: this.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: deliveryDestName('fh', logType, container),
      deliveryDestinationType: 'FH',
      outputFormat: this.outputFormat,
    });

    const recordFields = computeRecordFields(this.providedFields, this.mandatoryFields);

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
      recordFields,
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
  private readonly outputFormat: string | undefined;
  private readonly providedFields: string[] | undefined;
  private readonly mandatoryFields: string[] | undefined;

  /**
   * Creates a new log group delivery.
   * @param logGroup - The CloudWatch Logs log group reference
   */
  constructor(logGroup: logs.ILogGroupRef, props: DeliveryProps = {}) {
    this.logGroup = logGroup;
    this.outputFormat = props.outputFormat;
    this.providedFields = props.providedFields;
    this.mandatoryFields = props.mandatoryFields;
  }

  /**
   * Binds Log Group to a source resource for the purposes of log delivery and creates a delivery source, a delivery destination, and a connection between them.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const container = new Construct(scope, deliveryId('LogGroup', logType, scope, this.logGroup));

    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const deliverySourceRef = deliverySource.deliverySourceRef;

    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(container);
    this.grantLogsDelivery(logGroupPolicy);

    const deliveryDestination = new logs.CfnDeliveryDestination(container, 'Dest', {
      destinationResourceArn: this.logGroup.logGroupRef.logGroupArn,
      name: deliveryDestName('cwl', logType, container),
      deliveryDestinationType: 'CWL',
      outputFormat: this.outputFormat,
    });

    const recordFields = computeRecordFields(this.providedFields, this.mandatoryFields);

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.deliveryDestinationRef.deliveryDestinationArn,
      deliverySourceName: deliverySourceRef.deliverySourceName,
      recordFields,
    });

    delivery.node.addDependency(deliverySource);
    delivery.node.addDependency(deliveryDestination);

    deliveryDestination.node.addDependency(logGroupPolicy);

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

/**
 * Delivers vended logs to AWS X-Ray.
 */
export class XRayLogsDelivery implements ILogsDelivery {
  private readonly providedFields: string[] | undefined;
  private readonly mandatoryFields: string[] | undefined;

  /**
   * Creates a new X-Ray delivery.
   */
  constructor(props: RecordFieldDeliveryProps = {}) {
    this.providedFields = props.providedFields;
    this.mandatoryFields = props.mandatoryFields;
  }

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

    const recordFields = computeRecordFields(this.providedFields, this.mandatoryFields);

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
      recordFields,
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

/**
 * Delivers vended logs to a CfnDeliveryDestination specified by an arn.
 */
export class DestinationLogsDelivery implements ILogsDelivery {
  private readonly providedFields: string[] | undefined;
  private readonly mandatoryFields: string[] | undefined;

  /**
   * Creates a new Destination delivery.
   */
  private readonly destination: logs.IDeliveryDestinationRef;
  constructor(destination: logs.IDeliveryDestinationRef, props: RecordFieldDeliveryProps = {}) {
    this.destination = destination;
    this.providedFields = props.providedFields;
    this.mandatoryFields = props.mandatoryFields;
  }

  /**
   * Binds Delivery Destination to a source resource for the purposes of log delivery and creates a delivery source and a connection between the source and the destination.
   */
  public bind(scope: IConstruct, logType: string, sourceResourceArn: string): ILogsDeliveryConfig {
    const deliverySource = getOrCreateDeliverySource(logType, scope, sourceResourceArn);
    const uniqueName = `Dest${Names.nodeUniqueId(this.destination.node)}`;
    const container = new Construct(scope, deliveryId(uniqueName, logType, scope, deliverySource));
    const recordFields = computeRecordFields(this.providedFields, this.mandatoryFields);

    const delivery = new logs.CfnDelivery(container, 'Delivery', {
      deliveryDestinationArn: this.destination.deliveryDestinationRef.deliveryDestinationArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
      recordFields,
    });

    delivery.node.addDependency(deliverySource);
    const deliveryDestination = logs.CfnDeliveryDestination.fromDeliveryDestinationName(container, 'Destination',
      this.destination.deliveryDestinationRef.deliveryDestinationName);

    return {
      deliverySource,
      deliveryDestination,
      delivery,
    };
  }
}

function deliveryId(destType: string, logType: string, ...scopes: IConstruct[]) {
  return `Cdk${destType}${logType.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join('')}Delivery${scopes.map(s => Names.uniqueId(s)).join('')}`;
}

function deliveryDestName(destType: string, logType: string, scope: IConstruct) {
  const prefix = `cdk-${destType}-${logType.split('_').map(word => word.toLowerCase()).join('-')}-dest-`;
  return `${prefix}${Names.uniqueResourceName(scope, { maxLength: 60 - prefix.length })}`;
}

function computeRecordFields(providedFields: string[] | undefined, mandatoryFields: string[] | undefined) {
  if (!providedFields) {
    // if providedFields is undefined, use default behavior
    return undefined;
  } else if (!mandatoryFields) {
    // if this log type has no mandatory fields, just use the providedFields
    return providedFields;
  }
  // remove any mandatory fields we got from the providedFields array, return a concatination of the providedFields array without the mandatory fields and the mandatory fields
  // covers instances where a log type has both optional and mandatory fields and instances when an incomplete set of mandatory fields is passed in
  const onlyOptionalFields = providedFields.filter((field) => {return !mandatoryFields?.includes(field);});
  return onlyOptionalFields.concat(mandatoryFields);
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
