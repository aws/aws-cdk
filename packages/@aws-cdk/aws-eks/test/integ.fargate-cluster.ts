/// !cdk-integ pragma:disable-update-workflow
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as eks from '../lib';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_21;


class EksFargateClusterStack extends Stack {

  constructor(scope: App, id: string) {
    super(scope, id);

    new eks.FargateCluster(this, 'FargateCluster', {
      version: CLUSTER_VERSION,
      prune: false,
    });
  }
}

const app = new App();

const stack = new EksFargateClusterStack(app, 'aws-cdk-eks-fargate-cluster-test');
new integ.IntegTest(app, 'aws-cdk-eks-fargate-cluster', {
  testCases: [stack],
});

app.synth();
