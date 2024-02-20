import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';
import { IpAddressType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App({ postCliContext: { [AUTOSCALING_GENERATE_LAUNCH_TEMPLATE]: false } });
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-ec2-ipaddress-type');

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
const cluster = new ecs.Cluster(stack, 'Ec2Cluster', { vpc });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: true,
});
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcpRange(32768, 65535));
const provider = new ecs.AsgCapacityProvider(stack, 'CapacityProvier', {
  autoScalingGroup: new autoscaling.AutoScalingGroup(
    stack,
    'AutoScalingGroup',
    {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      securityGroup,
    },
  ),
  capacityProviderName: 'test-capacity-provider',
});
cluster.addAsgCapacityProvider(provider);

// Create ALB service with ipAddressType
const applicationLoadBalancedEc2Service = new ecsPatterns.ApplicationLoadBalancedEc2Service(
  stack,
  'AlbEc2ServiceWithIpAddressType',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    capacityProviderStrategies: [
      {
        capacityProvider: provider.capacityProviderName,
        base: 1,
        weight: 1,
      },
    ],
    ipAddressType: IpAddressType.DUAL_STACK,
  },
);
applicationLoadBalancedEc2Service.loadBalancer.connections.addSecurityGroup(securityGroup);

new integ.IntegTest(app, 'AlbEc2ServiceWithIpAddressType', {
  testCases: [stack],
});

app.synth();
