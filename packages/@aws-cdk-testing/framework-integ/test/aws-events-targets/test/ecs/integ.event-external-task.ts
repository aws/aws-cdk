import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-external');

const cluster = new ecs.Cluster(stack, 'EcsCluster');

// Create a Task Definition with EXTERNAL compatibility
const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
  networkMode: ecs.NetworkMode.BRIDGE, // Non-AWS_VPC network mode
  compatibility: ecs.Compatibility.EXTERNAL,
  cpu: '256',
  memoryMiB: '512',
});
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
});

const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

// Use EcsTask with EXTERNAL launch type
rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  launchType: ecs.LaunchType.EXTERNAL,
}));

new integ.IntegTest(app, 'EcsExternalTest', {
  testCases: [stack],
});

app.synth();
