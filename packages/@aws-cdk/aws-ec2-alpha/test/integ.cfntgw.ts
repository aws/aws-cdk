import * as vpc_v2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CfnTransitGateway, CfnTransitGatewayAttachment, CfnTransitGatewayRouteTableAssociation, SubnetType } from 'aws-cdk-lib/aws-ec2';
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

const subnet = new SubnetV2(stack, 'testSubnet1', {
  vpc,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.1.0.0/20'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});

// Create a Transit Gateway with
const tgw = new CfnTransitGateway(stack, 'TestTgw');

const attachment = new CfnTransitGatewayAttachment(stack, 'TestTgwAttachment', {
  transitGatewayId: tgw.ref,
  vpcId: vpc.vpcId,
  subnetIds: [subnet.subnetId],
});

const rtbId = tgw.propagationDefaultRouteTableId ?? 'invalid-id-string';

new CfnTransitGatewayRouteTableAssociation(stack, 'TestAssociation', {
  transitGatewayAttachmentId: attachment.ref,
  transitGatewayRouteTableId: rtbId,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

