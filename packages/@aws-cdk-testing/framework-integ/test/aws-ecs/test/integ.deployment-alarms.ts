#!/usr/bin/env node
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-deployment-alarms');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{
    containerPort: 80,
  }],
});

// Create some CloudWatch alarms to use for deployment monitoring
const alarm1 = new cloudwatch.Alarm(stack, 'Alarm1', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ECS',
    metricName: 'CPUUtilization',
    statistic: 'Average',
  }),
  threshold: 80,
  evaluationPeriods: 1,
});

const alarm2 = new cloudwatch.Alarm(stack, 'Alarm2', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ECS',
    metricName: 'MemoryUtilization',
    statistic: 'Average',
  }),
  threshold: 80,
  evaluationPeriods: 1,
});

const alarm3 = new cloudwatch.Alarm(stack, 'Alarm3', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ApplicationELB',
    metricName: 'TargetResponseTime',
    statistic: 'Average',
  }),
  threshold: 1,
  evaluationPeriods: 1,
});

// Create a Fargate service with initial deployment alarms
const service = new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  deploymentAlarms: {
    alarmNames: [alarm1.alarmName],
  },
});

// Enable additional alarms via multiple calls to enableDeploymentAlarms
// This tests that the alarm names are properly concatenated
service.enableDeploymentAlarms([alarm2.alarmName]);
service.enableDeploymentAlarms([alarm3.alarmName]);

new IntegTest(app, 'EcsDeploymentAlarmsTest', {
  testCases: [stack],
});

app.synth();
