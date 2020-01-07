import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');

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

app.synth();
