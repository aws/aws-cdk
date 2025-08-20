import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'oidc-provider-custom-role-integ-test');

const customRole = new iam.Role(stack, 'CustomRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

customRole.addToPrincipalPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  resources: ['*'],
  actions: [
    'iam:CreateOpenIDConnectProvider',
    'iam:DeleteOpenIDConnectProvider',
    'iam:UpdateOpenIDConnectProviderThumbprint',
    'iam:AddClientIDToOpenIDConnectProvider',
    'iam:RemoveClientIDFromOpenIDConnectProvider',
  ],
}));

new iam.OpenIdConnectProvider(stack, 'Provider', {
  url: 'https://oidc.eks.us-east-1.amazonaws.com/id/test5',
  clientIds: ['foo'],
  role: customRole,
});

new IntegTest(app, 'oicd-provider-custom-role-test', {
  testCases: [stack],
});
