import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { SqsSendMessage, SqsMessageAttributeDataType } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates a state machine with a task state to send a message to an SQS
 * queue, with attributes attached.
 *
 * When the state machine is executed, it will send a message to our
 * queue, which can subsequently be consumed.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`. The message received in SQS contains
 * the attributes defined in the CDK.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <from previous command> returns a status of `Succeeded`
 * -- aws sqs receive-message --queue-url <queue-url-from-output> --message-attribute-names 'All' has a message of 'sending message over' and attributes
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-sqs-send-message-integ');

const queue = new sqs.Queue(stack, 'show-me-the-messages');

const sendMessageTask = new SqsSendMessage(stack, 'send message to sqs', {
  queue,
  messageBody: sfn.TaskInput.fromText('sending message over'),
  messageAttributes: {
    stringAttribute: {
      dataType: SqsMessageAttributeDataType.STRING,
      value: 'attached attribute',
    },
    numberAttribute: {
      dataType: SqsMessageAttributeDataType.NUMBER,
      value: 123456,
    },
  },
});

const finalStatus = new sfn.Pass(stack, 'Final step');

const chain = sfn.Chain.start(sendMessageTask)
  .next(finalStatus);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

const stateMachineArn = new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

const queueUrl = new cdk.CfnOutput(stack, 'queueUrl', {
  value: queue.queueUrl,
});

const integ = new IntegTest(app, 'Integ', {
  testCases: [stack],
});

const start = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachineArn.value,
});

const executionResult = integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// Step function executes correctly
executionResult.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions();

const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queueUrl.value,
  MessageAttributeNames: ['All'],
  WaitTimeSeconds: 20,
});

// Receive message with correct attributes
message.expect(ExpectedResult.objectLike({
  Messages: [
    {
      Body: 'sending message over',
      MessageAttributes: {
        stringAttribute: {
          DataType: SqsMessageAttributeDataType.STRING,
          StringValue: 'attached attribute',
        },
        numberAttribute: {
          DataType: SqsMessageAttributeDataType.NUMBER,
          StringValue: '123456',
        },
      },
    },
  ],
}));
