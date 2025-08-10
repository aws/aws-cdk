/// !cdk-integ pragma:disable-update-workflow
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import * as eks from '../lib';

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    this.cluster = new eks.Cluster(this, 'Cluster', {
      mastersRole,
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
    });

    this.cluster.addHelmChart('IngressController', {
      chart: 'nginx-ingress',
      repository: 'https://helm.nginx.com/stable',
      release: 'ingress-controller',
    });

    const elbAddress = new eks.KubernetesObjectValue(this, 'elbAddress', {
      cluster: this.cluster,
      objectType: 'service',
      objectName: 'ingress-controller-nginx-ingress-controller',
      jsonPath: '.status.loadBalancer.ingress[0].hostname',
    });

    const serviceName = new eks.KubernetesObjectValue(this, 'serviceName', {
      cluster: this.cluster,
      objectType: 'services',
      jsonPath: '.items[0].metadata.name',
    });

    new CfnOutput(this, 'ELBAddress', { value: elbAddress.value });
    new CfnOutput(this, 'ServiceName', { value: serviceName.value });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-k8s-object-value');

new integ.IntegTest(app, 'aws-cdk-eks-k8s-object-value-integ', {
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
