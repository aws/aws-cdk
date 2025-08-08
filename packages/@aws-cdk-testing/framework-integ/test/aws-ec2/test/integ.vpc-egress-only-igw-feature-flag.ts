#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

/**
 * This integration test verifies the behavior of the EC2_REQUIRE_PRIVATE_SUBNETS_FOR_EGRESSONLYINTERNETGATEWAY feature flag
 * for VPC
 *
 * The test creates two stacks:
 * 1. One with the feature flag enabled
 * 2. One with the feature flag disabled
 *
 * Each stack creates a VPC with a public subnet.
 */

const app = new cdk.App();

class VpcEgressOnlyIGWFeatureFlagEnabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(cdk.cx_api.EC2_REQUIRE_PRIVATE_SUBNETS_FOR_EGRESSONLYINTERNETGATEWAY, true);
    // Create a VPC
    new ec2.Vpc(this, 'VpcEnabled', {
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'public',
        },
      ],
    });
  }
}

class VpcEgressOnlyIGWFeatureFlagDisabledStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(cdk.cx_api.EC2_REQUIRE_PRIVATE_SUBNETS_FOR_EGRESSONLYINTERNETGATEWAY, false);
    // Create a VPC
    new ec2.Vpc(this, 'VpcDisabled', {
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'public',
        },
      ],
    });
  }
}

// Create the stacks
const enabledStack = new VpcEgressOnlyIGWFeatureFlagEnabledStack(app, 'VpcMigrationFeatureFlagEnabledStack');
const disabledStack = new VpcEgressOnlyIGWFeatureFlagDisabledStack(app, 'VpcMigrationFeatureFlagDisabledStack');

// Create the integration test
new IntegTest(app, 'VpcEgressFeatureFlagTest', {
  testCases: [enabledStack, disabledStack],
});
