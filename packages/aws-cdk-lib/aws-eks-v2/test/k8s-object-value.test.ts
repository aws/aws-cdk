import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { Template } from '../../assertions';
import type { App } from '../../core';
import { Stack, Duration, RemovalPolicy } from '../../core';
import * as eks from '../lib';
import { testFixtureCluster } from './util';
import { KubernetesObjectValue } from '../lib/k8s-object-value';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_33;

describe('k8s object value', () => {
  test('creates the correct custom resource with explicit values for all properties', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

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
            'MyClusterKubectlProviderframeworkonEvent7B04B277',
            'Arn',
          ],
        },
        ClusterName: { Ref: 'MyCluster4C1BA579' },
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
    const cluster = new eks.Cluster(stack, 'MyCluster', {
      version: CLUSTER_VERSION,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

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
            'MyClusterKubectlProviderframeworkonEvent7B04B277',
            'Arn',
          ],
        },
        ClusterName: { Ref: 'MyCluster4C1BA579' },
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

  test('applies removal policy to kubernetes object value and kubectl provider', () => {
    const { stack, cluster } = testFixtureCluster();

    new eks.KubernetesObjectValue(stack, 'ObjectValue', {
      cluster,
      objectType: 'service',
      objectName: 'test-service',
      jsonPath: '.spec.type',
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const template = Template.fromStack(stack);
    template.hasResource('Custom::AWSCDK-EKS-KubernetesObjectValue', {
      DeletionPolicy: 'Retain',
    });
  });
});
