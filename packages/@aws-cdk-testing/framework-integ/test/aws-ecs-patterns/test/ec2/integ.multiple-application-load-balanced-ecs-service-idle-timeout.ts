import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationProtocol, SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationMultipleTargetGroupsEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
    '@aws-cdk/aws-ecs:reduceEc2FargateCloudWatchPermissions': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-alb-idle-timeout');
stack.node.setContext(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE, false);
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

// Two load balancers with different idle timeouts.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableExecuteCommand: true,
  loadBalancers: [
    {
      name: 'lb1',
      idleTimeout: Duration.seconds(5),
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
    {
      name: 'lb2',
      idleTimeout: Duration.seconds(500),
      domainName: 'frontend.example.com',
      domainZone: zone,
      listeners: [
        {
          name: 'listener2',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener',
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener',
    },
    {
      containerPort: 443,
      listener: 'listener2',
    },
    {
      containerPort: 80,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener2',
    },
  ],
});

new integ.IntegTest(app, 'multiAlbEcsEc2Test', {
  testCases: [stack],
});

app.synth();
