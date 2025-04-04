import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2, VpcV2, IpAddresses } from '../lib';

describe('SubnetV2 mapPublicIpOnLaunch', () => {
  test('mapPublicIpOnLaunch defaults to false for all subnet types', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcV2(stack, 'VPC', {
      primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
    });

    // WHEN - public subnet
    new SubnetV2(stack, 'PublicSubnet', {
      vpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      subnetType: SubnetType.PUBLIC,
    });

    // WHEN - private subnet
    new SubnetV2(stack, 'PrivateSubnet', {
      vpc,
      availabilityZone: 'us-east-1b',
      ipv4CidrBlock: new IpCidr('10.0.1.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.0.0/24',
      MapPublicIpOnLaunch: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.1.0/24',
      MapPublicIpOnLaunch: false,
    });
  });

  test('mapPublicIpOnLaunch can be explicitly set to true for public subnets', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcV2(stack, 'VPC', {
      primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
    });

    // WHEN
    new SubnetV2(stack, 'Subnet', {
      vpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
      subnetType: SubnetType.PUBLIC,
      mapPublicIpOnLaunch: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: true,
    });
  });

  test('throws error when mapPublicIpOnLaunch is set to true for non-public subnets', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcV2(stack, 'VPC', {
      primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
    });

    // THEN
    expect(() => {
      new SubnetV2(stack, 'Subnet', {
        vpc,
        availabilityZone: 'us-east-1a',
        ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        mapPublicIpOnLaunch: true,
      });
    }).toThrow('mapPublicIpOnLaunch can only be set to true for public subnets');
  });
});
