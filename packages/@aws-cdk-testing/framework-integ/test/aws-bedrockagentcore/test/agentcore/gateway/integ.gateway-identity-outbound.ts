/**
 * Integration test: Gateway OpenAPI targets using Token Vault identity constructs
 * ({@link ApiKeyCredentialProvider}, {@link OAuth2CredentialProvider}) via
 * {@link GatewayCredentialProvider.fromApiKeyIdentity} / {@link GatewayCredentialProvider.fromOauthIdentity}.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-gateway-identity-outbound-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-gateway-identity-outbound-1', {
});

const openApiSchema = agentcore.ApiSchema.fromInline(
  JSON.stringify({
    openapi: '3.0.0',
    info: { title: 'GatewayIdentityOutboundInteg', version: '1.0.0' },
    servers: [{ url: 'https://example.com' }],
    paths: {
      '/ping': {
        get: {
          operationId: 'ping',
          responses: { 200: { description: 'ok' } },
        },
      },
    },
  }),
);

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'integ-gateway-identity-outbound',
  description: 'Gateway with OpenAPI targets wired to Token Vault L2 identities',
  // Inbound IAM avoids default Cognito domain (global uniqueness); this integ focuses on outbound Token Vault auth.
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingAwsIam(),
});

const apiKeyProvider = new agentcore.ApiKeyCredentialProvider(stack, 'ApiKeyIdentity', {
  apiKeyCredentialProviderName: 'integ-gw-outbound-apikey',
  apiKey: cdk.SecretValue.unsafePlainText('integ-placeholder-api-key'),
  tags: { integ: 'gateway-identity-outbound' },
});

const oauthProvider = agentcore.OAuth2CredentialProvider.usingGithub(stack, 'OAuthIdentity', {
  oAuth2CredentialProviderName: 'integ-gw-outbound-oauth',
  clientId: 'integ-github-client-id',
  clientSecret: cdk.SecretValue.unsafePlainText('integ-github-client-secret'),
  tags: { integ: 'gateway-identity-outbound' },
});

gateway.addOpenApiTarget('OpenApiApiKeyTarget', {
  gatewayTargetName: 'integ-openapi-api-key',
  description: 'OpenAPI target with API key Token Vault identity',
  apiSchema: openApiSchema,
  credentialProviderConfigurations: [agentcore.GatewayCredentialProvider.fromApiKeyIdentity(apiKeyProvider)],
});

gateway.addOpenApiTarget('OpenApiOauthTarget', {
  gatewayTargetName: 'integ-openapi-oauth',
  description: 'OpenAPI target with OAuth Token Vault identity',
  apiSchema: openApiSchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.fromOauthIdentity(oauthProvider, {
      scopes: ['read:user'],
    }),
  ],
});

new integ.IntegTest(app, 'BedrockAgentCoreGatewayIdentityOutbound', {
  testCases: [stack],
  regions: [
    'us-east-1',
    'us-east-2',
    'us-west-2',
    'ca-central-1',
    'eu-central-1',
    'eu-north-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
  ],
});

