import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NlbEnablePrefixForIpv6NatStack');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  natGateways: 0,
});

const nlb = new elbv2.NetworkLoadBalancer(stack, 'Lb', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'Sg', { vpc }),
  ],
  enablePrefixForIpv6SourceNat: true,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const listener = nlb.addListener('Listener', {
  port: 1229,
  protocol: elbv2.Protocol.UDP,
});
const targetGroup = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
  vpc,
  port: 1229,
  protocol: elbv2.Protocol.UDP,
  ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
});
listener.addTargetGroups('TargetGroup', targetGroup);

new integ.IntegTest(app, 'NlbEnablePrefixForIpv6NatStackTest', {
  testCases: [stack],
});
