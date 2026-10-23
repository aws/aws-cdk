import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixtureCluster } from './util';
import { Template } from '../../assertions';
import * as cdk from '../../core';
import { CfnParameter, Names, Stack } from '../../core';
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

  test.each([false, true])('serializes JSON patch arrays (empty: %s)', empty => {
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: { kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer') },
    });

    new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      resourceName: 'deployment/test',
      patchType: PatchType.JSON,
      applyPatch: empty ? [] : [
        { op: 'test', path: '/spec/replicas', value: 3 },
        { op: 'replace', path: '/spec/replicas', value: 5 },
        { op: 'add', path: '/metadata/labels/example.com~1enabled', value: 'true' },
      ],
      restorePatch: empty ? [] : [
        { op: 'replace', path: '/spec/replicas', value: 3 },
        { op: 'remove', path: '/metadata/labels/example.com~1enabled' },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      PatchType: 'json',
      ApplyPatchJson: empty ? '[]' : '[{"op":"test","path":"/spec/replicas","value":3},{"op":"replace","path":"/spec/replicas","value":5},{"op":"add","path":"/metadata/labels/example.com~1enabled","value":"true"}]',
      RestorePatchJson: empty ? '[]' : '[{"op":"replace","path":"/spec/replicas","value":3},{"op":"remove","path":"/metadata/labels/example.com~1enabled"}]',
    });
  });

  test('preserves tokens in JSON patch arrays', () => {
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: { kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer') },
    });
    const label = new CfnParameter(stack, 'Label');

    new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      resourceName: 'deployment/test',
      patchType: PatchType.JSON,
      applyPatch: [{ op: 'add', path: '/metadata/labels/app', value: label.valueAsString }],
      restorePatch: [{ op: 'test', path: '/metadata/labels/app', value: label.valueAsString }],
    });

    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ApplyPatchJson: {
        'Fn::Join': ['', ['[{"op":"add","path":"/metadata/labels/app","value":"', { Ref: 'Label' }, '"}]']],
      },
      RestorePatchJson: {
        'Fn::Join': ['', ['[{"op":"test","path":"/metadata/labels/app","value":"', { Ref: 'Label' }, '"}]']],
      },
    });
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
      applyPatch: [{ op: 'replace', path: '/spec/replicas', value: 5 }],
      restorePatch: [{ op: 'replace', path: '/spec/replicas', value: 3 }],
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
      ApplyPatchJson: '[{"op":"replace","path":"/spec/replicas","value":5}]',
      RestorePatchJson: '[{"op":"replace","path":"/spec/replicas","value":3}]',
    });
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'mergePatchResource',
      PatchType: 'merge',
      ApplyPatchJson: '{"patch":{"to":"apply"}}',
      RestorePatchJson: '{"restore":{"patch":123}}',
    });
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'strategicPatchResource',
      PatchType: 'strategic',
      ApplyPatchJson: '{"patch":{"to":"apply"}}',
      RestorePatchJson: '{"restore":{"patch":123}}',
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
