import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Cluster, ContainerImage, FargateTaskDefinition, NetworkMode } from 'aws-cdk-lib/aws-ecs';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { EcsTask } from 'aws-cdk-lib/aws-events-targets';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

/**
 * To deploy the stack in this integ test,
 * replace the account and region values with your AWS account and region to deploy to.
 */
const account = process.env.CDK_INTEG_ACCOUNT;
const region = process.env.CDK_INTEG_REGION;

const app = new App();
const stack = new Stack(app, 'IntegEcsImportedTaskDefStack');
const cluster = new Cluster(stack, 'Cluster');
const taskDefFamily = 'TaskDefinitionA';

const taskRole = new Role(stack, 'TaskRole', {
  roleName: 'TaskRoleA',
  assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
});
const taskDefinition = new FargateTaskDefinition(stack, 'TaskDef', {
  cpu: 1024,
  memoryLimitMiB: 2048,
  family: taskDefFamily,
  taskRole: taskRole,
});
taskDefinition.addContainer('web', {
  image: ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  portMappings: [
    { hostPort: 12345, containerPort: 12345 },
  ],
});

const importedTaskDef = FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TaskDefImport', {
  taskDefinitionArn: `arn:aws:ecs:${region}:${account}:task-definition/TaskDef`,
  taskRole: Role.fromRoleArn(stack, 'RoleImport', `arn:aws:iam::${account}:role/TaskRoleA`),
  networkMode: NetworkMode.AWS_VPC,
});

const eventRule = new Rule(stack, 'Rule', {
  targets: [new EcsTask({
    cluster,
    taskDefinition: importedTaskDef,
  })],
  schedule: Schedule.rate(Duration.days(1)),
});
eventRule.node.addDependency(taskDefinition);

new IntegTest(app, 'IntegTest-EcsImportedTaskDefinition', {
  testCases: [stack],
});
