/**
 * Integration test to add assertions for methods that allows user to customize subnet options as an input
 */

import * as vpc_v2 from '../lib/vpc-v2';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import { RouteTable } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-gateways');

const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-gateway', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'CDKintegTestVPC',
});

const routeTable1 = new RouteTable(stack, 'TestRouteTable', {
  vpc: vpc,
  routeTableName: 'TestRouteTable',
});

const subnet1 = new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr('10.1.1.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'CDKIntegTestSubnet',
  routeTable: routeTable1,
});

const routeTable2 = new RouteTable(stack, 'TestRouteTable2', {
  vpc: vpc,
  routeTableName: 'TestRouteTable2',
});

const subnet2 = new SubnetV2(stack, 'testsubnet2', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr('10.1.2.0/28'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'CDKIntegTestSubnet2',
  routeTable: routeTable2,
});

// Add route only for specific subnets
vpc.addInternetGateway({
  internetGatewayName: 'CDKIntegTestTagIGW',
  ipv4Destination: '192.168.0.0/16',
  subnets: [subnet1, subnet2],
});

// Add route only for specific subnets
vpc.addEgressOnlyInternetGateway({
  egressOnlyInternetGatewayName: 'CDKIntegTestTagEIGW',
  destination: '2600:1f00::/24',
  subnets: [subnet1, subnet2],
});

const integ = new IntegTest(app, 'VpcSameAccountInteg', {
  testCases: [stack],
});

// Verify that IGW is attached to VPC
const igwassertion = integ.assertions.awsApiCall('ec2', 'DescribeInternetGatewaysCommand', {
  InternetGatewayId: [vpc.internetGatewayId],
});

igwassertion.expect(ExpectedResult.objectLike({
  InternetGateways: [
    Match.objectLike({
      InternetGatewayId: vpc.internetGatewayId,
      Attachments: Match.arrayWith([
        Match.objectLike({
          State: 'available',
          VpcId: vpc.vpcId,
        }),
      ]),
    }),
  ],
}));

// Verify that EIGW is attached to VPC
const eigwassertion = integ.assertions.awsApiCall('ec2', 'DescribeEgressOnlyInternetGatewaysCommand', {
  EgressOnlyInternetGatewayId: [vpc.egressOnlyInternetGatewayId],
});

eigwassertion.expect(ExpectedResult.objectLike({
  EgressOnlyInternetGateways: [
    Match.objectLike({
      EgressOnlyInternetGatewayId: vpc.egressOnlyInternetGatewayId,
      Attachments: Match.arrayWith([
        Match.objectLike({
          State: 'attached',
          VpcId: vpc.vpcId,
        }),
      ]),
    }),
  ],
}));

// Verify that the Gateways route is restricted to destination and given subnet's route table.
const rtbassertion = integ.assertions.awsApiCall('ec2', 'DescribeRouteTablesCommand', {
  RouteTableIds: [routeTable1.routeTableId, routeTable2.routeTableId],
});

rtbassertion.expect(ExpectedResult.objectLike({
  RouteTables: [
    Match.objectLike({
      RouteTableId: routeTable2.routeTableId,
      Routes: Match.arrayWith([
        Match.objectLike({
          DestinationCidrBlock: '192.168.0.0/16',
          GatewayId: vpc.internetGatewayId,
        }),
        Match.objectLike({
          DestinationIpv6CidrBlock: '2600:1f00::/24',
          EgressOnlyInternetGatewayId: vpc.egressOnlyInternetGatewayId,
        }),
      ]),
    }),
    Match.objectLike({
      RouteTableId: routeTable1.routeTableId,
      Routes: Match.arrayWith([
        Match.objectLike({
          DestinationCidrBlock: '192.168.0.0/16',
          GatewayId: vpc.internetGatewayId,
        }),
        Match.objectLike({
          DestinationIpv6CidrBlock: '2600:1f00::/24',
          EgressOnlyInternetGatewayId: vpc.egressOnlyInternetGatewayId,
        }),
      ]),
    }),
  ],
}));
