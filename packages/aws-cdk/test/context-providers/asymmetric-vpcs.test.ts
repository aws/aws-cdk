/* eslint-disable import/order */
import {
  DescribeVpcsCommand,
  DescribeSubnetsCommand,
  DescribeRouteTablesCommand,
  DescribeVpnGatewaysCommand,
  RouteTable,
  Subnet,
  VpnGateway,
  EC2Client,
} from '@aws-sdk/client-ec2';

import { mockClient } from 'aws-sdk-client-mock';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProviderv3 } from '../util/mock-sdk';

const ec2Mock = mockClient(EC2Client);

beforeEach(() => {
  ec2Mock.reset();
});

const mockSDK = new MockSdkProviderv3();

test('looks up the requested (symmetric) VPC', async () => {
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, CidrBlock: '1.1.1.1/24' },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, CidrBlock: '1.1.2.1/24' },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'sub-123456' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '1.1.1.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: 'igw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
      {
        Associations: [{ SubnetId: 'sub-789012' }],
        RouteTableId: 'rtb-789012',
        Routes: [
          {
            DestinationCidrBlock: '1.1.2.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            NatGatewayId: 'nat-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
    vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }],

  });

  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Public',
        type: 'Public',
        subnets: [
          {
            subnetId: 'sub-123456',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-123456',
            cidr: '1.1.1.1/24',
          },
        ],
      },
      {
        name: 'Private',
        type: 'Private',
        subnets: [
          {
            subnetId: 'sub-789012',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-789012',
            cidr: '1.1.2.1/24',
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: 'gw-abcdef',
  });
});

test('throws when no such VPC is found', async () => {
  ec2Mock.on(DescribeVpcsCommand).resolves({});

  await expect(new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  })).rejects.toThrow(/Could not find any VPCs matching/);
});

test('throws when multiple VPCs are found', async () => {
  ec2Mock.on(DescribeVpcsCommand).resolves({ Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }] });

  await expect(new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  })).rejects.toThrow(/Found 2 VPCs matching/);
});

test('uses the VPC main route table when a subnet has no specific association', async () => {
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, CidrBlock: '1.1.1.1/24' },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, CidrBlock: '1.1.2.1/24' },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'sub-123456' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '1.1.1.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: 'igw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
      {
        Associations: [{ Main: true }],
        RouteTableId: 'rtb-789012',
        Routes: [
          {
            DestinationCidrBlock: '1.1.2.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            NatGatewayId: 'nat-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
    vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }],
  });

  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Public',
        type: 'Public',
        subnets: [
          {
            subnetId: 'sub-123456',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-123456',
            cidr: '1.1.1.1/24',
          },
        ],
      },
      {
        name: 'Private',
        type: 'Private',
        subnets: [
          {
            subnetId: 'sub-789012',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-789012',
            cidr: '1.1.2.1/24',
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: 'gw-abcdef',
  });
});

test('Recognize public subnet by route table', async () => {
  // GIVEN
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'sub-123456' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '10.0.2.0/26',
            Origin: 'CreateRoute',
            State: 'active',
            VpcPeeringConnectionId: 'pcx-xxxxxx',
          },
          {
            DestinationCidrBlock: '1.1.1.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: 'igw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Public',
        type: 'Public',
        subnets: [
          {
            subnetId: 'sub-123456',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-123456',
            cidr: undefined,
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: undefined,
  });
});

test('Recognize isolated subnet by route table', async () => {
  // GIVEN
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'sub-123456' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '1.1.2.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Isolated',
        type: 'Isolated',
        subnets: [
          {
            subnetId: 'sub-123456',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-123456',
            cidr: undefined,
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: undefined,
  });
});

test('Recognize private subnet by route table', async () => {
  // GIVEN
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'sub-123456' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '10.0.2.0/26',
            Origin: 'CreateRoute',
            State: 'active',
            VpcPeeringConnectionId: 'pcx-xxxxxx',
          },
          {
            DestinationCidrBlock: '1.1.2.1/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            NatGatewayId: 'nat-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Private',
        type: 'Private',
        subnets: [
          {
            subnetId: 'sub-123456',
            availabilityZone: 'bermuda-triangle-1337',
            routeTableId: 'rtb-123456',
            cidr: undefined,
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: undefined,
  });
});

