/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
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
      ...getClusterVersionConfig(this),
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

    // there is no opinionated way of testing charts from private ECR, so there is description of manual steps needed to reproduce:
    // 1. `export AWS_PROFILE=youraccountprofile; aws ecr create-repository --repository-name helm-charts-test/s3-chart --region YOUR_REGION`
    // 2. `helm pull oci://public.ecr.aws/aws-controllers-k8s/s3-chart --version v0.1.0`
    // 3. Login to ECR (howto: https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html )
    // 4. `helm push s3-chart-v0.1.0.tgz oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test/`
    // 5. Change `repository` in above test to oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test
    // 6. Run integration tests as usual

    this.cluster.addHelmChart('test-oci-chart-different-release-name', {
      chart: 'lambda-chart',
      release: 'lambda-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
      version: 'v0.1.4',
      namespace: 'ack-system',
      createNamespace: true,
    });

    // testing the disable mechanism of the installation of CRDs
    this.cluster.addHelmChart('test-skip-crd-installation', {
      chart: 'lambda-chart',
      release: 'lambda-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
      version: 'v0.1.4',
      namespace: 'ack-system',
      createNamespace: true,
      skipCrds: true,
    });
  }
}

const app = new App();

const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
  testCases: [stack],
});

app.synth();
