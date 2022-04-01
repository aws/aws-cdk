/// !cdk-integ *
import { PolicyStatement, Effect, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc } from '../lib';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC');

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
    });

    vpc.addFlowLog('FlowLogsS3', {
      destination: FlowLogDestination.toS3(),
    });

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [bucket.arnForObjects(`AWSLogs/${this.account}/*`)],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': this.account,
        },
        ArnLike: {
          'aws:SourceArn': this.formatArn({
            service: 'logs',
            resource: '*',
          }),
        },
      },
    }));
    bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:GetBucketAcl', 's3:ListBucket'],
      resources: [bucket.bucketArn],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': this.account,
        },
        ArnLike: {
          'aws:SourceArn': this.formatArn({
            service: 'logs',
            resource: '*',
          }),
        },
      },
    }));

    vpc.addFlowLog('FlowLogsS3KeyPrefix', {
      destination: FlowLogDestination.toS3(bucket, 'prefix/'),
    });
  }
}

new TestStack(app, 'FlowLogsTestStack');

app.synth();
