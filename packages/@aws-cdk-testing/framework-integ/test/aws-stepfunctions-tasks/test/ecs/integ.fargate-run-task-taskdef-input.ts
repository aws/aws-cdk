import * as path from 'path';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates a state machine with a task state to run a job with ECS on Fargate
 * using a task definition ARN provided by the previous state
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-fargate-run-tasktask-def');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const cluster = new ecs.Cluster(stack, 'FargateCluster');

// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Build state machine
const definition = sfn.Pass.jsonata(stack, 'Start', {
  outputs: {
    taskDefinitionArn: taskDefinition.taskDefinitionArn,
  },
}).next(
  tasks.EcsRunTask.jsonata(stack, 'FargateTask', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinitionInput: sfn.TaskInput.fromText('{% $states.input.taskDefinitionArn %}'),
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
    networkMode: ecs.NetworkMode.AWS_VPC,
    taskRole: taskDefinition.taskRole,
    taskExecutionRole: taskDefinition.obtainExecutionRole(),
    cpu: '1024',
    memoryMiB: '2048',
  }),
);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  queryLanguage: sfn.QueryLanguage.JSONATA,
  definition,
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

const testCase = new IntegTest(app, 'SfnTasksEcsFargateRunTaskTest', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: sm.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(5),
  });

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
});
start.next(describe);

// Assert the step function execution finished with a status of SUCCEEDED
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(5),
});

app.synth();
