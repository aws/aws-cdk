import { App, Stack } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'BatchQuotaShareSchedulingPolicyStack');

new batch.QuotaShareSchedulingPolicy(stack, 'QuotaSharePolicy', {
  schedulingPolicyName: 'MyQuotaSharePolicy',
  idleResourceAssignmentStrategy: batch.IdleResourceAssignmentStrategy.FIFO,
});

new integ.IntegTest(app, 'BatchQuotaShareSchedulingPolicyTest', {
  testCases: [stack],
});

app.synth();
