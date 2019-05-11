import cdk = require('@aws-cdk/cdk');
import ec2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc');

const vpc = new ec2.VpcNetwork(stack, 'MyVpc');

// Test Security Group Rules
const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

const rules = [
  new ec2.IcmpPing(),
  new ec2.IcmpAllTypeCodes(128),
  new ec2.IcmpAllTypesAndCodes(),
  new ec2.UdpAllPorts(),
  new ec2.UdpPort(123),
  new ec2.UdpPortRange(800, 801),
];

for (const rule of rules) {
  sg.addIngressRule(new ec2.AnyIPv4(), rule);
}

app.run();
