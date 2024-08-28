import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { NetworkAcl, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { AddressFamily, AwsServiceName, Ipam, IpamPoolPublicIpSource } from '../lib/ipam';
import { createTestSubnet } from './util';

/**
 * Test suite for the SubnetV2 class.
 * Verifies the correct behavior and functionality of creating and managing subnets within a VpcV2 instance.
 */
describe('Subnet V2 with custom IP and routing', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);

  });

  test('should create a subnet with valid input parameters', () => {

    const testVpc = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'Secondary1',
      })],
    });

    const subnetConfig = {
      vpcV2: testVpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      subnetType: SubnetType.PUBLIC,
    };

    createTestSubnet(stack, subnetConfig);

    Template.fromStack(stack).templateMatches({
      Resources: {
        TestVPCD26570D8: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            CidrBlock: '10.1.0.0/16',
          },
        },
        TestSubnet2A4BE4CA: {
          Type: 'AWS::EC2::Subnet',
          Properties: {
            CidrBlock: '10.1.0.0/24',
            AvailabilityZone: 'us-east-1a',
            VpcId: {
              'Fn::GetAtt': [
                'TestVPCD26570D8',
                'VpcId',
              ],
            },
          },
        },
      },
    });

  });

  test('Should throw error if overlapping CIDR block(IPv4) for the subnet', () => {
    const testVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'Secondary1',
      })],
    });

    const subnetConfig = {
      vpcV2: testVPC,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      subnetType: SubnetType.PUBLIC,
    };

    createTestSubnet(stack, subnetConfig);

    // Define a second subnet with an overlapping CIDR range
    expect(() => new subnet.SubnetV2(stack, 'InvalidSubnet', {
      vpc: testVPC,
      ipv4CidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
    })).toThrow('CIDR block should not overlap with existing subnet blocks');
  });

  test('Should throw error if invalid CIDR block', () => {
    const testVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'Secondary1',
      })],
    });

    expect(() => new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: testVPC,
      ipv4CidrBlock: new subnet.IpCidr('10.3.0.0/23'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
    })).toThrow('CIDR block should be within the range of VPC');
  });

  test('Should throw error if VPC does not support IPv6', () => {
    const TestVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.2.0.0/16', {
        cidrBlockName: 'Secondary1',
      })],
    });
    expect(() => new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: TestVPC,
      ipv4CidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      ipv6CidrBlock: new subnet.IpCidr('2001:db8:1::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
    })).toThrow('To use IPv6, the VPC must enable IPv6 support.');
  });

  test('Create Subnet with IPv6 if it is Amazon Provided Ipv6 is enabled on VPC', () => {
    const testVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6({
        cidrBlockName: 'AmazonIpv6',
      })],
    });

    const subnetConfig = {
      vpcV2: testVPC,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      ipv6Cidr: new subnet.IpCidr('2001:db8:1::/64'),
      subnetType: SubnetType.PUBLIC,
    };
    createTestSubnet(stack, subnetConfig);
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestVPCD26570D8: {
          Type: 'AWS::EC2::VPC',
          Properties: {
            CidrBlock: '10.1.0.0/16',
          },
        },
        TestSubnet2A4BE4CA: {
          Type: 'AWS::EC2::Subnet',
          Properties: {
            CidrBlock: '10.1.0.0/24',
            AvailabilityZone: 'us-east-1a',
            VpcId: {
              'Fn::GetAtt': [
                'TestVPCD26570D8',
                'VpcId',
              ],
            },
            Ipv6CidrBlock: '2001:db8:1::/64',
          },
        },
      },
    });
  });

  test('Create Subnet with IPv6 if it is Ipam Ipv6 is enabled on VPC', () => {
    const ipam = new Ipam(stack, 'TestIpam', {
      operatingRegion: ['us-west-1'],
    });
    const pool = ipam.publicScope.addPool('PublicPool0', {
      addressFamily: AddressFamily.IP_V6,
      awsService: AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-1',
    });
    const TestVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipamPool: pool,
        netmaskLength: 60,
        cidrBlockName: 'ipv6Ipam',
      })],
    });

    new subnet.SubnetV2(stack, 'IpamSubnet', {
      vpc: TestVPC,
      ipv4CidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      ipv6CidrBlock: new subnet.IpCidr('2001:db8:1::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        TestIpamDBF92BA8: { Type: 'AWS::EC2::IPAM' },
        TestIpamPublicPool0588A338B: {
          Type: 'AWS::EC2::IPAMPool',
          Properties:
                    {
                      AddressFamily: 'ipv6',
                      IpamScopeId: {
                        'Fn::GetAtt': ['TestIpamDBF92BA8', 'PublicDefaultScopeId'],
                      },
                    },
        },
        TestVPCD26570D8: { Type: 'AWS::EC2::VPC' },
        TestVPCipv6Ipam6024F9EC: { Type: 'AWS::EC2::VPCCidrBlock' },
        IpamSubnet78671F8A: {
          Type: 'AWS::EC2::Subnet',
          Properties: {
            CidrBlock: '10.1.0.0/24',
            AvailabilityZone: 'us-east-1a',
            VpcId: { 'Fn::GetAtt': ['TestVPCD26570D8', 'VpcId'] },
            Ipv6CidrBlock: '2001:db8:1::/64',
          },
        },
      },
    });
  });

  test('Should throw error if overlapping CIDR block(IPv6) for the subnet', () => {
    const ipam = new Ipam(stack, 'TestIpam', {
      operatingRegion: ['us-west-1'],
    });
    const pool = ipam.publicScope.addPool('PublicPool0', {
      addressFamily: AddressFamily.IP_V6,
      awsService: AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-1',
    });
    const testVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipamPool: pool,
        netmaskLength: 60,
        cidrBlockName: 'ipv6Ipam',
      })],
    });

    const subnetConfig = {
      vpcV2: testVPC,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      ipv6CidrBlock: new subnet.IpCidr('2001:db8:1::/64'),
      subnetType: SubnetType.PUBLIC,
    };
    createTestSubnet(stack, subnetConfig);

    // Define a second subnet with an overlapping CIDR range
    expect(() => new subnet.SubnetV2(stack, 'OverlappingSubnet', {
      vpc: testVPC,
      ipv4CidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      ipv6CidrBlock: new subnet.IpCidr('2001:db8:1:1::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PUBLIC,
    })).toThrow('CIDR block should not overlap with existing subnet blocks');
  });

  test('should store the subnet to VPC by subnet type', () => {
    const testVPC = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });

    const subnetConfig = {
      vpcV2: testVPC,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      subnetType: SubnetType.PUBLIC,
    };
    const testsubnet = createTestSubnet(stack, subnetConfig);

    /**
                 * Test case: Verify that the subnet is correctly stored in the VPC's collection of public subnets.
                 * Expected outcome: The testsubnet should be the only public subnet in the VPC.
                 */
    expect(testVPC.publicSubnets.length).toEqual(1);
    expect(testVPC.publicSubnets[0]).toEqual(testsubnet);
  });

  test('should associate a NetworkAcl with the subnet', () => {
    const testVpc = new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });

    const subnetConfig = {
      vpcV2: testVpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.IpCidr('10.1.0.0/24'),
      subnetType: SubnetType.PUBLIC,
    };
    const testsubnet = createTestSubnet(stack, subnetConfig);

    const networkAcl = new NetworkAcl(stack, 'TestNetworkAcl', {
      vpc: testVpc,
    });

    testsubnet.associateNetworkAcl('TestAssociation', networkAcl);

    expect(Template.fromStack(stack).hasResource('AWS::EC2::SubnetNetworkAclAssociation', {}));
  });

});
