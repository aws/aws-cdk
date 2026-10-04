/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { GatewayVpcEndpointAwsService, InterfaceVpcEndpointAwsService, SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { NatConnectivityType, Route, RouteTable } from '../lib';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

/** Test Multiple Ipv4 Primary and Secondary address */
const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('10.2.0.0/16', {
      cidrBlockName: 'SecondaryAddress2',
    }),
    // Test Amazon provided secondary ipv6 address
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
    vpc_v2.IpAddresses.ipv4('10.3.0.0/16', {
      cidrBlockName: 'SecondaryAddress3',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

const subnet = new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: stack.availabilityZones[1],
  ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
  // Test secondary ipv6 address after Amazon Provided ipv6 allocation
  // ipv6CidrBlock: new Ipv6Cidr('2001:db8:1::/64'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// Validate ipv6 IPAM
new SubnetV2(stack, 'validateIpv6', {
  vpc,
  ipv4CidrBlock: new IpCidr('10.3.0.0/24'),
  availabilityZone: stack.availabilityZones[1],
  // Test secondary ipv6 address after Amazon Provided ipv6 allocation
  // ipv6CidrBlock: new IpCidr('2600:1f14:3283:9501::/64'),
  subnetType: SubnetType.PUBLIC,
});

// Test to add Gateway Endpoint
vpc.addGatewayEndpoint('TestGWendpoint', {
  service: GatewayVpcEndpointAwsService.S3,
  subnets: [{ subnetType: SubnetType.PUBLIC }],
});

// Test to add Interface Endpoint
vpc.addInterfaceEndpoint('TestInterfaceEndpoint', {
  service: InterfaceVpcEndpointAwsService.SNS,
  subnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
});

// Add an Egress only Internet Gateway
vpc.addEgressOnlyInternetGateway({
  subnets: [{ subnetType: SubnetType.PUBLIC }],
});

const vpnGateway = vpc.enableVpnGatewayV2({
  vpnRoutePropagation: [{ subnetType: SubnetType.PUBLIC }],
  type: VpnConnectionType.IPSEC_1,
});

// Can define a route with VPN gateway as a target
const routeTable = new RouteTable(stack, 'routeTable', { vpc } );

new Route(stack, 'route', {
  destination: '172.31.0.0/24',
  target: { gateway: vpnGateway },
  routeTable: routeTable,
});

// Add Internet Gateway with routes set to custom IP range
vpc.addInternetGateway({
  ipv4Destination: '192.168.0.0/16',
});

// Add a NAT Gateway
vpc.addNatGateway({
  subnet: subnet,
  connectivityType: NatConnectivityType.PRIVATE,
}).node.addDependency(vpnGateway);

// Can define a route with Nat gateway as a target
routeTable.addRoute( 'NATGWRoute', '172.32.0.0/24', { gateway: vpnGateway });

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

