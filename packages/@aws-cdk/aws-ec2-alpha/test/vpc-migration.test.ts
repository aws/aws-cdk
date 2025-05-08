import { App, Stack, cx_api } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InternetGateway, NatGateway, RouteTable } from '../lib/route';
import { VpcV2, IpAddresses } from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('InternetGateway', () => {
  describe('feature flag USE_RESOURCEID_FOR_VPCV2_MIGRATION', () => {
    test('when enabled, routerTargetId should use resource.ref', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: true,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // WHEN
      const igw = new InternetGateway(stack, 'TestIgw', { vpc });

      // THEN
      // Verify that the routerTargetId is set to the ref of the resource
      expect(igw.routerTargetId).toBe(igw.resource.ref);

      // Verify that the VPC Gateway Attachment is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
        VpcId: { Ref: 'TestVpc' },
        InternetGatewayId: { Ref: 'TestIgw' }, // Should use the ref when feature flag is enabled
      });
    });

    test('when disabled, routerTargetId should use resource.attrInternetGatewayId', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: false,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // WHEN
      const igw = new InternetGateway(stack, 'TestIgw', { vpc });

      // THEN
      // Verify that the routerTargetId is set to the attrInternetGatewayId of the resource
      expect(igw.routerTargetId).toBe(igw.resource.attrInternetGatewayId);

      // Verify that the VPC Gateway Attachment is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
        VpcId: { Ref: 'TestVpc' },
        InternetGatewayId: { 'Fn::GetAtt': ['TestIgw', 'InternetGatewayId'] }, // Should use the attribute when feature flag is disabled
      });
    });
  });
});

describe('NatGateway', () => {
  describe('feature flag USE_RESOURCEID_FOR_VPCV2_MIGRATION', () => {
    test('when enabled, routerTargetId should use resource.ref', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: true,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // Create a public subnet for the NAT Gateway
      const publicSubnet = new SubnetV2(stack, 'PublicSubnet', {
        vpc,
        availabilityZone: 'us-east-1a',
        ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
        subnetType: SubnetType.PUBLIC,
      });

      // WHEN
      const natGateway = new NatGateway(stack, 'TestNatGateway', {
        subnet: publicSubnet,
      });

      // THEN
      // Verify that the routerTargetId is set to the ref of the resource
      expect(natGateway.routerTargetId).toBe(natGateway.resource.ref);

      // Verify that the NAT Gateway is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NatGateway', {
        SubnetId: { Ref: 'PublicSubnet' },
        AllocationId: { 'Fn::GetAtt': [expect.stringMatching(/TestNatGatewayEIP.*/), 'AllocationId'] },
      });
    });

    test('when disabled, routerTargetId should use resource.attrNatGatewayId', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: false,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // Create a public subnet for the NAT Gateway
      const publicSubnet = new SubnetV2(stack, 'PublicSubnet', {
        vpc,
        availabilityZone: 'us-east-1a',
        ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
        subnetType: SubnetType.PUBLIC,
      });

      // WHEN
      const natGateway = new NatGateway(stack, 'TestNatGateway', {
        subnet: publicSubnet,
      });

      // THEN
      // Verify that the routerTargetId is set to the attrNatGatewayId of the resource
      expect(natGateway.routerTargetId).toBe(natGateway.resource.attrNatGatewayId);

      // Verify that the NAT Gateway is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::NatGateway', {
        SubnetId: { Ref: 'PublicSubnet' },
        AllocationId: { 'Fn::GetAtt': [expect.stringMatching(/TestNatGatewayEIP.*/), 'AllocationId'] },
      });
    });
  });
});

describe('RouteTable', () => {
  describe('feature flag USE_RESOURCEID_FOR_VPCV2_MIGRATION', () => {
    test('when enabled, routeTableId should use resource.ref', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: true,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // WHEN
      const routeTable = new RouteTable(stack, 'TestRouteTable', { vpc });

      // THEN
      // Verify that the routeTableId is set to the ref of the resource
      expect(routeTable.routeTableId).toBe(routeTable.resource.ref);

      // Verify that the Route Table is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::RouteTable', {
        VpcId: { Ref: 'TestVpc' },
      });
    });

    test('when disabled, routeTableId should use resource.attrRouteTableId', () => {
      // GIVEN
      const app = new App({
        context: {
          [cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: false,
        },
      });
      const stack = new Stack(app, 'TestStack');
      const vpc = new VpcV2(stack, 'TestVpc', {
        primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/16'),
      });

      // WHEN
      const routeTable = new RouteTable(stack, 'TestRouteTable', { vpc });

      // THEN
      // Verify that the routeTableId is set to the attrRouteTableId of the resource
      expect(routeTable.routeTableId).toBe(routeTable.resource.attrRouteTableId);

      // Verify that the Route Table is created with the correct properties
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EC2::RouteTable', {
        VpcId: { Ref: 'TestVpc' },
      });
    });
  });
});

