#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
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

// Stack with feature flag enabled
const app = new cdk.App({
  context: {
    [cdk.cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: true,
  },
});

class VpcMigrationFeatureFlagEnabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2alpha.VpcV2(this, 'VpcWithFeatureFlagEnabled', {
      primaryAddressBlock: ec2alpha.IpAddresses.ipv4('10.0.0.0/16'),
    });

    // Create a public subnet
    const publicSubnet = new ec2alpha.SubnetV2(this, 'PublicSubnet', {
      vpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new ec2alpha.IpCidr('10.0.0.0/24'),
      subnetType: ec2.SubnetType.PUBLIC,
    });

    // Create an Internet Gateway
    const igw = new ec2alpha.InternetGateway(this, 'InternetGateway', { vpc });

    // Create a NAT Gateway
    const natGateway = new ec2alpha.NatGateway(this, 'NatGateway', {
      subnet: publicSubnet,
      connectivityType: ec2alpha.NatConnectivityType.PRIVATE,
    });

    // Create a Route Table
    const routeTable = new ec2alpha.RouteTable(this, 'RouteTable', { vpc });

    // Add routes to verify functionality
    routeTable.addRoute('RouteToIgw', '0.0.0.0/0',
      { gateway: igw });

    routeTable.addRoute('RouteToNat', '172.16.0.0/16', {
      gateway: natGateway,
    });

    // Output the IDs to verify in the test
    new cdk.CfnOutput(this, 'IgwRouterId', { value: igw.routerTargetId });
    new cdk.CfnOutput(this, 'NatGatewayRouterId', { value: natGateway.routerTargetId });
    new cdk.CfnOutput(this, 'RouteTableId', { value: routeTable.routeTableId });
  }
}

// Stack with feature flag disabled
const appDisabled = new cdk.App({
  context: {
    [cdk.cx_api.USE_RESOURCEID_FOR_VPCV2_MIGRATION]: false,
  },
});

class VpcMigrationFeatureFlagDisabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2alpha.VpcV2(this, 'VpcWithFeatureFlagDisabled', {
      primaryAddressBlock: ec2alpha.IpAddresses.ipv4('10.0.0.0/16'),
    });

    // Create a public subnet
    const publicSubnet = new ec2alpha.SubnetV2(this, 'PublicSubnet', {
      vpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new ec2alpha.IpCidr('10.0.0.0/24'),
      subnetType: ec2.SubnetType.PUBLIC,
    });

    // Create an Internet Gateway
    const igw = new ec2alpha.InternetGateway(this, 'InternetGateway', { vpc });

    // Create a NAT Gateway
    const natGateway = new ec2alpha.NatGateway(this, 'NatGateway', {
      subnet: publicSubnet,
      connectivityType: ec2alpha.NatConnectivityType.PRIVATE,
    });

    // Create a Route Table
    const routeTable = new ec2alpha.RouteTable(this, 'RouteTable', { vpc });

    // Add routes to verify functionality
    routeTable.addRoute('RouteToIgw', '0.0.0.0/0',
      { gateway: igw });

    routeTable.addRoute('RouteToNat', '172.16.0.0/16', {
      gateway: natGateway,
    });

    // Output the IDs to verify in the test
    new cdk.CfnOutput(this, 'IgwRouterId', { value: igw.routerTargetId });
    new cdk.CfnOutput(this, 'NatGatewayRouterId', { value: natGateway.routerTargetId });
    new cdk.CfnOutput(this, 'RouteTableId', { value: routeTable.routeTableId });
  }
}

// Create the stacks
const enabledStack = new VpcMigrationFeatureFlagEnabledStack(app, 'VpcMigrationFeatureFlagEnabledStack');
const disabledStack = new VpcMigrationFeatureFlagDisabledStack(appDisabled, 'VpcMigrationFeatureFlagDisabledStack');

// Create the integration test
new IntegTest(app, 'VpcMigrationFeatureFlagTest', {
  testCases: [enabledStack, disabledStack],
  diffAssets: true,
});
