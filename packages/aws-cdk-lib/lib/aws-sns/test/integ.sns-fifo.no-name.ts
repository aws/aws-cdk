import { App, Stack } from '../../core';
import { IntegTest } from '../../integ-tests';
import { Topic } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-sns-fifo-1');

new Topic(stack, 'MyTopic', {
  fifo: true,
});

new IntegTest(app, 'SnsFifoNoNameTest', {
  testCases: [stack],
});

app.synth();