import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Stack } from '@aws-cdk/core';

import { ApplicationLoadBalancedFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Loadbalancer with HTTPS
new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  protocol: ApplicationProtocol.HTTPS,
  enableECSManagedTags: true,
  domainName: 'test.example.com',
  domainZone: {
    hostedZoneId: 'fakeId',
    zoneName: 'example.com.',
    hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
    stack,
    node: stack.node,
  },
});

app.synth();