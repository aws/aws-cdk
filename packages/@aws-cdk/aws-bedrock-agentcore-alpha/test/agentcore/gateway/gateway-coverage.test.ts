/**
 * Targeted tests to improve branch coverage
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  ApiKeyCredentialProvider,
  ApiSchema,
  Gateway,
  GatewayCredentialProvider,
  OAuth2CredentialProvider,
} from '../../../lib';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';

describe('Gateway Coverage Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should grant KMS permissions when both kmsKey and custom role provided', () => {
    const key = new kms.Key(stack, 'Key');
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    new Gateway(stack, 'Gateway', {
      gatewayName: 'test-gateway',
      kmsKey: key,
      role: role,
    });

    const template = Template.fromStack(stack);
    // Verify that KMS permissions are granted to the role
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['kms:Decrypt', 'kms:Encrypt']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should pass credentialProviderConfigurations when provided to Lambda target', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'test-gateway' });

    const fn = new lambda.Function(stack, 'Function', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'Test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const creds = [GatewayCredentialProvider.fromIamRole()];

    const target = gateway.addLambdaTarget('Target', {
      lambdaFunction: fn,
      toolSchema: toolSchema,
      credentialProviderConfigurations: creds,
    });

    expect(target.credentialProviderConfigurations).toEqual(creds);
  });

  const minimalOpenApiSchema = ApiSchema.fromInline(
    JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Cov', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    }),
  );

  test('OpenAPI target uses Token Vault ApiKeyCredentialProvider via fromApiKeyIdentity', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'test-gateway' });
    const apiKey = new ApiKeyCredentialProvider(stack, 'KeyProv', {
      apiKeyCredentialProviderName: 'gw_cov_apikey',
      apiKey: 'secret',
    });

    gateway.addOpenApiTarget('OpenApiKey', {
      gatewayTargetName: 'openapi-api-key-id',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [GatewayCredentialProvider.fromApiKeyIdentity(apiKey)],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'openapi-api-key-id',
      CredentialProviderConfigurations: [
        {
          CredentialProviderType: 'API_KEY',
          CredentialProvider: {
            ApiKeyCredentialProvider: {
              ProviderArn: Match.anyValue(),
              CredentialLocation: Match.anyValue(),
              CredentialParameterName: Match.anyValue(),
              CredentialPrefix: Match.anyValue(),
            },
          },
        },
      ],
    });
  });

  test('OpenAPI target uses Token Vault OAuth2CredentialProvider via fromOauthIdentity', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'test-gateway' });
    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      oAuth2CredentialProviderName: 'gw_cov_oauth',
      clientId: 'cid',
      clientSecret: 'csec',
    });

    gateway.addOpenApiTarget('OpenApiOauth', {
      gatewayTargetName: 'openapi-oauth-id',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentity(oauth, { scopes: ['read:user'], customParameters: { k: 'v' } }),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'openapi-oauth-id',
      CredentialProviderConfigurations: [
        {
          CredentialProviderType: 'OAUTH',
          CredentialProvider: {
            OauthCredentialProvider: {
              ProviderArn: Match.anyValue(),
              Scopes: ['read:user'],
              CustomParameters: { k: 'v' },
            },
          },
        },
      ],
    });
  });

  test('Gateway role receives outbound auth grants for identity-backed OpenAPI targets', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'test-gateway' });
    const apiKey = new ApiKeyCredentialProvider(stack, 'KeyProv', {
      apiKeyCredentialProviderName: 'gw_cov_grant_key',
      apiKey: 'k',
    });
    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      oAuth2CredentialProviderName: 'gw_cov_grant_oauth',
      clientId: 'c',
      clientSecret: 's',
    });

    gateway.addOpenApiTarget('A', {
      gatewayTargetName: 'openapi-grant-a',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [GatewayCredentialProvider.fromApiKeyIdentity(apiKey)],
    });
    gateway.addOpenApiTarget('B', {
      gatewayTargetName: 'openapi-grant-b',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [GatewayCredentialProvider.fromOauthIdentity(oauth, { scopes: ['read:user'] })],
    });

    const serialized = JSON.stringify(Template.fromStack(stack).findResources('AWS::IAM::Policy'));
    expect(serialized).toContain('bedrock-agentcore:GetResourceApiKey');
    expect(serialized).toContain('bedrock-agentcore:GetResourceOauth2Token');
    expect(serialized).toContain('secretsmanager:GetSecretValue');
  });
});
