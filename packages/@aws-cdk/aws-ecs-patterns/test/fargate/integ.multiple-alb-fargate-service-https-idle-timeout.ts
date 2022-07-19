import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol, SslPolicy } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';


import { ApplicationMultipleTargetGroupsFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-alb-fg-idletimeout');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Loadbalancer with idleTimeout set to 365 seconds
new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableECSManagedTags: true,
  enableExecuteCommand: true,
  loadBalancers: [
    {
      name: 'lb',
      idleTimeout: Duration.seconds(365),
      domainName: 'api.example.com',
      domainZone: zone,
      listeners: [
        {
          name: 'listener',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
    },
  ],
});

new integ.IntegTest(app, 'idleTimeoutTest', {
  testCases: [stack],
});

app.synth();
