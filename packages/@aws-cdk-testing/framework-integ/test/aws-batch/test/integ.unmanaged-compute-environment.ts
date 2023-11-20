import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { UnmanagedComputeEnvironment } from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-stack');

new UnmanagedComputeEnvironment(stack, 'minimalProps');

new UnmanagedComputeEnvironment(stack, 'maximalProps', {
  computeEnvironmentName: 'unmanagedIntegTestCE',
  enabled: true,
  unmanagedvCpus: 256,
  serviceRole: new Role(stack, 'IntegServiceRole', {
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBatchServiceRole'),
    ],
    assumedBy: new ServicePrincipal('batch.amazonaws.com'),
  }),
});

new integ.IntegTest(app, 'BatchManagedComputeEnvironmentTest', {
  testCases: [stack],
});

app.synth();
