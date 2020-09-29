import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');

const vpc = new ec2.Vpc(stack, 'MyVpc');

// Test NetworkAcl and rules

const nacl1 = new ec2.NetworkAcl(stack, 'myNACL1', {
  vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PRIVATE },
});

nacl1.addEntry('AllowDNSEgress', {
  ruleNumber: 100,
  traffic: ec2.AclTraffic.udpPort(53),
  cidr: ec2.AclCidr.ipv4('172.16.0.0/24'),
  direction: ec2.TrafficDirection.EGRESS,
});

nacl1.addEntry('AllowDNSIngress', {
  ruleNumber: 100,
  traffic: ec2.AclTraffic.udpPort(53),
  direction: ec2.TrafficDirection.INGRESS,
  cidr: ec2.AclCidr.anyIpv4(),
});

app.synth();
