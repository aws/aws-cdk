import * as cdk from '../../core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'InvalidCidrStack');

new ec2.Vpc(stack, 'InvalidVpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.40.0/19'),
  maxAzs: 1,
  subnetConfiguration: [
    { name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
  ],
});

app.synth();
