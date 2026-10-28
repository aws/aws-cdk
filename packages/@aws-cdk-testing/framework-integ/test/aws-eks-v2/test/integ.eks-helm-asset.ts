/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { EKS_USE_NATIVE_OIDC_PROVIDER } from 'aws-cdk-lib/cx-api';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as eks from 'aws-cdk-lib/aws-eks-v2';
import { getClusterVersionConfig, getLatestVersions } from './integ-tests-kubernetes-version';

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string, version?: eks.KubernetesVersion) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      ...getClusterVersionConfig(this, version),
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
    const ociChart = this.cluster.addHelmChart('test-oci-chart', {
      chart: 's3-chart',
      release: 's3-chart',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
      version: 'v0.1.0',
      namespace: 'ack-system',
      createNamespace: true,
      values: { aws: { region: this.region } },
    });

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
    const rdsChart = this.cluster.addHelmChart('test-skip-crd-installation', {
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
    // this service account has to be created in `ack-system`
    // we need to ensure that the namespace is created before the service account
    const sa = this.cluster.addServiceAccount('ec2-controller-sa', {
      namespace: 'ack-system',
    });

    // rdsChart should create the namespace `ack-system` if not available
    // adding the dependency ensures that the namespace is created before the service account
    sa.node.addDependency(rdsChart);

    sa.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'));

    this.cluster.addHelmChart('test-atomic-installation', {
      chart: 'ec2-chart',
      release: 'ec2-chart-release',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/ec2-chart',
      version: '1.2.13',
      namespace: 'ack-system',
      createNamespace: true,
      skipCrds: true,
      atomic: true,
      values: {
        aws: { region: this.region },
        serviceAccount: {
          name: sa.serviceAccountName,
          create: false,
          annotations: {
            // implicit dependency on the service account
            'eks.amazonaws.com/role-arn': sa.role.roleArn,
          },
        },
      },
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

    // non-OCI chart from a standard HTTPS Helm repository
    // https://kubernetes-sigs.github.io/headlamp/
    this.cluster.addHelmChart('test-non-oci-chart', {
      chart: 'headlamp',
      release: 'headlamp',
      repository: 'https://kubernetes-sigs.github.io/headlamp/',
      version: '0.39.0',
    });

    // Deploy-time verification that a Helm chart was actually installed on the cluster.
    // Helm v3 records every successful release as a Secret named
    // `sh.helm.release.v1.<release>.v<revision>` carrying a `status` label. Reading that
    // label back from the live cluster asserts the end-to-end OCI pull + install path for
    // the `s3-chart` release above succeeded (not merely that the stack synthesized).
    const ociReleaseStatus = new eks.KubernetesObjectValue(this, 'OciHelmReleaseStatus', {
      cluster: this.cluster,
      objectType: 'secret',
      objectName: 'sh.helm.release.v1.s3-chart.v1',
      objectNamespace: 'ack-system',
      jsonPath: '.metadata.labels.status',
    });
    ociReleaseStatus.node.addDependency(ociChart);

    new CfnOutput(this, 'HelmReleaseStatus', { value: ociReleaseStatus.value });
  }
}

const app = new App({
  postCliContext: {
    [EKS_USE_NATIVE_OIDC_PROVIDER]: true,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const [previousVersion, latestVersion] = getLatestVersions(2);

const stackLatest = new EksClusterStack(app, 'aws-cdk-eks-helm-test', eks.KubernetesVersion.of(latestVersion));
const stackPrevious = new EksClusterStack(app, 'aws-cdk-eks-helm-test-prev', eks.KubernetesVersion.of(previousVersion));
const integTest = new integ.IntegTest(app, 'aws-cdk-eks-helm', {
  testCases: [stackLatest, stackPrevious],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

// Deploy-time assertion: confirm the OCI Helm release reached the `deployed` state on the
// live cluster, via the `HelmReleaseStatus` output of the latest-version stack.
integTest.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'aws-cdk-eks-helm-test',
}).expect(integ.ExpectedResult.objectLike({
  Stacks: integ.Match.arrayWith([
    integ.Match.objectLike({
      Outputs: integ.Match.arrayWith([
        integ.Match.objectLike({
          OutputKey: 'HelmReleaseStatus',
          OutputValue: 'deployed',
        }),
      ]),
    }),
  ]),
}));
