import { App, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

const app = new App();
const stack = new Stack(app, 'oidc-provider-integ-test');

new iam.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
});

new iam.OpenIdConnectProvider(stack, 'Clients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test3',
  clientIds: ['foo', 'bar'],
});

new iam.OpenIdConnectProvider(stack, 'Thumbprints', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test4',
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

app.synth();
