import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'AlbFargatePidMode');
const vpc = new ec2.Vpc(stack, 'Vpc', { natGateways: 0 });
const service = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
  vpc,
  assignPublicIp: true,
  taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  openListener: false,
  pidMode: ecs.PidMode.TASK,
  runtimePlatform: { operatingSystemFamily: ecs.OperatingSystemFamily.LINUX },
  platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
  taskImageOptions: { image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
});

const test = new integ.IntegTest(app, 'AlbFargatePidModeTest', { testCases: [stack] });
test.assertions.awsApiCall('ECS', 'describeTaskDefinition', {
  taskDefinition: service.taskDefinition.taskDefinitionArn,
}).expect(integ.ExpectedResult.objectLike({ taskDefinition: { pidMode: 'task' } }));
