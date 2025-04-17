import { Annotations, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import * as route from '../lib/route';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('VPC with shared route tables', () => {
  let stack: cdk.Stack;
  let myVpc: vpc.VpcV2;
  let sharedRouteTable: route.RouteTable;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app);
    myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    // Create a shared route table
    sharedRouteTable = new route.RouteTable(stack, 'SharedRouteTable', {
      vpc: myVpc,
      routeTableName: 'SharedRouteTable',
    });
  });

  test('addInternetGateway with explicit subnets sharing route table creates only one route', () => {
    // Create two subnets that share the same route table
    const subnet1 = new SubnetV2(stack, 'Subnet1', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
      routeTable: sharedRouteTable,
    });

    const subnet2 = new SubnetV2(stack, 'Subnet2', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.2.0/24'),
      availabilityZone: 'us-east-1b',
      subnetType: SubnetType.PUBLIC,
      routeTable: sharedRouteTable,
    });

    // Add internet gateway with explicit subnets
    myVpc.addInternetGateway({
      internetGatewayName: 'TestIGW',
      subnets: [subnet1, subnet2],
    });

    // Verify the template
    const template = Template.fromStack(stack);

    // Count the number of routes with this route table ID and destination 0.0.0.0/0
    template.hasResource('AWS::EC2::Route', 1);

    // Verify no warning with public subnets
    Annotations.fromStack(stack).hasNoWarning('/Default/TestVpc', 'Given Subnet is not a public subnet. Internet Gateway should be added only to public subnets. [ack: InternetGatewayWarning]');
  });

  test('addInternetGateway throws warning if route is being added for private subnet', () => {
    const subnet = new SubnetV2(stack, 'Subnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: sharedRouteTable,
    });

    myVpc.addInternetGateway({
      internetGatewayName: 'TestIGW',
      subnets: [subnet],
    });
    Annotations.fromStack(stack).hasWarning('/Default/TestVpc', 'Given Subnet is not a public subnet. Internet Gateway should be added only to public subnets. [ack: InternetGatewayWarning]');
  });

  test('addInternetGateway with default public subnets sharing route table creates only one route', () => {
    // Create two public subnets that share the same route table
    new SubnetV2(stack, 'PublicSubnet1', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
      routeTable: sharedRouteTable,
    });

    new SubnetV2(stack, 'PublicSubnet2', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.2.0/24'),
      availabilityZone: 'us-east-1b',
      subnetType: SubnetType.PUBLIC,
      routeTable: sharedRouteTable,
    });

    // Add internet gateway without specifying subnets (should use all public subnets)
    myVpc.addInternetGateway({
      internetGatewayName: 'TestIGW',
    });

    // Verify the template
    const template = Template.fromStack(stack);

    // Count the number of routes with this route table ID and destination 0.0.0.0/0
    template.hasResource('AWS::EC2::Route', 1);

    // Verify no warning with public subnets
    Annotations.fromStack(stack).hasNoWarning('/Default/TestVpc', 'Given Subnet is not a public subnet. Internet Gateway should be added only to public subnets. [ack: InternetGatewayWarning]');
  });

  test('addEgressOnlyInternetGateway with subnets sharing route table creates only one route', () => {
    // Create two subnets that share the same route table
    const subnet1 = new SubnetV2(stack, 'Subnet1', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      ipv6CidrBlock: new IpCidr('2001:db8:1::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: sharedRouteTable,
    });

    const subnet2 = new SubnetV2(stack, 'Subnet2', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.2.0/24'),
      ipv6CidrBlock: new IpCidr('2001:db8:2::/64'),
      availabilityZone: 'us-east-1b',
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: sharedRouteTable,
    });

    // Add egress-only internet gateway with explicit subnets
    myVpc.addEgressOnlyInternetGateway({
      egressOnlyInternetGatewayName: 'TestEIGW',
      subnets: [subnet1, subnet2],
    });

    // Verify the template
    const template = Template.fromStack(stack);

    // Count the number of routes with this route table ID and destination ::/0
    template.hasResource('AWS::EC2::Route', 1);
  });
});
