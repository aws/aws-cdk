import * as cdk from 'aws-cdk-lib';
import * as ec2 from '../lib';
import { AddressFamily } from '../lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-subnetv2-ipam-integ-test');
const ipam = new ec2.Ipam(stack, 'Ipam', {
  ipamName: 'TopLevel',
  operatingRegion: [stack.region],
});

const ipv4IpamPool = ipam.privateScope.addPool('PrivatePool', {
  addressFamily: AddressFamily.IP_V4,
  ipamIpv4Cidrs: [{
    cidr: '172.16.0.0/16',
  }],
  locale: stack.region,
});

const vpc = new ec2.VpcV2(stack, 'Vpc', {
  primaryAddressBlock: ec2.IpAddresses.ipv4Ipam({
    ipamPool: ipv4IpamPool,
    netmaskLength: 16,
    cidrBlockName: 'TopLevelCidr',
  }),
});

new ec2.SubnetV2(stack, 'Subnet', {
  vpc,
  ipv4Cidr: {
    ipamPool: ipv4IpamPool.addPool('subnetPool', {
      addressFamily: AddressFamily.IP_V4,
      sourceResource: vpc,
    }),
    netmaskLength: 24,
  },
  subnetType: SubnetType.PRIVATE_ISOLATED,
  availabilityZone: stack.region + 'a',
});

new IntegTest(app, 'aws-cdk-subnetv2-ipam', {
  testCases: [stack],
});
