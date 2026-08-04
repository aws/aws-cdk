import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';
import { TransitGateway } from '../lib/transit-gateway';
import * as vpc_v2 from '../lib/vpc-v2';

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

const subnet = new SubnetV2(stack, 'testSubnet1', {
  vpc,
  availabilityZone: stack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.1.0.0/20'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// Create a Transit Gateway with
const tgw = new TransitGateway(stack, 'TransitGateway', {
  defaultRouteTableAssociation: false,
  defaultRouteTablePropagation: false,
});

// Can attach a VPC to the Transit Gateway
const attachment = tgw.attachVpc('DefaultRtbAttachment', {
  vpc: vpc,
  subnets: [subnet],
});

// Can add additional route tables to the Transit Gateway
const customRtb = tgw.addRouteTable('RouteTable2');

// Can add a static route to the Transit Gateway Route Table
tgw.defaultRouteTable.addRoute('defaultRTBRoute', attachment, '0.0.0.0/0');

// Add an Association and enable Propagation from the attachment to the custom Route Table
customRtb.addAssociation('customRtbAssociation', attachment);

// This will propagate the defaultRTBRoute to the custom route table.
// The propagation is done dynamically and is reflected in the AWS console but not in the generated CFN template.
// Run this test with --no-clean flag to confirm that the route is in both route tables.
customRtb.enablePropagation('customRtbPropagation', attachment);

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

