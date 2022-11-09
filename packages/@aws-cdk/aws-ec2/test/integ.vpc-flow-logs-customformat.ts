import { Bucket } from '@aws-cdk/aws-s3';
import { App, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc, LogFormat } from '../lib';

const app = new App();


class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC');

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      logFormat: [
        LogFormat.SRC_PORT,
      ],
    });

    const bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    vpc.addFlowLog('FlowLogsS3', {
      destination: FlowLogDestination.toS3(bucket, 'prefix/'),
      logFormat: [
        LogFormat.DST_PORT,
        LogFormat.SRC_PORT,
      ],
    });

  }
}


new IntegTest(app, 'FlowLogs', {
  testCases: [
    new TestStack(app, 'FlowLogsTestStack'),
  ],
});

app.synth();
