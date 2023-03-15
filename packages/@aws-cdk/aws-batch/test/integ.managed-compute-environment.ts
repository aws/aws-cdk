import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as cdk from '@aws-cdk/core';

import { IntegTest } from '@aws-cdk/integ-tests';
import * as batch from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
const vpc = new ec2.Vpc(stack, 'vpc');

new batch.ManagedEc2EcsComputeEnvironment(stack, 'DefaultCE', {
  vpc,
});

new batch.ManagedEc2EcsComputeEnvironment(stack, 'EnabledCE', {
  vpc,
  enabled: true,
  spot: true,
  spotBidPercentage: 90,
  useOptimalInstanceClasses: true,
  minvCpus: 64,
  maxvCpus: 1024,
  instanceClasses: [ec2.InstanceClass.R4],
  updateTimeout: cdk.Duration.minutes(20),
  terminateOnUpdate: true,
});

new batch.ManagedEc2EcsComputeEnvironment(stack, 'AnotherCE', {
  vpc,
  spot: false,
  useOptimalInstanceClasses: false,
  instanceClasses: [ec2.InstanceClass.R4],
  terminateOnUpdate: false,
});

new batch.ManagedEc2EksComputeEnvironment(stack, 'eksCE', {
  vpc,
  kubernetesNamespace: 'myKubeNamespace',
});

new batch.ManagedEc2EksComputeEnvironment(stack, 'eksCE', {
  vpc,
  kubernetesNamespace: 'myKubeNamespace',
  eksCluster: new eks.Cluster(stack, 'eksCluster', {
    version: eks.KubernetesVersion.V1_24,
  }),
});

new IntegTest(app, 'ArchiveTest', {
  testCases: [stack],
});

app.synth();