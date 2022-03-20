import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the number 42
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-batch-detect-sentiment-integ');

const detectSyntaxTask = new tasks.ComprehendBatchDetectSentiment(stack, 'ComprehendBatchDetectSentiment', {
  languageCode: 'en',
  textList: [
    'detecting sentiment from this phrase',
    'detecting sentiment from this phrase again',
  ],
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: detectSyntaxTask,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

app.synth();
