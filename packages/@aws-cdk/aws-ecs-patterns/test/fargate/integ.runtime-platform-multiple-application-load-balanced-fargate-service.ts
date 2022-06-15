import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, CpuArchitecture, ContainerImage, OperatingSystemFamily } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { ApplicationMultipleTargetGroupsFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-runtime-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Two load balancers with two listeners and two target groups.
new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  runtimePlatform: {
    cpuArchitecture: CpuArchitecture.X86_64,
    operatingSystemFamily: OperatingSystemFamily.LINUX,
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1',
        },
      ],
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2',
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
    {
      containerPort: 90,
      listener: 'listener2',
    },
  ],
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();