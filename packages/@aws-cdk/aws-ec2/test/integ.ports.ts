import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib/index';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const sg = new ec2.SecurityGroup(this, 'SecGroup', {
      vpc,
    });
    sg.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.allIcmpV6(),
      'allow ICMP6',
    );
  }
}

new TestStack(app, 'TestStack');

new IntegTest(app, 'Ports', {
  testCases: [
    new TestStack(app, 'PortsTestStack', {}),
  ],
});

app.synth();
