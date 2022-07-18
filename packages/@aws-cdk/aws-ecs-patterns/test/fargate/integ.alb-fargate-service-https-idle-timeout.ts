import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';


import { ApplicationLoadBalancedFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-alb-fg-idletimeout');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Loadbalancer with idleTimeout set to 120 seconds
new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  protocol: ApplicationProtocol.HTTPS,
  enableECSManagedTags: true,
  enableExecuteCommand: true,
  domainName: 'test.example.com',
  domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'fakeId',
    zoneName: 'example.com.',
  }),
  redirectHTTP: true,
  idleTimeout: Duration.seconds(120),
});

new integ.IntegTest(app, 'idleTimeoutTest', {
  testCases: [stack],
});

app.synth();
