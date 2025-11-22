import { Aws, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { DeliveryDestinationReference, IDeliveryDestinationRef, ILogGroupRef } from 'aws-cdk-lib/aws-logs';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { IBucketRef } from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import { tryFindBucketPolicy, XRayDeliveryDestinationPolicy } from './vended-logs-helpers';

/**
 * Base class for all delivery destination implementations.
 * Provides common functionality for log delivery destinations.
 */
abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestinationRef {
  /**
   * Reference to the delivery destination
   */
  public abstract readonly deliveryDestinationRef: DeliveryDestinationReference;
}

/**
 * Configuration properties for S3 delivery destinations.
 */
export interface S3DestinationProps {
  /**
   * The version of permissions supported by the source generating logs
   */
  readonly permissionsVersion: 'V1' | 'V2';
  /**
   * The S3 bucket to deliver logs to
   */
  readonly s3Bucket: IBucketRef;
}

/**
 * Configuration properties for CloudWatch Logs delivery destinations.
 */
interface LogsDestinationProps {
  /**
   * The CloudWatch log group to deliver logs to
   */
  readonly logGroup: ILogGroupRef;
}

/**
 * Configuration properties for Kinesis Data Firehose delivery destinations.
 */
interface FirehoseDestinationProps {
  /**
   * The Kinesis Data Firehose delivery stream to deliver logs to
   */
  readonly deliveryStream: IDeliveryStreamRef;
}

/**
 * Creates a delivery destination for S3 buckets with appropriate IAM permissions.
 * Supports both V1 and V2 permissions for S3 bucket access.
 */
export class S3DeliveryDestination extends DeliveryDestinationBase {
  /**
   * Reference to the S3 delivery destination
   */
  public readonly deliveryDestinationRef: DeliveryDestinationReference;

  /**
   * Creates a new S3 delivery destination.
   * @param scope - The construct scope
   * @param id - The construct ID
   * @param props - Configuration properties for the S3 destination
   */
  constructor(scope: IConstruct, id: string, props: S3DestinationProps) {
    super(scope, id);
    const bucketPolicy = this.getOrCreateBucketPolicy(scope, props);

    const destinationNamePrefix = 'cdk-s3-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.s3Bucket.bucketRef.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'S3',
    });
    deliveryDestination.node.addDependency(bucketPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  /**
   * Gets an existing bucket policy or creates a new one and adds the required permissions for log delivery.
   * @param scope - The construct scope
   * @param bucketProps - The S3 bucket properties
   * @returns The bucket policy with log delivery permissions
   */
  private getOrCreateBucketPolicy(scope: IConstruct, bucketProps: S3DestinationProps): CfnBucketPolicy {
    const existingPolicy = tryFindBucketPolicy(bucketProps.s3Bucket);
    const statements = [];

    const bucketStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${bucketProps.s3Bucket.bucketRef.bucketArn}/AWSLogs/${Stack.of(scope).account}/*`],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': Stack.of(scope).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(scope).region}:${Stack.of(scope).account}:delivery-source:*`,
        },
      },
    });
    statements.push(bucketStatement);

    if (bucketProps.permissionsVersion == 'V1') {
      const v1PermsStatement = new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [bucketProps.s3Bucket.bucketRef.bucketArn],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(scope).account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(scope).region}:${Stack.of(scope).account}:*`,
          },
        },
      });
      statements.push(v1PermsStatement);
    }

    if (existingPolicy) {
      const bucketPolicy = existingPolicy;

      // Add new statements using addOverride to avoid circular references
      const existingDoc = bucketPolicy.policyDocument as any;
      const existingStatements = Array.isArray(existingDoc.Statement) ? existingDoc.Statement : [];
      const newStatements = statements.map(s => s.toStatementJson());

      bucketPolicy.addOverride('Properties.PolicyDocument.Statement', [
        ...existingStatements,
        ...newStatements,
      ]);
      return bucketPolicy;
    } else {
      return new CfnBucketPolicy(scope, `CDKS3DestPolicy${Names.uniqueId(bucketProps.s3Bucket)}`, {
        bucket: bucketProps.s3Bucket.bucketRef.bucketName,
        policyDocument: new PolicyDocument({
          statements,
        }).toJSON(),
      });
    }
  }
}

/**
 * Creates a delivery destination for Kinesis Data Firehose delivery streams.
 * Automatically tags the delivery stream to enable log delivery.
 */
export class FirehoseDeliveryDestination extends DeliveryDestinationBase {
  /**
   * Reference to the Firehose delivery destination
   */
  public readonly deliveryDestinationRef: DeliveryDestinationReference;

  /**
   * Creates a new Firehose delivery destination.
   * @param scope - The construct scope
   * @param id - The construct ID
   * @param props - Configuration properties for the Firehose destination
   */
  constructor(scope: IConstruct, id: string, props: FirehoseDestinationProps) {
    super(scope, id);

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'FH',
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}

/**
 * Creates a delivery destination for CloudWatch Logs log groups.
 * Manages the required resource policy for cross-account log delivery.
 */
export class LogsDeliveryDestination extends DeliveryDestinationBase {
  /**
   * Reference to the CloudWatch Logs delivery destination
   */
  public readonly deliveryDestinationRef: DeliveryDestinationReference;

  /**
   * Creates a new CloudWatch Logs delivery destination.
   * @param scope - The construct scope
   * @param id - The construct ID
   * @param props - Configuration properties for the CloudWatch Logs destination
   */
  constructor(scope: IConstruct, id: string, props: LogsDestinationProps) {
    super(scope, id);

    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope, props.logGroup);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.logGroup.logGroupRef.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'CWL',
    });
    deliveryDestination.node.addDependency(logGroupPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  /**
   * Uses singleton pattern to get an existing CloudWatch Logs resource policy or create a new one.
   * Adds log delivery permissions to the policy.
   * @param scope - The construct scope
   * @param logGroup - The target log group
   * @returns The resource policy with log delivery permissions
   */
  private getOrCreateLogsResourcePolicy(scope: IConstruct, logGroup: ILogGroupRef) {
    const stack = Stack.of(scope);
    const policyId = 'CDKCWLLogDestDeliveryPolicy';
    const exists = stack.node.tryFindChild(policyId) as ResourcePolicy;

    const logGroupDeliveryStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${logGroup.logGroupRef.logGroupArn}:log-stream:*`],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': Stack.of(stack).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(stack).region}:${Stack.of(stack).account}:*`,
        },
      },
    });

    if (exists) {
      exists.document.addStatements(logGroupDeliveryStatement);
      return exists;
    }
    const logGroupPolicy = new ResourcePolicy(stack, policyId, {
      resourcePolicyName: 'LogDestinationDeliveryPolicy',
      policyStatements: [
        logGroupDeliveryStatement,
      ],
    });
    return logGroupPolicy;
  }
}

