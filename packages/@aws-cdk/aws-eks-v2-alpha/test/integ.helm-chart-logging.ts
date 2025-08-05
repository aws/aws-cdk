/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from '../lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';

/**
 * Integration test for improved Helm chart error logging in aws-eks-v2-alpha
 *
 * This test creates a minimal EKS cluster and installs a Helm chart
 * to verify the improved error logging functionality.
 */
class HelmChartLoggingV2Stack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // Create a minimal VPC with just one NAT gateway
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create a minimal EKS cluster using v2-alpha
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
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

const stack = new HelmChartLoggingV2Stack(app, 'aws-cdk-eks-v2-alpha-helm-logging-test');

new integ.IntegTest(app, 'aws-cdk-eks-v2-alpha-helm-logging', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();
