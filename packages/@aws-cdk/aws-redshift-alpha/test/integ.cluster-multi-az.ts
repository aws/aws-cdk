import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type * as constructs from 'constructs';
import * as redshift from '../lib';

/**
 * Integration test for Redshift Multi-AZ clusters.
 *
 * Note: This test validates the Multi-AZ feature which requires at least 3 availability zones.
 * The test is configured to run in us-west-2 which has 4 AZs available.
 *
 * Original intent: Validate that Redshift clusters can be deployed with Multi-AZ enabled,
 * which provides higher availability by automatically provisioning and maintaining a standby
 * cluster in a different AZ.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MultiAzRedshift');

cdk.Aspects.of(stack).add({
  visit(node: constructs.IConstruct) {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  },
});

// Create VPC with explicit AZ selection to ensure 3 AZs
// Use Fn.select to get first 3 AZs from the region
const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  availabilityZones: [
    cdk.Fn.select(0, cdk.Fn.getAzs()),
    cdk.Fn.select(1, cdk.Fn.getAzs()),
    cdk.Fn.select(2, cdk.Fn.getAzs()),
  ],
});

new redshift.Cluster(stack, 'Cluster', {
  vpc,
  masterUser: {
    masterUsername: 'admin',
  },
  nodeType: redshift.NodeType.RA3_XLPLUS,
  clusterType: redshift.ClusterType.MULTI_NODE,
  numberOfNodes: 2,
  multiAz: true,
});

new integ.IntegTest(app, 'MultiAzRedshiftTest', {
  testCases: [stack],
  regions: ['us-west-2'], // Specify region with 3+ AZs
});
