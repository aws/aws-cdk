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
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Ipv4Cidr, Ipv6Cidr, SubnetV2 } from '../lib/subnet-v2';
import { CarrierGateway, EgressOnlyInternetGateway, InternetGateway, NatGateway, NetworkInterface, Route, RouteTable, TransitGateway, VirtualPrivateGateway, VpcPeeringConnection } from '../lib/route';
import { GatewayVpcEndpoint, GatewayVpcEndpointAwsService, RouterType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Fn } from 'aws-cdk-lib';
//import { log } from 'console';

// as in unit tests, we use a qualified import,
// not bring in individual classes
//import * as er from '../lib';

const app = new cdk.App();

const stacks: {[id: string] : cdk.Stack} = {
  'default': new cdk.Stack(app, 'aws-cdk-routev2-alpha', {stackName: 'DefaultVpcDeploy'}),
  'cgw': new cdk.Stack(app, 'aws-cdk-routev2-carriergw-alpha', {stackName: 'CarrierGatewayVpc'}), // failing
  'eigw': new cdk.Stack(app, 'aws-cdk-routev2-egressonlyigw-alpha', {stackName: 'EgressOnlyIgwVpc'}),
  'igw': new cdk.Stack(app, 'aws-cdk-routev2-igw-alpha', {stackName: 'InternetGatewayVpc'}),
  'vpgw': new cdk.Stack(app, 'aws-cdk-routev2-virtualprivategw-alpha', {stackName: 'VirtualPrivateGwVpc'}),
  'natgw': new cdk.Stack(app, 'aws-cdk-routev2-natgw-alpha', {stackName: 'NatGwVpc'}),
  'nif': new cdk.Stack(app, 'aws-cdk-routev2-networkif-alpha', {stackName: 'NetworkInterfaceVpc'}),
  'tgw': new cdk.Stack(app, 'aws-cdk-routev2-transitgw-alpha', {stackName: 'TransitGwVpc'}), // failing
  'vpcpc': new cdk.Stack(app, 'aws-cdk-routev2-vpcpeerconnection-alpha', {stackName: 'VpcPeerConnection'}), // failing
  'dynamodb': new cdk.Stack(app, 'aws-cdk-routev2-dynamodbendpoint-alpha', {stackName: 'DynamodbEndpointVpc'}),
};

var vpcs: {[id: string] : vpc_v2.VpcV2} = {};
var subnets: {[id: string]: SubnetV2} = {};
var routeTables: {[id: string]: RouteTable} = {};

