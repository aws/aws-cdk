/// !cdk-integ pragma:ignore-assets
import { App, Stack } from '@aws-cdk/core';
import { Cluster, KubectlProvider } from '../lib';

const app = new App();
const stack = new Stack(app, 'kubectl-provider-integ-test');

const cluster = Cluster.fromClusterAttributes(stack, 'Cluster', {
  clusterName: 'cluster',
  kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role'
});

new KubectlProvider(stack, 'NewKubectlProvider', {
  cluster,
});

app.synth();
