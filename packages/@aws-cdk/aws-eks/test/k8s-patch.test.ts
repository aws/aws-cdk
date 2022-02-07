import { Template } from '@aws-cdk/assertions';
import { Names, Stack } from '@aws-cdk/core';
import * as eks from '../lib';
import { KubernetesPatch, PatchType } from '../lib/k8s-patch';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

describe('k8s patch', () => {
  test('applies a patch to k8s', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

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
          'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
          'Outputs.awscdkawseksKubectlProviderframeworkonEvent0A650005Arn',
        ],
      },
      ResourceName: 'myResourceName',
      ResourceNamespace: 'default',
      ApplyPatchJson: '{"patch":{"to":"apply"}}',
      RestorePatchJson: '{"restore":{"patch":123}}',
      ClusterName: {
        Ref: 'MyCluster8AD82BF8',
      },
      RoleArn: {
        'Fn::GetAtt': [
          'MyClusterCreationRoleB5FA4FF3',
          'Arn',
        ],
      },
    });

    // also make sure a dependency on the barrier is added to the patch construct.
    expect(patch.node.dependencies.map(d => Names.nodeUniqueId(d.node))).toEqual(['MyClusterKubectlReadyBarrier7547948A']);


  });
  test('defaults to "strategic" patch type if no patchType is specified', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

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
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

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
});
