import * as cdk from 'aws-cdk-lib/core';
import * as sqs from 'aws-cdk-lib/aws-sqs';

const app = new cdk.App({ autoSynth: false });
const stack = new cdk.Stack(app, 'Stack1');
new sqs.Queue(stack, 'Queue1', {
  queueName: "Queue1",
  fifo: true,
});

app.synth();
