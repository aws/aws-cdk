import {
  DescribeRouteTablesCommand,
  DescribeSubnetsCommand,
  DescribeVpcsCommand,
  DescribeVpnGatewaysCommand,
} from '@aws-sdk/client-ec2';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProvider, mockEC2Client, restoreSdkMocksToDefault } from '../util/mock-sdk';

beforeEach(() => {
  restoreSdkMocksToDefault();
  mockEC2Client
    .on(DescribeVpcsCommand)
    .resolves({
      Vpcs: [{ VpcId: 'vpc-1234567', CidrBlock: '1.1.1.1/16' }],
    })
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
    });
});

const mockSDK = new MockSdkProvider();

test('looks up the requested (symmetric) VPC', async () => {
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [
        {
          SubnetId: 'sub-123456',
          AvailabilityZone: 'bermuda-triangle-1337',
          MapPublicIpOnLaunch: true,
          CidrBlock: '1.1.1.1/24',
        },
        {
          SubnetId: 'sub-789012',
          AvailabilityZone: 'bermuda-triangle-1337',
          MapPublicIpOnLaunch: false,
          CidrBlock: '1.1.2.1/24',
        },
      ],
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({ VpnGateways: [{ VpnGatewayId: 'gw-abcdef' }] });
  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
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
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client.on(DescribeVpcsCommand).resolves({});
  await expect(
    new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      account: '123456789012',
      region: 'us-east-1',
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    }),
  ).rejects.toThrow(/Could not find any VPCs matching/);
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
});

test('throws when multiple VPCs are found', async () => {
  // GIVEN
  mockEC2Client.on(DescribeVpcsCommand).resolves({
    Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }],
  });

  // WHEN
  await expect(
    new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      account: '123456789012',
      region: 'us-east-1',
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    }),
  ).rejects.toThrow(/Found 2 VPCs matching/);
  expect(mockEC2Client).toHaveReceivedCommandWith(DescribeVpcsCommand, {
    Filters: [{ Name: 'foo', Values: ['bar'] }],
  });
});

test('uses the VPC main route table when a subnet has no specific association', async () => {
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [
        {
          SubnetId: 'sub-123456',
          AvailabilityZone: 'bermuda-triangle-1337',
          MapPublicIpOnLaunch: true,
          CidrBlock: '1.1.1.1/24',
        },
        {
          SubnetId: 'sub-789012',
          AvailabilityZone: 'bermuda-triangle-1337',
          MapPublicIpOnLaunch: false,
          CidrBlock: '1.1.2.1/24',
        },
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
    })
    .on(DescribeVpnGatewaysCommand)
    .resolves({
      VpnGateways: [{ VpnGatewayId: 'gw-abcdef' }],
    });

  const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
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
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client.on(DescribeRouteTablesCommand).resolves({
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
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
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
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client.on(DescribeRouteTablesCommand).resolves({
    RouteTables: [
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
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client.on(DescribeRouteTablesCommand).resolves({
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
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [
        {
          SubnetId: 'pri-sub-in-1b',
          AvailabilityZone: 'us-west-1b',
          MapPublicIpOnLaunch: false,
          CidrBlock: '1.1.1.1/24',
        },
        {
          SubnetId: 'pub-sub-in-1c',
          AvailabilityZone: 'us-west-1c',
          MapPublicIpOnLaunch: true,
          CidrBlock: '1.1.2.1/24',
        },
        {
          SubnetId: 'pub-sub-in-1b',
          AvailabilityZone: 'us-west-1b',
          MapPublicIpOnLaunch: true,
          CidrBlock: '1.1.3.1/24',
        },
        {
          SubnetId: 'pub-sub-in-1a',
          AvailabilityZone: 'us-west-1a',
          MapPublicIpOnLaunch: true,
          CidrBlock: '1.1.4.1/24',
        },
      ],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  });

  // THEN
  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
  mockEC2Client
    .on(DescribeSubnetsCommand)
    .resolves({
      Subnets: [
        {
          SubnetId: 'pri-sub-in-1b',
          AvailabilityZone: 'us-west-1b',
          MapPublicIpOnLaunch: false,
          Tags: [{ Key: 'Tier', Value: 'restricted' }],
        },
        {
          SubnetId: 'pub-sub-in-1c',
          AvailabilityZone: 'us-west-1c',
          MapPublicIpOnLaunch: true,
          Tags: [{ Key: 'Tier', Value: 'connectivity' }],
        },
        {
          SubnetId: 'pub-sub-in-1b',
          AvailabilityZone: 'us-west-1b',
          MapPublicIpOnLaunch: true,
          Tags: [{ Key: 'Tier', Value: 'connectivity' }],
        },
        {
          SubnetId: 'pub-sub-in-1a',
          AvailabilityZone: 'us-west-1a',
          MapPublicIpOnLaunch: true,
          Tags: [{ Key: 'Tier', Value: 'connectivity' }],
        },
      ],
    })
    .on(DescribeRouteTablesCommand)
    .resolves({
      RouteTables: [
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
    account: '123456789012',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
    subnetGroupNameTag: 'Tier',
  });

  expect(result).toEqual({
    availabilityZones: [],
    vpcCidrBlock: '1.1.1.1/16',
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
