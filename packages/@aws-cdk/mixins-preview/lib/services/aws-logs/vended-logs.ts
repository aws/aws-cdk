import { Aws, Names, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { DeliveryReference, IDeliverySourceRef, ILogGroupRef } from 'aws-cdk-lib/aws-logs';
import { CfnDelivery, CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { IBucketRef } from 'aws-cdk-lib/aws-s3';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import { XRayDeliveryDestinationPolicy } from './vended-logs-helper';
import type { IDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { tryFindBucketPolicyForBucket } from '../../mixins/private/reflections';

/**
 * Interface for log deliveries.
 */
interface IDestination {
  /**
   * Binds the destination to a delivery source and creates a delivery connection between the source and destination.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @param sourceArn - Optional source ARN
   * @returns The delivery reference
   */
  bind(scope: IConstruct, deliverySource: IDeliverySourceRef, sourceArn?: string): DeliveryReference;
}

/**
 * S3 log delivery implementation.
 */
export class S3LogDelivery implements IDestination {
  private readonly bucket: IBucketRef;
  private readonly permissions: 'V1' | 'V2';

  /**
   * Creates a new S3 log delivery destination.
   * @param bucket - The S3 bucket reference
   * @param permissionsVersion - The permissions version ('V1' or 'V2')
   */
  constructor(bucket: IBucketRef, permissionsVersion: 'V1' | 'V2') {
    this.bucket = bucket;
    this.permissions = permissionsVersion;
  }

  /**
   * Binds the S3 destination to a delivery source and creates a delivery connection between them.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @returns The delivery reference
   */
  public bind(scope: IConstruct, deliverySource: IDeliverySourceRef): DeliveryReference {
    const bucketPolicy = this.getOrCreateBucketPolicy(scope );

    const destinationNamePrefix = 'cdk-s3-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(this.bucket)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.bucket.bucketRef.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'S3',
    });
    deliveryDestination.node.addDependency(bucketPolicy);

    const delivery = new CfnDelivery(scope, `CDKS3Delivery${Names.uniqueId(this.bucket)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);
    return delivery.deliveryRef;
  }

  /**
   * Gets or creates a bucket policy for the S3 bucket destination.
   * @param scope - The construct scope
   * @returns The bucket policy
   */
  private getOrCreateBucketPolicy(scope: IConstruct): CfnBucketPolicy {
    const existingPolicy = tryFindBucketPolicyForBucket(this.bucket);
    const statements = [];

    const bucketStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${this.bucket.bucketRef.bucketArn}/AWSLogs/${Stack.of(scope).account}/*`],
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

    if (this.permissions == 'V1') {
      const v1PermsStatement = new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [this.bucket.bucketRef.bucketArn],
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
      return new CfnBucketPolicy(scope, `CDKS3DestPolicy${Names.uniqueId(this.bucket)}`, {
        bucket: this.bucket.bucketRef.bucketName,
        policyDocument: new PolicyDocument({
          statements,
        }).toJSON(),
      });
    }
  }
}

/**
 * Kinesis Data Firehose log delivery implementation.
 */
export class FirehoseLogDelivery implements IDestination {
  private readonly deliveryStream: IDeliveryStream;

  /**
   * Creates a new Firehose log delivery destination.
   * @param stream - The Kinesis Data Firehose delivery stream
   */
  constructor(stream: IDeliveryStream) {
    this.deliveryStream = stream;
  }

  /**
   * Binds the Firehose destination to a delivery source and creates a delivery connection between them.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @returns The delivery reference
   */
  public bind(scope: IConstruct, deliverySource: IDeliverySourceRef): DeliveryReference {
    Tags.of(this.deliveryStream).add('LogDeliveryEnabled', 'true');
    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'FH',
    });

    const delivery = new CfnDelivery(scope, `CDKFHDelivery${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);
    return delivery.deliveryRef;
  }
}

/**
 * CloudWatch Log group delivery implementation.
 */
export class LogGroupLogDelivery implements IDestination {
  private readonly logGroup: ILogGroupRef;

  /**
   * Creates a new log group delivery destination.
   * @param logGroup - The CloudWatch Logs log group reference
   */
  constructor(logGroup: ILogGroupRef) {
    this.logGroup = logGroup;
  }

  /**
   * Binds the log group destination to a delivery source and creates a delivery connection between them.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @returns The delivery reference
   */
  public bind(scope: IConstruct, deliverySource: IDeliverySourceRef): DeliveryReference {
    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope, this.logGroup);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(this.logGroup)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.logGroup.logGroupRef.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'CWL',
    });
    deliveryDestination.node.addDependency(logGroupPolicy);

    const delivery = new CfnDelivery(scope, `CDKCWLDelivery${Names.uniqueId(this.logGroup)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);
    return delivery.deliveryRef;
  }

  /**
   * Gets or creates a singleton CloudWatch Logs resource policy.
   * @param scope - The construct scope
   * @param logGroup - The log group reference
   * @returns The resource policy
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
 * AWS X-Ray log delivery implementation.
 */
export class XRayLogDelivery implements IDestination {
  /**
   * Creates a new X-Ray log delivery destination.
   */
  constructor() {}

  /**
   * Binds the X-Ray destination to a delivery source and creates a delivery connection between them.
   * @param scope - The construct scope
   * @param deliverySource - The delivery source reference
   * @param sourceArn - The source ARN
   * @returns The delivery reference
   */
  public bind(scope: IConstruct, deliverySource: IDeliverySourceRef, sourceArn: string): DeliveryReference {
    const xrayResourcePolicy = this.getOrCreateXRayPolicyGenerator(scope);

    xrayResourcePolicy.allowSource(sourceArn);
    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(scope)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });

    const delivery = new CfnDelivery(scope, `CDKXRAYDelivery${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.deliverySourceRef.deliverySourceName,
    });
    delivery.addDependency(deliveryDestination);
    delivery.node.addDependency(deliverySource);
    return delivery.deliveryRef;
  }

  /**
   * Gets or creates a singleton X-Ray policy generator.
   * @param scope - The construct scope
   * @returns The X-Ray delivery destination policy
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
