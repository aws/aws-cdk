/// !cdk-integ *
import { App, Stack, StackProps } from '@aws-cdk/core';
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
  }
}

new TestStack(app, 'TestStack');

app.synth();
