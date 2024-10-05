import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-alb-fg-ipv6');
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  restrictDefaultSecurityGroup: false,
});
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const service = new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const integ = new IntegTest(app, 'albFargateServiceTest', {
  testCases: [stack],
});

integ.assertions.httpApiCall(`http://${service.loadBalancer.loadBalancerDnsName}`, {
  method: 'GET',
  port: 443,
}).waitForAssertions({
  totalTimeout: Duration.minutes(5),
  interval: Duration.seconds(10),
});
