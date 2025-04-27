import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-ecs-encrypt-storage');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const key = new kms.Key(stack, 'Key', {
  removalPolicy: RemovalPolicy.DESTROY,
});
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  managedStorageConfiguration: { kmsKey: key },
});

const integTest = new IntegTest(app, 'aws-ecs-cluster-encrypt-storage', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('ECS', 'describeClusters', {
  clusters: [cluster.clusterName],
  include: ['CONFIGURATIONS'],
})
  .assertAtPath(
    'clusters.0.configuration.managedStorageConfiguration.kmsKeyId',
    ExpectedResult.stringLikeRegexp(key.keyId),
  );
