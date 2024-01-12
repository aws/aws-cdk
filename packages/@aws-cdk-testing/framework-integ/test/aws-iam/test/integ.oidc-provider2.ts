import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'oidc-provider2-integ-test');

const noClients = new iam.OpenIdConnectProvider2(
  stack,
  'NoClientsNoThumbprint',
  {
    url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
  },
);

const clients = new iam.OpenIdConnectProvider2(stack, 'Clients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test3',
  clientIds: ['foo', 'bar'],
});

const thumbprints = new iam.OpenIdConnectProvider2(stack, 'Thumbprints', {
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

new IntegTest(app, 'iodc-provider2-test', {
  testCases: [stack],
  diffAssets: true,
});
