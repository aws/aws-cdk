import { expect } from '@aws-cdk/assert';
import { Stack, Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { KubernetesGet } from '../lib/k8s-get';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

export = {
  'creates the correct custom resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    const attribute = new KubernetesGet(stack, 'MyAttribute', {
      cluster: cluster,
      jsonPath: '.status',
      resourceName: 'mydeployment',
      resourceType: 'deployment',
      timeout: Duration.seconds(5),
    });

    const expectedCustomResourceId = 'MyAttributeF1E9B10D';
    test.deepEqual(expect(stack).value.Resources[expectedCustomResourceId], {
      Type: 'Custom::AWSCDK-EKS-KubernetesGet',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
            'Outputs.awscdkawseksKubectlProviderframeworkonEvent0A650005Arn',
          ],
        },
        ClusterName: { Ref: 'MyCluster8AD82BF8' },
        RoleArn: { 'Fn::GetAtt': [ 'MyClusterCreationRoleB5FA4FF3', 'Arn' ] },
        ResourceType: 'deployment',
        ResourceName: 'mydeployment',
        JsonPath: '.status',
        TimeoutSeconds: 5,
      },
      DependsOn: [ 'MyClusterKubectlReadyBarrier7547948A' ],
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });

    test.deepEqual(stack.resolve(attribute.value), { 'Fn::GetAtt': [ expectedCustomResourceId, 'Value' ] });
    test.done();
  },

};
