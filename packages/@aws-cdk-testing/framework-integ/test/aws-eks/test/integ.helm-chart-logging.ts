/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * Integration test for improved Helm chart error logging
 *
 * This test creates a minimal EKS cluster and installs a Helm chart
 * to verify the improved error logging functionality.
 */
class HelmChartLoggingStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // Create a minimal VPC with just one NAT gateway
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create a minimal EKS cluster
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 1,
      ...getClusterVersionConfig(this),
    });

    // Install a simple Helm chart from a public repository
    // Using the AWS Load Balancer Controller chart as it's commonly used
    cluster.addHelmChart('aws-load-balancer-controller', {
      chart: 'aws-load-balancer-controller',
      repository: 'https://aws.github.io/eks-charts',
      namespace: 'kube-system',
      version: '1.6.0',
      values: {
        clusterName: cluster.clusterName,
      },
    });
  }
}

const app = new App();

const stack = new HelmChartLoggingStack(app, 'aws-cdk-eks-helm-logging-test');

new integ.IntegTest(app, 'aws-cdk-eks-helm-logging', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();
