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

  test('VPC with primary address', () => {
    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
    },
    );
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestVpcE77CE678: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            CidrBlock: '10.1.0.0/16',
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
          },
        },
      },
    });
  });

  test('VPC with secondary IPv4 address', () => {
    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16')],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    },
    );
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestVpcE77CE678: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            CidrBlock: '10.1.0.0/16',
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
          },
        },
        TestVpcSecondaryIp171E5BEAD: {
          Type: 'AWS::EC2::VPCCidrBlock',
          Properties: {
            VpcId: {
              'Fn::GetAtt': [
                'TestVpcE77CE678',
                'VpcId',
              ],
            },
          },
        },
      },
    });

  });

  test('VPC throws error with incorrect cidr range', () => {
    expect(() => {
      new vpc.VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
        secondaryAddressBlocks: [vpc.IpAddresses.ipv4('192.168.0.0/16')],
        enableDnsHostnames: true,
        enableDnsSupport: true,
      },
      );
    }).toThrow('CIDR block should be in the same RFC 1918 range in the VPC');
  });

  test('VPC supports secondary Amazon Provided IPv6 address', () => {
  });

  test('VPC Primary IP from ipv4 ipam', () => {
  });

  test('Throws error with an incorrect IPv4 CIDR range', () => {});

  test('Enable DNS Hostnames and DNS Support', () => {});

});

