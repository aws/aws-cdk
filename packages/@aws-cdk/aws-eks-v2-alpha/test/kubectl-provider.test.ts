import { testFixtureCluster } from './util';
import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib/core';
import * as eks from '../lib';

describe('KubectlProvider', () => {
  test('creates AWS::Lambda::Function onEvent handler with correct AWS_STS_REGIONAL_ENDPOINTS environment variable', () => {
    const { stack } = testFixtureCluster();
    // find the KubectlProvider
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
