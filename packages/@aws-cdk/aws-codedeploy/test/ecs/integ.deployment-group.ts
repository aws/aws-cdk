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
});
taskDefinition.addContainer('MyContainer', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  portMappings: [{
    containerPort: 80,
  }],
});
const service = new ecs.FargateService(stack, 'MyService', {
  cluster,
  taskDefinition,
});
const targetGroup = new ApplicationTargetGroup(stack, 'TargetGroup', {
  vpc,
  protocol: ApplicationProtocol.HTTP,
  targetType: TargetType.IP,
});
const loadBalancer = new ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
});
const listener = loadBalancer.addListener('Listener', {
  defaultTargetGroups: [targetGroup],
  port: 80,
});
service.attachToApplicationTargetGroup(targetGroup);

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
  prodTrafficRoute: {
    listener,
    targetGroup,
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