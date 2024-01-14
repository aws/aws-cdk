import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'OidcProviderIntegStack');

const provider = new iam.OpenIdConnectProvider2(stack, 'Provider', {
  oidcProviderName: 'MyProvider',
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test1',
  clientIds: ['foo', 'bar'],
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

const minimal = new iam.OpenIdConnectProvider2(stack, 'Minimal', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
  thumbprints: ['aa00aa1122aa00aa1122aa00aa1122aa00aa1122'],
});

new CfnOutput(stack, 'Arn', {
  value: `${provider.openIdConnectProviderArn}`,
});

new CfnOutput(stack, 'Issuer', {
  value: `${provider.openIdConnectProviderIssuer}`,
});

new CfnOutput(stack, 'MinimalArn', {
  value: `${minimal.openIdConnectProviderArn}`,
});

new CfnOutput(stack, 'MinimalIssuer', {
  value: `${minimal.openIdConnectProviderIssuer}`,
});

new IntegTest(app, 'OidcProviderInteg', {
  testCases: [stack],
  diffAssets: true,
});
