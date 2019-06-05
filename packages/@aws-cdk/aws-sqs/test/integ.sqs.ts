import { App, CfnOutput, Stack } from '@aws-cdk/cdk';
import { Queue } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-sqs');

const dlq = new Queue(stack, 'DeadLetterQueue');
const queue = new Queue(stack, 'Queue', {
  deadLetterQueue: { queue: dlq, maxReceiveCount: 5 }
});

new Queue(stack, 'FifoQueue', {
  fifo: true
});

new CfnOutput(stack, 'QueueUrl', { value: queue.queueUrl });

app.synth();
