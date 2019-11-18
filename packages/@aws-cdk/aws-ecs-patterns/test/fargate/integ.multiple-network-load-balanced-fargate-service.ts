import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');

import { NetworkMultipleTargetGroupsFargateService } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// Two load balancers with two listeners individually, and two target groups attaching to them respectively.
new NetworkMultipleTargetGroupsFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1'
        }
      ]
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2'
        }
      ]
    }
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1'
    },
    {
      containerPort: 90,
      listener: 'listener2'
    }
  ]
});

app.synth();