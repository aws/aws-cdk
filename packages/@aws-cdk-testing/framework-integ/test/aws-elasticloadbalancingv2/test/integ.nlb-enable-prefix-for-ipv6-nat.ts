import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NlbEnablePrefixForIpv6NatStack');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
});

const instance = new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: new ec2.AmazonLinuxImage(),
});

const nlb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'SG', { vpc }),
  ],
  enablePrefixForIpv6SourceNat: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const listener = nlb.addListener('Listener', {
  port: 1229,
  protocol: elbv2.Protocol.UDP,
});

listener.addTargets('Target', {
  port: 1229,
  targets: [new targets.InstanceTarget(instance)],
});

nlb.connections.allowTo(instance, ec2.Port.udp(1229));

new integ.IntegTest(app, 'NlbEnablePrefixForIpv6NatStackTest', {
  testCases: [stack],
});
