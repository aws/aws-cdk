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
import { AddressFamily, AwsServiceName, IpCidr, Ipam, IpamPoolPublicIpSource, SubnetV2 } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-integ-ipam');

const ipam = new Ipam(stack, 'IpamTest', {
  operatingRegion: ['us-west-2'],
});

/**Test Ipam Pool Ipv4 */

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  ipv4ProvisionedCidrs: ['10.2.0.0/16'],
  locale: 'us-west-2',
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: 'us-west-2',
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );

/** Test Ipv4 Primary and Secondary address IpvIPAM */
const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipamPool: pool1,
      netmaskLength: 20,
      cidrBlockName: 'ipv4IpamCidr',
    }),
    vpc_v2.IpAddresses.ipv6Ipam({
      ipamPool: pool2,
      netmaskLength: 60,
      cidrBlockName: 'Ipv6IpamCidr',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Since source for IPAM IPv6 is set to amazonProvidedIPAM CIDR,
 * can assign IPv6 address only after the allocation
 * uncomment ipv6CidrBlock and provide valid IPv6 range
 */
new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  //defined on the basis of allocation done in IPAM console
  //ipv6CidrBlock: new Ipv6Cidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 *  due to dependency on de-allocation of provisioned ipv6 CIDR
 */
new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});
