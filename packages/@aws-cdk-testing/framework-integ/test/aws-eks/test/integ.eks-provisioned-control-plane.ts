/// !cdk-integ pragma:disable-update-workflow
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * This test verifies that a cluster can be created with the Provisioned Control Plane
 * scaling tier configuration. We use STANDARD tier to avoid additional costs.
 */
class EksProvisionedControlPlaneStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new eks.Cluster(this, 'Cluster', {
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      controlPlaneScalingTier: eks.ControlPlaneScalingTier.STANDARD,
    });
  }
}

const app = new App();

const stack = new EksProvisionedControlPlaneStack(app, 'EksProvisionedControlPlaneStack');

new integ.IntegTest(app, 'eks-provisioned-control-plane-integ', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
