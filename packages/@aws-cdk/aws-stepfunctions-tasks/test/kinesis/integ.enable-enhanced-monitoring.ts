import * as kinesis from '@aws-cdk/aws-kinesis';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { KinesisEnableEnhancedMonitoring, ShardLevelMetrics } from '../../lib/kinesis/enable-enhanced-monitoring';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn XXX | should return the execution arn
 * * aws stepfunctions describe-execution --execution-arn XXX  | should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks');

const stream = new kinesis.Stream(stack, 'Stream', {
  streamName: 'MyStream',
});

const task = new KinesisEnableEnhancedMonitoring(stack, 'Task', {
  streamName: stream.streamName,
  shardLevelMetrics: [
    ShardLevelMetrics.ALL,
  ],
});

const definition = new sfn.Pass(stack, 'Start')
  .next(task);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: definition,
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'KinesisEnableEnhancedMonitoring', {
  testCases: [stack],
});

// start the execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
}));

app.synth();
