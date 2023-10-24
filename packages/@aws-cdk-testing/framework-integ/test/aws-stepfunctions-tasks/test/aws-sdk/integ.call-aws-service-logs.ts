import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-call-aws-service-logs-integ');

const logGroup = new LogGroup(stack, 'LogGroup');
const task = new CallAwsService(stack, 'SendTaskSuccess', {
  service: 'cloudwatchlogs',
  action: 'createLogStream',
  parameters: {
    LogGroupName: logGroup.logGroupName,
    LogStreamName: sfn.JsonPath.stringAt('$$.Execution.Name'),
  },
  resultPath: sfn.JsonPath.DISCARD,
  iamResources: [logGroup.logGroupArn],
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: task,
});

// THEN
const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn,
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(10),
  interval: cdk.Duration.seconds(3),
});

app.synth();
