import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NlbIpv6Stack');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const securityGroupNlb = new ec2.SecurityGroup(stack, 'SecurityGroupNlb', {
  vpc,
  allowAllOutbound: true,
});
const securityGroupService = new ec2.SecurityGroup(stack, 'SecurityGroupService', {
  vpc,
  allowAllOutbound: true,
});
securityGroupService.addIngressRule(ec2.Peer.securityGroupId(securityGroupNlb.securityGroupId), ec2.Port.tcp(80));

const nlbLoadbalancedFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NlbFargateService', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  securityGroups: [securityGroupService],
});
nlbLoadbalancedFargateService.loadBalancer.connections.addSecurityGroup(securityGroupNlb);
nlbLoadbalancedFargateService.loadBalancer.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

const integ = new IntegTest(app, 'NlbIpv6Test', {
  testCases: [stack],
});

integ.assertions.httpApiCall(`http://${nlbLoadbalancedFargateService.loadBalancer.loadBalancerDnsName}`, {
  method: 'GET',
  port: 80,
}).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(10),
});
