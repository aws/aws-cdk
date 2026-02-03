import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2, VpcV2, IpAddresses } from '../lib';

describe('VPC with BYOIP IPv6', () => {
  test('VPC with BYOIP IPv6 pool', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const vpc = new VpcV2(stack, 'VPC', {
      primaryAddressBlock: IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [
        IpAddresses.ipv6ByoipPool({
          ipv6PoolId: 'ipv6pool-ec2-012345abcde',
          cidrBlockName: 'MyByoipIpv6Block',
          ipv6CidrBlock: '2600:f0f0:8::/56',
        }),
      ],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    new SubnetV2(stack, 'Subnet1', {
      vpc,
      ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
      ipv6CidrBlock: new IpCidr('2600:f0f0:8:1::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });

    new SubnetV2(stack, 'Subnet2', {
      vpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      ipv6CidrBlock: new IpCidr('2600:f0f0:8:0::/64'),
      availabilityZone: 'us-east-1a',
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: '10.1.0.0/16',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });

    template.hasResourceProperties('AWS::EC2::VPCCidrBlock', {
      Ipv6Pool: 'ipv6pool-ec2-012345abcde',
      Ipv6CidrBlock: '2600:f0f0:8::/56',
    });

    template.resourceCountIs('AWS::EC2::Subnet', 2);
  });
});
