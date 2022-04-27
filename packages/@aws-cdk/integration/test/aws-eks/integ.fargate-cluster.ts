/// !cdk-integ pragma:ignore-assets pragma:disable-update-workflow
import * as eks from '@aws-cdk/aws-eks';
import { App, Stack } from '@aws-cdk/core';

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

new EksFargateClusterStack(app, 'aws-cdk-eks-fargate-cluster-test');

app.synth();
