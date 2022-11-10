import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpn');

const vpc = new ec2.Vpc(stack, 'MyVpc');

new ec2.VpnConnection(stack, 'Asn', { // Custom ASN
  ip: '1.2.3.4',
  vpc: vpc,
  asn: 65001,
});

app.synth();
