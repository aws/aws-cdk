import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import * as route from '../lib/route';
import { CfnEIP, SubnetType } from 'aws-cdk-lib/aws-ec2';
/* eslint-disable no-console */

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
  test('Method to add a new Egress-Only IGW', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    },
    );
    myVpc.addEgressOnlyInternetGateway({});
    Template.fromStack(stack).hasResource('AWS::EC2::EgressOnlyInternetGateway', 1);
  });

  test('addEIGW throws error if VPC does not have IPv6', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    expect(() => {
      myVpc.addEgressOnlyInternetGateway({});
    }).toThrow('Egress only IGW can only be added to Ipv6 enabled VPC');
  });

  test('addEIGW defines a route under subnet to default destination', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    new SubnetV2(stack, 'validateIpv6', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      ipv6CidrBlock: new IpCidr('2001:db8::/48'),
      subnetType: SubnetType.PUBLIC,
    });
    myVpc.addEgressOnlyInternetGateway({
      subnets: [{ subnetType: SubnetType.PUBLIC }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/0',
    });
  });

  test('addEIGW defines a route under subnet to given destination', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    new SubnetV2(stack, 'validateIpv6', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      //Test secondary ipv6 address after IPAM pool creation
      ipv6CidrBlock: new IpCidr('2001:db8::/48'),
      subnetType: SubnetType.PUBLIC,
    });
    myVpc.addEgressOnlyInternetGateway({
      subnets: [{ subnetType: SubnetType.PUBLIC }],
      destination: '::/48',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/48',
    });
  });

  test('addEIGW should not associate a route to an incorrect subnet', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    new SubnetV2(stack, 'validateIpv6', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      //Test secondary ipv6 address after IPAM pool creation
      ipv6CidrBlock: new IpCidr('2001:db8::/48'),
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    expect( () => {
      myVpc.addEgressOnlyInternetGateway({
        subnets: [{ subnetType: SubnetType.PUBLIC }],
        destination: '::/48',
      });
    }).toThrow("There are no 'Public' subnet groups in this VPC. Available types: Isolated,Deprecated_Isolated");
  });

  test('addNatGateway defines a private gateway', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
    });
    const template = Template.fromStack(stack);
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines private gateway with secondary IP addresses', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddresses: [
        '10.0.1.0/28',
        '10.0.2.0/28',
      ],
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SecondaryPrivateIpAddresses: [
          '10.0.1.0/28',
          '10.0.2.0/28',
        ],
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines private gateway with secondary IP address count', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddressCount: 2,
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SecondaryPrivateIpAddressCount: 2,
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines public gateway', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines public gateway with provided EIP', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    const eip = new CfnEIP(stack, 'MyEIP', {
      domain: myVpc.vpcId,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
      allocationId: eip.attrAllocationId,
    });
    const template = Template.fromStack(stack);
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be in stack
    template.hasResourceProperties('AWS::EC2::EIP', {
      Domain: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
    });
  });

  test('addNatGateway defines public gateway with many parameters', () => {
    const myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    const mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    myVpc.addInternetGateway();
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PUBLIC,
      maxDrainDuration: cdk.Duration.seconds(2001),
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'public',
        MaxDrainDurationSeconds: 2001,
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

});