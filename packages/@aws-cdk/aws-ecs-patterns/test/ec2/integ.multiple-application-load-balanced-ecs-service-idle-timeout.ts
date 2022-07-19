import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol, SslPolicy } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';

import { ApplicationMultipleTargetGroupsEc2Service } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

// One load balancer with one listener and two target groups.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableExecuteCommand: true,
  loadBalancers: [
    {
      name: 'lb',
      idleTimeout: Duration.seconds(400),
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

new integ.IntegTest(app, 'multiAlbEcsEc2Test', {
  testCases: [stack],
});

app.synth();