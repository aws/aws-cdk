import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProvider } from '../util/mock-sdk';

AWS.setSDKInstance(aws);

afterEach(done => {
  AWS.restore();
  done();
});

const mockSDK = new MockSdkProvider();

type AwsCallback<T> = (err: Error | null, val: T) => void;

test('looks up the requested (symmetric) VPC', async () => {
  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, CidrBlock: '1.1.1.1/24' },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, CidrBlock: '1.1.2.1/24' },
    ],
    routeTables: [
      { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456' },
      { Associations: [{ SubnetId: 'sub-789012' }], RouteTableId: 'rtb-789012' },
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
  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, {});
  });

  await expect(new VpcNetworkContextProviderPlugin(mockSDK).getValue({
    account: '1234',
    region: 'us-east-1',
    filter: { foo: 'bar' },
    returnAsymmetricSubnets: true,
  })).rejects.toThrow(/Could not find any VPCs matching/);
});

test('throws when multiple VPCs are found', async () => {
  // GIVEN
  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, { Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }] });
  });

  // WHEN
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
      { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456' },
      { Associations: [{ Main: true }], RouteTableId: 'rtb-789012' },
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
      { Associations: [{ Main: true }], RouteTableId: 'rtb-123' },
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
            routeTableId: 'rtb-123',
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
            routeTableId: 'rtb-123',
            cidr: '1.1.4.1/24',
          },
          {
            subnetId: 'pub-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-123',
            cidr: '1.1.3.1/24',
          },
          {
            subnetId: 'pub-sub-in-1c',
            availabilityZone: 'us-west-1c',
            routeTableId: 'rtb-123',
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
      { Associations: [{ Main: true }], RouteTableId: 'rtb-123' },
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
            routeTableId: 'rtb-123',
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
            routeTableId: 'rtb-123',
            cidr: undefined,
          },
          {
            subnetId: 'pub-sub-in-1b',
            availabilityZone: 'us-west-1b',
            routeTableId: 'rtb-123',
            cidr: undefined,
          },
          {
            subnetId: 'pub-sub-in-1c',
            availabilityZone: 'us-west-1c',
            routeTableId: 'rtb-123',
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
  subnets: aws.EC2.Subnet[];
  routeTables: aws.EC2.RouteTable[];
  vpnGateways?: aws.EC2.VpnGateway[];
}

function mockVpcLookup(options: VpcLookupOptions) {
  const VpcId = 'vpc-1234567';

  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, { Vpcs: [{ VpcId, CidrBlock: '1.1.1.1/16' }] });
  });

  AWS.mock('EC2', 'describeSubnets', (params: aws.EC2.DescribeSubnetsRequest, cb: AwsCallback<aws.EC2.DescribeSubnetsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'vpc-id', Values: [VpcId] }]);
    return cb(null, { Subnets: options.subnets });
  });

  AWS.mock('EC2', 'describeRouteTables', (params: aws.EC2.DescribeRouteTablesRequest, cb: AwsCallback<aws.EC2.DescribeRouteTablesResult>) => {
    expect(params.Filters).toEqual([{ Name: 'vpc-id', Values: [VpcId] }]);
    return cb(null, { RouteTables: options.routeTables });
  });

  AWS.mock('EC2', 'describeVpnGateways', (params: aws.EC2.DescribeVpnGatewaysRequest, cb: AwsCallback<aws.EC2.DescribeVpnGatewaysResult>) => {
    expect(params.Filters).toEqual([
      { Name: 'attachment.vpc-id', Values: [VpcId] },
      { Name: 'attachment.state', Values: ['attached'] },
      { Name: 'state', Values: ['available'] },
    ]);
    return cb(null, { VpnGateways: options.vpnGateways });
  });
}
