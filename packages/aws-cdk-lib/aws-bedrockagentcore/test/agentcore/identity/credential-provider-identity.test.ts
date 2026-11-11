import { Match, Template } from '../../../../assertions';
import * as iam from '../../../../aws-iam';
import * as cdk from '../../../../core';
import type { OAuth2AuthorizationServerMetadata } from '../../../lib';
import {
  ApiKeyCredentialLocation,
  ApiKeyCredentialProvider,
  GatewayCredentialProvider,
  OAuth2CredentialProvider,
} from '../../../lib';

describe('ApiKeyCredentialProvider', () => {
  test('synthesizes expected CloudFormation resource', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'my_api_key_provider',
      apiKey: cdk.SecretValue.unsafePlainText('super-secret'),
      tags: { team: 'agents' },
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::ApiKeyCredentialProvider', 1);
    template.hasResourceProperties('AWS::BedrockAgentCore::ApiKeyCredentialProvider', {
      Name: 'my_api_key_provider',
      ApiKey: 'super-secret',
      Tags: Match.arrayWith([{ Key: 'team', Value: 'agents' }]),
    });
  });

  test('grantRead scopes actions to provider ARN and parent resources', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'keyprov',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetApiKeyCredentialProvider',
              'bedrock-agentcore:ListApiKeyCredentialProviders',
            ]),
            Resource: Match.not(Match.exact('*')),
          }),
        ]),
      },
    });
  });

  test('grantUse includes Secrets Manager read on the credential secret', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'keyprov',
      apiKey: cdk.SecretValue.unsafePlainText('k'),
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantUse(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
          }),
        ]),
      },
    });
  });

  test('grantUse on imported provider omits Secrets Manager when secret ARN is unknown', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = ApiKeyCredentialProvider.fromApiKeyCredentialProviderAttributes(stack, 'Imp', {
      credentialProviderArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/apikeycredentialprovider/existing',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    imported.grantUse(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceApiKey',
          }),
        ]),
      },
    });
    // Secrets Manager should NOT be granted when secret ARN is unknown
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.not(
          Match.arrayWith([
            Match.objectLike({ Action: 'secretsmanager:GetSecretValue' }),
          ]),
        ),
      },
    });
  });

  test('fromApiKeyCredentialProviderAttributes exposes ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = ApiKeyCredentialProvider.fromApiKeyCredentialProviderAttributes(stack, 'Imp', {
      credentialProviderArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/apikeycredentialprovider/existing',
      apiKeySecretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:foo',
    });

    expect(imported.credentialProviderArn).toContain('apikeycredentialprovider/existing');
    expect(imported.bindForGatewayApiKeyTarget().secretArn).toContain('secretsmanager');
  });

  test('bindForGatewayApiKeyTarget throws when secret ARN is missing on import', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = ApiKeyCredentialProvider.fromApiKeyCredentialProviderAttributes(stack, 'Imp', {
      credentialProviderArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/apikeycredentialprovider/existing',
    });

    expect(() => imported.bindForGatewayApiKeyTarget()).toThrow(/apiKeySecretArn/);
  });
});

