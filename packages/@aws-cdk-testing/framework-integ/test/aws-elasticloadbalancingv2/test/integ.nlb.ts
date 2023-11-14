import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'allow https access from the world');

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  securityGroups: [sg],
});

const listener = lb.addListener('Listener', {
  port: 443,
});

const group = listener.addTargets('Target', {
  port: 443,
  targets: [new elbv2.IpTarget('10.0.1.1')],
});

group.configureHealthCheck({
  interval: cdk.Duration.seconds(250),
  timeout: cdk.Duration.seconds(100),
  protocol: elbv2.Protocol.TCP,
  healthyThresholdCount: 5,
  unhealthyThresholdCount: 2,
});

vpc.publicSubnets.forEach(subnet => group.node.addDependency(subnet));
group.node.addDependency(vpc.internetConnectivityEstablished);

// The target's security group must allow being routed by the LB and the clients.

new integ.IntegTest(app, 'elbv2-integ', {
  testCases: [stack],
});

app.synth();
