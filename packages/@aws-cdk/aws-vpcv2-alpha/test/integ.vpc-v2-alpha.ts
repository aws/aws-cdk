// /*
//  * Our integration tests act as snapshot tests to make sure the rendered template is stable.
//  * If any changes to the result are required,
//  * you need to perform an actual CloudFormation deployment of this application,
//  * and, if it is successful, a new snapshot will be written out.
//  *
//  * For more information on CDK integ tests,
//  * see the main CONTRIBUTING.md file.
//  */

import * as vpc_v2 from '../lib/vpc-v2';
import { AddressFamily, Ipam } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Ipv4Cidr, /*Ipv6Cidr,*/ SubnetV2 } from '../lib/subnet-v2';
import { EgressOnlyInternetGateway, Route, RouteTable } from '../lib/route';
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, RouterType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { log } from 'console';

// as in unit tests, we use a qualified import,
// not bring in individual classes
//import * as er from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'Ipam');

const pool = ipam.publicScope.addPool({
  addressFamily: AddressFamily.IP_V4,
  provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
  region: 'us-east-1',
});

const vpc = new vpc_v2.VpcV2(stack, 'VPCTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipv4IpamPoolId: pool.attrIpamPoolId,
      ipv4NetmaskLength: 20,
    }),
    vpc_v2.IpAddresses.amazonProvidedIpv6(),
    // vpc_v2.IpAddresses.ipv4('192.168.0.0/16'), Test for invalid RFC range
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'us-west-2a',
  cidrBlock: new Ipv4Cidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
});

const selection = vpc.selectSubnets();
log(selection);
vpc.enableVpnGateway({
  vpnRoutePropagation: [{
    subnetType: SubnetType.PRIVATE_WITH_EGRESS, // optional, defaults to "PUBLIC"
  }],
  type: 'ipsec.1',
});

const routeTable = new RouteTable(stack, 'TestRoottable', {
  vpcId: vpc.vpcId,
});

const eigw = new EgressOnlyInternetGateway(stack, 'testEOIGW', {
  vpcId: vpc.vpcId,
});

const dynamoEndpoint = new GatewayVpcEndpoint(stack, 'testDynamoEndpoint', {
  service: GatewayVpcEndpointAwsService.DYNAMODB,
  vpc: vpc,
});

const routeToEigw = new Route(stack, 'testEIGWRoute', {
  routeTable: routeTable,
  destination: vpc_v2.IpAddresses.ipv4('10.0.0.0/25'),
  target: eigw,
});

const routeToDynamo = new Route(stack, 'testDynamoRoute', {
  routeTable: routeTable,
  destination: vpc_v2.IpAddresses.ipv4('10.0.0.128/25'),
  target: dynamoEndpoint,
});

/**
 * Expected as should be true by default
 */

// if (!vpc.isolatedSubnets.includes(subnet)) {
//   throw new Error('Subnet is not isolated');
// };

if (!routeTable.routeTableId) {
  throw new Error('No RouteTable id');
}

if (eigw.routerType != RouterType.EGRESS_ONLY_INTERNET_GATEWAY) {
  throw new Error('EIGW RouterType not correct');
}

if (!dynamoEndpoint.vpcEndpointId) {
  throw new Error('No dynamo endpoint id');
}

if (routeToDynamo.targetRouterType != RouterType.VPC_ENDPOINT) {
  throw new Error('Dynamo route has wrong route type');
}

if (routeToEigw.targetRouterType != RouterType.EGRESS_ONLY_INTERNET_GATEWAY) {
  throw new Error('Egress Only Internet Gateway has wrong router type');
}

app.synth();

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});