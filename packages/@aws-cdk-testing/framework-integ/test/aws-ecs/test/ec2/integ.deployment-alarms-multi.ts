import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-deployment-alarms-multi');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
});

const svc = new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});

const alarm1 = new cloudwatch.Alarm(stack, 'Alarm1', {
  metric: svc.metricCpuUtilization(),
  evaluationPeriods: 5,
  threshold: 80,
});

const alarm2 = new cloudwatch.Alarm(stack, 'Alarm2', {
  metric: svc.metricMemoryUtilization(),
  evaluationPeriods: 5,
  threshold: 80,
});

svc.enableDeploymentAlarms([alarm1.alarmName]);
svc.enableDeploymentAlarms([alarm2.alarmName]);

new integ.IntegTest(app, 'DeploymentAlarmsMulti', {
  testCases: [stack],
});
app.synth();
