import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { UserPool, UserPoolIdentityProviderSaml } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new UserPoolIdentityProviderSaml(this, 'cdk', {
      userPool: userpool,
      name: 'cdk',
      metadataUrl: 'https://fujifish.github.io/samling/public/metadata.xml',
    });

    const client = userpool.addClient('client');

    const domain = userpool.addDomain('domain', {
      cognitoDomain: {
        domainPrefix: 'cdk-test-pool',
      },
    });

    new CfnOutput(this, 'SignInLink', {
      value: domain.signInUrl(client, {
        redirectUri: 'https://example.com',
      }),
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-user-pool-identity-provider-saml-stack');

new IntegTest(app, 'integ-user-pool-identity-provider-saml-test', {
  testCases: [testCase],
});
