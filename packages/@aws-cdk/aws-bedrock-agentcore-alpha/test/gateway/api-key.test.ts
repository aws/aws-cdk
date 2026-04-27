import {
  ApiKeyCredentialLocation,
  ApiKeyCredentialProviderConfiguration,
} from '../../lib/gateway/outbound-auth/api-key';

describe('ApiKeyCredentialLocation', () => {
  describe('header()', () => {
    test('uses default credentialParameterName and credentialPrefix when no config provided', () => {
      const location = ApiKeyCredentialLocation.header();

      expect(location.credentialParameterName).toBe('Authorization');
      expect(location.credentialPrefix).toBe('Bearer ');
      expect(location.credentialLocationType).toBe('HEADER');
    });

    test('uses default credentialParameterName and credentialPrefix when config is empty object', () => {
      const location = ApiKeyCredentialLocation.header({});

      expect(location.credentialParameterName).toBe('Authorization');
      expect(location.credentialPrefix).toBe('Bearer ');
    });

    test('respects explicit credentialParameterName', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialParameterName: 'X-API-Key',
      });

      expect(location.credentialParameterName).toBe('X-API-Key');
      expect(location.credentialPrefix).toBe('Bearer ');
    });

    test('respects explicit credentialPrefix', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialPrefix: 'Token ',
      });

      expect(location.credentialParameterName).toBe('Authorization');
      expect(location.credentialPrefix).toBe('Token ');
    });

    test('respects empty string credentialParameterName', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialParameterName: '',
      });

      expect(location.credentialParameterName).toBe('');
    });

    test('respects empty string credentialPrefix', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialPrefix: '',
      });

      expect(location.credentialPrefix).toBe('');
    });

    test('respects both explicit values', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialParameterName: 'X-Custom-Key',
        credentialPrefix: 'Custom ',
      });

      expect(location.credentialParameterName).toBe('X-Custom-Key');
      expect(location.credentialPrefix).toBe('Custom ');
    });

    test('uses defaults when properties are explicitly undefined', () => {
      const location = ApiKeyCredentialLocation.header({
        credentialParameterName: undefined,
        credentialPrefix: undefined,
      });

      expect(location.credentialParameterName).toBe('Authorization');
      expect(location.credentialPrefix).toBe('Bearer ');
    });
  });

  describe('queryParameter()', () => {
    test('uses default credentialParameterName when no config provided', () => {
      const location = ApiKeyCredentialLocation.queryParameter();

      expect(location.credentialParameterName).toBe('api_key');
      expect(location.credentialPrefix).toBeUndefined();
      expect(location.credentialLocationType).toBe('QUERY_PARAMETER');
    });

    test('uses default credentialParameterName when config is empty object', () => {
      const location = ApiKeyCredentialLocation.queryParameter({});

      expect(location.credentialParameterName).toBe('api_key');
      expect(location.credentialPrefix).toBeUndefined();
    });

    test('respects explicit credentialParameterName', () => {
      const location = ApiKeyCredentialLocation.queryParameter({
        credentialParameterName: 'token',
      });

      expect(location.credentialParameterName).toBe('token');
    });

    test('respects empty string credentialParameterName', () => {
      const location = ApiKeyCredentialLocation.queryParameter({
        credentialParameterName: '',
      });

      expect(location.credentialParameterName).toBe('');
    });

    test('passes through credentialPrefix when provided', () => {
      const location = ApiKeyCredentialLocation.queryParameter({
        credentialPrefix: 'Bearer ',
      });

      expect(location.credentialPrefix).toBe('Bearer ');
    });

    test('passes through empty string credentialPrefix', () => {
      const location = ApiKeyCredentialLocation.queryParameter({
        credentialPrefix: '',
      });

      expect(location.credentialPrefix).toBe('');
    });

    test('uses defaults when properties are explicitly undefined', () => {
      const location = ApiKeyCredentialLocation.queryParameter({
        credentialParameterName: undefined,
        credentialPrefix: undefined,
      });

      expect(location.credentialParameterName).toBe('api_key');
      expect(location.credentialPrefix).toBeUndefined();
    });
  });
});

describe('ApiKeyCredentialProviderConfiguration', () => {
  describe('constructor', () => {
    test('uses default header credential location when not specified', () => {
      const config = new ApiKeyCredentialProviderConfiguration({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
      });

      expect(config.credentialLocation.credentialLocationType).toBe('HEADER');
      expect(config.credentialLocation.credentialParameterName).toBe('Authorization');
      expect(config.credentialLocation.credentialPrefix).toBe('Bearer ');
    });

    test('uses provided credential location', () => {
      const config = new ApiKeyCredentialProviderConfiguration({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        credentialLocation: ApiKeyCredentialLocation.queryParameter({
          credentialParameterName: 'key',
        }),
      });

      expect(config.credentialLocation.credentialLocationType).toBe('QUERY_PARAMETER');
      expect(config.credentialLocation.credentialParameterName).toBe('key');
    });
  });

  describe('_render()', () => {
    test('renders with default credential location', () => {
      const config = new ApiKeyCredentialProviderConfiguration({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
      });

      const rendered = config._render();
      expect(rendered).toEqual({
        credentialProviderType: 'API_KEY',
        credentialProvider: {
          apiKeyCredentialProvider: {
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
            credentialLocation: 'HEADER',
            credentialParameterName: 'Authorization',
            credentialPrefix: 'Bearer ',
          },
        },
      });
    });

    test('renders with custom credential location using empty prefix', () => {
      const config = new ApiKeyCredentialProviderConfiguration({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        credentialLocation: ApiKeyCredentialLocation.header({
          credentialPrefix: '',
          credentialParameterName: 'X-API-Key',
        }),
      });

      const rendered = config._render();
      expect(rendered.credentialProvider.apiKeyCredentialProvider.credentialPrefix).toBe('');
      expect(rendered.credentialProvider.apiKeyCredentialProvider.credentialParameterName).toBe('X-API-Key');
    });

    test('renders query parameter location without prefix', () => {
      const config = new ApiKeyCredentialProviderConfiguration({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv/apikeycredentialprovider/p',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        credentialLocation: ApiKeyCredentialLocation.queryParameter(),
      });

      const rendered = config._render();
      expect(rendered.credentialProvider.apiKeyCredentialProvider.credentialLocation).toBe('QUERY_PARAMETER');
      expect(rendered.credentialProvider.apiKeyCredentialProvider.credentialParameterName).toBe('api_key');
      expect(rendered.credentialProvider.apiKeyCredentialProvider.credentialPrefix).toBeUndefined();
    });
  });
});