test('works for asymmetric subnets (not spanning the same Availability Zones)', async () => {
  // GIVEN
  mockVpcLookup({
    subnets: [
      { SubnetId: 'pri-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: false, CidrBlock: '1.1.1.1/24' },
      { SubnetId: 'pub-sub-in-1c', AvailabilityZone: 'us-west-1c', MapPublicIpOnLaunch: true, CidrBlock: '1.1.2.1/24' },
      { SubnetId: 'pub-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: true, CidrBlock: '1.1.3.1/24' },
      { SubnetId: 'pub-sub-in-1a', AvailabilityZone: 'us-west-1a', MapPublicIpOnLaunch: true, CidrBlock: '1.1.4.1/24' },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'pri-sub-in-1b' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '0.0.0.0/0',
            NatGatewayId: 'nat-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
      {
        Associations: [{ Main: true }],
        RouteTableId: 'rtb-789012',
        Routes: [
          {
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: 'igw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'Private',
        type: 'Private',
        subnets: [
          {
            subnetId: 'pri-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-123456',
            cidr: '1.1.1.1/24',
          },
        ],
      },
      {
        name: 'Public',
        type: 'Public',
        subnets: [
          {
            subnetId: 'pub-sub-in-1a',
            availabilityZone: 'us-west-1a',
            routeTableId: 'rtb-789012',
            cidr: '1.1.4.1/24',
          },
          {
            subnetId: 'pub-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-789012',
            cidr: '1.1.3.1/24',
          },
          {
            subnetId: 'pub-sub-in-1c',
            availabilityZone: 'us-west-1c',
            routeTableId: 'rtb-789012',
            cidr: '1.1.2.1/24',
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: undefined,
  });
});

test('allows specifying the subnet group name tag', async () => {
  // GIVEN
  mockVpcLookup({
    subnets: [
      {
        SubnetId: 'pri-sub-in-1b',
        AvailabilityZone: 'us-west-1b',
        MapPublicIpOnLaunch: false,
        Tags: [
          { Key: 'Tier', Value: 'restricted' },
        ],
      },
      {
        SubnetId: 'pub-sub-in-1c',
        AvailabilityZone: 'us-west-1c',
        MapPublicIpOnLaunch: true,
        Tags: [
          { Key: 'Tier', Value: 'connectivity' },
        ],
      },
      {
        SubnetId: 'pub-sub-in-1b',
        AvailabilityZone: 'us-west-1b',
        MapPublicIpOnLaunch: true,
        Tags: [
          { Key: 'Tier', Value: 'connectivity' },
        ],
      },
      {
        SubnetId: 'pub-sub-in-1a',
        AvailabilityZone: 'us-west-1a',
        MapPublicIpOnLaunch: true,
        Tags: [
          { Key: 'Tier', Value: 'connectivity' },
        ],
      },
    ],
    routeTables: [
      {
        Associations: [{ SubnetId: 'pri-sub-in-1b' }],
        RouteTableId: 'rtb-123456',
        Routes: [
          {
            DestinationCidrBlock: '0.0.0.0/0',
            NatGatewayId: 'nat-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
      {
        Associations: [{ Main: true }],
        RouteTableId: 'rtb-789012',
        Routes: [
          {
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: 'igw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
  });

  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
    subnetGroupNameTag: 'Tier',
  });

  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
      {
        name: 'restricted',
        type: 'Private',
        subnets: [
          {
            subnetId: 'pri-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-123456',
            cidr: undefined,
          },
        ],
      },
      {
        name: 'connectivity',
        type: 'Public',
        subnets: [
          {
            subnetId: 'pub-sub-in-1a',
            availabilityZone: 'us-west-1a',
            routeTableId: 'rtb-789012',
            cidr: undefined,
          },
          {
            subnetId: 'pub-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-789012',
            cidr: undefined,
          },
          {
            subnetId: 'pub-sub-in-1c',
            availabilityZone: 'us-west-1c',
            routeTableId: 'rtb-789012',
            cidr: undefined,
          },
        ],
      },
    ],
    vpcId: 'vpc-1234567',
    vpnGatewayId: undefined,
  });
});

interface VpcLookupOptions {
  subnets: Subnet[];
  routeTables: RouteTable[];
  vpnGateways?: VpnGateway[];
}

function mockVpcLookup(options: VpcLookupOptions) {
  const VpcId = 'vpc-1234567';

  ec2Mock.on(DescribeVpcsCommand).resolves({
    Vpcs: [{ VpcId, CidrBlock: '1.1.1.1/16' }],
  });

  ec2Mock.on(DescribeSubnetsCommand).resolves({
    Subnets: options.subnets,
  });

  ec2Mock.on(DescribeRouteTablesCommand).resolves({
    RouteTables: options.routeTables,
  });

  ec2Mock.on(DescribeVpnGatewaysCommand).resolves({
    VpnGateways: options.vpnGateways,
  });
}
