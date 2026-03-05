import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { Ipam, RouteTable } from '../lib';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-tag');

/** Test Multiple Ipv4 Primary and Secondary address */
const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-tag', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    // Test Amazon provided secondary ipv6 address
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'CDKintegTestVPC',
});

const routeTable = new RouteTable(stack, 'TestRouteTable', {
  vpc: vpc,
  routeTableName: 'TestRouteTable',
});

const subnet = new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'CDKIntegTestSubnet',
  routeTable: routeTable,
});

vpc.addInternetGateway({
  internetGatewayName: 'CDKIntegTestTagIGW',
});

const vpnGateway = vpc.enableVpnGatewayV2({
  vpnRoutePropagation: [{ subnetType: SubnetType.PRIVATE_ISOLATED }],
  type: VpnConnectionType.IPSEC_1,
});

const natgw = vpc.addNatGateway({
  natGatewayName: 'CDKIntegTestTagNGW',
  subnet: subnet,
});
natgw.node.addDependency(vpnGateway);

const ipam = new Ipam(stack, 'IpamIntegTest', {
  operatingRegions: [stack.region],
  ipamName: 'CDKIpamTestTag',
});

const scope = ipam.addScope(stack, 'CustomIpamScope', {
  ipamScopeName: 'CustomPrivateScopeTag',
});

const integ = new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

const tag_assertion = integ.assertions.awsApiCall('EC2', 'describeVpcs', {
  VpcIds: [vpc.vpcId],
});

tag_assertion.expect(ExpectedResult.objectLike({
  Vpcs: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'CDKintegTestVPC',
        }),
      ]),
    }),
  ],
}));

// Assertion for the Internet Gateway (IGW)
const igw_assertion = integ.assertions.awsApiCall('EC2', 'describeInternetGateways', {
  InternetGatewayIds: [vpc.internetGatewayId],
});

igw_assertion.expect(ExpectedResult.objectLike({
  InternetGateways: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'CDKintegTestVPC',
        }),
      ]),
    }),
  ],
}));

// Assertion for the NAT Gateway (NGW)
const ngw_assertion = integ.assertions.awsApiCall('EC2', 'describeNatGateways', {
  NatGatewayIds: [natgw.natGatewayId],
});

ngw_assertion.expect(ExpectedResult.objectLike({
  NatGateways: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'CDKIntegTestTagNGW',
        }),
      ]),
    }),
  ],
}));

// Assertion for the Route Table
const route_table_assertion = integ.assertions.awsApiCall('EC2', 'describeRouteTables', {
  RouteTableIds: [routeTable.routeTableId],
});

route_table_assertion.expect(ExpectedResult.objectLike({
  RouteTables: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'TestRouteTable',
        }),
      ]),
    }),
  ],
}));

// Assertion for the IPAM and IPAM Scope
const ipam_assertion = integ.assertions.awsApiCall('EC2', 'describeIpams', {
  IpamIds: [ipam.ipamId],
});
ipam_assertion.expect(ExpectedResult.objectLike({
  Ipams: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'CDKIpamTestTag',
        }),
      ]),
    }),
  ],
}));

// Assertion for the IPAM Scope
const ipam_scope_assertion = integ.assertions.awsApiCall('EC2', 'describeIpamScopes', {
  IpamScopeIds: [scope.scopeId],
});
ipam_scope_assertion.expect(ExpectedResult.objectLike({
  IpamScopes: [
    Match.objectLike({
      Tags: Match.arrayWith([
        Match.objectLike({
          Key: 'Name',
          Value: 'CustomPrivateScopeTag',
        }),
      ]),
    }),
  ],
}));
