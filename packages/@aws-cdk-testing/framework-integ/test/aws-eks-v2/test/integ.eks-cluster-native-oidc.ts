/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { EKS_USE_NATIVE_OIDC_PROVIDER } from 'aws-cdk-lib/cx-api';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

class EksClusterNativeOidcStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, 'Cluster', {
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },

    });

    /**
     * ServiceAccount and AlbController are added to verify that OIDC provider is created and
     * can be used to create IAM roles for service accounts.
     */

    new eks.ServiceAccount(this, 'ServiceAccount', {
      cluster: cluster,
      name: 'test-service-account',
      namespace: 'default',
    });
    new eks.AlbController(this, 'AlbController', {
      cluster: cluster,
      version: eks.AlbControllerVersion.V2_8_2,
    });
  }
}

const app = new App({
  postCliContext: {
    [EKS_USE_NATIVE_OIDC_PROVIDER]: true,
  },
});

const stack = new EksClusterNativeOidcStack(app, 'aws-cdk-eks-v2-alpha-cluster-native-oidc', {
  env: { region: 'us-east-1' },
});

new integ.IntegTest(app, 'aws-cdk-eks-v2-alpha-native-oidc-integ', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
