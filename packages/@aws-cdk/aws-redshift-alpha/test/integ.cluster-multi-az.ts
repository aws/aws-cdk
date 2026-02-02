import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type * as constructs from 'constructs';
import * as redshift from '../lib';

/**
 * Integration test for Redshift Multi-AZ clusters.
 * 
 * Note: This test requires deployment to a region with at least 3 availability zones.
 * Multi-AZ Redshift clusters require subnets in at least 3 different AZs.
 * 
 * Current limitation: When synthesizing region-agnostic stacks, the VPC construct
 * cannot determine the number of available AZs at synth time, which may cause
 * deployment failures in regions with fewer than 3 AZs or when the VPC doesn't
 * create subnets in 3 AZs.
 * 
 * TODO: This test may need to be region-specific (e.g., hardcode to us-west-2)
 * or require manual verification that the deployment region has 3+ AZs.
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

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  maxAzs: 3,
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
