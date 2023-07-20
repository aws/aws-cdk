import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { InstanceType, Vpc, SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, AsgCapacityProvider, EcsOptimizedImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-alb');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });
const securityGroup = new SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: true,
});
securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcpRange(32768, 65535));

const provider1 = new AsgCapacityProvider(stack, 'FirstCapacityProvier', {
  autoScalingGroup: new AutoScalingGroup(stack, 'FirstAutoScalingGroup', {
    vpc,
    instanceType: new InstanceType('t2.micro'),
    machineImage: EcsOptimizedImage.amazonLinux2(),
    securityGroup,
  }),
  capacityProviderName: 'first-capacity-provider',
});
cluster.addAsgCapacityProvider(provider1);

const provider2 = new AsgCapacityProvider(stack, 'SecondCapacityProvier', {
  autoScalingGroup: new AutoScalingGroup(stack, 'SecondAutoScalingGroup', {
    vpc,
    instanceType: new InstanceType('t3.micro'),
    machineImage: EcsOptimizedImage.amazonLinux2(),
    securityGroup,
  }),
  capacityProviderName: 'second-capacity-provider',
});
cluster.addAsgCapacityProvider(provider2);

// one service with multi capacity provider strategies
const applicationLoadBalancedEc2Service = new ApplicationLoadBalancedEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  capacityProviderStrategies: [
    {
      capacityProvider: provider1.capacityProviderName,
      base: 1,
      weight: 1,
    },
    {
      capacityProvider: provider2.capacityProviderName,
      base: 0,
      weight: 2,
    },
  ],
});
applicationLoadBalancedEc2Service.loadBalancer.connections.addSecurityGroup(securityGroup);

new integ.IntegTest(app, 'applicationLoadBalancedEc2ServiceTest', {
  testCases: [stack],
});

app.synth();