describe('OAuth2CredentialProvider', () => {
  test('synthesizes expected CloudFormation resource', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingGithub(stack, 'Provider', {
      oAuth2CredentialProviderName: 'my_oauth_provider',
      clientId: 'gh-client',
      clientSecret: cdk.SecretValue.unsafePlainText('gh-secret'),
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::OAuth2CredentialProvider', 1);
    template.hasResourceProperties('AWS::BedrockAgentCore::OAuth2CredentialProvider', {
      Name: 'my_oauth_provider',
      CredentialProviderVendor: 'GithubOauth2',
      Oauth2ProviderConfigInput: {
        GithubOauth2ProviderConfig: {
          ClientId: 'gh-client',
          ClientSecret: 'gh-secret',
        },
      },
    });
  });

  test('grantUse applies token actions to provider ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = OAuth2CredentialProvider.usingCustom(stack, 'Provider', {
      oAuth2CredentialProviderName: 'oauthprov',
      clientId: 'cid',
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
      discoveryUrl: 'https://example.com/.well-known/openid-configuration',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantUse(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
          }),
        ]),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['bedrock-agentcore:GetResourceOauth2Token']),
          }),
        ]),
      },
    });
  });

  test('usingYandex synthesizes included config with client credentials only', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingYandex(stack, 'Yandex', {
      oAuth2CredentialProviderName: 'yandex_idp',
      clientId: 'yandex-cid',
      clientSecret: cdk.SecretValue.unsafePlainText('yandex-csec'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::OAuth2CredentialProvider', {
      Name: 'yandex_idp',
      CredentialProviderVendor: 'YandexOauth2',
      Oauth2ProviderConfigInput: {
        IncludedOauth2ProviderConfig: {
          ClientId: 'yandex-cid',
          ClientSecret: 'yandex-csec',
        },
      },
    });
  });

  test('usingOkta synthesizes IncludedOauth2ProviderConfig', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingOkta(stack, 'Okta', {
      oAuth2CredentialProviderName: 'okta_idp',
      clientId: 'okta-cid',
      clientSecret: cdk.SecretValue.unsafePlainText('okta-csec'),
      issuer: 'https://dev-123.okta.com/oauth2/default',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::OAuth2CredentialProvider', {
      Name: 'okta_idp',
      CredentialProviderVendor: 'OktaOauth2',
      Oauth2ProviderConfigInput: {
        IncludedOauth2ProviderConfig: {
          ClientId: 'okta-cid',
          ClientSecret: 'okta-csec',
          Issuer: 'https://dev-123.okta.com/oauth2/default',
        },
      },
    });
  });

  test('bindForGatewayOAuthTarget forwards scopes', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = OAuth2CredentialProvider.usingSlack(stack, 'Provider', {
      oAuth2CredentialProviderName: 'oauthprov',
      clientId: 'slack-client',
      clientSecret: cdk.SecretValue.unsafePlainText('slack-secret'),
    });

    const binding = provider.bindForGatewayOAuthTarget(['chat:write'], { foo: 'bar' });
    expect(binding.scopes).toEqual(['chat:write']);
    expect(binding.customParameters).toEqual({ foo: 'bar' });
    expect(binding.providerArn).toBe(provider.credentialProviderArn);
  });

  test('usingCustom rejects discoveryUrl and authorizationServerMetadata together', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const metadata: OAuth2AuthorizationServerMetadata = {
      issuer: 'https://idp.example.com',
      authorizationEndpoint: 'https://idp.example.com/oauth2/authorize',
      tokenEndpoint: 'https://idp.example.com/oauth2/token',
    };

    expect(() =>
      OAuth2CredentialProvider.usingCustom(stack, 'Bad', {
        clientId: 'cid',
        clientSecret: cdk.SecretValue.unsafePlainText('csec'),
        discoveryUrl: 'https://idp.example.com/.well-known/openid-configuration',
        authorizationServerMetadata: metadata,
      }),
    ).toThrow(/not both/);
  });

  test('usingCustom rejects when neither discovery nor metadata is provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      OAuth2CredentialProvider.usingCustom(stack, 'Bad', {
        clientId: 'cid',
        clientSecret: cdk.SecretValue.unsafePlainText('csec'),
      }),
    ).toThrow(/either discoveryUrl or authorizationServerMetadata/);
  });

  test('usingCustom maps authorizationServerMetadata to CloudFormation', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingCustom(stack, 'CustomMeta', {
      oAuth2CredentialProviderName: 'custom_meta',
      clientId: 'cid',
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
      authorizationServerMetadata: {
        issuer: 'https://idp.example.com',
        authorizationEndpoint: 'https://idp.example.com/oauth2/authorize',
        tokenEndpoint: 'https://idp.example.com/oauth2/token',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::OAuth2CredentialProvider', {
      Name: 'custom_meta',
      Oauth2ProviderConfigInput: {
        CustomOauth2ProviderConfig: {
          ClientId: 'cid',
          ClientSecret: 'csec',
          OauthDiscovery: {
            AuthorizationServerMetadata: {
              Issuer: 'https://idp.example.com',
              AuthorizationEndpoint: 'https://idp.example.com/oauth2/authorize',
              TokenEndpoint: 'https://idp.example.com/oauth2/token',
            },
          },
        },
      },
    });
  });
});

