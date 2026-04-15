/*
 * Integration test for Bedrock AgentCore Token Vault identity constructs:
 * ApiKeyCredentialProvider and OAuth2CredentialProvider (vendor, included, and custom factories).
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-identity-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-identity-1');

// API key credential provider (Token Vault)
new agentcore.ApiKeyCredentialProvider(stack, 'ApiKeyProvider', {
  apiKeyCredentialProviderName: 'integ-test-api-key-provider',
  apiKey: 'integ-test-api-key-placeholder',
  tags: { integ: 'identity' },
});

// OAuth2 — vendor-specific configuration (GitHub)
agentcore.OAuth2CredentialProvider.usingGithub(stack, 'GithubOAuth', {
  oAuth2CredentialProviderName: 'integ-test-github-oauth',
  clientId: 'integ-test-github-client-id',
  clientSecret: 'integ-test-github-client-secret',
  tags: { integ: 'identity' },
});

// OAuth2 — included config with client credentials only (per AWS Identity docs)
agentcore.OAuth2CredentialProvider.usingYandex(stack, 'YandexOAuth', {
  oAuth2CredentialProviderName: 'integ-test-yandex-oauth',
  clientId: 'integ-test-yandex-client-id',
  clientSecret: 'integ-test-yandex-client-secret',
});

// OAuth2 — custom IdP with discovery URL
agentcore.OAuth2CredentialProvider.usingCustom(stack, 'CustomOAuth', {
  oAuth2CredentialProviderName: 'integ-test-custom-oauth',
  clientId: 'integ-test-custom-client-id',
  clientSecret: 'integ-test-custom-client-secret',
  discoveryUrl: 'https://example.com/.well-known/openid-configuration',
});

// OAuth2 — included config with tenant endpoints (Okta-style sample shape)
agentcore.OAuth2CredentialProvider.usingOkta(stack, 'OktaOAuth', {
  oAuth2CredentialProviderName: 'integ-test-okta-oauth',
  clientId: 'integ-test-okta-client-id',
  clientSecret: 'integ-test-okta-client-secret',
  issuer: 'https://example.okta.com/oauth2/default',
  authorizationEndpoint: 'https://example.okta.com/oauth2/default/v1/authorize',
  tokenEndpoint: 'https://example.okta.com/oauth2/default/v1/token',
});

new integ.IntegTest(app, 'BedrockAgentCoreIdentity', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});

app.synth();
