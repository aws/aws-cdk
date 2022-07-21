import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, AsgCapacityProvider, EcsOptimizedImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { NetworkLoadBalancedEc2Service } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });
const provider1 = new AsgCapacityProvider(stack, 'FirstCapacityProvier', {
  autoScalingGroup: new AutoScalingGroup(stack, 'FirstAutoScalingGroup', {
    vpc,
    instanceType: new InstanceType('t2.micro'),
    machineImage: EcsOptimizedImage.amazonLinux2(),
  }),
  capacityProviderName: 'first-capacity-provider',
});
cluster.addAsgCapacityProvider(provider1);
const provider2 = new AsgCapacityProvider(stack, 'SecondCapacityProvier', {
  autoScalingGroup: new AutoScalingGroup(stack, 'SecondAutoScalingGroup', {
    vpc,
    instanceType: new InstanceType('t3.micro'),
    machineImage: EcsOptimizedImage.amazonLinux2(),
  }),
  capacityProviderName: 'second-capacity-provider',
});
cluster.addAsgCapacityProvider(provider2);

// one service with multi capacity provider strategies
new NetworkLoadBalancedEc2Service(stack, 'myService', {
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

new integ.IntegTest(app, 'networkLoadBalancedEc2ServiceTest', {
  testCases: [stack],
});

app.synth();