// These tests verify internal _render() equivalence between factory methods (construct vs ARN paths).
// They ensure both code paths produce identical CFN output without needing a full stack synthesis.
describe('GatewayCredentialProvider from Token Vault constructs', () => {
  test('fromApiKeyIdentity matches fromApiKeyIdentityArn for the same binding', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const apiKey = new ApiKeyCredentialProvider(stack, 'KeyProv', {
      apiKeyCredentialProviderName: 'key1',
      apiKey: cdk.SecretValue.unsafePlainText('secret'),
    });
    const binding = apiKey.bindForGatewayApiKeyTarget();
    const viaConstruct = GatewayCredentialProvider.fromApiKeyIdentity(apiKey);
    const viaArn = GatewayCredentialProvider.fromApiKeyIdentityArn({
      providerArn: binding.providerArn,
      secretArn: binding.secretArn,
    });
    expect(viaConstruct._render()).toEqual(viaArn._render());
  });

  test('fromApiKeyIdentity forwards credentialLocation', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const apiKey = new ApiKeyCredentialProvider(stack, 'KeyProv', {
      apiKey: cdk.SecretValue.unsafePlainText('secret'),
    });
    const loc = ApiKeyCredentialLocation.header({
      credentialParameterName: 'X-API-Key',
      credentialPrefix: '',
    });
    const viaConstruct = GatewayCredentialProvider.fromApiKeyIdentity(apiKey, { credentialLocation: loc });
    const binding = apiKey.bindForGatewayApiKeyTarget();
    const viaArn = GatewayCredentialProvider.fromApiKeyIdentityArn({
      providerArn: binding.providerArn,
      secretArn: binding.secretArn,
      credentialLocation: loc,
    });
    expect(viaConstruct._render()).toEqual(viaArn._render());
  });

  test('fromOauthIdentity matches fromOauthIdentityArn for the same binding', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      clientId: 'cid',
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
    });
    const viaConstruct = GatewayCredentialProvider.fromOauthIdentity(oauth, {
      scopes: ['read:user'],
      customParameters: { foo: 'bar' },
    });
    const binding = oauth.bindForGatewayOAuthTarget(['read:user'], { foo: 'bar' });
    const viaArn = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn: binding.providerArn,
      secretArn: binding.secretArn,
      scopes: binding.scopes,
      customParameters: binding.customParameters,
    });
    expect(viaConstruct._render()).toEqual(viaArn._render());
  });
});

describe('grantFullAccess scopes all permissions to provider ARN and parent resources', () => {
  test('ApiKeyCredentialProvider grantFullAccess includes parent resource ARNs', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'keyprov',
      apiKey: cdk.SecretValue.unsafePlainText('k'),
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantFullAccess(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetApiKeyCredentialProvider',
              'bedrock-agentcore:ListApiKeyCredentialProviders',
            ]),
            Resource: Match.not(Match.exact('*')),
          }),
        ]),
      },
    });
  });

  test('OAuth2CredentialProvider grantFullAccess includes parent resource ARNs', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = OAuth2CredentialProvider.usingGithub(stack, 'Provider', {
      oAuth2CredentialProviderName: 'oauthprov',
      clientId: 'cid',
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantFullAccess(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetOauth2CredentialProvider',
              'bedrock-agentcore:ListOauth2CredentialProviders',
            ]),
            Resource: Match.not(Match.exact('*')),
          }),
        ]),
      },
    });
  });
});

