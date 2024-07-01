
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Queue, RedrivePermission } from 'aws-cdk-lib/aws-sqs';

const app = new App();

const stack = new Stack(app, 'aws-cdk-sqs');

const sourceQueue1 = new Queue(stack, 'SourceQueue1', {
  redriveAllowPolicy: {
    redrivePermission: RedrivePermission.ALLOW_ALL,
  },
});
const sourceQueue2 = new Queue(stack, 'SourceQueue2', {
  redriveAllowPolicy: {
    redrivePermission: RedrivePermission.DENY_ALL,
  },
});

new Queue(stack, 'DeadLetterQueue', {
  redriveAllowPolicy: {
    sourceQueues: [sourceQueue1, sourceQueue2],
    redrivePermission: RedrivePermission.BY_QUEUE,
  },
});

new integ.IntegTest(app, 'SqsTest', {
  testCases: [stack],
});

app.synth();
