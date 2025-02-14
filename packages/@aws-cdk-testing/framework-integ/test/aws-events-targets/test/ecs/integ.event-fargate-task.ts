import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-integ-fargate');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');

// Create a Task Definition for the container to start
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Create a Task Definition with EC2 and FARGATE compatibility
const taskDefinitionWithCompatibility = new ecs.TaskDefinition(stack, 'TaskDefWithCompatibility', {
  networkMode: ecs.NetworkMode.AWS_VPC,
  compatibility: ecs.Compatibility.EC2_AND_FARGATE,
  cpu: '256',
  memoryMiB: '512',
});
taskDefinitionWithCompatibility.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// A rule that describes the event trigger (in this case a scheduled run)
const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

// Use EcsTask as the target of the Rule
rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  taskCount: 1,
  enableExecuteCommand: true,
  cpu: '512',
  memory: '512',
  containerOverrides: [{
    containerName: 'TheContainer',
    environment: [
      { name: 'I_WAS_TRIGGERED', value: 'From CloudWatch Events' },
    ],
  }],
  deadLetterQueue,
  propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
  tags: [
    {
      key: 'my-tag',
      value: 'my-tag-value',
    },
  ],
}));

// add public EcsTask as the target of the Rule
rule.addTarget(
  new targets.EcsTask({
    cluster,
    taskDefinition,
    assignPublicIp: true,
    subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
  }),
);

// add EcsTask with EC2 and FARGATE compatibility as the target of the Rule
rule.addTarget(
  new targets.EcsTask({
    cluster,
    taskDefinition: taskDefinitionWithCompatibility,
    launchType: ecs.LaunchType.FARGATE,
  }),
);

new integ.IntegTest(app, 'EcsFargateTest', {
  testCases: [stack],
});

app.synth();
