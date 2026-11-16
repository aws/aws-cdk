/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 */

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { AddressFamily, AwsServiceName, IpCidr, Ipam, IpamPoolPublicIpSource, SubnetV2 } from '../lib';
import * as vpc_v2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-integ-ipam');

const ipam = new Ipam(stack, 'IpamTest');

const pool1 = ipam.privateScope.addPool('PrivatePool0', {
  addressFamily: AddressFamily.IP_V4,
  ipv4ProvisionedCidrs: ['10.2.0.0/16'],
  locale: stack.region,
});

const pool2 = ipam.publicScope.addPool('PublicPool0', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: stack.region,
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
pool2.provisionCidr('PublicPool0Cidr', { netmaskLength: 52 });

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

new SubnetV2(stack, 'testsbubnet', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
  // IPAM pool CIDR deprovisioning is async — CloudFormation may attempt to
  // delete the pool before the VPC CIDR allocation is fully released, causing
  // DELETE_FAILED. Tolerate destroy errors to avoid flaky test teardown.
  cdkCommandOptions: {
    destroy: {
      expectError: true,
    },
  },
});
