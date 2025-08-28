import * as path from 'path';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP, STEPFUNCTIONS_TASKS_FIX_RUN_ECS_TASK_POLICY } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates a state machine with a task state to run a job with ECS on Fargate
 * using a task definition provided by the previous state
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
const stack = new cdk.Stack(app, 'aws-sfn-tasks-ecs-fargate-run-tasktask-def');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
stack.node.setContext(STEPFUNCTIONS_TASKS_FIX_RUN_ECS_TASK_POLICY, false);

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

new IntegTest(app, 'SfnTasksEcsFargateRunTaskTest', {
  testCases: [stack],
});

app.synth();
