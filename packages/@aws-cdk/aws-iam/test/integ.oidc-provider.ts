/// !cdk-integ pragma:ignore-assets
import { App, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

const app = new App();
const stack = new Stack(app, 'oidc-provider-integ-test');

new iam.OpenIdConnectProvider(stack, 'Clients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test3',
  clientIds: ['foo', 'bar'],
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

new iam.OpenIdConnectProvider(stack, 'NoClients', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test4',
  thumbprints: [
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1122',
    'aa00aa1122aa00aa1122aa00aa1122aa00aa1111',
  ],
});

app.synth();