describe('Custom OAuth2 token safety', () => {
  test('usingCustom rejects both tokenized discoveryUrl and metadata', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const discoveryUrl = cdk.Lazy.string({ produce: () => 'https://idp.example.com/.well-known/openid-configuration' });
    const metadata: OAuth2AuthorizationServerMetadata = {
      issuer: cdk.Lazy.string({ produce: () => 'https://idp.example.com' }),
      authorizationEndpoint: 'https://idp.example.com/oauth2/authorize',
      tokenEndpoint: 'https://idp.example.com/oauth2/token',
    };

    // Both provided is always an error, even when values contain Tokens
    expect(() =>
      OAuth2CredentialProvider.usingCustom(stack, 'TokenBoth', {
        clientId: 'cid',
        clientSecret: cdk.SecretValue.unsafePlainText('csec'),
        discoveryUrl,
        authorizationServerMetadata: metadata,
      }),
    ).toThrow(/not both/);
  });

  test('usingCustom with only discoveryUrl synthesizes correctly', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingCustom(stack, 'CustomDisc', {
      oAuth2CredentialProviderName: 'custom_disc',
      clientId: 'cid',
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
      discoveryUrl: 'https://idp.example.com/.well-known/openid-configuration',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::OAuth2CredentialProvider', {
      Name: 'custom_disc',
      Oauth2ProviderConfigInput: {
        CustomOauth2ProviderConfig: {
          OauthDiscovery: {
            DiscoveryUrl: 'https://idp.example.com/.well-known/openid-configuration',
          },
        },
      },
    });
  });
});

describe('Validation edge cases', () => {
  test('fails for invalid credential provider name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    expect(() =>
      new ApiKeyCredentialProvider(stack, 'Bad', {
        apiKeyCredentialProviderName: 'has spaces!',
        apiKey: cdk.SecretValue.unsafePlainText('k'),
      }),
    ).toThrow(/Credential provider name/);
  });

  test('tokenized tags skip validation', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const tokenKey = cdk.Lazy.string({ produce: () => 'resolved-key' });

    // Should not throw even though the key is a token (cannot be validated at synth time)
    expect(() =>
      new ApiKeyCredentialProvider(stack, 'TokenTag', {
        apiKeyCredentialProviderName: 'provider_with_token_tags',
        tags: { [tokenKey]: 'value' },
      }),
    ).not.toThrow();
  });

  test('grantAdmin grants control plane permissions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'keyprov',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantAdmin(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:CreateApiKeyCredentialProvider',
              'bedrock-agentcore:GetApiKeyCredentialProvider',
              'bedrock-agentcore:UpdateApiKeyCredentialProvider',
              'bedrock-agentcore:DeleteApiKeyCredentialProvider',
            ]),
          }),
        ]),
      },
    });
  });

  test('auto-generates physical name when not specified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new ApiKeyCredentialProvider(stack, 'MyProvider', {
      apiKey: cdk.SecretValue.unsafePlainText('k'),
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::ApiKeyCredentialProvider', 1);
    template.hasResourceProperties('AWS::BedrockAgentCore::ApiKeyCredentialProvider', {
      Name: Match.stringLikeRegexp('TestStackMyProvider.*'),
    });
  });

  test('fromOAuth2CredentialProviderAttributes exposes vendor and ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = OAuth2CredentialProvider.fromOAuth2CredentialProviderAttributes(stack, 'Imp', {
      credentialProviderArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/oauth2credentialprovider/existing',
      credentialProviderVendor: 'GithubOauth2',
      clientSecretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:oauth',
    });

    expect(imported.credentialProviderArn).toContain('oauth2credentialprovider/existing');
    expect(imported.credentialProviderVendor).toBe('GithubOauth2');
    const binding = imported.bindForGatewayOAuthTarget(['read:user']);
    expect(binding.secretArn).toContain('secretsmanager');
    expect(binding.scopes).toEqual(['read:user']);
  });

  test('bindForGatewayOAuthTarget throws when secret ARN is missing on import', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const imported = OAuth2CredentialProvider.fromOAuth2CredentialProviderAttributes(stack, 'Imp', {
      credentialProviderArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/oauth2credentialprovider/existing',
      credentialProviderVendor: 'GithubOauth2',
    });

    expect(() => imported.bindForGatewayOAuthTarget(['read:user'])).toThrow(/clientSecretArn/);
  });
});
