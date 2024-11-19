import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IpAddressType } from '../../../../../aws-cdk-lib/aws-elasticloadbalancingv2/lib/shared/enums';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'NlbEnablePrefixForIpv6NatStack');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
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

const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup1', { 
  vpc,
  port: 80,
  IpAddressType: IpAddressType.DUAL_STACK,
  protocol: elbv2.Protocol.UDP,
  targetType: elbv2.TargetType.INSTANCE,
});

nlb.addListener('Listener', {
  port: 80,
  protocol: elbv2.Protocol.UDP,
  defaultAction: elbv2.NetworkListenerAction.forward([group]),
});

new integ.IntegTest(app, 'NlbEnablePrefixForIpv6NatStackTest', {
  testCases: [stack],
});
