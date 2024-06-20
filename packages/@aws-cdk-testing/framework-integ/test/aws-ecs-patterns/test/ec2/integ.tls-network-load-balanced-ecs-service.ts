import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { NetworkLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

/**
 * In order to test this you need
 * to have a valid public hosted zone that you can use
 * to request certificates for.
 *
*/
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App();
const stack = new Stack(app, 'tls-network-load-balanced-ecs-service');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
  instanceType: new InstanceType('t2.small'),
  desiredCapacity: 2,
});

const hostedZone = PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});
const validation = CertificateValidation.fromDns(hostedZone);

// EC2 Service and NLB with TLS listener
new NetworkLoadBalancedEc2Service(stack, 'myServiceWithTls', {
  cluster,
  memoryLimitMiB: 256,
  listenerCertificate: new Certificate(stack, 'myCert', {
    domainName,
    validation,
  }),
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'networkLoadBalancedEc2ServiceTest', {
  testCases: [stack],
});

app.synth();