/**
 * Creates a delivery destination for AWS X-Ray tracing.
 * Manages the X-Ray resource policy for log delivery permissions.
 */
export class XRayDeliveryDestination extends DeliveryDestinationBase {
  /** Reference to the X-Ray delivery destination */
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  /**
   * The X-Ray resource policy manager
   */
  public readonly xrayResourcePolicy: XRayDeliveryDestinationPolicy;

  /**
   * Creates a new X-Ray delivery destination.
   * @param scope - The construct scope
   * @param id - The construct ID
   */
  constructor(scope: IConstruct, id: string) {
    super(scope, id);
    // only have one of these per stack
    this.xrayResourcePolicy = this.getOrCreateXRayPolicyGenerator(scope);

    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(this)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  /**
   * Gets an existing X-Ray policy generator or creates a new one.
   * Ensures only one X-Ray policy generator exists per stack.
   * @param scope - The construct scope
   * @returns The X-Ray delivery destination policy manager
   */
  private getOrCreateXRayPolicyGenerator(scope: IConstruct) {
    const stack = Stack.of(scope);
    const poliyGeneratorId = 'CDKXRayPolicyGenerator';
    const exists = stack.node.tryFindChild(poliyGeneratorId) as XRayDeliveryDestinationPolicy;

    if (exists) {
      return exists;
    }
    return new XRayDeliveryDestinationPolicy(stack, poliyGeneratorId);
  }
}
