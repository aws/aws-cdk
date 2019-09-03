import cdk = require('@aws-cdk/core');
import ec2 = require('../lib');
import { AclCidr, AclTraffic, TrafficDirection } from '../lib';

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
  traffic: AclTraffic.udpPort(53),
  cidr: AclCidr.ipv4('172.16.0.0/24'),
  direction: TrafficDirection.EGRESS,
});

nacl1.addEntry('AllowDNSIngress', {
  ruleNumber: 100,
  traffic: AclTraffic.udpPort(53),
  direction: TrafficDirection.INGRESS,
  cidr: AclCidr.anyIpv4()
});

app.synth();
