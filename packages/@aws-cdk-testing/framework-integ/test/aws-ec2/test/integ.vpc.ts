import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'MyVpc');

// Test Security Group Rules
const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

const rules = [
  ec2.Port.icmpPing(),
  ec2.Port.icmpType(128),
  ec2.Port.allIcmp(),
  ec2.Port.allUdp(),
  ec2.Port.udp(123),
  ec2.Port.udpRange(800, 801),
];

for (const rule of rules) {
  sg.addIngressRule(ec2.Peer.anyIpv4(), rule);
}

// Test various Peer types with type-safe rule configurations
// These use the IngressRuleConfig and EgressRuleConfig interfaces
sg.addIngressRule(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(443), 'Allow HTTPS from specific CIDR');
sg.addIngressRule(ec2.Peer.ipv6('2001:db8::/32'), ec2.Port.tcp(443), 'Allow HTTPS from IPv6 CIDR');
sg.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(80), 'Allow HTTP from any IPv6');

// Test egress rules with different peer types
sg.addEgressRule(ec2.Peer.ipv4('192.168.0.0/16'), ec2.Port.tcp(5432), 'Allow PostgreSQL to specific CIDR');
sg.addEgressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(443), 'Allow HTTPS to any IPv6');

app.synth();
