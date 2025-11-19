import { Aws, CfnResource, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { DeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { DeliveryDestinationReference, IDeliveryDestinationRef, LogGroup } from 'aws-cdk-lib/aws-logs';
import { BucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnResourcePolicy } from 'aws-cdk-lib/aws-xray';
import type { Construct } from 'constructs';

abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestinationRef {
  public abstract readonly deliveryDestinationRef: DeliveryDestinationReference;
}

interface DeliveryDestinationProps {
  readonly destinationService: 'S3' | 'CWL' | 'FH' | 'XRAY';
}

interface S3DestinationProps extends DeliveryDestinationProps {
  readonly permissionsVersion: 'V1' | 'V2';
  readonly s3Bucket: Bucket;
}

interface LogsDestinationProps extends DeliveryDestinationProps {
  readonly logGroup: LogGroup;
}

interface FirehoseDestinationProps extends DeliveryDestinationProps {
  readonly deliveryStream: DeliveryStream;
}

export class S3DeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: Construct, id: string, props: S3DestinationProps) {
    super(scope, id);
    const bucketPolicy = this.getOrCreateBucketPolicy(scope, props);

    const destinationNamePrefix = 'cdk-s3-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.s3Bucket.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    deliveryDestination.node.addDependency(bucketPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  private getOrCreateBucketPolicy(stack: Construct, bucketProps: S3DestinationProps): BucketPolicy {
    const allConstructs = stack.node.findAll();
    const bucketPolicies = allConstructs.filter(construct => construct instanceof BucketPolicy) as BucketPolicy[];
    const policiesForCurBucket = bucketPolicies.length > 0 ?
      bucketPolicies.filter(policy => policy.bucket === bucketProps.s3Bucket) : undefined;
    let bucketPolicy: BucketPolicy;
    const statements = [];
    if (policiesForCurBucket && policiesForCurBucket.length > 0) {
      bucketPolicy = policiesForCurBucket[0];
    } else {
      bucketPolicy = new BucketPolicy(stack, `CDKS3DestPolicy${Names.uniqueId(this)}`, {
        bucket: bucketProps.s3Bucket,
        document: new PolicyDocument(),
      });
    }
    const bucketStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${bucketProps.s3Bucket.bucketArn}/AWSLogs/${Stack.of(this).account}/*`],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': Stack.of(this).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:delivery-source:*`,
        },
      },
    });
    statements.push(bucketStatement);

    if (bucketProps.permissionsVersion == 'V1') {
      const v1PermsStatement = new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [bucketProps.s3Bucket.bucketArn],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(this).account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:*`,
          },
        },
      });
      statements.push(v1PermsStatement);
    }

    bucketPolicy.document.addStatements(...statements);
    return bucketPolicy;
  }
}

export class FirehoseDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: Construct, id: string, props: FirehoseDestinationProps) {
    super(scope, id);

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
    const destinationNamePrefix = 'cdk-fh-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.deliveryStream.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}

export class LogsDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: Construct, id: string, props: LogsDestinationProps) {
    super(scope, id);

    const logGroupPolicy = this.getOrCreateLogsResourcePolicy(scope, props.logGroup);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(this)}`, {
      destinationResourceArn: props.logGroup.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    deliveryDestination.node.addDependency(logGroupPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  private getOrCreateLogsResourcePolicy(stack: Construct, logGroup: LogGroup) {
    const allConstructs = stack.node.findAll();
    const resourcePolicies = allConstructs.filter(
      construct => construct instanceof ResourcePolicy &&
       CfnResource.isCfnResource(construct.node.defaultChild) &&
       construct.node.defaultChild.cfnResourceType === 'AWS::Logs::ResourcePolicy',
    ) as ResourcePolicy[];
    const logGroupDeliveryStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${logGroup.logGroupArn}:log-stream:*`],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': Stack.of(this).account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:*`,
        },
      },
    });

    if (resourcePolicies.length === 0) {
      const logGroupPolicy = new ResourcePolicy(stack, `CWLDeliveryPolicy${Names.uniqueId(this)}`, {
        resourcePolicyName: 'LogDestinationDeliveryPolicy',
        policyStatements: [
          logGroupDeliveryStatement,
        ],
      });
      return logGroupPolicy;
    }
    resourcePolicies[0].document.addStatements(logGroupDeliveryStatement);
    return resourcePolicies[0];
  }
}

export class XRayDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  public readonly xrayResourcePolicy: XRayPolicyGenerator;
  constructor(scope: Construct, id: string, props: DeliveryDestinationProps) {
    super(scope, id);
    // only have one of these per stack
    this.xrayResourcePolicy = this.getOrCreateXRayPolicyGenerator(scope);

    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKXRayDest${Names.uniqueId(this)}`, {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(this, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  private getOrCreateXRayPolicyGenerator(stack: Construct) {
    const exists = stack.node.findAll().find(
      construct => construct instanceof XRayPolicyGenerator,
    ) as XRayPolicyGenerator;

    return exists === undefined ? new XRayPolicyGenerator(this, `CDKXRayPolicyGenerator${Names.uniqueId(this)}`) : exists;
  }
}

export class XRayPolicyGenerator extends Resource {
  public readonly XrayResourcePolicy: CfnResourcePolicy;
  private readonly logGeneratingSourceArns: string[] = [];
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.XrayResourcePolicy = this.getOrCreateXRayResourcePolicy(scope);
  }

  private getOrCreateXRayResourcePolicy(stack: Construct) {
    // Find existing XRay resource policy
    const existing = stack.node.findAll().find(
      construct => construct instanceof CfnResourcePolicy &&
      construct.cfnResourceType === 'AWS::XRay::ResourcePolicy' &&
      construct.policyName === 'CDKXRayDeliveryDestPolicy',
    ) as CfnResourcePolicy;

    if (existing) {
      return existing;
    }

    return new CfnResourcePolicy(stack, `CDKXRayPolicy${Names.uniqueId(this)}`, {
      policyName: 'CDKXRayDeliveryDestPolicy',
      policyDocument: this.buildPolicyDocument(),
    });
  }

  public addSourceToPolicy(logGeneratingSourceArn: string) {
    this.logGeneratingSourceArns.push(logGeneratingSourceArn);
    this.XrayResourcePolicy.policyDocument = this.buildPolicyDocument();
  }

  private buildPolicyDocument() {
    return JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Sid: 'CDKLogsDeliveryWrite',
        Effect: 'Allow',
        Principal: {
          Service: 'delivery.logs.amazonaws.com',
        },
        Action: 'xray:PutTraceSegments',
        Resource: '*',
        Condition: {
          'StringEquals': {
            'aws:SourceAccount': Stack.of(this).account,
          },
          'ForAllValues:ArnLike': {
            'logs:LogGeneratingResourceArns': this.logGeneratingSourceArns,
          },
          'ArnLike': {
            'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:delivery-source:*`,
          },
        },
      }],
    });
  }
}
