import { Aws, Names, Resource, Stack, Tags } from 'aws-cdk-lib';
import type { IResource } from 'aws-cdk-lib';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { DeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, CfnResourcePolicy } from 'aws-cdk-lib/aws-logs';
import type { LogGroup } from 'aws-cdk-lib/aws-logs';
import { CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import type { Bucket } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

interface IDeliveryDestination extends IResource {
  readonly destinationArn: string;
}

abstract class DeliveryDestinationBase extends Resource implements IDeliveryDestination {
  public abstract readonly destinationArn: string;
}

interface DeliveryDestinationProps {
  readonly permissionsVersion: 'V1' | 'V2';
  readonly s3Bucket?: Bucket;
  readonly logGroup?: LogGroup;
  readonly deliveryStream?: DeliveryStream;
}

export class S3DeliveryDestination extends DeliveryDestinationBase {
  public readonly destinationArn: string;
  constructor(scope: Construct, id: string, props: DeliveryDestinationProps & Required<Pick<DeliveryDestinationProps, 's3Bucket'>>) {
    super(scope, id);
    const bucketPolicyDoc = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
          actions: ['s3:PutObject'],
          resources: [`${props.s3Bucket.bucketArn}/AWSLogs/${Stack.of(this).account}/*`],
          conditions: {
            StringEquals: {
              's3:x-amz-acl': 'bucket-owner-full-control',
              'aws:SourceAccount': Stack.of(this).account,
            },
            ArnLike: {
              'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:delivery-source:*`,
            },
          },
        }),
      ],
    });

    if (props.permissionsVersion == 'V1') {
      const v1BucketPolicy = new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [props.s3Bucket.bucketArn],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(this).account,
          },
          ArnLike: {
            'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:*`,
          },
        },
      });

      bucketPolicyDoc.addStatements(v1BucketPolicy);
    }

    const bucketPolicy = new CfnBucketPolicy(scope, 'S3Policy', {
      bucket: props.s3Bucket.bucketName,
      policyDocument: bucketPolicyDoc.toJSON(),
    });

    const deliveryDestination = new CfnDeliveryDestination(scope, 'S3DeliveryDestination', {
      destinationResourceArn: props.s3Bucket.bucketArn,
      name: `s3-delivery-destination-${Names.uniqueResourceName(props.s3Bucket, { maxLength: 20 })}`,
    });
    deliveryDestination.addDependency(bucketPolicy);
    this.destinationArn = deliveryDestination.attrArn;
  }
}

export class FirehoseDeliveryDestination extends DeliveryDestinationBase {
  public readonly destinationArn: string;
  constructor(scope: Construct, id: string, props: DeliveryDestinationProps & Required<Pick<DeliveryDestinationProps, 'deliveryStream'>>) {
    super(scope, id);

    Tags.of(props.deliveryStream).add('LogDeliveryEnabled', 'true');
    const deliveryDestination = new CfnDeliveryDestination(scope, 'FirehoseDeliveryDestination', {
      destinationResourceArn: props.deliveryStream.deliveryStreamArn,
      name: `fh-delivery-destination-${Names.uniqueResourceName(props.deliveryStream, { maxLength: 20 })}`,
    });
    this.destinationArn = deliveryDestination.attrArn;
  }
}

export class CloudwatchDeliveryDestination extends DeliveryDestinationBase {
  public readonly destinationArn: string;
  constructor(scope: Construct, id: string, props: DeliveryDestinationProps & Required<Pick<DeliveryDestinationProps, 'logGroup'>>) {
    super(scope, id);

    const logGroupPolicy = new CfnResourcePolicy(scope, 'CloudwatchDeliveryPolicy', {
      policyName: 'CloudFrontLogDeliveryPolicy',
      policyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AWSLogDeliveryWrite',
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Resource: `${props.logGroup.logGroupArn}:log-stream:*`,
            Condition: {
              StringEquals: {
                'aws:SourceAccount': Stack.of(this).account,
              },
              ArnLike: {
                'aws:SourceArn': `arn:${Aws.PARTITION}:logs:${Stack.of(this).region}:${Stack.of(this).account}:*`,
              },
            },
          },
        ],
      }),
    });

    const deliveryDestination = new CfnDeliveryDestination(scope, 'CloudwatchDeliveryDestination', {
      destinationResourceArn: props.logGroup.logGroupArn,
      name: `cwl-delivery-destination-${Names.uniqueResourceName(props.logGroup, { maxLength: 20 })}`,
    });
    deliveryDestination.addDependency(logGroupPolicy);
    this.destinationArn = deliveryDestination.attrArn;
  }
}
