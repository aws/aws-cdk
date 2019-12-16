import aws = require('aws-sdk');
import AWS = require('aws-sdk-mock');
import nodeunit = require('nodeunit');
import { ISDK } from '../../lib/api';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';

AWS.setSDK(require.resolve('aws-sdk'));

const mockSDK: ISDK = {
  defaultAccount: () => Promise.resolve('123456789012'),
  defaultRegion: () => Promise.resolve('bermuda-triangle-1337'),
  cloudFormation: () => { throw new Error('Not Mocked'); },
  ec2: () => Promise.resolve(new aws.EC2()),
  ecr: () => { throw new Error('Not Mocked'); },
  route53: () => { throw new Error('Not Mocked'); },
  s3: () => { throw new Error('Not Mocked'); },
  ssm: () => { throw new Error('Not Mocked'); },
};

type AwsCallback<T> = (err: Error | null, val: T) => void;

export = nodeunit.testCase({
  async 'looks up the requested VPC'(test: nodeunit.Test) {
    // GIVEN
    const filter = { foo: 'bar' };
    const provider = new VpcNetworkContextProviderPlugin(mockSDK);

    mockVpcLookup(test, {
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
    test.deepEqual(result, {
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

    AWS.restore();
    test.done();
  },

  async 'throws when no such VPC is found'(test: nodeunit.Test) {
    // GIVEN
    const filter = { foo: 'bar' };
    const provider = new VpcNetworkContextProviderPlugin(mockSDK);

    AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
      test.deepEqual(params.Filters, [{ Name: 'foo', Values: ['bar'] }]);
      return cb(null, {});
    });

    // WHEN
    try {
      await provider.getValue({ filter });
      throw Error('The expected exception was not raised!');
    } catch (e) {
      test.throws(() => { throw e; }, /Could not find any VPCs matching/);
    }

    AWS.restore();
    test.done();
  },

  async 'throws when multiple VPCs are found'(test: nodeunit.Test) {
    // GIVEN
    const filter = { foo: 'bar' };
    const provider = new VpcNetworkContextProviderPlugin(mockSDK);

    AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
      test.deepEqual(params.Filters, [{ Name: 'foo', Values: ['bar'] }]);
      return cb(null, { Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }]});
    });

    // WHEN
    try {
      await provider.getValue({ filter });
      throw Error('The expected exception was not raised!');
    } catch (e) {
      test.throws(() => { throw e; }, /Found 2 VPCs matching/);
    }

    AWS.restore();
    test.done();
  },

  async 'uses the VPC main route table when a subnet has no specific association'(test: nodeunit.Test) {
    // GIVEN
    const filter = { foo: 'bar' };
    const provider = new VpcNetworkContextProviderPlugin(mockSDK);

    mockVpcLookup(test, {
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
    test.deepEqual(result, {
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

    test.done();
    AWS.restore();
  },

  async 'Recognize public subnet by route table'(test: nodeunit.Test) {
    // GIVEN
    const filter = { foo: 'bar' };
    const provider = new VpcNetworkContextProviderPlugin(mockSDK);

    mockVpcLookup(test, {
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
    test.deepEqual(result, {
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

    AWS.restore();
    test.done();
  },
});

interface VpcLookupOptions {
  subnets: aws.EC2.Subnet[];
  routeTables: aws.EC2.RouteTable[];
  vpnGateways?: aws.EC2.VpnGateway[];
}

function mockVpcLookup(test: nodeunit.Test, options: VpcLookupOptions) {
  const VpcId = 'vpc-1234567';

  AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
    test.deepEqual(params.Filters, [{ Name: 'foo', Values: ['bar'] }]);
    return cb(null, { Vpcs: [{ VpcId, CidrBlock: '1.1.1.1/16' }] });
  });

  AWS.mock('EC2', 'describeSubnets', (params: aws.EC2.DescribeSubnetsRequest, cb: AwsCallback<aws.EC2.DescribeSubnetsResult>) => {
    test.deepEqual(params.Filters, [{ Name: 'vpc-id', Values: [VpcId] }]);
    return cb(null, { Subnets: options.subnets });
  });

  AWS.mock('EC2', 'describeRouteTables', (params: aws.EC2.DescribeRouteTablesRequest, cb: AwsCallback<aws.EC2.DescribeRouteTablesResult>) => {
    test.deepEqual(params.Filters, [{ Name: 'vpc-id', Values: [VpcId] }]);
    return cb(null, { RouteTables: options.routeTables });
  });

  AWS.mock('EC2', 'describeVpnGateways', (params: aws.EC2.DescribeVpnGatewaysRequest, cb: AwsCallback<aws.EC2.DescribeVpnGatewaysResult>) => {
    test.deepEqual(params.Filters, [
      { Name: 'attachment.vpc-id', Values: [ VpcId ] },
      { Name: 'attachment.state', Values: [ 'attached' ] },
      { Name: 'state', Values: [ 'available' ] }
    ]);
    return cb(null, { VpnGateways: options.vpnGateways });
  });
}
