import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Topic } from 'aws-cdk-lib/aws-sns';

const app = new App();

const stack = new Stack(app, 'aws-cdk-sns-fifo-1');

new Topic(stack, 'MyTopic', {
  fifo: true,
});

new IntegTest(app, 'SnsFifoNoNameTest', {
  testCases: [stack],
});

app.synth();
