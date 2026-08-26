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
import { Fn } from 'aws-cdk-lib';
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { EgressOnlyInternetGateway, InternetGateway, NatConnectivityType, NatGateway, RouteTable, VPNGatewayV2 } from '../lib/route';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stacks: {[id: string] : cdk.Stack} = {
  default: new cdk.Stack(app, 'aws-cdk-routev2-alpha', { stackName: 'DefaultVpcDeploy' }),
  eigw: new cdk.Stack(app, 'aws-cdk-routev2-egressonlyigw-alpha', { stackName: 'EgressOnlyIgwVpc' }),
  igw: new cdk.Stack(app, 'aws-cdk-routev2-igw-alpha', { stackName: 'InternetGatewayVpc' }),
  vpgw: new cdk.Stack(app, 'aws-cdk-routev2-virtualprivategw-alpha', { stackName: 'VirtualPrivateGwVpc' }),
  natgw_pub: new cdk.Stack(app, 'aws-cdk-routev2-publicnatgw-alpha', { stackName: 'NatGwPubVpc' }),
  natgw_priv: new cdk.Stack(app, 'aws-cdk-routev2-privatenatgw-alpha', { stackName: 'NatGwPrivVpc' }),
  nif: new cdk.Stack(app, 'aws-cdk-routev2-networkif-alpha', { stackName: 'NetworkInterfaceVpc' }),
  vpcpc: new cdk.Stack(app, 'aws-cdk-routev2-vpcpeerconnection-alpha', { stackName: 'VpcPeerConnection' }),
  dynamodb: new cdk.Stack(app, 'aws-cdk-routev2-dynamodbendpoint-alpha', { stackName: 'DynamodbEndpointVpc' }),
};

var vpcs: {[id: string] : vpc_v2.VpcV2} = {};
var subnets: {[id: string]: SubnetV2} = {};
var routeTables: {[id: string]: RouteTable} = {};

for (const stackName in stacks) {
  const vpc = new vpc_v2.VpcV2(stacks[stackName], stackName, {
    primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
    secondaryAddressBlocks: [vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonIpv6',
    })],
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });
  vpcs[stackName] = vpc;
  const routeTable = new RouteTable(stacks[stackName], 'TestRoottable', {
    vpc: vpcs[stackName],
  });
  routeTables[stackName] = routeTable;
  if (stackName == 'eigw') {
    const subnet = new SubnetV2(stacks[stackName], stackName + 'Subnet', {
      vpc: vpc,
      availabilityZone: stacks[stackName].availabilityZones[0],
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: routeTables[stackName],
    });
    subnets[stackName] = subnet;
  } else {
    // use empty ipv6 that doesn't overlap
    const subnet = new SubnetV2(stacks[stackName], stackName + 'Subnet', {
      vpc: vpc,
      availabilityZone: stacks[stackName].availabilityZones[0],
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      ipv6CidrBlock: new IpCidr(Fn.select(0, vpc.ipv6CidrBlocks)),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: routeTables[stackName],
    });
    subnets[stackName] = subnet;
  }
}

const eigw = new EgressOnlyInternetGateway(stacks.eigw, 'testEOIGW', {
  vpc: vpcs.eigw,
});
routeTables.eigw.addRoute('eigwRoute', '::/0', { gateway: eigw });

const igw = new InternetGateway(stacks.igw, 'testIGW', {
  vpc: vpcs.igw,
});
routeTables.igw.addRoute('igwRoute', '0.0.0.0/0', { gateway: igw });

const vpgw = new VPNGatewayV2(stacks.vpgw, 'testVPGW', {
  type: VpnConnectionType.IPSEC_1,
  vpc: vpcs.vpgw,
});
routeTables.vpgw.addRoute('vpgwRoute', '0.0.0.0/0', { gateway: vpgw });

const natGwIgw = new InternetGateway(stacks.natgw_pub, 'testNATgwIGW', {
  vpc: vpcs.natgw_pub,
});
routeTables.natgw_pub.addRoute('natGwRoute', '0.0.0.0/0', { gateway: natGwIgw });
const natGwPub = new NatGateway(stacks.natgw_pub, 'testNATgw', {
  subnet: subnets.natgw_pub,
  vpc: vpcs.natgw_pub,
});
routeTables.natgw_pub.addRoute('natGwPubRoute', '0.0.0.0/0', { gateway: natGwPub });

const natGwPriv = new NatGateway(stacks.natgw_priv, 'testNATgw', {
  subnet: subnets.natgw_priv,
  vpc: vpcs.natgw_priv,
  connectivityType: NatConnectivityType.PRIVATE,
  privateIpAddress: '10.0.0.42',
  secondaryPrivateIpAddresses: [
    '10.0.0.43', '10.0.0.44', '10.0.0.45',
  ],
});
routeTables.natgw_priv.addRoute('natGwPrivRoute', '0.0.0.0/0', { gateway: natGwPriv });

const dynamoEndpoint = new GatewayVpcEndpoint(stacks.dynamodb, 'testDynamoEndpoint', {
  service: GatewayVpcEndpointAwsService.DYNAMODB,
  vpc: vpcs.dynamodb,
  subnets: [subnets.dynamodb],
});
routeTables.dynamodb.addRoute('dynamoRoute', '0.0.0.0/0', { endpoint: dynamoEndpoint });

var i = 0;
for (const stackName in stacks) {
  new IntegTest(app, 'integtest-model-' + i, {
    testCases: [stacks[stackName]],
  });
  i++;
}
