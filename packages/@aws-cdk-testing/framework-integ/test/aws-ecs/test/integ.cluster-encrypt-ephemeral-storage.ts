import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: {
    '@aws-cdk/aws-ec2:restrictDefaultSecurityGroup': false,
  },
});

const stackUnnamed = new cdk.Stack(app, 'aws-ecs-ephemmeral-integ');
const stackNamed = new cdk.Stack(app, 'aws-ecs-ephemmeral-integ-named-cluster');

const keyForUnnamed = new kms.Key(stackUnnamed, 'key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new ecs.Cluster(stackUnnamed, 'cluster', {
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: keyForUnnamed },
});

const keyForNamed = new kms.Key(stackNamed, 'key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new ecs.Cluster(stackNamed, 'named-cluster', {
  clusterName: 'cluster-name',
  managedStorageConfiguration: { fargateEphemeralStorageKmsKey: keyForNamed },
});

new integ.IntegTest(app, 'aws-ecs-cluster-encrypt-ephemeral-storage', {
  testCases: [stackUnnamed],
});

app.synth();
