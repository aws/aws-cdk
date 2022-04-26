import * as cdk from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';
/// !cdk-integ pragma:enable-lookups

class EksClusterStack extends TestStack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new eks.Cluster(this, 'Cluster');
  }
}

const app = new cdk.App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-defaults');

app.synth();