for (const stackName in stacks) {
  const vpc = new vpc_v2.VpcV2(stacks[stackName], stackName, {
    primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
    secondaryAddressBlocks: [vpc_v2.IpAddresses.amazonProvidedIpv6()],
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });
  vpcs[stackName] = vpc;
  if (stackName == 'eigw') {
    const subnet = new SubnetV2(stacks[stackName], stackName + 'Subnet', {
      vpc: vpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new Ipv4Cidr('10.0.0.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });
    subnets[stackName] = subnet;
  } else {
    // use empty ipv6 that doesn't overlap
    const subnet = new SubnetV2(stacks[stackName], stackName + 'Subnet', {
      vpc: vpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new Ipv4Cidr('10.0.0.0/24'),
      ipv6CidrBlock: new Ipv6Cidr(Fn.select(0, vpc.ipv6CidrBlocks)),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });
    subnets[stackName] = subnet;
  }
}

const user2Vpc = new vpc_v2.VpcV2(stacks.vpcpc, 'vpcpc-user2', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.128.0/17'),
});

new SubnetV2(stacks.vpcpc, 'vpcpcSubnet-2', {
  vpc: user2Vpc,
  availabilityZone: 'us-east-1a',
  cidrBlock: new Ipv4Cidr('10.0.128.128/24'),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
});

for (const stackName in stacks) {
  const routeTable = new RouteTable(stacks[stackName], 'TestRoottable', {
    vpcId: vpcs[stackName].vpcId,
  });
  routeTables[stackName] = routeTable;
}

const carrierGw = new CarrierGateway(stacks.cgw, 'testCGW', {
  vpcId: vpcs.cgw.vpcId,
});

const eigw = new EgressOnlyInternetGateway(stacks.eigw, 'testEOIGW', {
  vpcId: vpcs.eigw.vpcId,
});

const igw = new InternetGateway(stacks.igw, 'testIGW', {
  vpcId: vpcs.igw.vpcId,
});

const vpgw = new VirtualPrivateGateway(stacks.vpgw, 'testVPGW', {
  type: 'ipsec.1',
  vpcId: vpcs.vpgw.vpcId,
});

const natGw = new NatGateway(stacks.natgw, 'testNATgw', {
  subnet: subnets.natgw,
  vpcId: vpcs.natgw.vpcId,
});
const natGwIgw = new InternetGateway(stacks.natgw, 'testNATgwIGW', {
  vpcId: vpcs.natgw.vpcId,
});
new Route(stacks.natgw, 'testnatgwigwRoute', {
  routeTable: routeTables.natgw,
  destination: vpc_v2.IpAddresses.ipv4('242.0.0.0/32'),
  target: natGwIgw,
});

const networkInterface = new NetworkInterface(stacks.nif, 'testNWIF', {
  subnet: subnets.nif,
});

const transitGw = new TransitGateway(stacks.tgw, 'testTGW');

const vpcPeerConn = new VpcPeeringConnection(stacks.vpcpc, 'testVPCPC', {
  vpcId: vpcs.vpcpc.vpcId,
  peerVpcId: user2Vpc.vpcId,
  peerRoleArn: user2Vpc.vpcArn,
});

const dynamoEndpoint = new GatewayVpcEndpoint(stacks.dynamodb, 'testDynamoEndpoint', {
  service: GatewayVpcEndpointAwsService.DYNAMODB,
  vpc: vpcs.dynamodb,
  subnets: [subnets.dynamodb],
});

const routeToCgw = new Route(stacks.cgw, 'testCGWRoute', {
  routeTable: routeTables.cgw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: carrierGw,
});

const routeToEigw = new Route(stacks.eigw, 'testEIGWRoute', {
  routeTable: routeTables.eigw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: eigw,
});

const routeToIgw = new Route(stacks.igw, 'testIGWRoute', {
  routeTable: routeTables.igw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: igw,
});

const routeToVpgw = new Route(stacks.vpgw, 'testVPGWRoute', {
  routeTable: routeTables.vpgw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: vpgw,
});

const routeToNATGW = new Route(stacks.natgw, 'testNATGWRoute', {
  routeTable: routeTables.natgw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: natGw,
});

const routeToNetworkIf = new Route(stacks.nif, 'testNetIntRoute', {
  routeTable: routeTables.nif,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: networkInterface,
});

const routeToTransit = new Route(stacks.tgw, 'testTransitGWRoute', {
  routeTable: routeTables.tgw,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: transitGw,
});

const routeToVpcPeercon = new Route(stacks.vpcpc, 'testPeerconRoute', {
  routeTable: routeTables.vpcpc,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: vpcPeerConn,
});

const routeToDynamo = new Route(stacks.dynamodb, 'testDynamoRoute', {
  routeTable: routeTables.dynamodb,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: dynamoEndpoint,
});

/**
 * Expected as should be true by default
 */

// if (!vpc.isolatedSubnets.includes(subnet)) {
//   throw new Error('Subnet is not isolated');
// };

if (eigw.routerType != RouterType.EGRESS_ONLY_INTERNET_GATEWAY) {
  throw new Error('EIGW RouterType not correct');
}

if (!dynamoEndpoint.vpcEndpointId) {
  throw new Error('No dynamo endpoint id');
}

if (routeToCgw.targetRouterType != RouterType.CARRIER_GATEWAY) {
  throw new Error('Carrier gateway route has wrong route type');
}

if (routeToEigw.targetRouterType != RouterType.EGRESS_ONLY_INTERNET_GATEWAY) {
  throw new Error('Egress Only Internet Gateway has wrong router type');
}

if (routeToIgw.targetRouterType != RouterType.GATEWAY) {
  throw new Error('Internet Gateway has wrong router type');
}

if (routeToVpgw.targetRouterType != RouterType.GATEWAY) {
  throw new Error('Virtual Private Gateway has wrong router type');
}

if (routeToNATGW.targetRouterType != RouterType.NAT_GATEWAY) {
  throw new Error('NAT Gateway has wrong router type');
}

if (routeToNetworkIf.targetRouterType != RouterType.NETWORK_INTERFACE) {
  throw new Error('Network Interface has wrong router type');
}

if (routeToTransit.targetRouterType != RouterType.TRANSIT_GATEWAY) {
  throw new Error('Transit Gateway has wrong router type');
}

if (routeToVpcPeercon.targetRouterType != RouterType.VPC_PEERING_CONNECTION) {
  throw new Error('VPC Peer Connection has wrong router type');
}

if (routeToDynamo.targetRouterType != RouterType.VPC_ENDPOINT) {
  throw new Error('Dynamo route has wrong route type');
}

var i = 0;
for (const stackName in stacks) {
  new IntegTest(app, 'integtest-model-' + i, {
    testCases: [stacks[stackName]],
  });
  i++;
}
