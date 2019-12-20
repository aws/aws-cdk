import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as nodeunit from 'nodeunit';
import { ISDK } from '../../lib/api';
import { VpcNetworkContextProviderPlugin } from '../../lib/context-providers/vpcs';

AWS.setSDKInstance(aws);

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
  async 'looks up the requested (symmetric) VPC'(test: nodeunit.Test) {
    mockVpcLookup(test, {
      subnets: [
        { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, CidrBlock: '1.1.1.1/24' },
        { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, CidrBlock: '1.1.2.1/24' }
      ],
      routeTables: [
        { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456', },
        { Associations: [{ SubnetId: 'sub-789012' }], RouteTableId: 'rtb-789012', }
      ],
      vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }]

    });

    const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    });

    test.deepEqual(result, {
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
      vpnGatewayId: 'gw-abcdef'
    });

    AWS.restore();
    test.done();
  },

  async 'throws when no such VPC is found'(test: nodeunit.Test) {
    AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
      test.deepEqual(params.Filters, [{ Name: 'foo', Values: ['bar'] }]);
      return cb(null, {});
    });

    try {
      await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
        filter: { foo: 'bar' },
        returnAsymmetricSubnets: true,
      });

      throw Error('The expected exception was not raised!');
    } catch (e) {
      test.throws(() => { throw e; }, /Could not find any VPCs matching/);
    }

    AWS.restore();
    test.done();
  },

  async 'throws when multiple VPCs are found'(test: nodeunit.Test) {
    // GIVEN
    AWS.mock('EC2', 'describeVpcs', (params: aws.EC2.DescribeVpcsRequest, cb: AwsCallback<aws.EC2.DescribeVpcsResult>) => {
      test.deepEqual(params.Filters, [{ Name: 'foo', Values: ['bar'] }]);
      return cb(null, { Vpcs: [{ VpcId: 'vpc-1' }, { VpcId: 'vpc-2' }]});
    });

    // WHEN
    try {
      await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
        filter: { foo: 'bar' },
        returnAsymmetricSubnets: true,
      });

      throw Error('The expected exception was not raised!');
    } catch (e) {
      test.throws(() => { throw e; }, /Found 2 VPCs matching/);
    }

    AWS.restore();
    test.done();
  },

  async 'uses the VPC main route table when a subnet has no specific association'(test: nodeunit.Test) {
    mockVpcLookup(test, {
      subnets: [
        { SubnetId: 'sub-123456', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: true, CidrBlock: '1.1.1.1/24' },
        { SubnetId: 'sub-789012', AvailabilityZone: 'bermuda-triangle-1337', MapPublicIpOnLaunch: false, CidrBlock: '1.1.2.1/24' }
      ],
      routeTables: [
        { Associations: [{ SubnetId: 'sub-123456' }], RouteTableId: 'rtb-123456', },
        { Associations: [{ Main: true }], RouteTableId: 'rtb-789012', }
      ],
      vpnGateways: [{ VpnGatewayId: 'gw-abcdef' }]
    });

    const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    });

    test.deepEqual(result, {
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
      vpnGatewayId: 'gw-abcdef'
    });

    test.done();
    AWS.restore();
  },

  async 'Recognize public subnet by route table'(test: nodeunit.Test) {
    // GIVEN
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
    const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    });

    // THEN
    test.deepEqual(result, {
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

    AWS.restore();
    test.done();
  },

  async 'works for asymmetric subnets (not spanning the same Availability Zones)'(test: nodeunit.Test) {
    // GIVEN
    mockVpcLookup(test, {
      subnets: [
        { SubnetId: 'pri-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: false, CidrBlock: '1.1.1.1/24', },
        { SubnetId: 'pub-sub-in-1c', AvailabilityZone: 'us-west-1c', MapPublicIpOnLaunch: true, CidrBlock: '1.1.2.1/24'  },
        { SubnetId: 'pub-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: true, CidrBlock: '1.1.3.1/24'  },
        { SubnetId: 'pub-sub-in-1a', AvailabilityZone: 'us-west-1a', MapPublicIpOnLaunch: true, CidrBlock: '1.1.4.1/24'  },
      ],
      routeTables: [
        { Associations: [{ Main: true }], RouteTableId: 'rtb-123' },
      ],
    });

    // WHEN
    const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
    });

    // THEN
    test.deepEqual(result, {
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

    AWS.restore();
    test.done();
  },

  async 'allows specifying the subnet group name tag'(test: nodeunit.Test) {
    // GIVEN
    mockVpcLookup(test, {
      subnets: [
        {
          SubnetId: 'pri-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: false, Tags: [
            { Key: 'Tier', Value: 'restricted' },
        ] },
        {
          SubnetId: 'pub-sub-in-1c', AvailabilityZone: 'us-west-1c', MapPublicIpOnLaunch: true, Tags: [
            { Key: 'Tier', Value: 'connectivity' },
        ] },
        {
          SubnetId: 'pub-sub-in-1b', AvailabilityZone: 'us-west-1b', MapPublicIpOnLaunch: true, Tags: [
            { Key: 'Tier', Value: 'connectivity' },
        ] },
        {
          SubnetId: 'pub-sub-in-1a', AvailabilityZone: 'us-west-1a', MapPublicIpOnLaunch: true, Tags: [
            { Key: 'Tier', Value: 'connectivity' },
        ] },
      ],
      routeTables: [
        { Associations: [{ Main: true }], RouteTableId: 'rtb-123' },
      ],
    });

    const result = await new VpcNetworkContextProviderPlugin(mockSDK).getValue({
      filter: { foo: 'bar' },
      returnAsymmetricSubnets: true,
      subnetGroupNameTag: 'Tier',
    });

    test.deepEqual(result, {
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
