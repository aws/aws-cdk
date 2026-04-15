import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import type { CfnOAuth2CredentialProvider } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  ApiKeyCredentialProvider,
  ApiKeyCredentialLocation,
  GatewayCredentialProvider,
  OAuth2CredentialProvider,
  OAuth2CredentialProviderIdentityPerms,
  TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS,
} from '../../../lib';

describe('ApiKeyCredentialProvider', () => {
  test('synthesizes expected CloudFormation resource', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'my_api_key_provider',
      apiKey: 'super-secret',
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

  test('grantRead combines resource and list permissions', () => {
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
    const policies = template.findResources('AWS::IAM::Policy');
    expect(Object.keys(policies).length).toBeGreaterThan(0);
    const serialized = JSON.stringify(policies);
    expect(serialized).toContain('bedrock-agentcore:GetApiKeyCredentialProvider');
    expect(serialized).toContain('bedrock-agentcore:ListApiKeyCredentialProviders');
    expect(serialized).toContain('CredentialProviderArn');
    expect(serialized).toContain('"*"');
  });

  test('grantUse includes Secrets Manager read on the credential secret', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const provider = new ApiKeyCredentialProvider(stack, 'Provider', {
      apiKeyCredentialProviderName: 'keyprov',
      apiKey: 'k',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantUse(role);

    const serialized = JSON.stringify(Template.fromStack(stack).findResources('AWS::IAM::Policy'));
    for (const action of TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS) {
      expect(serialized).toContain(action);
    }
    expect(serialized).toContain('secretsmanager');
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

    const serialized = JSON.stringify(Template.fromStack(stack).findResources('AWS::IAM::Policy'));
    expect(serialized).toContain('bedrock-agentcore:GetResourceApiKey');
    expect(serialized).not.toContain('secretsmanager:GetSecretValue');
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
      clientSecret: 'gh-secret',
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
      clientSecret: 'csec',
      discoveryUrl: 'https://example.com/.well-known/openid-configuration',
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    provider.grantUse(role);

    const template = Template.fromStack(stack);
    const policies = template.findResources('AWS::IAM::Policy');
    expect(Object.keys(policies).length).toBeGreaterThan(0);
    const serialized = JSON.stringify(policies);
    for (const action of OAuth2CredentialProviderIdentityPerms.USE_PERMS) {
      expect(serialized).toContain(action);
    }
    for (const action of TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS) {
      expect(serialized).toContain(action);
    }
    expect(serialized).toContain('CredentialProviderArn');
    expect(serialized).toContain('secretsmanager');
  });

  test('usingYandex synthesizes included config with client credentials only', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    OAuth2CredentialProvider.usingYandex(stack, 'Yandex', {
      oAuth2CredentialProviderName: 'yandex_idp',
      clientId: 'yandex-cid',
      clientSecret: 'yandex-csec',
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
      clientSecret: 'okta-csec',
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
      clientSecret: 'slack-secret',
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

    const metadata: CfnOAuth2CredentialProvider.Oauth2AuthorizationServerMetadataProperty = {
      issuer: 'https://idp.example.com',
      authorizationEndpoint: 'https://idp.example.com/oauth2/authorize',
      tokenEndpoint: 'https://idp.example.com/oauth2/token',
    };

    expect(() =>
      OAuth2CredentialProvider.usingCustom(stack, 'Bad', {
        clientId: 'cid',
        clientSecret: 'csec',
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
        clientSecret: 'csec',
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
      clientSecret: 'csec',
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

describe('GatewayCredentialProvider from Token Vault constructs', () => {
  test('fromApiKeyIdentity matches fromApiKeyIdentityArn for the same binding', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const apiKey = new ApiKeyCredentialProvider(stack, 'KeyProv', {
      apiKeyCredentialProviderName: 'key1',
      apiKey: 'secret',
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
      apiKey: 'secret',
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
      clientSecret: 'csec',
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
