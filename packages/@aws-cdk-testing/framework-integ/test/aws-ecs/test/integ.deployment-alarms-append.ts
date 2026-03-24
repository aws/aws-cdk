import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new App();
const stack = new Stack(app, 'EcsDeploymentAlarmsAppendStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDef = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDef.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 512,
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition: taskDef,
});

const alarm1 = new cloudwatch.Alarm(stack, 'Alarm1', {
  metric: service.metricCpuUtilization(),
  threshold: 80,
  evaluationPeriods: 1,
});

const alarm2 = new cloudwatch.Alarm(stack, 'Alarm2', {
  metric: service.metricMemoryUtilization(),
  threshold: 80,
  evaluationPeriods: 1,
});

service.enableDeploymentAlarms([alarm1.alarmName]);
service.enableDeploymentAlarms([alarm2.alarmName]);

new IntegTest(app, 'EcsDeploymentAlarmsAppendInteg', {
  testCases: [stack],
});
