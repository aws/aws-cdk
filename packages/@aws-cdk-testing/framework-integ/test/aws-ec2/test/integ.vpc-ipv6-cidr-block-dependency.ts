import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'VpcIpv6CidrBlockDependencyStack');

const vpc = new ec2.Vpc(stack, 'DualStackVpc', {
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  natGateways: 0,
  subnetConfiguration: [{ name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
});

const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
  allowAllOutbound: false,
});
securityGroup.addIngressRule(ec2.Peer.ipv6(cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks)), ec2.Port.tcp(443));
securityGroup.node.addDependency(vpc.ipv6CidrBlockCreated);

new IntegTest(app, 'VpcIpv6CidrBlockDependencyTest', {
  testCases: [stack],
});
