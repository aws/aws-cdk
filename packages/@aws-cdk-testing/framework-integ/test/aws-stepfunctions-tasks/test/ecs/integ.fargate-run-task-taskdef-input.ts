import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates a state machine with a task state to run a job with ECS on Fargate
 * using a task definition ARN provided by the previous state
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-fargate-run-tasktask-def');

const cluster = new ecs.Cluster(stack, 'FargateCluster');

const taskExecutionRole = new iam.Role(stack, 'TaskExecutionRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
const taskRole = new iam.Role(stack, 'TaskRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});

// Build state machine
const definition = tasks.CallAwsService.jsonata(
  stack,
  'RegisterTaskDefinition',
  {
    service: 'ecs',
    action: 'registerTaskDefinition',
    parameters: {
      Cpu: '256',
      Memory: '512',
      Family: 'test-family',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: ['FARGATE'],
      TaskRoleArn: taskRole.roleArn,
      ExecutionRoleArn: taskExecutionRole.roleArn,
      ContainerDefinitions: [
        {
          Essential: true,
          Name: 'test-image',
          Image: 'public.ecr.aws/docker/library/hello-world',
        },
      ],
    },
    outputs: {
      taskDefinitionArn: '{% $states.result.TaskDefinition.TaskDefinitionArn %}',
    },
    iamResources: ['*'],
    iamAction: 'ecs:RegisterTaskDefinition',
  },
).next(
  tasks.EcsRunTask.jsonata(stack, 'FargateTask', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinitionFromArnOptions: {
      taskDefinitionArnInput: sfn.TaskInput.fromText('{% $states.input.taskDefinitionArn %}'),
      networkMode: ecs.NetworkMode.AWS_VPC,
      taskRole: taskRole,
      taskExecutionRole: taskExecutionRole,
    },
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
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
