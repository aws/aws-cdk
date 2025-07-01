import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'DualStackVpc');

const natProvider = ec2.NatProvider.gateway();
const vpc = new ec2.Vpc(stack, 'DualStackVpc', {
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  subnetConfiguration: [
    {
      name: 'Ipv6Public1',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Ipv6Public2',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Ipv6Private1',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  ],
  natGatewayProvider: natProvider,
});

const natGatewayId = natProvider.configuredGateways[0].gatewayId;
(vpc.privateSubnets[0] as ec2.PrivateSubnet).addIpv6Nat64Route(natGatewayId);

new lambda.Function(stack, 'Lambda_with_IPv6_VPC', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.PYTHON_3_9,
  vpc,
  ipv6AllowedForDualStack: true,
});

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});
