import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { ActionAfterCompletion, EventBridgeSchedulerCreateScheduleTask } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'createScheduleInteg');

const kmsKey = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const scheduleGroup = new scheduler.CfnScheduleGroup(stack, 'ScheduleGroup', {
  name: 'TestGroup',
});
const targetQueue = new sqs.Queue(stack, 'TargetQueue');
const deadLetterQueue = new sqs.Queue(stack, 'DeadLetterQueue');

const schedulerRole = new iam.Role(stack, 'SchedulerRole', {
  assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
});
schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
  actions: ['sqs:SendMessage'],
  resources: [targetQueue.queueArn],
}));
schedulerRole.addToPrincipalPolicy(new iam.PolicyStatement({
  actions: ['kms:Decrypt'],
  resources: [kmsKey.keyArn],
}));

const createScheduleTask1 = new EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule1', {
  scheduleName: 'TestSchedule',
  actionAfterCompletion: ActionAfterCompletion.NONE,
  clientToken: 'testToken',
  description: 'Testdescription',
  startDate: new Date(),
  endDate: new Date(new Date().getTime() + 1000 * 60 * 60),
  flexibleTimeWindow: cdk.Duration.minutes(5),
  groupName: scheduleGroup.ref,
  kmsKey,
  scheduleExpression: 'rate(1 minute)',
  timezone: 'UTC',
  enabled: true,
  targetArn: targetQueue.queueArn,
  role: schedulerRole,
  retryPolicy: {
    maximumRetryAttempts: 2,
    maximumEventAge: cdk.Duration.minutes(5),
  },
  deadLetterQueue,
});

const createScheduleTask2 = new EventBridgeSchedulerCreateScheduleTask(stack, 'createSchedule2', {
  scheduleName: 'TestSchedule2',
  scheduleExpression: 'rate(1 minute)',
  targetArn: targetQueue.queueArn,
  role: schedulerRole,
});

const startTask = new sfn.Pass(stack, 'Start Task');
const endTask = new sfn.Pass(stack, 'End Task');

const stateMachine = new sfn.StateMachine(stack, 'stateMachine', {
  definition: sfn.Chain.start(startTask).next(createScheduleTask1).next(createScheduleTask2).next(endTask),
});

const testCase = new IntegTest(app, 'PutEvents', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
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
