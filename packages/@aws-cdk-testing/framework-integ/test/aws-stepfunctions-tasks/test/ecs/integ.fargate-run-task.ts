import * as path from 'path';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP, STEPFUNCTIONS_TASKS_FIX_RUN_ECS_TASK_POLICY } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates a state machine with a task state to run a job with ECS on Fargate
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-fargate-run-task');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
stack.node.setContext(STEPFUNCTIONS_TASKS_FIX_RUN_ECS_TASK_POLICY, false);

const cluster = new ecs.Cluster(stack, 'FargateCluster');

// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});
const containerDefinition = taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ SomeKey: 'SomeValue', Timeout: 900 }),
}).next(
  new tasks.EcsRunTask(stack, 'FargateTask', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    cluster,
    taskDefinition,
    assignPublicIp: true,
    containerOverrides: [
      {
        containerDefinition,
        environment: [
          {
            name: 'SOME_KEY',
            value: sfn.JsonPath.stringAt('$.SomeKey'),
          },
        ],
      },
    ],
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
    taskTimeout: sfn.Timeout.at('$.Timeout'),
    cpu: '1024',
    memoryMiB: '2048',
  }),
).next(
  new tasks.EcsRunTask(stack, 'FargateTaskSetRevisionNumber', {
    cluster,
    taskDefinition,
    revisionNumber: 1,
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
  }),
).next(
  new tasks.EcsRunTask(stack, 'FargateTaskWithPropagatedTag', {
    cluster,
    taskDefinition,
    launchTarget: new tasks.EcsFargateLaunchTarget({
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    }),
    propagatedTagSource: ecs.PropagatedTagSource.TASK_DEFINITION,
  }),
);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new IntegTest(app, 'SfnTasksEcsFargateRunTaskTest', {
  testCases: [stack],
});

app.synth();
