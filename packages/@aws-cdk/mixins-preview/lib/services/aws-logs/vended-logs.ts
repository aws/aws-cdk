import { Aws, Names, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { CfnDeliverySource, DeliveryReference, ILogGroupRef, LogGroup } from 'aws-cdk-lib/aws-logs';
import { CfnDelivery, CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { IBucketRef } from 'aws-cdk-lib/aws-s3';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { IConstruct } from 'constructs';
import { tryFindBucketPolicy, XRayDeliveryDestinationPolicy } from './vended-logs-helper';
import type { IDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';

interface IDestination {
  bind(scope: IConstruct, deliverySource: CfnDeliverySource, sourceArn?: string): DeliveryReference;
}

export class S3LogDelivery implements IDestination {
  private readonly bucket: IBucketRef;
  private readonly permissions: 'V1' | 'V2';
  constructor(bucket: IBucketRef, permissionsVersion: 'V1' | 'V2') {
    this.bucket = bucket;
    this.permissions = permissionsVersion;
  }

  public bind(scope: IConstruct, deliverySource: CfnDeliverySource): DeliveryReference {
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
      deliverySourceName: deliverySource.name,
    });
    delivery.addDependency(deliveryDestination);
    delivery.addDependency(deliverySource);
    return delivery.deliveryRef;
  }

  private getOrCreateBucketPolicy(scope: IConstruct): CfnBucketPolicy {
    const existingPolicy = tryFindBucketPolicy(this.bucket);
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

export class FirehoseLogDelivery implements IDestination {
  private readonly deliveryStream: IDeliveryStream;
  constructor(stream: IDeliveryStream) {
    this.deliveryStream = stream;
  }

  public bind(scope: IConstruct, deliverySource: CfnDeliverySource): DeliveryReference {
    Tags.of(this.deliveryStream).add('LogDeliveryEnabled', 'true');
    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      destinationResourceArn: this.deliveryStream.deliveryStreamRef.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'FH',
    });

    const delivery = new CfnDelivery(scope, `CDKFHDelivery${Names.uniqueId(this.deliveryStream)}${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.name,
    });
    delivery.addDependency(deliveryDestination);
    delivery.addDependency(deliverySource);
    return delivery.deliveryRef;
  }
}

export class LogGroupLogDelivery implements IDestination {
  private readonly logGroup: LogGroup;
  constructor(logGroup: LogGroup) {
    this.logGroup = logGroup;
  }

  public bind(scope: IConstruct, deliverySource: CfnDeliverySource): DeliveryReference {
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
      deliverySourceName: deliverySource.name,
    });
    delivery.addDependency(deliveryDestination);
    delivery.addDependency(deliverySource);
    return delivery.deliveryRef;
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

export class XRayLogDelivery implements IDestination {
  constructor() {}

  public bind(scope: IConstruct, deliverySource: CfnDeliverySource, sourceArn: string): DeliveryReference {
    const xrayResourcePolicy = this.getOrCreateXRayPolicyGenerator(scope);

    xrayResourcePolicy.allowSource(sourceArn);
    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(scope)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: 'XRAY',
    });

    const delivery = new CfnDelivery(scope, `CDKXRAYDelivery${Names.uniqueId(scope)}`, {
      deliveryDestinationArn: deliveryDestination.attrArn,
      deliverySourceName: deliverySource.name,
    });
    delivery.addDependency(deliveryDestination);
    delivery.addDependency(deliverySource);
    return delivery.deliveryRef;
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
