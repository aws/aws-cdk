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

app.synth();
