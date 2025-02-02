import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { AddressFamily, AwsServiceName, Ipam, IpamPoolPublicIpSource } from '../lib';

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
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'SecondaryAddress',
      })],
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
        TestVpcSecondaryAddress72BC831D: {
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

  test('VPC throws error with incorrect cidr range (IPv4)', () => {
    expect(() => {
      new vpc.VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
        secondaryAddressBlocks: [vpc.IpAddresses.ipv4('192.168.0.0/16', {
          cidrBlockName: 'SecondaryIpv4',
        })],
        enableDnsHostnames: true,
        enableDnsSupport: true,
      },
      );
    }).toThrow('CIDR block should be in the same RFC 1918 range in the VPC');
  });

  test('VPC supports secondary Amazon Provided IPv6 address', () => {
    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonProvided' })],
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
        TestVpcAmazonProvided00BF109D: {
          Type: 'AWS::EC2::VPCCidrBlock',
          Properties: {
            AmazonProvidedIpv6CidrBlock: true, // Amazon Provided IPv6 address
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

  test('VPC Primary IP from Ipv4 Ipam', () => {
    const ipam = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-1'],
    });

    const pool = ipam.privateScope.addPool('PrivatePool0', {
      addressFamily: AddressFamily.IP_V4,
      ipv4ProvisionedCidrs: ['10.1.0.1/24'],
      locale: 'us-west-1',
    });

    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4Ipam({
        ipamPool: pool,
        netmaskLength: 28,
        cidrBlockName: 'IPv4Ipam',
      }),
      enableDnsHostnames: true,
      enableDnsSupport: true,
    },
    );
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestIpamDBF92BA8: { Type: 'AWS::EC2::IPAM' },
        TestIpamPrivatePool0E8589980: {
          Type: 'AWS::EC2::IPAMPool',
          Properties: {
            AddressFamily: 'ipv4',
            IpamScopeId: { 'Fn::GetAtt': ['TestIpamDBF92BA8', 'PrivateDefaultScopeId'] },
            Locale: 'us-west-1',
            ProvisionedCidrs: [
              {
                Cidr: '10.1.0.1/24',
              },
            ],
          },
        },
        TestVpcE77CE678: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            Ipv4IpamPoolId: {
              'Fn::GetAtt': [
                'TestIpamPrivatePool0E8589980',
                'IpamPoolId',
              ],
            },
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
          },
        },
      },
    });
  });

  test('VPC Secondary IP from Ipv6 Ipam', () => {
    const ipam = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-1'],
    });

    const pool = ipam.publicScope.addPool('PublicPool0', {
      addressFamily: AddressFamily.IP_V6,
      awsService: AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-1',
    });
    pool.provisionCidr('PublicPoolCidr', {
      netmaskLength: 60,
    });

    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipamPool: pool,
        netmaskLength: 64,
        cidrBlockName: 'IPv6Ipam',
      })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    },
    );
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestIpamDBF92BA8: { Type: 'AWS::EC2::IPAM' },
        TestIpamPublicPool0588A338B: {
          Type: 'AWS::EC2::IPAMPool',
          Properties: {
            AddressFamily: 'ipv6',
            AwsService: 'ec2',
            IpamScopeId: { 'Fn::GetAtt': ['TestIpamDBF92BA8', 'PublicDefaultScopeId'] },
            PublicIpSource: 'amazon',
          },
        },
        // Test Amazon Provided IPAM IPv6
        TestIpamPublicPool0PublicPoolCidrB0FF20F7: {
          Type: 'AWS::EC2::IPAMPoolCidr',
          Properties: {
            IpamPoolId: {
              'Fn::GetAtt': [
                'TestIpamPublicPool0588A338B',
                'IpamPoolId',
              ],
            },
            NetmaskLength: 60,
          },
        },
        TestVpcE77CE678: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            CidrBlock: '10.1.0.0/16',
            EnableDnsHostnames: true,
            EnableDnsSupport: true,
          },
        },
        TestVpcIPv6Ipam402F1C75: {
          Type: 'AWS::EC2::VPCCidrBlock',
          Properties: {
            VpcId: {
              'Fn::GetAtt': [
                'TestVpcE77CE678',
                'VpcId',
              ],
            },
            Ipv6IpamPoolId: {
              'Fn::GetAtt': [
                'TestIpamPublicPool0588A338B',
                'IpamPoolId',
              ],
            },
            Ipv6NetmaskLength: 64,
          },
        },
      },
    });
  });

  test('VPC with secondary IPv6 Pool address', () => {
    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6ByoipPool({
        cidrBlockName: 'SecondaryIPv6',
        ipv6PoolId: 'SecondaryIPv6Pool',
        ipv6CidrBlock: '2001:db8::/32',
      })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCCidrBlock', {
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
      Ipv6CidrBlock: '2001:db8::/32',
      Ipv6Pool: 'SecondaryIPv6Pool',
    });
  });

  test('VPC with multiple IPv6 Pool addresses', () => {
    // WHEN
    new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [
        vpc.IpAddresses.ipv6ByoipPool({
          cidrBlockName: 'SecondaryIPv6One',
          ipv6PoolId: 'Pool1',
          ipv6CidrBlock: '2001:db8:1::/48',
        }),
        vpc.IpAddresses.ipv6ByoipPool({
          cidrBlockName: 'SecondaryIPv6Two',
          ipv6PoolId: 'Pool2',
          ipv6CidrBlock: '2001:db8:2::/48',
        }),
      ],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::EC2::VPCCidrBlock', 2);
  });

  test('Set field `useIpv6` to true if secondary address is defined using IPAM IPv6', () => {
    const ipv6Vpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipamPool: new Ipam(stack, 'TestIpam', {
          operatingRegions: ['us-west-1'],
        }).publicScope.addPool('PublicPool0', {
          addressFamily: AddressFamily.IP_V6,
          awsService: AwsServiceName.EC2,
          publicIpSource: IpamPoolPublicIpSource.AMAZON,
          locale: 'us-west-1',
        }),
        netmaskLength: 64,
        cidrBlockName: 'IPv6Ipam',
      })],
    },
    );
    expect(ipv6Vpc.useIpv6).toBe(true);
  });

  test('Set field `useIpv6` to true if secondary address is defined using Amazon Provided IPv6', () => {
    const ipv6Vpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6({
        cidrBlockName: 'Ipv6Amazon',
      })],
    },
    );
    expect(ipv6Vpc.useIpv6).toBe(true);
  });

  test('Set field `useIpv6` to true if secondary address is defined using BYOIP IPv6', () => {
    const ipv6Vpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6ByoipPool({
        ipv6PoolId: 'test-Byoip-pool',
        ipv6CidrBlock: '2001:db8::/32',
        cidrBlockName: 'BYOIP',
      })],
    },
    );
    expect(ipv6Vpc.useIpv6).toBe(true);
  });

  test('Set field `useIpv6` to false if no IPv6 address is attached to VPC', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'SecondaryAddress',
      })],
    },
    );
    expect(testVpc.useIpv6).toBe(false);
  });

  test('VPC throws error is secondary CIDR block name is not provided', () => {
    expect(() => new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16')],
    })).toThrow('Cidr Block Name is required to create secondary IP address');
  });
});
