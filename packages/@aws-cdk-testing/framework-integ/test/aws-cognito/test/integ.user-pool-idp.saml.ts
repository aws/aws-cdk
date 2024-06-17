import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPoolClientIdentityProvider, UserPool, UserPoolIdentityProviderSaml, UserPoolIdentityProviderSamlMetadata, SigningAlgorithm } from 'aws-cdk-lib/aws-cognito';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // For SP initiated SAML
    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new UserPoolIdentityProviderSaml(this, 'samlProvider', {
      userPool: userpool,
      name: 'provider',
      metadata: UserPoolIdentityProviderSamlMetadata.url('https://fujifish.github.io/samling/public/metadata.xml'),
      encryptedResponses: true,
      requestSigningAlgorithm: SigningAlgorithm.RSA_SHA256,
    });

    const client = userpool.addClient('client');

    const domain = userpool.addDomain('domain', {
      cognitoDomain: {
        domainPrefix: 'cdk-test-pool',
      },
    });

    // For IdP initiated SAML
    const userpoolForIdpInitiatedSaml = new UserPool(this, 'poolForIdpInitiatedSaml', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const idpInitiatedProvider = new UserPoolIdentityProviderSaml(this, 'samlProviderIdpInitiated', {
      userPool: userpoolForIdpInitiatedSaml,
      name: 'IdPInitiatedProvider',
      metadata: UserPoolIdentityProviderSamlMetadata.url('https://fujifish.github.io/samling/public/metadata.xml'),
      idpInitiated: true,
    });
    userpoolForIdpInitiatedSaml.addClient('idpInitiatedClient', {
      supportedIdentityProviders: [UserPoolClientIdentityProvider.custom(idpInitiatedProvider.providerName)],
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
