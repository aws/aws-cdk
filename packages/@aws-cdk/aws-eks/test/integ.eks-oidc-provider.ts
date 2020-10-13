/// !cdk-integ pragma:ignore-assets
import { App, Stack } from '@aws-cdk/core';
import * as eks from '../lib';

const app = new App();
const stack = new Stack(app, 'oidc-provider-integ-test');

new eks.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test2',
});

app.synth();
