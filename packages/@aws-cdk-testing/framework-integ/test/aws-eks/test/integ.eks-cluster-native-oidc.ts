/// !cdk-integ pragma:disable-update-workflow
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { EKS_USE_NATIVE_OIDC_PROVIDER } from 'aws-cdk-lib/cx-api';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

class EksClusterNativeOidcStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, 'Cluster', {
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),

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

const stack = new EksClusterNativeOidcStack(app, 'aws-cdk-eks-cluster-native-oidc', {
  env: { region: 'us-east-1' },
});

new integ.IntegTest(app, 'aws-cdk-eks-cluster-native-oidc-integ', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
