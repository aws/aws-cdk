import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { KubernetesPatch, PatchType } from '../lib/k8s-patch';

export = {
  'applies a patch to k8s'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 }},
      resourceName: 'myResourceName',
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      ServiceToken: {
        "Fn::GetAtt": [
          "awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B",
          "Outputs.awscdkawseksKubectlProviderframeworkonEvent0A650005Arn"
        ]
      },
      ResourceName: "myResourceName",
      ResourceNamespace: "default",
      ApplyPatchJson: "{\"patch\":{\"to\":\"apply\"}}",
      RestorePatchJson: "{\"restore\":{\"patch\":123}}",
      ClusterName: {
        Ref: "MyCluster8AD82BF8"
      },
      RoleArn: {
        "Fn::GetAtt": [
          "MyClusterCreationRoleB5FA4FF3",
          "Arn"
        ]
      }
    }));
    test.done();
  },
  'defaults to "strategic" patch type if no patchType is specified'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    new KubernetesPatch(stack, 'MyPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 }},
      resourceName: 'myResourceName',
    });
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      PatchType: "strategic"
    }));
    test.done();
  },
  'uses specified to patch type if specified'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    new KubernetesPatch(stack, 'jsonPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 }},
      resourceName: 'jsonPatchResource',
      patchType: PatchType.JSON
    });
    new KubernetesPatch(stack, 'mergePatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 }},
      resourceName: 'mergePatchResource',
      patchType: PatchType.MERGE
    });
    new KubernetesPatch(stack, 'strategicPatch', {
      cluster,
      applyPatch: { patch: { to: 'apply' } },
      restorePatch: { restore: { patch: 123 }},
      resourceName: 'strategicPatchResource',
      patchType: PatchType.STRATEGIC
    });

    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: "jsonPatchResource",
      PatchType: "json"
    }));
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: "mergePatchResource",
      PatchType: "merge"
    }));
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: "strategicPatchResource",
      PatchType: "strategic"
    }));
    test.done();
  }
};