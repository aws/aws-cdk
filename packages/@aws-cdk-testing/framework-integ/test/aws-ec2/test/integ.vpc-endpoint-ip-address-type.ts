import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'VpcEndpointIpAddressTypeStack');

const vpc = new ec2.Vpc(stack, 'DualStackVpc', {
  ipProtocol: ec2.IpProtocol.DUAL_STACK,
});

vpc.addInterfaceEndpoint('IPv4', {
  privateDnsEnabled: false,
  service: ec2.InterfaceVpcEndpointAwsService.BEDROCK,
  subnets: { subnetType: ec2.SubnetType.PUBLIC },
  ipAddressType:ec2.IpAddressType.IPV4,
});

vpc.addInterfaceEndpoint('IPv6', {
  privateDnsEnabled: false,
  service: ec2.InterfaceVpcEndpointAwsService.S3_TABLES,
  subnets: { subnetType: ec2.SubnetType.PUBLIC },
  ipAddressType:ec2.IpAddressType.IPV6,
});

new IntegTest(app, 'VpcEndpointIpAddressTypeTest', {
  testCases: [stack],
});
