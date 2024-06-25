import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import * as route from '../lib/route';
import { Template } from 'aws-cdk-lib/assertions';

describe('EC2 Routing', () => {
  let stack: cdk.Stack;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;
  let routeTable: route.RouteTable;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
    myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6()],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    mySubnet = new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.Ipv4Cidr('10.0.0.0/24'),
      ipv6CidrBlock: new subnet.Ipv6Cidr(cdk.Fn.select(0, myVpc.ipv6CidrBlocks)),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });
    routeTable = new route.RouteTable(stack, 'TestRouteTable', {
      vpcId: myVpc.vpcId,
    });
  });

  test('Route to EIGW', () => {
    const eigw = new route.EgressOnlyInternetGateway(stack, 'TestEIGW', {
      vpcId: myVpc.vpcId,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: vpc.IpAddresses.ipv4('0.0.0.0/0'),
      target: eigw,
    });
    Template.fromStack(stack).toJSON();
  });
});