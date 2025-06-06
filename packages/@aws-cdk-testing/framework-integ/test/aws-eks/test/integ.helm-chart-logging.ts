/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
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

    // Allow all account users to assume this role to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // Create a minimal VPC with just one NAT gateway
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create a minimal EKS cluster
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
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

    // Install a chart from ECR Public Gallery
    // This is the AWS Controllers for Kubernetes (ACK) S3 controller
    cluster.addHelmChart('ack-s3-controller', {
      chart: 's3-chart',
      release: 's3-controller',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
      version: 'v0.1.0',
      namespace: 'ack-system',
      createNamespace: true,
      values: {
        aws: {
          region: this.region,
        },
      },
    });

    // Also install our local test chart
    const chartAsset = new Asset(this, 'ChartAsset', {
      path: path.join(__dirname, 'helm-chart-logging-test'),
    });
    
    cluster.addHelmChart('local-test-chart', {
      chartAsset: chartAsset,
      namespace: 'default',
      values: {
        config: {
          message: 'Custom message from integration test',
        },
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
