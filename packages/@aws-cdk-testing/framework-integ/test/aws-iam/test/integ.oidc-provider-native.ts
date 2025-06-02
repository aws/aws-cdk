import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'oidc-provider-native-integ-stack');

const provider = new iam.OidcProviderNative(stack, 'Provider', {
  oidcProviderName: 'MyProvider',
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test1',
  clientIds: ['foo', 'bar'],
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

new CfnOutput(stack, 'Arn', {
  value: `${provider.oidcProviderArn}`,
});

new CfnOutput(stack, 'Issuer', {
  value: `${provider.oidcProviderIssuer}`,
});

// Minimal OIDC Provider without client IDs and thumbprints
const minimal = new iam.OidcProviderNative(stack, 'Minimal', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
  thumbprints: ['aa00aa1122aa00aa1122aa00aa1122aa00aa1122'],
});

new CfnOutput(stack, 'MinimalArn', {
  value: `${minimal.oidcProviderArn}`,
});

new CfnOutput(stack, 'MinimalIssuer', {
  value: `${minimal.oidcProviderIssuer}`,
});

// Basic Integration Test without assertions, verifying that the stack deploys successfully
new IntegTest(app, 'oidc-provider-native-integ-test', {
  testCases: [stack],
  diffAssets: true,
});

const integ = new IntegTest(app, 'oidc-provider-native-integ-test-with-assertions', {
  testCases: [stack],
  diffAssets: true,
});

// Validate the full provider exists and has correct configuration
const getProvider = integ.assertions.awsApiCall('IAM', 'getOpenIDConnectProvider', {
  OpenIDConnectProviderArn: provider.oidcProviderArn,
});

// Assert the provider URL matches what we configured
getProvider.expect(ExpectedResult.objectLike({
  Url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test1',
}));

// Verify the client IDs are correctly configured
getProvider.expect(ExpectedResult.objectLike({
  ClientIDList: ['foo', 'bar'],
}));

// Validate the thumbprints are correctly configured
getProvider.expect(ExpectedResult.objectLike({
  ThumbprintList: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
}));

// Validate the minimal provider exists and has correct configuration
const getMinimalProvider = integ.assertions.awsApiCall('IAM', 'getOpenIDConnectProvider', {
  OpenIDConnectProviderArn: minimal.oidcProviderArn,
});

// Assert the minimal provider URL matches what we configured
getMinimalProvider.expect(ExpectedResult.objectLike({
  Url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
}));

// Verify the minimal provider has no client IDs
getMinimalProvider.expect(ExpectedResult.objectLike({
  ClientIDList: [],
}));

// Validate the thumbprints for minimal provider
getMinimalProvider.expect(ExpectedResult.objectLike({
  ThumbprintList: ['aa00aa1122aa00aa1122aa00aa1122aa00aa1122'],
}));

app.synth();
