import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'MyVpc');

// Test NetworkAcl and rules

const nacl1 = new ec2.NetworkAcl(stack, 'myNACL1', {
  vpc,
  networkAclName: 'CustomNetworkAclName',
  subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
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
