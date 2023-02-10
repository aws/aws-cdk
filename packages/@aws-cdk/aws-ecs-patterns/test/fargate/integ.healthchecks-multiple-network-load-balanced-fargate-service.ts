import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { NetworkMultipleTargetGroupsFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-multi-nlb-healthchecks');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Two load balancers with two listeners and two target groups.
const networkMultipleTargetGroupsFargateService = new NetworkMultipleTargetGroupsFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
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

networkMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({});

networkMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({});


new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
