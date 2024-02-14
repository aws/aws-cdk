import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

/**
 * Follow these instructions to manually test running a CodeDeploy deployment with the resources provisioned in this stack:
 *
 * 1. Deploy the stack:
```
$ cdk deploy --app 'node integ.deployment-group.js' aws-cdk-codedeploy-ecs-dg
```
 *
 * 2. Create a file called `appspec.json` with the following contents, replacing the placeholders with output values from the deployed stack:
```
{
  "version": 0.0,
  "Resources": [
    {
      "TargetService": {
        "Type": "AWS::ECS::Service",
        "Properties": {
          "TaskDefinition": "<PLACEHOLDER - NEW TASK DEFINITION>",
          "LoadBalancerInfo": {
            "ContainerName": "Container",
            "ContainerPort": 80
          },
          "PlatformVersion": "LATEST",
          "NetworkConfiguration": {
            "awsvpcConfiguration": {
              "subnets": [
                "<PLACEHOLDER - SUBNET 1 ID>",
                "<PLACEHOLDER - SUBNET 2 ID>",
              ],
              "securityGroups": [
                "<PLACEHOLDER - SECURITY GROUP ID>"
              ],
              "assignPublicIp": "DISABLED"
            }
          }
        }
      }
    }
  ]
}
```
 *
 * 3. Start the deployment:
```
$ appspec=$(jq -R -s '.' < appspec.json | sed 's/\\n//g')
$ aws deploy create-deployment \
   --application-name <PLACEHOLDER - CODEDEPLOY APPLICATION NAME> \
   --deployment-group-name <PLACEHOLDER - CODEDEPLOY DEPLOYMENT GROUP NAME> \
   --description "AWS CDK integ test" \
   --revision revisionType=AppSpecContent,appSpecContent={content="$appspec"}
```
 *
 * 4. Wait for the deployment to complete successfully, providing the deployment ID from the previous step:
```
$ aws deploy wait deployment-successful --deployment-id <PLACEHOLDER - DEPLOYMENT ID>
```
 *
 * 5. Destroy the stack:
```
$ cdk destroy --app 'node integ.deployment-group.js' aws-cdk-codedeploy-ecs-dg
```
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-ecs-dg');

// Network infrastructure
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

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

// A second task definition for testing a CodeDeploy deployment of the ECS service to a new task definition
const taskDefinition2 = new ecs.FargateTaskDefinition(stack, 'TaskDef2');
taskDefinition2.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest'),
  portMappings: [{ containerPort: 80 }],
});
service.node.addDependency(taskDefinition2);

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

const dg = new codedeploy.EcsDeploymentGroup(stack, 'BlueGreenDG', {
  alarms: [
    blueUnhealthyHosts,
    blueApiFailure,
    greenUnhealthyHosts,
    greenApiFailure,
  ],
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
  ignoreAlarmConfiguration: true,
});

// Outputs to use for manual testing
new cdk.CfnOutput(stack, 'NewTaskDefinition', { value: taskDefinition2.taskDefinitionArn });
new cdk.CfnOutput(stack, 'Subnet1Id', { value: vpc.privateSubnets[0].subnetId });
new cdk.CfnOutput(stack, 'Subnet2Id', { value: vpc.privateSubnets[1].subnetId });
new cdk.CfnOutput(stack, 'SecurityGroupId', { value: service.connections.securityGroups[0].securityGroupId });
new cdk.CfnOutput(stack, 'CodeDeployApplicationName', { value: dg.application.applicationName });
new cdk.CfnOutput(stack, 'CodeDeployDeploymentGroupName', { value: dg.deploymentGroupName });

new integ.IntegTest(app, 'EcsDeploymentGroupTest', {
  testCases: [stack],
});

app.synth();
