import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';

class EksClusterStack extends TestStack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    const vpc = new ec2.Vpc(this, 'VPC');

    const cluster = new eks.Cluster(this, 'EKSCluster', {
      vpc,
      defaultCapacity: 0,
    });

    cluster.addCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      desiredCapacity: 1, // Raise this number to add more nodes
    });
    /// !hide
  }
}

const app = new cdk.App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-test-basic');

app.synth();
