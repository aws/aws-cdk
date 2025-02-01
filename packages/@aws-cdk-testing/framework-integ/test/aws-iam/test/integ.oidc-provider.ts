import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    [cxapi.IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
  },
});
const stack = new Stack(app, 'oidc-provider-integ-test');

const noClients = new iam.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
});

const clients = new iam.OpenIdConnectProvider(stack, 'Clients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test3',
  clientIds: ['foo', 'bar'],
});

const thumbprints = new iam.OpenIdConnectProvider(stack, 'Thumbprints', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test4',
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

new CfnOutput(stack, 'NoClientsThumbprints', {
  value: `${noClients.openIdConnectProviderthumbprints}`,
});

new CfnOutput(stack, 'ClientsThumbprints', {
  value: `${clients.openIdConnectProviderthumbprints}`,
});

new CfnOutput(stack, 'ThumbprintsThumbprints', {
  value: `${thumbprints.openIdConnectProviderthumbprints}`,
});

new IntegTest(app, 'iodc-provider-test', {
  testCases: [stack],
  diffAssets: true,
});
