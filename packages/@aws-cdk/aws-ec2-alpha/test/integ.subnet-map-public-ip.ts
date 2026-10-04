/**
 * Integration test for SubnetV2 mapPublicIpOnLaunch property
 * Tests that the mapPublicIpOnLaunch property is correctly passed to the CloudFormation resource
 */

import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-subnet-map-public-ip');

const vpc = new vpc_v2.VpcV2(stack, 'VPC', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'MapPublicIpTestVPC',
});

// Create a public subnet with mapPublicIpOnLaunch explicitly set to true
new SubnetV2(stack, 'PublicSubnetWithIp', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.0.1.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'PublicSubnetWithIp',
  mapPublicIpOnLaunch: true,
});

// Create a public subnet with mapPublicIpOnLaunch explicitly set to false
new SubnetV2(stack, 'PublicSubnetWithoutIp', {
  vpc,
  availabilityZone: stack.availabilityZones[1],
  ipv4CidrBlock: new IpCidr('10.0.2.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'PublicSubnetWithoutIp',
  mapPublicIpOnLaunch: false,
});

// Create a private subnet with default mapPublicIpOnLaunch (should be false)
new SubnetV2(stack, 'PrivateSubnetDefault', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.0.3.0/24'),
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
  subnetName: 'PrivateSubnetDefault',
});

const integ = new IntegTest(app, 'SubnetMapPublicIpInteg', {
  testCases: [stack],
});

// Verify that the mapPublicIpOnLaunch property is correctly set on the subnets
const publicWithIpAssertion = integ.assertions.awsApiCall('ec2', 'describeSubnets', {
  Filters: [
    {
      Name: 'tag:aws-cdk:subnet-name',
      Values: ['PublicSubnetWithIp'],
    },
  ],
});

publicWithIpAssertion.expect(ExpectedResult.objectLike({
  Subnets: [
    Match.objectLike({
      MapPublicIpOnLaunch: true,
    }),
  ],
}));

const publicWithoutIpAssertion = integ.assertions.awsApiCall('ec2', 'describeSubnets', {
  Filters: [
    {
      Name: 'tag:aws-cdk:subnet-name',
      Values: ['PublicSubnetWithoutIp'],
    },
  ],
});

publicWithoutIpAssertion.expect(ExpectedResult.objectLike({
  Subnets: [
    Match.objectLike({
      MapPublicIpOnLaunch: false,
    }),
  ],
}));

const privateDefaultAssertion = integ.assertions.awsApiCall('ec2', 'describeSubnets', {
  Filters: [
    {
      Name: 'tag:aws-cdk:subnet-name',
      Values: ['PrivateSubnetDefault'],
    },
  ],
});

privateDefaultAssertion.expect(ExpectedResult.objectLike({
  Subnets: [
    Match.objectLike({
      MapPublicIpOnLaunch: false,
    }),
  ],
}));
