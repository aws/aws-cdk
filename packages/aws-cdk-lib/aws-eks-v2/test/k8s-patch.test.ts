import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixtureCluster } from './util';
import { Template } from '../../assertions';
import * as cdk from '../../core';
import { Names, Stack } from '../../core';
import * as eks from '../lib';
import { KubernetesPatch, PatchType } from '../lib/k8s-patch';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_31;

describe('k8s patch', () => {
  test('applies a patch to k8s', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
      },
    });

    // WHEN
    const patch = new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 } },
      resourceName: 'myResourceName',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ServiceToken: {
        'Fn::GetAtt': [
          'MyClusterKubectlProviderframeworkonEvent7B04B277',
          'Arn',
        ],
      },
      ResourceName: 'myResourceName',
      ResourceNamespace: 'default',
      ApplyPatchJson: '{"patch":{"to":"apply"}}',
      RestorePatchJson: '{"restore":{"patch":123}}',
      ClusterName: {
        Ref: 'MyCluster4C1BA579',
      },
    });

    // also make sure a dependency on the barrier is added to the patch construct.
    expect(patch.node.dependencies.map(d => Names.nodeUniqueId(d.node))).toEqual(['MyClusterKubectlReadyBarrier7547948A']);
  });

  test('defaults to "strategic" patch type if no patchType is specified', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
      },
    });

    // WHEN
    new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 } },
      resourceName: 'myResourceName',
    });
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      PatchType: 'strategic',
    });
  });

  test('uses specified to patch type if specified', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
      },
    });

    // WHEN
    new KubernetesPatch(stack, 'jsonPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 } },
      resourceName: 'jsonPatchResource',
      patchType: PatchType.JSON,
    });
    new KubernetesPatch(stack, 'mergePatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 } },
      resourceName: 'mergePatchResource',
      patchType: PatchType.MERGE,
    });
    new KubernetesPatch(stack, 'strategicPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 } },
      resourceName: 'strategicPatchResource',
      patchType: PatchType.STRATEGIC,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'jsonPatchResource',
      PatchType: 'json',
    });
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'mergePatchResource',
      PatchType: 'merge',
    });
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'strategicPatchResource',
      PatchType: 'strategic',
    });
  });

  test('applies removal policy to kubernetes patch and kubectl provider', () => {
    const { stack, cluster } = testFixtureCluster();

    new KubernetesPatch(stack, 'Patch', {
      cluster,
      resourceName: 'deployment/test',
      applyPatch: { spec: { replicas: 3 } },
      restorePatch: { spec: { replicas: 1 } },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const template = Template.fromStack(stack);
    template.hasResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      DeletionPolicy: 'Retain',
    });
  });
});
