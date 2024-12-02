import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { SubnetV2, IpCidr } from '../lib/subnet-v2';
//import { Ipam } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-tag');

/** Test Multiple Ipv4 Primary and Secondary address */
const vpc = new vpc_v2.VpcV2(stack, 'VPC-integ-test-tag', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.ipv4('10.2.0.0/16', {
      cidrBlockName: 'SecondaryAddress2',
    }),
    //Test Amazon provided secondary ipv6 address
    vpc_v2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'CDKintegTestVPC',
});

const subnet = new SubnetV2(stack, 'testsubnet', {
  vpc,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'CDKIntegTestSubnet',
});

vpc.addInternetGateway({
  internetGatewayName: 'CDKIntegTestTagIGW',
});

vpc.addNatGateway({
  natGatewayName: 'CDKIntegTestTagNGW',
  subnet: subnet,
});

vpc.enableVpnGatewayV2({
  vpnGatewayName: 'CDKIntegTestTagVGW',
  type: VpnConnectionType.IPSEC_1,
});

// const ipam = new Ipam(stack, 'IpamIntegTest', {
//   operatingRegion: ['us-west-2'],
//   ipamName: 'CDKIpamTestTag',
// });

// ipam.addScope(stack, 'CustomIpamScope', {
//   ipamScopeName: 'CustomPrivateScopeTag',
// });

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});