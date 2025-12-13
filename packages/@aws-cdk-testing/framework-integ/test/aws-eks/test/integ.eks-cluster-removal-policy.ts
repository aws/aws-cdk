/// !cdk-integ pragma:disable-update-workflow
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * This test just checks that all resources can be deployed with a removal policy.
 * We use the DESTROY policy here to avoid leaving orphaned resources behind, but if it works for DESTROY, it should work for other values as well.
 */
class EksClusterRemovalPolicyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new eks.Cluster(this, 'Cluster', {
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();

const stack = new EksClusterRemovalPolicyStack(app, 'EksClusterRemovalPolicyStack');

new integ.IntegTest(app, 'eks-cluster-removal-policy-integ', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();
