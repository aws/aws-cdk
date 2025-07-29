/// !cdk-integ pragma:disable-update-workflow
import * as path from 'path';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import {
  App, CfnOutput, Stack, StackProps, Duration,
  custom_resources as cr,
  aws_iam as iam,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import * as hello from './hello-k8s';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus-27';
import * as constructs from 'constructs';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;
  private importedCluster: eks.ICluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });

    // create a eks admin role that allows restricted principles to assume
    const mastersRole = new iam.Role(this, 'EksAdminRole', {
      roleName: `eksAdminrole-${Stack.of(this).stackName}`,
      /**
       * Specify your principal arn below so you are allowed to assume this role and run kubectl to verify cluster status.
       * For this integ testing we simply use AccountRootPrincipal, which should be avoided in production.
       */
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      defaultCapacity: 2,
      ...getClusterVersionConfig(this),
      mastersRole,
    });

    // import this cluster
    const kubectlProvider = this.cluster.stack.node.tryFindChild('@aws-cdk--aws-eks.KubectlProvider') as eks.KubectlProvider;
    const crProvider = kubectlProvider.node.tryFindChild('Provider') as cr.Provider;

    // import the kubectl provider
    const importedKubectlProvider = eks.KubectlProvider.fromKubectlProviderAttributes(this, 'KubectlProvider', {
      functionArn: crProvider.serviceToken,
      kubectlRoleArn: this.cluster.kubectlRole!.roleArn,
      handlerRole: kubectlProvider.handlerRole,
    });

    this.importedCluster = eks.Cluster.fromClusterAttributes(this, 'ImportedCluster', {
      clusterName: this.cluster.clusterName,
      openIdConnectProvider: this.cluster.openIdConnectProvider,
      vpc: this.vpc,
      kubectlLayer: this.cluster.kubectlLayer,
      kubectlRoleArn: this.cluster.kubectlRole?.roleArn,
      kubectlProvider: importedKubectlProvider,
    });

    this.assertSimpleManifest();

    this.assertManifestWithoutValidation();

    this.assertSimpleHelmChart();

    this.assertHelmChartAsset();

    this.assertSimpleCdk8sChart();

    this.assertCreateNamespace();

    this.assertServiceAccount();

    this.assertExtendedServiceAccount();

    // EKS service role
    new CfnOutput(this, 'ClusterRole', { value: this.cluster.role.roleArn });
    // EKS cluster creation role
    new CfnOutput(this, 'ClusterAdminRole', { value: this.cluster.adminRole.roleArn });
    // Kubectl Role(this should be the cluster creation role)
    new CfnOutput(this, 'KubectlRole', { value: this.cluster.kubectlRole!.roleArn });
    // Kubectl Lambda Role
    new CfnOutput(this, 'KubectlLambdaRole', { value: this.cluster.kubectlLambdaRole!.roleArn });
    // EKS masters role(this role will be added in system:masters)
    new CfnOutput(this, 'EksMastersRoleOutput', { value: mastersRole.roleArn });
  }

  private assertServiceAccount() {
    // add a service account connected to a IAM role
    this.importedCluster.addServiceAccount('MyServiceAccount', {
      name: 'sa',
    });
  }

  private assertExtendedServiceAccount() {
    // add a service account connected to a IAM role
    this.importedCluster.addServiceAccount('MyExtendedServiceAccount', {
      name: 'ext-sa',
      annotations: {
        'eks.amazonaws.com/sts-regional-endpoints': 'false',
      },
      labels: {
        'some-label': 'with-some-value',
      },
    });
  }

  private assertCreateNamespace() {
    // deploy an nginx ingress in a namespace
    const nginxNamespace = this.importedCluster.addManifest('nginx-namespace', {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'nginx',
      },
    });

    const nginxIngress = this.importedCluster.addHelmChart('nginx-ingress', {
      chart: 'nginx-ingress',
      repository: 'https://helm.nginx.com/stable',
      namespace: 'nginx',
      wait: true,
      release: 'nginx-ingress',
      // https://github.com/nginxinc/helm-charts/tree/master/stable
      version: '0.17.1',
      values: {
        controller: {
          service: {
            create: false,
          },
        },
      },
      createNamespace: false,
      timeout: Duration.minutes(15),
    });

    // make sure namespace is deployed before the chart
    nginxIngress.node.addDependency(nginxNamespace);
  }

  private assertSimpleCdk8sChart() {
    class Chart extends cdk8s.Chart {
      constructor(scope: constructs.Construct, ns: string, cluster: eks.ICluster) {
        super(scope, ns);

        new kplus.ConfigMap(this, 'config-map', {
          data: {
            clusterName: cluster.clusterName,
          },
        });
      }
    }
    const app = new cdk8s.App();
    const chart = new Chart(app, 'Chart', this.importedCluster);

    this.importedCluster.addCdk8sChart('cdk8s-chart', chart);
  }

  private assertSimpleHelmChart() {
    // deploy the Kubernetes dashboard through a helm chart
    this.importedCluster.addHelmChart('dashboard', {
      chart: 'kubernetes-dashboard',
      // https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard
      version: '6.0.8',
      repository: 'https://kubernetes.github.io/dashboard/',
    });
  }

  private assertHelmChartAsset() {
    // get helm chart from Asset
    const chartAsset = new Asset(this, 'ChartAsset', {
      path: path.join(__dirname, 'test-chart'),
    });
    this.importedCluster.addHelmChart('test-chart', {
      chartAsset: chartAsset,
    });
  }

  private assertSimpleManifest() {
    // apply a kubernetes manifest
    this.importedCluster.addManifest('HelloApp', ...hello.resources);
  }

  private assertManifestWithoutValidation() {
    // apply a kubernetes manifest
    new eks.KubernetesManifest(this, 'HelloAppWithoutValidation', {
      cluster: this.importedCluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'ConfigMap',
        data: { hello: 'world' },
        metadata: { name: 'config-map' },
        unknown: { key: 'value' },
      }],
      skipValidation: true,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-import-cluster-test');

new integ.IntegTest(app, 'aws-cdk-eks-import-cluster', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

app.synth();
