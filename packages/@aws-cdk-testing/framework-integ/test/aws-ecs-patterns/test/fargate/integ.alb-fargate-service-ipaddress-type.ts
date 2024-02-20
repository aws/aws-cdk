import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';
import { IpAddressType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App({ postCliContext: { [AUTOSCALING_GENERATE_LAUNCH_TEMPLATE]: false } });
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-fargate-ipaddress-type');

// Create VPC and ECS Cluster
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  subnetConfiguration: [
    {
      name: 'subnet',
      subnetType: ec2.SubnetType.PUBLIC,
      mapPublicIpOnLaunch: true,
      ipv6AssignAddressOnCreation: true,
    },
  ],
});
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Create ALB service with ipAddressType
new ecsPatterns.ApplicationLoadBalancedFargateService(
  stack,
  'AlbFargateServiceWithIpAddressType',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    ipAddressType: IpAddressType.DUAL_STACK,
    assignPublicIp: true,
  },
);

new integ.IntegTest(app, 'AlbFargateServiceWithIpAddressType', {
  testCases: [stack],
});

app.synth();
