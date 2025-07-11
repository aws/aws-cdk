import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-ephemeral-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const keyForUnnamed = new kms.Key(stack, 'key-for-unnamed', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new ecs.Cluster(stack, 'cluster', {
  vpc,
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: keyForUnnamed },
});

const keyForNamed = new kms.Key(stack, 'key-for-named', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new ecs.Cluster(stack, 'named-cluster', {
  vpc,
  clusterName: 'cluster-name',
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: keyForNamed },
});

new integ.IntegTest(app, 'aws-ecs-cluster-encrypt-ephemeral-storage', {
  testCases: [stack],
});

app.synth();
