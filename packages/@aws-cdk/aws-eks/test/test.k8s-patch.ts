import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { KubernetesPatch } from '../lib/k8s-patch';

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
  }
};