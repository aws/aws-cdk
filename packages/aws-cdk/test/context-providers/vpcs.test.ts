import {
  DescribeRouteTablesCommand,
  DescribeSubnetsCommand,
  DescribeVpcsCommand,
  DescribeVpnGatewaysCommand,
} from '@aws-sdk/client-ec2';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProvider, mockEC2Client, restoreSdkMocksToDefault } from '../util/mock-sdk';

const mockSDK = new MockSdkProvider();

beforeEach(() => {
  restoreSdkMocksToDefault();
  mockEC2Client
    .on(DescribeVpcsCommand)
    .resolves({
      Vpcs: [{ VpcId: 'vpc-1234567', CidrBlock: '1.1.1.1/16', OwnerId: '123456789012' }],
    })
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [
        { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
        { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false },
      ],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({
      VpnGateways: [{ VpnGatewayId: 'gw-abcdef' }],
    });
});

test('looks up the requested VPC', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('throws when no such VPC is found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);
  mockEC2Client.on(DescribeVpcsCommand).resolves({});

  // WHEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      filter,
    }),
  ).rejects.toThrow(/Could not find any VPCs matching/);
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
});

test('throws when subnet with subnetGroupNameTag not found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      subnetGroupNameTag: 'DOES_NOT_EXIST',
      filter,
    }),
  ).rejects.toThrow(/Invalid subnetGroupNameTag: Subnet .* does not have an associated tag with Key='DOES_NOT_EXIST'/);
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
});

test('does not throw when subnet with subnetGroupNameTag is found', async () => {
  // GIVEN
  mockEC2Client.on(DescribeSubnetsCommand).resolves({
    Subnets: [
      {
        SubnetId: 'sub-123456',
        AvailabilityZone: 'bermuda-triangle-1337',
        MapPublicIpOnLaunch: true,
        Tags: [{ Key: 'DOES_EXIST', Value: 'SubnetName1' }],
      },
      {
        SubnetId: 'sub-789012',
        AvailabilityZone: 'bermuda-triangle-1337',
        MapPublicIpOnLaunch: false,
        Tags: [{ Key: 'DOES_EXIST', Value: 'SubnetName2' }],
      },
    ],
  });
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
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
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['SubnetName2'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['SubnetName1'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('throws when multiple VPCs are found', async () => {
  // GIVEN
  mockEC2Client.on(DescribeVpcsCommand).resolves({
    Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }],
  });
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      filter,
    }),
  ).rejects.toThrow(/Found 2 VPCs matching/);
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
});

test('uses the VPC main route table when a subnet has no specific association', async () => {
  // GIVEN
  mockEC2Client.on(DescribeRouteTablesCommand).resolves({
    RouteTables: [
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
  });
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    privateSubnetIds: ['sub-789012'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-789012'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
    vpnGatewayId: 'gw-abcdef',
  });

  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('Recognize public subnet by route table', async () => {
  // GIVEN
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [{ SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({});
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    publicSubnetIds: ['sub-123456'],
    publicSubnetNames: ['Public'],
    publicSubnetRouteTableIds: ['rtb-123456'],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('Recognize private subnet by route table with NAT Gateway', async () => {
  // GIVEN
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [{ SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({});
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    privateSubnetIds: ['sub-123456'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-123456'],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('Recognize private subnet by route table with Transit Gateway', async () => {
  // GIVEN
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [{ SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({});
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter,
  });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
    ownerAccountId: '123456789012',
    availabilityZones: ['bermuda-triangle-1337'],
    privateSubnetIds: ['sub-123456'],
    privateSubnetNames: ['Private'],
    privateSubnetRouteTableIds: ['rtb-123456'],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});

test('Recognize isolated subnet by route table', async () => {
  // GIVEN
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [{ SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({});
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
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
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSubnetsCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeRouteTablesCommand, {
    Filters: [{ Name: 'vpc-id', Values: ['vpc-1234567'] }],
  });
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpnGatewaysCommand, {
    Filters: [
      { Name: 'attachment.vpc-id', Values: ['vpc-1234567'] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ],
  });
});
