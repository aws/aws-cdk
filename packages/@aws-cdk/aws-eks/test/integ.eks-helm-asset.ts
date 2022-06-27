/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack } from '@aws-cdk/core';
import * as eks from '../lib/index';

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_21,
      tags: {
        foo: 'bar',
      },
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
    });

    this.assertHelmChartAsset();
  }

  private assertHelmChartAsset() {
    // get helm chart from Asset
    const chartAsset = new Asset(this, 'ChartAsset', {
      path: path.join(__dirname, 'test-chart'),
    });
    this.cluster.addHelmChart('test-chart', {
      chartAsset: chartAsset,
    });

    this.cluster.addHelmChart('test-oci-chart', {
      chart: 's3-chart',
      release: 's3-chart',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
      version: 'v0.1.0',
      namespace: 'ack-system',
      createNamespace: true,
    });
  }
}

const app = new App();

new EksClusterStack(app, 'aws-cdk-eks-helm-test');

app.synth();

