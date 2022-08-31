import { App, Stack } from '@aws-cdk/core';
import * as eks from '../lib';

const app = new App();
const stack = new Stack(app, 'oidc-provider-integ-test');

new eks.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: `https://oidc.eks.${Stack.of(stack).region}.amazonaws.com/id/test2`,
});

app.synth();
