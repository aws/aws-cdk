import { App, Stack, Duration } from '@aws-cdk/core';
import * as eks from '../lib';
import { KubernetesObjectValue } from '../lib/k8s-object-value';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

describe('k8s object value', () => {
  test('creates the correct custom resource with explicit values for all properties', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    const attribute = new KubernetesObjectValue(stack, 'MyAttribute', {
      cluster: cluster,
      jsonPath: '.status',
      objectName: 'mydeployment',
      objectType: 'deployment',
      objectNamespace: 'mynamespace',
      timeout: Duration.seconds(5),
    });

    const expectedCustomResourceId = 'MyAttributeF1E9B10D';

    const app = stack.node.root as App;
    const stackTemplate = app.synth().getStackArtifact(stack.stackName).template;
    expect(stackTemplate.Resources[expectedCustomResourceId]).toEqual({
      Type: 'Custom::AWSCDK-EKS-KubernetesObjectValue',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
            'Outputs.awscdkawseksKubectlProviderframeworkonEvent0A650005Arn',
          ],
        },
        ClusterName: { Ref: 'MyCluster8AD82BF8' },
        RoleArn: { 'Fn::GetAtt': ['MyClusterCreationRoleB5FA4FF3', 'Arn'] },
        ObjectType: 'deployment',
        ObjectName: 'mydeployment',
        ObjectNamespace: 'mynamespace',
        JsonPath: '.status',
        TimeoutSeconds: 5,
      },
      DependsOn: ['MyClusterKubectlReadyBarrier7547948A'],
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });

    expect(stack.resolve(attribute.value)).toEqual({ 'Fn::GetAtt': [expectedCustomResourceId, 'Value'] });
  });

  test('creates the correct custom resource with defaults', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    const attribute = new KubernetesObjectValue(stack, 'MyAttribute', {
      cluster: cluster,
      jsonPath: '.status',
      objectName: 'mydeployment',
      objectType: 'deployment',
    });

    const expectedCustomResourceId = 'MyAttributeF1E9B10D';
    const app = stack.node.root as App;
    const stackTemplate = app.synth().getStackArtifact(stack.stackName).template;
    expect(stackTemplate.Resources[expectedCustomResourceId]).toEqual({
      Type: 'Custom::AWSCDK-EKS-KubernetesObjectValue',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
            'Outputs.awscdkawseksKubectlProviderframeworkonEvent0A650005Arn',
          ],
        },
        ClusterName: { Ref: 'MyCluster8AD82BF8' },
        RoleArn: { 'Fn::GetAtt': ['MyClusterCreationRoleB5FA4FF3', 'Arn'] },
        ObjectType: 'deployment',
        ObjectName: 'mydeployment',
        ObjectNamespace: 'default',
        JsonPath: '.status',
        TimeoutSeconds: 300,
      },
      DependsOn: ['MyClusterKubectlReadyBarrier7547948A'],
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });

    expect(stack.resolve(attribute.value)).toEqual({ 'Fn::GetAtt': [expectedCustomResourceId, 'Value'] });
  });
});
