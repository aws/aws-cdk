import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
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
    console.log(Template.fromStack(stack).toJSON());
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/48',
    });
  });

  test('should not associate a route to an incorrect subnet', () => {
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
});