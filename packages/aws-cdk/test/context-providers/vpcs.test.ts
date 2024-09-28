/* eslint-disable import/order */
import { mockClient } from 'aws-sdk-client-mock';
import {
  EC2Client,
  DescribeVpcsCommand,
  DescribeSubnetsCommand,
  DescribeRouteTablesCommand,
  DescribeVpnGatewaysCommand,
  Subnet,
  RouteTable,
  VpnGateway,
} from '@aws-sdk/client-ec2';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProviderv3 } from '../util/mock-sdk';

const ec2Mock = mockClient(EC2Client);

beforeEach(() => {
  ec2Mock.reset();
});

const mockSDK = new MockSdkProviderv3();

test('looks up the requested VPC', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
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

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
    subnetGroups: undefined,
  });
});

test('throws when no such VPC is found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  ec2Mock.on(DescribeVpcsCommand).resolves({});

  // WHEN
  await expect(provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  })).rejects.toThrow(/Could not find any VPCs matching/);
});

test('throws when subnet with subnetGroupNameTag not found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
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

  // WHEN
  await expect(provider.getValue({
    account: '1234',
    region: 'us-east-1',
    subnetGroupNameTag: 'DOES_NOT_EXIST',
    filter,
  })).rejects.toThrow(/Invalid subnetGroupNameTag: Subnet .* does not have an associated tag with Key='DOES_NOT_EXIST'/);
});

test('does not throw when subnet with subnetGroupNameTag is found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, Tags: [{ Key: 'DOES_EXIST', Value: 'SubnetName1' }] },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, Tags: [{ Key: 'DOES_EXIST', Value: 'SubnetName2' }] },
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

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    subnetGroupNameTag: 'DOES_EXIST',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['SubnetName2'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['SubnetName1'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
    subnetGroups: undefined,
  });
});

test('throws when multiple VPCs are found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  ec2Mock.on(DescribeVpcsCommand).resolves({ Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }] });

  // WHEN
  await expect(provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  })).rejects.toThrow(/Found 2 VPCs matching/);
});

test('uses the VPC main route table when a subnet has no specific association', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
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

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
    subnetGroups: undefined,
  });
});

test('Recognize public subnet by route table', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

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
            DestinationCidrBlock: '10.0.1.0/24',
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
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: undefined,
    subnetGroups: undefined,
  });
});

test('Recognize private subnet by route table with NAT Gateway', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

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
            DestinationCidrBlock: '10.0.1.0/24',
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
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: ['sub-123456'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-123456'],
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    vpnGatewayId: undefined,
    subnetGroups: undefined,
  });
});

test('Recognize private subnet by route table with Transit Gateway', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

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
            DestinationCidrBlock: '10.0.1.0/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
          {
            DestinationCidrBlock: '0.0.0.0/0',
            TransitGatewayId: 'tgw-xxxxxx',
            Origin: 'CreateRoute',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: ['sub-123456'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-123456'],
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    vpnGatewayId: undefined,
    subnetGroups: undefined,
  });
});

test('Recognize isolated subnet by route table', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

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
            DestinationCidrBlock: '10.0.1.0/24',
            GatewayId: 'local',
            Origin: 'CreateRouteTable',
            State: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({
    account: '1234',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    isolatedSubnetIds: ['sub-123456'],
    isolatedSubnetNames: ['Isolated'],
    isolatedSubnetRouteTableIds: ['rtb-123456'],
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    vpnGatewayId: undefined,
    subnetGroups: undefined,
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
    Vpcs: [{ VpcId, CidrBlock: '1.1.1.1/16', OwnerId: '123456789012' }],
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
