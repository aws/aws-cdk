// /*
//  * Our integration tests act as snapshot tests to make sure the rendered template is stable.
//  * If any changes to the result are required,
//  * you need to perform an actual CloudFormation deployment of this application,
//  * and, if it is successful, a new snapshot will be written out.
//  *
//  * For more information on CDK integ tests,
//  * see the main CONTRIBUTING.md file.
//  */

import * as vpc_v2 from '../lib/vpc-v2';
import { AddressFamily, AwsServiceName, Ipam, IpamPoolPublicIpSource } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha');

const ipam = new Ipam(stack, 'IpamTest', {
  operatingRegion: ['eu-central-1'],
});

/**Test Ipam Pool Ipv4 */

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  ipv4ProvisionedCidrs: ['10.2.0.0/16'],
  locale: 'eu-central-1',
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: 'eu-central-1',
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 } );

/** Test Ipv4 Primary and Secondary address */
new vpc_v2.VpcV2(stack, 'VPC-integ-test-1', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4Ipam({
      ipamPool: pool1,
      netmaskLength: 20,
      cidrBlockName: 'ipv4IpamCidr',
    }),
    //Test secondary ipv6 address
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Integ test for VPC with IPAM pool to be run with --no-clean
 */
const vpc = new vpc_v2.VpcV2(stack, 'Vpc-integ-test-2', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.ipv6Ipam({
    ipamPool: pool2,
    netmaskLength: 60,
    cidrBlockName: 'Ipv6IpamCidr',
  }),
  vpc_v2.IpAddresses.ipv4('10.2.0.0/16', {
    cidrBlockName: 'SecondaryAddress2',
  }),
  vpc_v2.IpAddresses.ipv4('10.3.0.0/16', {
    cidrBlockName: 'SecondaryAddress3',
  },
  )],
});

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: 'eu-central-1a',
  ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: 'eu-central-1b',
  ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
  //Test secondary ipv6 address after IPAM pool creation
  //ipv6CidrBlock: new Ipv6Cidr('2001:db8:1::/64'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

//Validate ipv6 IPAM
new SubnetV2(stack, 'validateIpv6', {
  vpc,
  ipv4CidrBlock: new IpCidr('10.3.0.0/24'),
  availabilityZone: 'eu-central-1b',
  //Test secondary ipv6 address after IPAM pool creation
  //ipv6CidrBlock: new Ipv6Cidr('2001:db8::/48'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

