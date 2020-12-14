import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { SnsPublish } from '../../lib/sns/publish';

/*
 * Creates a state machine with a task state to publish to an SNS topic.
 * The SNS topic has an SQS queue added as a subscriber.
 * When the state machine is executed, it will publish a message to our
 * topic, which can subsequently be consumed from the SQS queue.
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
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-sns-publish-integ');

const topic = new sns.Topic(stack, 'cool-topic');
const queue = new sqs.Queue(stack, 'show-me-the-messages');

topic.addSubscription(new subs.SqsSubscription(queue));

const publishTask = new SnsPublish(stack, 'publish to SNS', {
  topic,
  message: sfn.TaskInput.fromText('sending message over'),
});

const finalStatus = new sfn.Pass(stack, 'Final step');

const chain = sfn.Chain.start(publishTask)
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
