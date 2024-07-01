import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'Ipv6Vpc');

const natProvider = ec2.NatProvider.gateway();
new ec2.Vpc(stack, 'Ipv6ProtocolVpc', {
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
      ipv6AssignAddressOnCreation: true,
    },
    {
      name: 'Priate',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      ipv6AssignAddressOnCreation: true,
    },
    {
      name: 'Isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      ipv6AssignAddressOnCreation: true,
    },
  ],
  natGatewayProvider: natProvider,
});

new IntegTest(app, 'Ipv6Testing', {
  testCases: [stack],
});

