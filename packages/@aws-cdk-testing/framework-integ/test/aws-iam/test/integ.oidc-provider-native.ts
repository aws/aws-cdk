import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'oidc-provider-native-integ-stack');

const provider = new iam.OIDCProvider(stack, 'Provider', {
  oidcProviderName: 'MyProvider',
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test1',
  clientIds: ['foo', 'bar'],
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

const minimal = new iam.OIDCProvider(stack, 'Minimal', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
  thumbprints: ['aa00aa1122aa00aa1122aa00aa1122aa00aa1122'],
});

new CfnOutput(stack, 'Arn', {
  value: `${provider.oidcProviderArn}`,
});

new CfnOutput(stack, 'Issuer', {
  value: `${provider.oidcProviderIssuer}`,
});

new CfnOutput(stack, 'MinimalArn', {
  value: `${minimal.oidcProviderArn}`,
});

new CfnOutput(stack, 'MinimalIssuer', {
  value: `${minimal.oidcProviderIssuer}`,
});

new IntegTest(app, 'oidc-provider-native-integ-test', {
  testCases: [stack],
  diffAssets: true,
});
