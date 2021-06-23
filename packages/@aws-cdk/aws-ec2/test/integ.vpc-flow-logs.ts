/// !cdk-integ *
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
    });

    vpc.addFlowLog('FlowLogsS3KeyPrefix', {
      destination: FlowLogDestination.toS3(bucket, 'prefix/'),
    });
  }
}

new TestStack(app, 'TestStack');

app.synth();
