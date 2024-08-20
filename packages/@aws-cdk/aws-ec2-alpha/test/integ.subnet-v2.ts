/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import * as vpc_v2 from '../lib/vpc-v2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AddressFamily, AwsServiceName, IpCidr, Ipam, IpamPoolPublicIpSource, SubnetV2 } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-new');

const ipam = new Ipam(stack, 'Ipam', {
  operatingRegion: ['eu-west-2'], //set to the region stack is being deployed to
});

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */
const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: 'eu-west-2', //set to the region stack is being deployed to
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});

pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );

const vpc = new vpc_v2.VpcV2(stack, 'VPCTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
    ipamPool: pool2,
    netmaskLength: 56,
    cidrBlockName: 'Ipv6IpamCidr',
  })],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Since source for IPAM IPv6 is set to amazonProvided,
 * can assign IPv6 address only after the allocation
 * uncomment ipv6CidrBlock and provide valid IPv6 range
 */
new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  //defined on the basis of allocation done in IPAM console
  //ipv6CidrBlock: new Ipv6Cidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

vpc.enableVpnGateway({
  vpnRoutePropagation: [{
    subnetType: SubnetType.PRIVATE_ISOLATED, // optional, defaults to "PUBLIC"
  }],
  type: 'ipsec.1',
});

new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

