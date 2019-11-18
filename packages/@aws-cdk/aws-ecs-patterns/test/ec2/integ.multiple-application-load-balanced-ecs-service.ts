import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');

import { ApplicationMultipleTargetGroupsEc2Service } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

// One load balancer with one listener, and two target groups attaching to it.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10
    }
  ]
});

app.synth();