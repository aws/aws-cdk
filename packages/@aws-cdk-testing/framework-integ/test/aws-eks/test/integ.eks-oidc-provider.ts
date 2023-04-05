import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';

const app = new App();
const stack = new Stack(app, 'aws-eks-oidc-provider-test');

new eks.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: `https://oidc.eks.${Stack.of(stack).region}.amazonaws.com/id/test2`,
});

new integ.IntegTest(app, 'aws-cdk-eks-oidc-provider', {
  testCases: [stack],
});

app.synth();
