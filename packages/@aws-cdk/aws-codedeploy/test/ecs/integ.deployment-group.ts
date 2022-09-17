import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { ComparisonOperator } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, TargetType } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as codedeploy from '../../lib';
import { EcsDeploymentConfig } from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-ecs-dg');

const vpc = new ec2.Vpc(stack, 'VPC');

const cluster = new ecs.Cluster(stack, 'MyCluster', {
  vpc,
});
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'MyTaskDef', {
  cpu: 256,
  memoryLimitMiB: 512,
  family: 'nginx',
});
taskDefinition.addContainer('MyContainer', {
  image: ecs.ContainerImage.fromRegistry('nginx@sha256:79c77eb7ca32f9a117ef91bc6ac486014e0d0e75f2f06683ba24dc298f9f4dd4'),
  portMappings: [{
    containerPort: 80,
  }],
});
const service = new ecs.FargateService(stack, 'MyService', {
  cluster,
  taskDefinition,
});
const blueTargetGroup = new ApplicationTargetGroup(stack, 'BlueTargetGroup', {
  vpc,
  protocol: ApplicationProtocol.HTTP,
  targetType: TargetType.IP,
});
const greenTargetGroup = new ApplicationTargetGroup(stack, 'GreenTargetGroup', {
  vpc,
  protocol: ApplicationProtocol.HTTP,
  targetType: TargetType.IP,
});
const loadBalancer = new ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
});
const listener = loadBalancer.addListener('Listener', {
  defaultTargetGroups: [blueTargetGroup],
  port: 80,
});
service.attachToApplicationTargetGroup(blueTargetGroup);

new codedeploy.EcsDeploymentGroup(stack, 'CodeDeployGroup', {
  deploymentConfig: EcsDeploymentConfig.CANARY_10_PERCENT_5_MINUTES,
  services: [service],
  alarms: [
    new cloudwatch.Alarm(stack, 'Alarm1', {
      metric: loadBalancer.metricTargetResponseTime(),
      threshold: 3,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    }),
  ],
  blueGreenDeploymentConfiguration: {
    prodListener: listener,
    blueTargetGroup: blueTargetGroup,
    greenTargetGroup: greenTargetGroup,
  },
  autoRollback: {
    failedDeployment: false,
    deploymentInAlarm: false,
  },
});

new integ.IntegTest(app, 'EcsTest', {
  testCases: [stack],
});

app.synth();