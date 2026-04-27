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
import { PolicyEngineMode } from '../../../lib/gateway/gateway';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { PolicyEngine } from '../../../lib/policy/policy-engine';

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

  test('Should automatically grant GetPolicyEngine to gateway role scoped to policy engine ARN', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine', {
      policyEngineName: 'test_policy_engine',
    });

    new Gateway(stack, 'Gateway', {
      gatewayName: 'test-gateway',
      policyEngineConfiguration: { policyEngine },
    });

    const template = Template.fromStack(stack, { skipCyclicalDependenciesCheck: true });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetPolicyEngine',
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine.*'), 'PolicyEngineArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Should automatically grant AuthorizeAction and PartiallyAuthorizeActions to both policy engine and gateway ARNs', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine2', {
      policyEngineName: 'test_policy_engine_2',
    });

    new Gateway(stack, 'Gateway2', {
      gatewayName: 'test-gateway-2',
      policyEngineConfiguration: {
        policyEngine,
        mode: PolicyEngineMode.ENFORCE,
      },
    });

    const template = Template.fromStack(stack, { skipCyclicalDependenciesCheck: true });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:AuthorizeAction',
              'bedrock-agentcore:PartiallyAuthorizeActions',
            ]),
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine2.*'), 'PolicyEngineArn']),
              }),
              Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            ]),
          }),
        ]),
      },
    });
  });

  test('Should set PolicyEngineConfiguration on the CfnGateway with LOG_ONLY as default mode', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine3', {
      policyEngineName: 'test_policy_engine_3',
    });

    new Gateway(stack, 'Gateway3', {
      gatewayName: 'test-gateway-3',
      policyEngineConfiguration: { policyEngine },
    });

    const template = Template.fromStack(stack, { skipCyclicalDependenciesCheck: true });
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway-3',
      PolicyEngineConfiguration: {
        Arn: Match.objectLike({
          'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine3.*'), 'PolicyEngineArn']),
        }),
        Mode: 'LOG_ONLY',
      },
    });
  });

  test('Should set PolicyEngineConfiguration with ENFORCE mode when specified', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine4', {
      policyEngineName: 'test_policy_engine_4',
    });

    new Gateway(stack, 'Gateway4', {
      gatewayName: 'test-gateway-4',
      policyEngineConfiguration: {
        policyEngine,
        mode: PolicyEngineMode.ENFORCE,
      },
    });

    const template = Template.fromStack(stack, { skipCyclicalDependenciesCheck: true });
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway-4',
      PolicyEngineConfiguration: {
        Mode: 'ENFORCE',
      },
    });
  });

  test('Should not set PolicyEngineConfiguration when not provided', () => {
    new Gateway(stack, 'GatewayNoPolicyEngine', {
      gatewayName: 'no-policy-engine-gateway',
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'no-policy-engine-gateway',
      PolicyEngineConfiguration: Match.absent(),
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

  test('API key outbound auth produces three separate IAM statements with correct resource scoping', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'my-gateway' });
    const apiKey = new ApiKeyCredentialProvider(stack, 'Key', {
      apiKeyCredentialProviderName: 'key-prov',
      apiKey: 'k',
    });

    gateway.addOpenApiTarget('T', {
      gatewayTargetName: 'target',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [GatewayCredentialProvider.fromApiKeyIdentity(apiKey)],
    });

    const template = Template.fromStack(stack);

    // Statement 1: GetWorkloadAccessToken scoped to workload-identity-directory
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetWorkloadAccessToken',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::Join': Match.arrayWith([Match.arrayWith([
                  Match.stringLikeRegexp('.*bedrock-agentcore.*workload-identity-directory/default'),
                ])]),
              }),
              Match.objectLike({
                'Fn::Join': Match.arrayWith([Match.arrayWith([
                  Match.stringLikeRegexp('.*workload-identity-directory/default/workload-identity/my-gateway-\\*'),
                ])]),
              }),
            ]),
          }),
        ]),
      },
    });

    // Statement 2: GetResourceApiKey scoped to credential provider ARN
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceApiKey',
            Resource: { 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Key.*'), 'CredentialProviderArn']) },
          }),
        ]),
      },
    });

    // Statement 3: Secrets Manager scoped to account wildcard (not the L1 object attribute)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
            Resource: Match.objectLike({
              'Fn::Join': Match.arrayWith([Match.arrayWith([
                Match.stringLikeRegexp('.*secretsmanager.*secret:\\*'),
              ])]),
            }),
          }),
        ]),
      },
    });
  });

  test('OAuth outbound auth produces three separate IAM statements with correct resource scoping', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'my-gateway' });
    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      oAuth2CredentialProviderName: 'oauth-prov',
      clientId: 'c',
      clientSecret: 's',
    });

    gateway.addOpenApiTarget('T', {
      gatewayTargetName: 'target',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentity(oauth, { scopes: ['read'] }),
      ],
    });

    const template = Template.fromStack(stack);

    // Statement 1: GetWorkloadAccessToken scoped to workload-identity-directory
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetWorkloadAccessToken',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::Join': Match.arrayWith([Match.arrayWith([
                  Match.stringLikeRegexp('.*bedrock-agentcore.*workload-identity-directory/default'),
                ])]),
              }),
            ]),
          }),
        ]),
      },
    });

    // Statement 2: GetResourceOauth2Token scoped to credential provider ARN
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceOauth2Token',
            Resource: { 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Gh.*'), 'CredentialProviderArn']) },
          }),
        ]),
      },
    });

    // Statement 3: Secrets Manager scoped to account wildcard
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
            Resource: Match.objectLike({
              'Fn::Join': Match.arrayWith([Match.arrayWith([
                Match.stringLikeRegexp('.*secretsmanager.*secret:\\*'),
              ])]),
            }),
          }),
        ]),
      },
    });
  });

  test('API key outbound auth with fromApiKeyIdentityArn uses provided secret ARN string', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'my-gateway' });

    gateway.addOpenApiTarget('T', {
      gatewayTargetName: 'target',
      apiSchema: minimalOpenApiSchema,
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv1/apikeycredentialprovider/my-key',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-abc123',
        }),
      ],
    });

    const template = Template.fromStack(stack);

    // All three statements present and separate
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetWorkloadAccessToken',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceApiKey',
            Resource: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv1/apikeycredentialprovider/my-key',
          }),
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
          }),
        ]),
      },
    });
  });
});
