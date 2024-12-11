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
import { InternetGateway, IpCidr, RouteTable, SubnetV2 } from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2-alpha-new');

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
new SubnetV2(stack, 'testSubnet1', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.1.0.0/20'),
  //defined on the basis of allocation done in IPAM console
  //ipv6CidrBlock: new Ipv6Cidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

/**Test compatibility with existing construct */
new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
});

/** Test route table association */

const igw = new InternetGateway(stack, 'testIGW', {
  vpc,
});

const routeTable = new RouteTable(stack, 'TestRoutetable', {
  vpc,
});

routeTable.addRoute('eigwRoute', '0.0.0.0/0', { gateway: igw });

new SubnetV2(stack, 'testSubnet2', {
  vpc,
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.1.128.0/20'),
  routeTable: routeTable,
  subnetType: SubnetType.PUBLIC,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

