import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import { InternetGateway, NatGateway, RouteTable, VPCPeeringConnection, VPNGatewayV2 } from '../lib/route';
import { SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { AddressFamily, Ipam } from '../lib';

describe('Vpc V2 with full control', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
  });
  // Test VPC tagging
  test('VPC has correct tags', () => {
    new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
      Tags: [
        {
          Key: 'Name',
          Value: 'MyTestVpc',
        },
      ],
    });
  });

  // Test VPC tagging with default name
  test('VPC has default tag when no name provided', () => {
    new vpc.VpcV2(stack, 'TestVpc');
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/TestVpc',
        },
      ],
    });
  });

  test('Subnet has correct tags from Tags.of(this)', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    new SubnetV2(stack, 'TestSubnet', {
      vpc: testVpc,
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      subnetName: 'MyTestSubnet',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: 'MyTestSubnet',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: 'Private',
        },
      ],
    });
  });

  test('RouteTable has correct tags from Tags.of(this)', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    new RouteTable(stack, 'TestRouteTable', {
      vpc: testVpc,
      routeTableName: 'TestRouteTable',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::RouteTable', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestRouteTable',
        },
      ],
    });
  });

  test('InternetGateway has correct tags from Tags.of(this)', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    new InternetGateway(stack, 'TestIGW', {
      vpc: testVpc,
      internetGatewayName: 'TestIGW',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::InternetGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'MyTestVpc',
        },
      ],
    });
  });

  test('NatGateway has correct tags from Tags.of(this)', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });
    const testSubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: testVpc,
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
      subnetName: 'MyTestSubnet',
    });

    new NatGateway(stack, 'TestNGW', {
      vpc: testVpc,
      subnet: testSubnet,
      natGatewayName: 'TestNGW',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestNGW',
        },
      ],
    });
  });

  test('VPCPeeringConnection has correct tags from Tags.of(this)', () => {
    const vpc1 = new vpc.VpcV2(stack, 'TestVpc1');
    const vpc2 = new vpc.VpcV2(stack, 'TestVpc2', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });

    new VPCPeeringConnection(stack, 'TestPeering', {
      requestorVpc: vpc1,
      acceptorVpc: vpc2,
      vpcPeeringConnectionName: 'TestPeering',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCPeeringConnection', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestPeering',
        },
      ],
    });
  });

  test('VPNGatewayV2 has correct tags from Tags.of(this)', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    new VPNGatewayV2(stack, 'TestVPNGateway', {
      vpc: testVpc,
      amazonSideAsn: 65000,
      type: VpnConnectionType.DUMMY,
      vpnGatewayName: 'TestVPNGateway',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestVPNGateway',
        },
      ],
    });
  });

  // Testing the tags using add method

  test('NatGateway has correct tags from Tags.of(this) using add method', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });
    const testSubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: testVpc,
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
      subnetName: 'MyTestSubnet',
    });

    testVpc.addNatGateway({
      subnet: testSubnet,
      natGatewayName: 'TestNGW',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestNGW',
        },
      ],
    });
  });

  test('VPNGatewayV2 has correct tags from Tags.of(this) using add method', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    testVpc.enableVpnGatewayV2({
      amazonSideAsn: 65000,
      type: VpnConnectionType.DUMMY,
      vpnGatewayName: 'TestVPNGateway',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestVPNGateway',
        },
      ],
    });
  });
  test('InternetGateway has correct tags from Tags.of(this) using add method', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      vpcName: 'MyTestVpc',
    });

    testVpc.addInternetGateway({
      internetGatewayName: 'TestIGW',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::InternetGateway', {
      Tags: [
        {
          Key: 'Name',
          Value: 'MyTestVpc',
        },
      ],
    });
  });

  test('VPCPeeringConnection has correct tags from Tags.of(this) using add method', () => {
    const vpc1 = new vpc.VpcV2(stack, 'TestVpc1');
    const vpc2 = new vpc.VpcV2(stack, 'TestVpc2', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });

    vpc1.createPeeringConnection('TestPeeringConnection', {
      acceptorVpc: vpc2,
      vpcPeeringConnectionName: 'TestPeering',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCPeeringConnection', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestPeering',
        },
      ],
    });
  });

  test('Adds tag to IPAM and IPAM Scope and Pool', () => {
    const ipam = new Ipam(stack, 'TestIpam', {
      ipamName: 'TestIpam',
      operatingRegions: ['us-west-1'],
    });

    ipam.addScope(stack, 'TestScope', {
      ipamScopeName: 'TestScope',
    });

    ipam.privateScope.addPool('testPool', {
      locale: 'us-west-1',
      ipamPoolName: 'TestPool',
      addressFamily: AddressFamily.IP_V4,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::IPAM', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestIpam',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::IPAMScope', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestScope',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::IPAMPool', {
      Tags: [
        {
          Key: 'Name',
          Value: 'TestPool',
        },
      ],
    });
  });
});
