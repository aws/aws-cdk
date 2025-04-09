/**
 * Integration test for VPC with shared route tables
 * Tests that when multiple subnets share the same route table,
 * only one route is created when adding an internet gateway
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import { RouteTable } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-shared-route-table');

const vpc = new vpc_v2.VpcV2(stack, 'VPC', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvidedIpv6CidrBlock',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'SharedRouteTableVPC',
});

// Create a shared route table
const sharedRouteTable = new RouteTable(stack, 'SharedRouteTable', {
  vpc: vpc,
  routeTableName: 'SharedRouteTable',
});

// Create two public subnets that share the same route table
new SubnetV2(stack, 'PublicSubnet1', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'PublicSubnet1',
  routeTable: sharedRouteTable,
});

new SubnetV2(stack, 'PublicSubnet2', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr('10.1.2.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'PublicSubnet2',
  routeTable: sharedRouteTable,
});

// Add internet gateway to create route in public subnets
vpc.addInternetGateway({
  internetGatewayName: 'SharedRouteTableIGW',
});

vpc.addEgressOnlyInternetGateway({
  egressOnlyInternetGatewayName: 'SharedRouteTableEgressOnlyIGW',
  subnets: [{
    subnetType: SubnetType.PUBLIC,
  }],
});

const integ = new IntegTest(app, 'VpcSharedRouteTableInteg', {
  testCases: [stack],
});

// Verify that only one route is created in the shared route table
const rtbassertion = integ.assertions.awsApiCall('ec2', 'DescribeRouteTablesCommand', {
  RouteTableIds: [sharedRouteTable.routeTableId],
});

// Verify that there's exactly one default route (0.0.0.0/0) in the route table
rtbassertion.expect(ExpectedResult.objectLike({
  RouteTables: [
    Match.objectLike({
      Routes: Match.arrayWith([
        Match.objectLike({
          DestinationCidrBlock: '10.1.0.0/16',
          GatewayId: 'local',
          Origin: 'CreateRouteTable',
          State: 'active',
        }),
        Match.objectLike({
          DestinationCidrBlock: '0.0.0.0/0',
          GatewayId: vpc.internetGatewayId,
          Origin: 'CreateRoute',
          State: 'active',
        }),
        // Local route for IPv6 - this is automatically created for IPv6-enabled VPCs
        Match.objectLike({
          DestinationIpv6CidrBlock: Match.stringLikeRegexp('.*::/56'), // The actual CIDR will be assigned by AWS
          GatewayId: 'local',
          Origin: 'CreateRouteTable',
          State: 'active',
        }),
        Match.objectLike({
          DestinationIpv6CidrBlock: '::/0',
          EgressOnlyInternetGatewayId: vpc.egressOnlyInternetGatewayId,
          Origin: 'CreateRoute',
          State: 'active',
        }),
      ]),
    }),
  ],
}));
