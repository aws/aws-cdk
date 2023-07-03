import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { SqsSendMessage } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Creates a state machine with a task state to send a message to an SQS
 * queue.
 *
 * When the state machine is executed, it will send a message to our
 * queue, which can subsequently be consumed.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <from previous command> returns a status of `Succeeded`
 * -- aws sqs receive-message --queue-url <queue-url-from-output> has a message of 'sending message over'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-sqs-send-message-integ');
const queue = new sqs.Queue(stack, 'show-me-the-messages', {
  encryption: sqs.QueueEncryption.KMS,
});

const sendMessageTask = new SqsSendMessage(stack, 'send message to sqs', {
  queue,
  messageBody: sfn.TaskInput.fromText('sending message over'),
});

const finalStatus = new sfn.Pass(stack, 'Final step');

const chain = sfn.Chain.start(sendMessageTask)
  .next(finalStatus);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new cdk.CfnOutput(stack, 'queueUrl', {
  value: queue.queueUrl,
});

app.synth();
