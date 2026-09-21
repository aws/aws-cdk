import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { Template } from '../../assertions';
import { Stack } from '../../core';
import * as eks from '../lib';
import { testFixture } from './util';

describe('KubectlProvider', () => {
  test('creates AWS::Lambda::Function onEvent handler with correct AWS_STS_REGIONAL_ENDPOINTS environment variable', () => {
    // find the KubectlProvider
    const { stack } = testFixture();

    new eks.Cluster(stack, 'Cluster1', {
      version: eks.KubernetesVersion.V1_25,
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    });

    const provider = stack.node.tryFindChild('@aws-cdk--aws-eks.KubectlProvider') as eks.KubectlProvider;
    const providerStackTemplate = Template.fromStack(Stack.of(provider));
    providerStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Description: 'onEvent handler for EKS kubectl resource provider',
      Environment: {
        Variables: {
          AWS_STS_REGIONAL_ENDPOINTS: 'regional',
        },
      },
    });
  });
});
