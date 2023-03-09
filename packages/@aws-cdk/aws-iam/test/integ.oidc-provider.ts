import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as iam from '../lib';

const app = new App();
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
});

app.synth();
