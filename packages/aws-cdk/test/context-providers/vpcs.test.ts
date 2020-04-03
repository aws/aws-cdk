import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';
import { MockSdkProvider } from '../util/mock-sdk';

AWS.setSDK(require.resolve('aws-sdk'));

const mockSDK = new MockSdkProvider();

type AwsCallback<T> = (err: Error | null, val: T) => void;

afterEach(done => {
  AWS.restore();
  done();
});

test('looks up the requested VPC', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }
    ],
    routeTables: [
      { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456', },
      { Associations: [{ SubnetId: 'sub-789012' }], RouteTableId: 'rtb-789012', }
    ],
    vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }]

  });

  // WHEN
  const result = await provider.getValue({ filter });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
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

  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, {});
  });

  // WHEN
  await expect(provider.getValue({ filter })).rejects.toThrow(/Could not find any VPCs matching/);
});

test('throws when multiple VPCs are found', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    expect(params.Filters).toEqual([{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, { Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }]});
  });

  // WHEN
  await expect(provider.getValue({ filter })).rejects.toThrow(/Found 2 VPCs matching/);
});

test('uses the VPC main route table when a subnet has no specific association', async () => {
  // GIVEN
  const filter = { foo: 'bar' };
  const provider = new VpcNetworkContextProviderPlugin(mockSDK);

  mockVpcLookup({
    subnets: [
      { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true },
      { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false }
    ],
    routeTables: [
      { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456', },
      { Associations: [{ Main: true }], RouteTableId: 'rtb-789012', }
    ],
    vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }]
  });

  // WHEN
  const result = await provider.getValue({ filter });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
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
            DestinationCidrBlock: "10.0.2.0/26",
            Origin: "CreateRoute",
            State: "active",
            VpcPeeringConnectionId: "pcx-xxxxxx"
          },
          {
            DestinationCidrBlock: "10.0.1.0/24",
            GatewayId: "local",
            Origin: "CreateRouteTable",
            State: "active"
          },
          {
            DestinationCidrBlock: "0.0.0.0/0",
            GatewayId: "igw-xxxxxx",
            Origin: "CreateRoute",
            State: "active"
          }
        ],
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({ filter });

  // THEN
  expect(result).toEqual({
    vpcId: 'vpc-1234567',
    vpcCidrBlock: '1.1.1.1/16',
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
      { Name: 'attachment.vpc-id', Values: [ VpcId ] },
      { Name: 'attachment.state', Values: [ 'attached' ] },
      { Name: 'state', Values: [ 'available' ] }
    ]);
    return cb(null, { VpnGateways: options.vpnGateways });
  });
}
