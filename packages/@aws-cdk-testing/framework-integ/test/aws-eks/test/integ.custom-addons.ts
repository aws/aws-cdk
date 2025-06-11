import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'eks-custom-addons');

const vpc = new ec2.Vpc(stack, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });

const cluster = new eks.Cluster(stack, 'Cluster', {
  vpc,
  ...getClusterVersionConfig(stack, eks.KubernetesVersion.V1_32),
  defaultCapacity: 0,
  bootstrapSelfManagedAddons: false,
});

const calico = new eks.HelmChart(stack, 'Calico', {
  cluster,
  release: 'calico',
  chart: 'tigera-operator',
  repository: 'https://docs.tigera.io/calico/charts',
  namespace: 'tigera-operator',
  version: 'v3.30.1',
  createNamespace: true,
});

const cnipatch = new eks.KubernetesPatch(stack, 'cnipatch', {
  cluster,
  resourceName: 'installation/default',
  applyPatch: [{ op: 'replace', path: '/spec/cni', value: { type: 'Calico' } }],
  restorePatch: [{ op: 'remove', path: '/spec/cni' }],
  patchType: eks.PatchType.JSON,
});

cnipatch.node.addDependency(calico);

new IntegTest(app, 'aws-cdk-eks-custom-addons', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});
