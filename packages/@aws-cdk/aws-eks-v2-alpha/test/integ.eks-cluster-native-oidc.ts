/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { EKS_USE_NATIVE_OIDC_PROVIDER } from 'aws-cdk-lib/cx-api';
import * as eks from '../lib';

class EksClusterNativeOidcStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, 'Cluster', {
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },

    });

    // Access openIdConnectProvider to trigger OIDC creation
    cluster.openIdConnectProvider;
  }
}

const app = new App({
  postCliContext: {
    [EKS_USE_NATIVE_OIDC_PROVIDER]: true,
  },
});

const stack = new EksClusterNativeOidcStack(app, 'aws-cdk-eks-cluster-native-oidc', {
  env: { region: 'us-east-1' },
});

new integ.IntegTest(app, 'aws-cdk-eks-cluster-native-oidc-integ', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
