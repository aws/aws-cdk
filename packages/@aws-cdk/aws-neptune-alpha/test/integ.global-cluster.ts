import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DatabaseCluster, InstanceType, GlobalCluster } from '../lib';

/*
 * Test Neptune Global Database cluster:
 * 1. Primary cluster created and used as sourceCluster for GlobalCluster.
 * 2. Secondary cluster in another region joining GlobalCluster via globalCluster prop.
 *
 * Stack verification steps:
 * * aws neptune describe-global-clusters --global-cluster-identifier <deployed global cluster identifier>
 * * aws neptune describe-db-clusters --db-cluster-identifier <primary cluster identifier>
 */

const app = new cdk.App();

const primaryStack = new cdk.Stack(app, 'aws-cdk-neptune-global-cluster-integ', {
  env: {
    region: 'us-east-1',
  },
  crossRegionReferences: true,
});

const primaryVpc = new ec2.Vpc(primaryStack, 'PrimaryVpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const primaryCluster = new DatabaseCluster(primaryStack, 'PrimaryCluster', {
  vpc: primaryVpc,
  instanceType: InstanceType.R5_LARGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const globalCluster = new GlobalCluster(primaryStack, 'GlobalCluster', {
  globalClusterIdentifier: 'my-global-cluster',
  sourceCluster: primaryCluster,
  deletionProtection: false,
});

const secondaryStack = new cdk.Stack(app, 'aws-cdk-neptune-global-cluster-secondary-integ', {
  env: {
    region: 'us-east-2',
  },
  crossRegionReferences: true,
});

const secondaryVpc = new ec2.Vpc(secondaryStack, 'SecondaryVpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

new DatabaseCluster(secondaryStack, 'SecondaryCluster', {
  vpc: secondaryVpc,
  instanceType: InstanceType.R5_LARGE,
  globalCluster,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const assertionStack = new cdk.Stack(app, 'GlobalClusterAssertStack', {
  env: {
    region: 'us-east-1',
  },
});

const integTest = new integ.IntegTest(app, 'GlobalClusterTest', {
  testCases: [primaryStack, secondaryStack],
  assertionStack,
  regions: ['us-east-1'],
  diffAssets: true,
});

integTest.assertions
  .awsApiCall('Neptune', 'describeGlobalClusters', {
    GlobalClusterIdentifier: globalCluster.globalClusterIdentifier,
  })
  .expect(integ.ExpectedResult.objectLike({
    GlobalClusters: [
      integ.Match.objectLike({
        Engine: 'neptune',
        GlobalClusterMembers: integ.Match.arrayWith([
          integ.Match.objectLike({
            IsWriter: true,
          }),
        ]),
      }),
    ],
  }));

integTest.assertions
  .awsApiCall('Neptune', 'describeDBClusters', {
    DBClusterIdentifier: primaryCluster.clusterIdentifier,
  })
  .expect(integ.ExpectedResult.objectLike({
    DBClusters: [
      integ.Match.objectLike({
        GlobalClusterIdentifier: globalCluster.globalClusterIdentifier,
      }),
    ],
  }));
