import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_18;

class EksClusterStack extends TestStack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC');

    const secretsEncryptionKey = new kms.Key(this, 'SecretsKey');

    const cluster = new eks.LegacyCluster(this, 'EKSCluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
      secretsEncryptionKey,
    });

    cluster.addCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      minCapacity: 1, // Raise this number to add more nodes
    });
  }
}

const app = new cdk.App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-kubectl-disabled');

app.synth();
