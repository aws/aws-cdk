import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-ephemmeral-integ');
const key = new kms.Key(stack, 'key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new ecs.Cluster(stack, 'NamedCluster', {
  clusterName: 'cluster-name',
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: key },
});
new ecs.Cluster(stack, 'Cluster', {
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: key },
});

new integ.IntegTest(app, 'aws-ecs-cluster-encrypt-ephemeral-storage', {
  testCases: [stack],
});

app.synth();
