import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:reduceEc2FargateCloudWatchPermissions': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-alb-fg-https');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
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
  enableExecuteCommand: true,
  domainName: 'test.example.com',
  domainZone: route53.HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
    hostedZoneId: 'fakeId',
    zoneName: 'example.com.',
  }),
  redirectHTTP: true,
});

new integ.IntegTest(app, 'albFargateServiceTest', {
  testCases: [stack],
});

app.synth();
