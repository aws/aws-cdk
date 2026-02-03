import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'DualStackVpc');

const natProvider = ec2.NatProvider.gateway();
const vpc = new ec2.Vpc(stack, 'DualStackProtocolVpc', {
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  subnetConfiguration: [
    {
      name: 'Pub1',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Pub2',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Priv1',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  ],
  natGatewayProvider: natProvider,
});

const natGatewayId = natProvider.configuredGateways[0].gatewayId;
(vpc.privateSubnets[0] as ec2.PrivateSubnet).addIpv6Nat64Route(natGatewayId);

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});

