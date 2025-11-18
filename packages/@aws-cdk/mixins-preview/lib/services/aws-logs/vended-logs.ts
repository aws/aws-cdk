import { Aws, CfnResource, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { DeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, ResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { DeliveryDestinationReference, IDeliveryDestinationRef, LogGroup } from 'aws-cdk-lib/aws-logs';
import { BucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { Bucket } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestinationRef {
  public abstract readonly deliveryDestinationRef: DeliveryDestinationReference;
}

interface DeliveryDestinationProps {
  readonly permissionsVersion: 'V1' | 'V2';
  readonly destinationService: 'S3' | 'CWL' | 'FH' | 'XRAY';
}

interface S3DestinationProps extends DeliveryDestinationProps {
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
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKS3Dest${Names.uniqueId(props.s3Bucket)}`, {
      destinationResourceArn: props.s3Bucket.bucketArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(props.s3Bucket, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    deliveryDestination.node.addDependency(bucketPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  getOrCreateBucketPolicy(stack: Construct, bucketProps: S3DestinationProps): BucketPolicy {
    const allConstructs = stack.node.findAll();
    const bucketPolicies = allConstructs.filter(construct => construct instanceof BucketPolicy) as BucketPolicy[];
    const policiesForCurBucket = bucketPolicies.length > 0 ?
      bucketPolicies.filter(policy => policy.bucket === bucketProps.s3Bucket) : undefined;
    let bucketPolicy: BucketPolicy;
    const statements = [];
    if (policiesForCurBucket && policiesForCurBucket.length > 0) {
      bucketPolicy = policiesForCurBucket[0];
    } else {
      bucketPolicy = new BucketPolicy(stack, `CDKS3DestPolicy${Names.uniqueId(bucketProps.s3Bucket)}`, {
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
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKFHDest${Names.uniqueId(props.deliveryStream)}`, {
      destinationResourceArn: props.deliveryStream.deliveryStreamArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(props.deliveryStream, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}

export class LogsDeliveryDestination extends DeliveryDestinationBase {
  public readonly deliveryDestinationRef: DeliveryDestinationReference;
  constructor(scope: Construct, id: string, props: LogsDestinationProps) {
    super(scope, id);

    const logGroupPolicy = this.findOrCreateLogsResourcePolicy(scope, props.logGroup);

    const destinationNamePrefix = 'cdk-cwl-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, `CDKCWLDest${Names.uniqueId(props.logGroup)}`, {
      destinationResourceArn: props.logGroup.logGroupArn,
      name: `${destinationNamePrefix}${Names.uniqueResourceName(props.logGroup, { maxLength: 60 - destinationNamePrefix.length })}`,
      deliveryDestinationType: props.destinationService,
    });
    deliveryDestination.node.addDependency(logGroupPolicy);
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }

  findOrCreateLogsResourcePolicy(stack: Construct, logGroup: LogGroup) {
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
      const logGroupPolicy = new ResourcePolicy(stack, `CWLDeliveryPolicy${Names.uniqueId(logGroup)}`, {
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
  constructor(scope: Construct, id: string, props: DeliveryDestinationProps) {
    super(scope, id);

    const destinationNamePrefix = 'cdk-xray-dest-';
    const deliveryDestination = new CfnDeliveryDestination(scope, 'CDKXRayDeliveryDestination', {
      name: `${destinationNamePrefix}${Names.uniqueResourceName(scope, { maxLength: 60 - destinationNamePrefix.length })}`, // there is no resource for XRays
      deliveryDestinationType: props.destinationService,
    });
    this.deliveryDestinationRef = deliveryDestination.deliveryDestinationRef;
  }
}
