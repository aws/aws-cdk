import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as codedeploy from '../../lib';
import { EcsAppSpec } from '../../lib';

/**
 * Follow these instructions to manually test running a CodeDeploy deployment with the resources provisioned in this stack:
 *
 * 1. Deploy the stack:
```
$ cdk deploy --app 'node integ.deployment.js' aws-cdk-codedeploy-ecs-deployment
```
 *
 * 2. Destroy the stack:
```
$ cdk destroy --app 'node integ.deployment.js' aws-cdk-codedeploy-ecs-deployment
```
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-ecs-deployment');

// Network infrastructure
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

// ECS service
const cluster = new ecs.Cluster(stack, 'EcsCluster', {
  vpc,
});
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  portMappings: [{ containerPort: 80 }],
});
const service = new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  deploymentController: {
    type: ecs.DeploymentControllerType.CODE_DEPLOY,
  },
});

// Load balancer
const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'ServiceLB', {
  vpc,
  internetFacing: false,
});

// Listeners
const prodListener = loadBalancer.addListener('ProdListener', {
  port: 80, // port for production traffic
  protocol: elbv2.ApplicationProtocol.HTTP,
});
const testListener = loadBalancer.addListener('TestListener', {
  port: 9002, // port for testing
  protocol: elbv2.ApplicationProtocol.HTTP,
});

// Target groups
const blueTG = prodListener.addTargets('BlueTG', {
  port: 80,
  protocol: elbv2.ApplicationProtocol.HTTP,
  targets: [
    service.loadBalancerTarget({
      containerName: 'Container',
      containerPort: 80,
    }),
  ],
  deregistrationDelay: cdk.Duration.seconds(30),
  healthCheck: {
    interval: cdk.Duration.seconds(5),
    healthyHttpCodes: '200',
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 3,
    timeout: cdk.Duration.seconds(4),
  },
});

const greenTG = new elbv2.ApplicationTargetGroup(stack, 'GreenTG', {
  vpc,
  port: 80,
  protocol: elbv2.ApplicationProtocol.HTTP,
  targetType: elbv2.TargetType.IP,
  deregistrationDelay: cdk.Duration.seconds(30),
  healthCheck: {
    interval: cdk.Duration.seconds(5),
    healthyHttpCodes: '200',
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 3,
    timeout: cdk.Duration.seconds(4),
  },
});

testListener.addTargetGroups('GreenTGTest', {
  targetGroups: [greenTG],
});

prodListener.node.addDependency(greenTG);
testListener.node.addDependency(blueTG);
service.node.addDependency(testListener);
service.node.addDependency(greenTG);

// Alarms: monitor 500s and unhealthy hosts on target groups
const blueUnhealthyHosts = new cloudwatch.Alarm(stack, 'BlueUnhealthyHosts', {
  alarmName: stack.stackName + '-Unhealthy-Hosts-Blue',
  metric: blueTG.metricUnhealthyHostCount(),
  threshold: 1,
  evaluationPeriods: 2,
});

const blueApiFailure = new cloudwatch.Alarm(stack, 'Blue5xx', {
  alarmName: stack.stackName + '-Http-500-Blue',
  metric: blueTG.metricHttpCodeTarget(
    elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
    { period: cdk.Duration.minutes(1) },
  ),
  threshold: 1,
  evaluationPeriods: 1,
});

const greenUnhealthyHosts = new cloudwatch.Alarm(stack, 'GreenUnhealthyHosts', {
  alarmName: stack.stackName + '-Unhealthy-Hosts-Green',
  metric: greenTG.metricUnhealthyHostCount(),
  threshold: 1,
  evaluationPeriods: 2,
});

const greenApiFailure = new cloudwatch.Alarm(stack, 'Green5xx', {
  alarmName: stack.stackName + '-Http-500-Green',
  metric: greenTG.metricHttpCodeTarget(
    elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
    { period: cdk.Duration.minutes(1) },
  ),
  threshold: 1,
  evaluationPeriods: 1,
});

// Deployment group
const deploymentConfig = new codedeploy.EcsDeploymentConfig(stack, 'CanaryConfig', {
  trafficRouting: codedeploy.TrafficRouting.timeBasedCanary({
    interval: cdk.Duration.minutes(1),
    percentage: 20,
  }),
});

const dg = new codedeploy.EcsDeploymentGroup(stack, 'DG', {
  application: new codedeploy.EcsApplication(stack, 'App', {
    applicationName: 'MyApp',
  }),
  alarms: [
    blueUnhealthyHosts,
    blueApiFailure,
    greenUnhealthyHosts,
    greenApiFailure,
  ],
  deploymentGroupName: 'MyDG',
  service,
  blueGreenDeploymentConfig: {
    blueTargetGroup: blueTG,
    greenTargetGroup: greenTG,
    listener: prodListener,
    testListener,
    terminationWaitTime: cdk.Duration.minutes(1),
  },
  deploymentConfig,
  autoRollback: {
    stoppedDeployment: true,
  },
});

const deployment = new codedeploy.EcsDeployment({
  deploymentGroup: dg,
  description: 'test deployment',
  autoRollback: {
    stoppedDeployment: true,
  },
  timeout: Duration.minutes(60),
  appspec: new EcsAppSpec({
    taskDefinition,
    containerName: 'Container',
    containerPort: 80,
  }),
});

// Outputs to use for manual testing
new cdk.CfnOutput(stack, 'Subnet1Id', { value: vpc.privateSubnets[0].subnetId });
new cdk.CfnOutput(stack, 'Subnet2Id', { value: vpc.privateSubnets[1].subnetId });
new cdk.CfnOutput(stack, 'SecurityGroupId', { value: service.connections.securityGroups[0].securityGroupId });
new cdk.CfnOutput(stack, 'CodeDeployApplicationName', { value: dg.application.applicationName });
new cdk.CfnOutput(stack, 'CodeDeployDeploymentGroupName', { value: dg.deploymentGroupName });
new cdk.CfnOutput(stack, 'DeploymentId', { value: deployment.deploymentId });

new integ.IntegTest(app, 'EcsDeploymentGroupTest', {
  testCases: [stack],
});

app.synth();
