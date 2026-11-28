import { App, Stack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    [cxapi.IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: undefined,
  },
});
const stack = new Stack(app, 'oidc-provider-flag-unset-integ-test');

const noClients = new iam.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2flagunset',
});

const clients = new iam.OpenIdConnectProvider(stack, 'Clients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test3flagunset',
  clientIds: ['foo', 'bar'],
});

const thumbprints = new iam.OpenIdConnectProvider(stack, 'Thumbprints', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test4flagunset',
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

const integ = new IntegTest(app, 'oidc-provider-flag-unset-test', {
  testCases: [stack],
  diffAssets: true,
});

integ.assertions.awsApiCall('IAM', 'getOpenIDConnectProvider', {
  OpenIDConnectProviderArn: noClients.openIdConnectProviderArn,
}).expect(ExpectedResult.objectLike({
  ThumbprintList: Match.arrayWith([Match.stringLikeRegexp('^[0-9a-fA-F]{40}$')]),
}));

integ.assertions.awsApiCall('IAM', 'getOpenIDConnectProvider', {
  OpenIDConnectProviderArn: clients.openIdConnectProviderArn,
}).expect(ExpectedResult.objectLike({
  ThumbprintList: Match.arrayWith([Match.stringLikeRegexp('^[0-9a-fA-F]{40}$')]),
}));

integ.assertions.awsApiCall('IAM', 'getOpenIDConnectProvider', {
  OpenIDConnectProviderArn: thumbprints.openIdConnectProviderArn,
}).expect(ExpectedResult.objectLike({
  ThumbprintList: Match.arrayWith([
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
  ]),
}));
