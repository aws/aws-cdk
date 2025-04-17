import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib/core';
import * as vpc from '../lib';
import { TransitGateway } from '../lib/transit-gateway';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('TransitGatewayVpcAttachment', () => {
  let stack: Stack;
  let myVpc: vpc.VpcV2;
  let transitGateway: TransitGateway;
  let mySubnet: vpc.SubnetV2;

  beforeEach(() => {
    stack = new Stack();
    myVpc = new vpc.VpcV2(stack, 'VpcA', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.1.0.0/16', { cidrBlockName: 'TempSecondaryBlock' })],
    });

    mySubnet = new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new subnet.IpCidr('10.0.0.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    transitGateway = new TransitGateway(stack, 'TransitGateway', {
      defaultRouteTableAssociation: false,
      defaultRouteTablePropagation: false,
    });
  });

  test('creates vpc attachment with required properties', () => {
    // WHEN
    transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        {
          Ref: 'TestSubnet2A4BE4CA',
        },
      ],
      TransitGatewayId: {
        'Fn::GetAtt': [
          'TransitGateway11B93D57',
          'Id',
        ],
      },
      VpcId: {
        'Fn::GetAtt': [
          'VpcAAD85CA4C',
          'VpcId',
        ],
      },
    });
  });

  test('creates vpc attachment with optional properties', () => {
    // WHEN
    transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
      vpcAttachmentOptions: {
        dnsSupport: true,
        ipv6Support: true,
        applianceModeSupport: true,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      VpcId: stack.resolve(myVpc.vpcId),
      TransitGatewayId: stack.resolve(transitGateway.transitGatewayId),
      SubnetIds: [stack.resolve(mySubnet.subnetId)],
      Options: {
        DnsSupport: 'enable',
        Ipv6Support: 'enable',
        ApplianceModeSupport: 'enable',
      },
    });
  });

  test('can add subnets', () => {
    // GIVEN
    const attachment = transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
    });

    const additionalSubnet = new subnet.SubnetV2(stack, 'AdditionalSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1b',
      ipv4CidrBlock: new subnet.IpCidr('10.0.1.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    // WHEN
    attachment.addSubnets([additionalSubnet]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        { Ref: 'TestSubnet2A4BE4CA' },
        { Ref: 'AdditionalSubnetD5F4E6FA' },
      ],
    });
  });

  test('can remove subnets', () => {
    // GIVEN
    const additionalSubnet = new subnet.SubnetV2(stack, 'AdditionalSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1b',
      ipv4CidrBlock: new subnet.IpCidr('10.0.1.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    const attachment = transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet, additionalSubnet],
    });

    // WHEN
    attachment.removeSubnets([additionalSubnet]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [{ Ref: 'TestSubnet2A4BE4CA' }],
    });
  });

  test('throws error when adding duplicate subnet', () => {
    // GIVEN
    const attachment = transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
    });

    // THEN
    expect(() => attachment.addSubnets([mySubnet])).toThrow(
      `Subnet with ID ${mySubnet.subnetId} is already added to the Attachment`,
    );
  });

  test('throws error when removing non-existent subnet', () => {
    // GIVEN
    const attachment = transitGateway.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
    });

    const nonExistentSubnet = new subnet.SubnetV2(stack, 'NonExistentSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1c',
      ipv4CidrBlock: new subnet.IpCidr('10.0.2.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    // THEN
    expect(() => attachment.removeSubnets([nonExistentSubnet])).toThrow(
      `Subnet with ID ${nonExistentSubnet.subnetId} does not exist in the Attachment`,
    );
  });

  test('throws warning when options are enabled on attachment but not on the transit gateway', () => {
    // GIVEN
    const transitGateway2 = new TransitGateway(stack, 'TransitGateway2', {
      dnsSupport: false,
      securityGroupReferencingSupport: false,
    });

    // WHEN
    transitGateway2.attachVpc('VpcAttachment', {
      vpc: myVpc,
      subnets: [mySubnet],
      vpcAttachmentOptions: {
        dnsSupport: true,
        securityGroupReferencingSupport: true,
      },
    });

    // THEN
    const annotations = Annotations.fromStack(stack).findWarning('*', Match.anyValue());
    expect(annotations.length).toBe(2);

    Annotations.fromStack(stack).hasWarning('/Default/TransitGateway2/VpcAttachment', '\'DnsSupport\' is enabled for the VPC Attachment but disabled on the TransitGateway. The feature will not work unless \'DnsSupport\' is enabled on both. [ack: @aws-cdk/aws-ec2:transitGatewayDnsSupportMismatch]');

    Annotations.fromStack(stack).hasWarning('/Default/TransitGateway2/VpcAttachment', '\'SecurityGroupReferencingSupport\' is enabled for the VPC Attachment but disabled on the TransitGateway. The feature will not work unless \'SecurityGroupReferencingSupport\' is enabled on both. [ack: @aws-cdk/aws-ec2:transitGatewaySecurityGroupReferencingSupportMismatch]');
  });
});
