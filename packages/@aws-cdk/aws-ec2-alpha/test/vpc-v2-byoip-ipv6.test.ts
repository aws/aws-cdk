import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, Ipv6Cidr, SubnetV2, VpcV2, IpAddresses } from '../lib';

describe('VPC BYOIP IPv6 Support', () => {
  test('VPC with BYOIP IPv6 CIDR block', () => {
    const stack = new cdk.Stack();

    const vpc = new VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [
        IpAddresses.ipv6Cidr({
          cidrBlockName: 'BYOIPv6Block',
          ipv6Pool: 'ipv6pool-ec2-123456',
        }),
      ],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    new SubnetV2(stack, 'Subnet1', {
      vpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      ipv6CidrBlock: new Ipv6Cidr('2001:db8:1::/64'),
      availabilityZone: 'us-west-2a',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });

    new SubnetV2(stack, 'Subnet2', {
      vpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'us-west-2a',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });

    const template = Template.fromStack(stack);

    // Verify VPC has BYOIP IPv6 CIDR block
    template.hasResourceProperties('AWS::EC2::VPCCidrBlock', {
      Ipv6Pool: 'ipv6pool-ec2-123456',
    });

    // Verify subnets are created
    template.resourceCountIs('AWS::EC2::Subnet', 2);
    
    // Verify subnet with IPv6 CIDR
    template.hasResourceProperties('AWS::EC2::Subnet', {
      Ipv6CidrBlock: '2001:db8:1::/64',
    });
  });
});
