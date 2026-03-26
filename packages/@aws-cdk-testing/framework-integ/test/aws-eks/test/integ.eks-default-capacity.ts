import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * Integration test for EKS cluster with default capacity.
 *
 * Validates that the default nodegroup (defaultCapacity > 0) works correctly.
 * Pinned to k8s 1.32 because the default AMI type (AL2_x86_64) is only
 * supported for k8s 1.32 or earlier.
 */
class EksDefaultCapacityStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 2,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.of('1.32')),
    });
  }
}

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });

const stack = new EksDefaultCapacityStack(app, 'aws-cdk-eks-default-capacity-test');

new integ.IntegTest(app, 'aws-cdk-eks-default-capacity', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
