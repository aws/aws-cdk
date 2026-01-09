import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ManagedEc2EcsComputeEnvironment } from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-compute-environment-tags-stack');
const vpc = new ec2.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

new ManagedEc2EcsComputeEnvironment(stack, 'TaggedComputeEnv', {
  vpc,
  tags: {
    Environment: 'test',
    Application: 'myapp',
  },
});

new integ.IntegTest(app, 'BatchComputeEnvironmentTagsTest', {
  testCases: [stack],
});

app.synth();
