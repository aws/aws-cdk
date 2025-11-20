import { Aws, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { IDeliveryStreamRef } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { DeliveryDestinationReference, IDeliveryDestinationRef, ILogGroupRef } from 'aws-cdk-lib/aws-logs';
import { CfnBucketPolicy, IBucketRef } from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import { tryFindBucketPolicy, XRayDeliveryDestinationPolicy } from './vended-logs-helpers';

abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestinationRef {
  public abstract readonly deliveryDestinationRef: DeliveryDestinationReference;
}

export interface S3DestinationProps {
  readonly permissionsVersion: 'V1' | 'V2';
  readonly s3Bucket: IBucketRef;
}

interface LogsDestinationProps {
  readonly logGroup: ILogGroupRef;
}

interface FirehoseDestinationProps {
  readonly deliveryStream: IDeliveryStreamRef;
}

export class S3DeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
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

export class FirehoseDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
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

export class LogsDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
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

export class XRayDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  public readonly xrayResourcePolicy: XRayDeliveryDestinationPolicy;
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
