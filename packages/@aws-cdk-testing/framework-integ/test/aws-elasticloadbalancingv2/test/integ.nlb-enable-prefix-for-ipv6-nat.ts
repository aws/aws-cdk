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

const disabledNlb = new elbv2.NetworkLoadBalancer(stack, 'DisabledLb', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'DisabledLbSg', { vpc }),
  ],
  enablePrefixForIpv6SourceNat: false,
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
});

const tcpListener = disabledNlb.addListener('TcpListener', {
  port: 1229,
  protocol: elbv2.Protocol.TCP,
});
const tcpTargetGroup = new elbv2.NetworkTargetGroup(stack, 'TcpTargetGroup', {
  vpc,
  port: 1229,
  protocol: elbv2.Protocol.TCP,
  ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
});
tcpListener.addTargetGroups('TcpTargetGroup', tcpTargetGroup);

const enabledNlb = new elbv2.NetworkLoadBalancer(stack, 'EnabledLb', {
  vpc,
  internetFacing: true,
  securityGroups: [
    new ec2.SecurityGroup(stack, 'EnabledLbSg', { vpc }),
  ],
  ipAddressType: elbv2.IpAddressType.DUAL_STACK,
  enablePrefixForIpv6SourceNat: true,
});
const udpListener = enabledNlb.addListener('UdpListener', {
  port: 1229,
  protocol: elbv2.Protocol.UDP,
});
const udpTargetGroup = new elbv2.NetworkTargetGroup(stack, 'UdpTargetGroup', {
  vpc,
  port: 1229,
  protocol: elbv2.Protocol.UDP,
  ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
});
udpListener.addTargetGroups('TargetGroup', udpTargetGroup);

const tcpWithUdpListener = enabledNlb.addListener('TcpWithUdpListener', {
  port: 3502,
  protocol: elbv2.Protocol.TCP_UDP,
});
const tcpWithUdpTargetGroup = new elbv2.NetworkTargetGroup(stack, 'TcpWithUdpTargetGroup', {
  vpc,
  port: 3502,
  protocol: elbv2.Protocol.TCP_UDP,
  ipAddressType: elbv2.TargetGroupIpAddressType.IPV6,
});
tcpWithUdpListener.addTargetGroups('TcpWithUdpTargetGroup', tcpWithUdpTargetGroup);

new integ.IntegTest(app, 'NlbEnablePrefixForIpv6NatStackTest', {
  testCases: [stack],
});
