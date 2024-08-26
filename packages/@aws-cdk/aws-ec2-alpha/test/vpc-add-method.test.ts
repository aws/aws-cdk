import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';

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
});