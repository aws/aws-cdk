#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ec2alpha from '../lib';

/**
 * This integration test verifies the behavior of the USE_RESOURCEID_FOR_VPCV2_MIGRATION feature flag
 * for VPC components like InternetGateway, NatGateway, and RouteTable.
 *
 * The test creates two stacks:
 * 1. One with the feature flag enabled
 * 2. One with the feature flag disabled
 *
 * Each stack creates a VPC with an Internet Gateway, NAT Gateway, and Route Table.
 */

const app = new cdk.App();

class VpcMigrationFeatureFlagEnabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(cdk.cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION, true);

    const vpc = new ec2alpha.VpcV2(this, 'VpcWithFeatureFlagEnabled', {
      primaryAddressBlock: ec2alpha.IpAddresses.ipv4('10.0.0.0/16'),
    });

    const publicSubnet = new ec2alpha.SubnetV2(this, 'PublicSubnet', {
      vpc,
      availabilityZone: this.availabilityZones[0],
      ipv4CidrBlock: new ec2alpha.IpCidr('10.0.0.0/24'),
      subnetType: ec2.SubnetType.PUBLIC,
    });

    const igw = new ec2alpha.InternetGateway(this, 'InternetGateway', { vpc });

    const natGateway = new ec2alpha.NatGateway(this, 'NatGateway', {
      subnet: publicSubnet,
      connectivityType: ec2alpha.NatConnectivityType.PRIVATE,
    });

    const routeTable = new ec2alpha.RouteTable(this, 'RouteTable', { vpc });

    routeTable.addRoute('RouteToIgw', '0.0.0.0/0', { gateway: igw });
    routeTable.addRoute('RouteToNat', '172.16.0.0/16', { gateway: natGateway });

    new cdk.CfnOutput(this, 'IgwRouterId', { value: igw.routerTargetId });
    new cdk.CfnOutput(this, 'NatGatewayRouterId', { value: natGateway.routerTargetId });
    new cdk.CfnOutput(this, 'RouteTableId', { value: routeTable.routeTableId });
  }
}

class VpcMigrationFeatureFlagDisabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(cdk.cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION, false);

    const vpc = new ec2alpha.VpcV2(this, 'VpcWithFeatureFlagDisabled', {
      primaryAddressBlock: ec2alpha.IpAddresses.ipv4('10.0.0.0/16'),
    });

    const publicSubnet = new ec2alpha.SubnetV2(this, 'PublicSubnet', {
      vpc,
      availabilityZone: this.availabilityZones[0],
      ipv4CidrBlock: new ec2alpha.IpCidr('10.0.0.0/24'),
      subnetType: ec2.SubnetType.PUBLIC,
    });

    const igw = new ec2alpha.InternetGateway(this, 'InternetGateway', { vpc });

    const natGateway = new ec2alpha.NatGateway(this, 'NatGateway', {
      subnet: publicSubnet,
      connectivityType: ec2alpha.NatConnectivityType.PRIVATE,
    });

    const routeTable = new ec2alpha.RouteTable(this, 'RouteTable', { vpc });

    routeTable.addRoute('RouteToIgw', '0.0.0.0/0', { gateway: igw });
    routeTable.addRoute('RouteToNat', '172.16.0.0/16', { gateway: natGateway });

    new cdk.CfnOutput(this, 'IgwRouterId', { value: igw.routerTargetId });
    new cdk.CfnOutput(this, 'NatGatewayRouterId', { value: natGateway.routerTargetId });
    new cdk.CfnOutput(this, 'RouteTableId', { value: routeTable.routeTableId });
  }
}

const enabledStack = new VpcMigrationFeatureFlagEnabledStack(app, 'VpcMigrationFeatureFlagEnabledStack');
const disabledStack = new VpcMigrationFeatureFlagDisabledStack(app, 'VpcMigrationFeatureFlagDisabledStack');

new IntegTest(app, 'VpcMigrationFeatureFlagTest', {
  testCases: [enabledStack, disabledStack],
  diffAssets: true,
});
