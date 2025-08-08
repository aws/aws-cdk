import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { NetworkLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

/**
 * In order to test this you need prepare a certificate.
 */
const certArn = process.env.CDK_INTEG_CERT_ARN || process.env.CERT_ARN;
if (!certArn) throw new Error('For this test you must provide your own Certificate as an env var "CERT_ARN". See framework-integ/README.md for details.');

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new Stack(app, 'tls-network-load-balanced-ecs-service');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
  instanceType: new InstanceType('t2.small'),
  desiredCapacity: 2,
});

const listenerCertificate = Certificate.fromCertificateArn(stack, 'myCert', certArn);

// EC2 Service and NLB with TLS listener
new NetworkLoadBalancedEc2Service(stack, 'myServiceWithTls', {
  cluster,
  memoryLimitMiB: 256,
  listenerCertificate,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

new integ.IntegTest(app, 'networkLoadBalancedEc2ServiceTest', {
  testCases: [stack],
});

app.synth();
