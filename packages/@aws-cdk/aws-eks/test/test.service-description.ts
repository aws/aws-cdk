import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

export = {
  'creates the correct custom resources'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    const service = new eks.ServiceDescription(stack, 'MyService', {
      cluster: cluster,
      serviceName: 'myservice',
    });

    const expectedCustomResourceId = 'MyServiceLoadBalancerAttributeAF0E2979';

    // this makes sure the load balancer attribute is created correctly
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
        ResourceType: 'service',
        ResourceName: 'myservice',
        JsonPath: '.status.loadBalancer.ingress[0].hostname',
        TimeoutSeconds: 300,
      },
      DependsOn: [ 'MyClusterKubectlReadyBarrier7547948A' ],
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });

    // this makes sure the getter refers to the correct custom resource
    test.deepEqual(stack.resolve(service.loadBalancerAddress), { 'Fn::GetAtt': [ expectedCustomResourceId, 'Value' ] });
    test.done();
  },

};
