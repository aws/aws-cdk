import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';
import * as eks from '../lib';

const app = new App({
  postCliContext: {
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
  },
});
const stack = new Stack(app, 'aws-eks-oidc-provider-test');

new eks.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: `https://oidc.eks.${Stack.of(stack).region}.amazonaws.com/id/test2`,
});

new eks.OpenIdConnectProviderNative(stack, 'OpenIdConnectProviderNative', {
  url: `https://oidc.eks.${Stack.of(stack).region}.amazonaws.com/id/test3`,
});

new integ.IntegTest(app, 'aws-cdk-eks-oidc-provider', {
  testCases: [stack],
});

app.synth();
