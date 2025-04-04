import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope:cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const loadBalancer = new elbv2.NetworkLoadBalancer(this, 'NLB', { vpc });

    new ec2.VpcEndpointService(this, 'vpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [loadBalancer],
      acceptanceRequired: true,
      contributorInsights: true,
      supportedIpAddressTypes: [ec2.IpAddressType.IPV4],
      allowedRegions: ['us-east-2'],
    });
  }
}

const stack = new TestStack(app, 'TestStackLoadBalancer');

new integ.IntegTest(app, 'VpcEndpointservice', {
  testCases: [stack],
});

app.synth();
