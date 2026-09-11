import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { GlobalCluster, EngineVersion } from '../lib';

/*
 * Test creating an empty Neptune Global Database cluster.
 *
 * Stack verification steps:
 * * aws neptune describe-global-clusters --global-cluster-identifier <deployed global cluster identifier>
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-neptune-global-cluster-integ');

const globalCluster = new GlobalCluster(stack, 'GlobalCluster', {
  globalClusterIdentifier: 'my-global-cluster',
  engineVersion: EngineVersion.V1_3_0_0,
  storageEncrypted: true,
  deletionProtection: false,
});

const integTest = new integ.IntegTest(app, 'GlobalClusterTest', {
  testCases: [stack],
});

integTest.assertions
  .awsApiCall('Neptune', 'describeGlobalClusters', {
    GlobalClusterIdentifier: globalCluster.globalClusterIdentifier,
  })
  .expect(integ.ExpectedResult.objectLike({
    GlobalClusters: [
      integ.Match.objectLike({
        Engine: 'neptune',
        StorageEncrypted: true,
      }),
    ],
  }));
