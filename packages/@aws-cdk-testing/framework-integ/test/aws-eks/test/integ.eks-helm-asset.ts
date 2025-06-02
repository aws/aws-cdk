/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

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
    this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });

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

    // https://gallery.ecr.aws/aws-controllers-k8s/s3-chart
    this.cluster.addHelmChart('test-oci-chart', {
      chart: 's3-chart',
      release: 's3-chart',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
      version: 'v0.1.0',
      namespace: 'ack-system',
      createNamespace: true,
      values: { aws: { region: this.region } },
    });

    // there is no opinionated way of testing charts from private ECR, so there is description of manual steps needed to reproduce:
    // 1. `export AWS_PROFILE=youraccountprofile; aws ecr create-repository --repository-name helm-charts-test/s3-chart --region YOUR_REGION`
    // 2. `helm pull oci://public.ecr.aws/aws-controllers-k8s/s3-chart --version v0.1.0`
    // 3. Login to ECR (howto: https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html )
    // 4. `helm push s3-chart-v0.1.0.tgz oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test/`
    // 5. Change `repository` in above test to oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test
    // 6. Run integration tests as usual

    // https://gallery.ecr.aws/aws-controllers-k8s/lambda-chart
    this.cluster.addHelmChart('test-oci-chart-different-release-name', {
      chart: 'lambda-chart',
      release: 'lambda-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
      version: 'v0.1.4',
      namespace: 'ack-system',
      createNamespace: true,
      values: { aws: { region: this.region } },
    });

    // testing the disable mechanism of the installation of CRDs
    // https://gallery.ecr.aws/aws-controllers-k8s/rds-chart
    this.cluster.addHelmChart('test-skip-crd-installation', {
      chart: 'rds-chart',
      release: 'rds-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/rds-chart',
      version: '1.4.1',
      namespace: 'ack-system',
      createNamespace: true,
      skipCrds: true,
      values: { aws: { region: this.region } },
    });

    // testing installation with atomic flag set to true
    // https://gallery.ecr.aws/aws-controllers-k8s/sns-chart
    this.cluster.addHelmChart('test-atomic-installation', {
      chart: 'ec2-chart',
      release: 'ec2-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/ec2-chart',
      version: '1.2.13',
      namespace: 'ack-system',
      createNamespace: true,
      skipCrds: true,
      atomic: true,
      values: { aws: { region: this.region } },
    });

    // https://github.com/orgs/grafana-operator/packages/container/package/helm-charts%2Fgrafana-operator
    this.cluster.addHelmChart('test-non-ecr-oci-chart', {
      chart: 'grafana-operator',
      release: 'grafana-operator-release',
      repository: 'oci://ghcr.io/grafana-operator/helm-charts/grafana-operator',
      version: 'v5.0.0-rc1',
      namespace: 'ack-system',
      createNamespace: true,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();
