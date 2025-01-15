import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { TransitGateway } from '../lib/transit-gateway';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-alpha-transit-gateway-disable-automatic-settings');

const vpc = new vpc_v2.VpcV2(stack, 'SubnetTest', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [vpc_v2.IpAddresses.amazonProvidedIpv6( {
    cidrBlockName: 'SecondaryTest',
  })],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

/**
 * Since source for IPAM IPv6 is set to amazonProvided,
 * can assign IPv6 address only after the allocation
 * uncomment ipv6CidrBlock and provide valid IPv6 range
 */
const subnet1 = new SubnetV2(stack, 'testSubnet1', {
// new SubnetV2(stack, 'testSubnet1', {
  vpc,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.1.0.0/20'),
  //defined on the basis of allocation done in IPAM console
  //ipv6CidrBlock: new Ipv6Cidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

const tgw = new TransitGateway(stack, 'TransitGateway', {
  defaultRouteTableAssociation: false,
  defaultRouteTablePropagation: false,
});

const attachment = tgw.attachVpc('DefaultRtbAttachment', vpc, [subnet1]);
attachment.node.addDependency(vpc);
const customRtb = tgw.addRouteTable('RouteTable2');

tgw.defaultRouteTable.addRoute('defaultRTBRoute', attachment, '0.0.0.0/0');
customRtb.addAssociation('customRtbAssociation', attachment);
customRtb.enablePropagation('customRtbPropagation', attachment);

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

