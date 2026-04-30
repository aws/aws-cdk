/**
 * Targeted tests to improve branch coverage
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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
import { ApiGatewayHttpMethod } from '../../../lib/gateway/targets/target-configuration';
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
      apiKey: cdk.SecretValue.unsafePlainText('secret'),
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
      clientSecret: cdk.SecretValue.unsafePlainText('csec'),
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
      apiKey: cdk.SecretValue.unsafePlainText('k'),
    });
    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      oAuth2CredentialProviderName: 'gw_cov_grant_oauth',
      clientId: 'c',
      clientSecret: cdk.SecretValue.unsafePlainText('s'),
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
    expect(serialized).toContain('bedrock-agentcore:CompleteResourceTokenAuth');
    expect(serialized).toContain('bedrock-agentcore:GetWorkloadAccessTokenForJWT');
    expect(serialized).toContain('bedrock-agentcore:GetWorkloadAccessTokenForUserId');
    expect(serialized).toContain('secretsmanager:GetSecretValue');
    // secretsmanager:DescribeSecret should NOT be present
    expect(serialized).not.toContain('secretsmanager:DescribeSecret');
  });

  test('API key outbound auth produces three separate IAM statements with correct resource scoping', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'my-gateway' });
    const apiKey = new ApiKeyCredentialProvider(stack, 'Key', {
      apiKeyCredentialProviderName: 'key-prov',
      apiKey: cdk.SecretValue.unsafePlainText('k'),
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

    // Statement 2: GetResourceApiKey scoped to token vault, provider ARN, directory, and identity wildcard
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceApiKey',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::Join': Match.arrayWith([Match.arrayWith([
                  Match.stringLikeRegexp('.*bedrock-agentcore.*token-vault/default'),
                ])]),
              }),
              { 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Key.*'), 'CredentialProviderArn']) },
            ]),
          }),
        ]),
      },
    });

    // Statement 3: Secrets Manager scoped to bedrock-agentcore-identity prefix wildcard
    // (CDK-created providers use a wildcard because the CFN attribute ApiKeySecretArn
    // returns an object, not a plain string ARN that can be placed in IAM Resource fields)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'secretsmanager:GetSecretValue',
            Resource: Match.objectLike({
              'Fn::Join': Match.arrayWith([Match.arrayWith([
                Match.stringLikeRegexp('.*secretsmanager.*secret:bedrock-agentcore-identity!\\*'),
              ])]),
            }),
          }),
        ]),
      },
    });

    // Verify no secretsmanager:DescribeSecret
    const serialized = JSON.stringify(template.findResources('AWS::IAM::Policy'));
    expect(serialized).not.toContain('secretsmanager:DescribeSecret');
  });

  test('OAuth outbound auth produces four separate IAM statements with correct resource scoping', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'my-gateway' });
    const oauth = OAuth2CredentialProvider.usingGithub(stack, 'Gh', {
      oAuth2CredentialProviderName: 'oauth-prov',
      clientId: 'c',
      clientSecret: cdk.SecretValue.unsafePlainText('s'),
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

    // Statement 1: GetWorkloadAccessToken + ForJWT + ForUserId scoped to directory
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetWorkloadAccessToken',
              'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
              'bedrock-agentcore:GetWorkloadAccessTokenForUserId',
            ]),
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

    // Statement 2: CompleteResourceTokenAuth scoped to token vault, provider, directory, identity
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:CompleteResourceTokenAuth',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::Join': Match.arrayWith([Match.arrayWith([
                  Match.stringLikeRegexp('.*bedrock-agentcore.*token-vault/default'),
                ])]),
              }),
              { 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Gh.*'), 'CredentialProviderArn']) },
            ]),
          }),
        ]),
      },
    });

    // Statement 3: GetResourceOauth2Token scoped to token vault, provider, directory, identity
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetResourceOauth2Token',
            Resource: Match.arrayWith([
              { 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Gh.*'), 'CredentialProviderArn']) },
            ]),
          }),
        ]),
      },
    });

    // Statement 4: Secrets Manager scoped to bedrock-agentcore-identity prefix wildcard
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'secretsmanager:GetSecretValue',
            Resource: Match.objectLike({
              'Fn::Join': Match.arrayWith([Match.arrayWith([
                Match.stringLikeRegexp('.*secretsmanager.*secret:bedrock-agentcore-identity!\\*'),
              ])]),
            }),
          }),
        ]),
      },
    });

    // Verify no secretsmanager:DescribeSecret
    const serialized = JSON.stringify(template.findResources('AWS::IAM::Policy'));
    expect(serialized).not.toContain('secretsmanager:DescribeSecret');
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
            Resource: Match.arrayWith([
              'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/tv1/apikeycredentialprovider/my-key',
            ]),
          }),
          Match.objectLike({
            Action: 'secretsmanager:GetSecretValue',
            Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-abc123',
          }),
        ]),
      },
    });
  });
});

describe('Gateway grant methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    gateway = new Gateway(stack, 'test-gateway', {
      gatewayName: 'test-gateway',
    });
  });

  test('Should grant custom actions to IAM principal scoped to gateway ARN', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = gateway.grant(user, 'bedrock-agentcore:GetGateway', 'bedrock-agentcore:ListGatewayTargets');

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock-agentcore:GetGateway', 'bedrock-agentcore:ListGatewayTargets'],
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('testgateway.*'), 'GatewayArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Should grant read permissions with Get on gateway ARN and List on all resources', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = gateway.grantRead(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);

    const template = Template.fromStack(stack);
    // Get* actions scoped to the gateway ARN
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:GetGateway'],
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('testgateway.*'), 'GatewayArn']),
            }),
          }),
        ]),
      },
    });
    // List* actions scoped to all resources
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock-agentcore:ListGateways', 'bedrock-agentcore:ListGatewayTargets'],
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('Should grant manage permissions with Create, Update, and Delete actions scoped to gateway ARN', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = gateway.grantManage(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:CreateGateway',
              'bedrock-agentcore:CreateGatewayTarget',
              'bedrock-agentcore:UpdateGateway',
              'bedrock-agentcore:UpdateGatewayTarget',
              'bedrock-agentcore:DeleteGateway',
              'bedrock-agentcore:DeleteGatewayTarget',
            ]),
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('testgateway.*'), 'GatewayArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Should grant invoke permission scoped to gateway ARN', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = gateway.grantInvoke(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:InvokeGateway',
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('testgateway.*'), 'GatewayArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Should grant permissions to IAM role', () => {
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const grant = gateway.grantRead(role);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant permissions to IAM group', () => {
    const group = new iam.Group(stack, 'TestGroup');
    const grant = gateway.grantInvoke(group);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });
});

describe('Gateway metric methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    gateway = new Gateway(stack, 'test-gateway-metrics', {
      gatewayName: 'test-gateway-metrics',
    });
  });

  test('Should create metric with custom name and dimensions', () => {
    const metric = gateway.metric('CustomMetric', { CustomDimension: 'value' });
    expect(metric.metricName).toBe('CustomMetric');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.dimensions?.CustomDimension).toBe('value');
    // Resource dimension is automatically added pointing to the gateway ARN
    expect(metric.dimensions?.Resource).toBeDefined();
  });

  test('Should create metricInvocations metric with Sum statistic', () => {
    const metric = gateway.metricInvocations();
    expect(metric.metricName).toBe('Invocations');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create metricThrottles metric with Sum statistic', () => {
    const metric = gateway.metricThrottles();
    expect(metric.metricName).toBe('Throttles');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create metricSystemErrors metric with Sum statistic', () => {
    const metric = gateway.metricSystemErrors();
    expect(metric.metricName).toBe('SystemErrors');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create metricUserErrors metric with Sum statistic', () => {
    const metric = gateway.metricUserErrors();
    expect(metric.metricName).toBe('UserErrors');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create metricLatency metric with Average statistic', () => {
    const metric = gateway.metricLatency();
    expect(metric.metricName).toBe('Latency');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create metricDuration metric with Average statistic', () => {
    const metric = gateway.metricDuration();
    expect(metric.metricName).toBe('Duration');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create metricTargetExecutionTime metric with Average statistic', () => {
    const metric = gateway.metricTargetExecutionTime();
    expect(metric.metricName).toBe('TargetExecutionTime');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create metricTargetType metric with TargetType dimension and Sum statistic', () => {
    const metric = gateway.metricTargetType('Lambda');
    expect(metric.metricName).toBe('TargetType');
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.statistic).toBe('Sum');
    expect(metric.dimensions?.TargetType).toBe('Lambda');
  });

  test('Should override default statistic with custom props', () => {
    const metric = gateway.metricInvocations({ statistic: 'Average' });
    expect(metric.metricName).toBe('Invocations');
    expect(metric.statistic).toBe('Average');
  });
});

describe('OAuth credential provider tests', () => {
  const providerArn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/oauth2credentialprovider/test';
  const secretArn = 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret';

  test('Should expose providerArn, secretArn, scopes, and customParameters from constructor props', () => {
    const provider: any = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn,
      secretArn,
      scopes: ['openid', 'profile'],
      customParameters: { prompt: 'consent' },
    });

    expect(provider.providerArn).toBe(providerArn);
    expect(provider.secretArn).toBe(secretArn);
    expect(provider.scopes).toEqual(['openid', 'profile']);
    expect(provider.customParameters).toEqual({ prompt: 'consent' });
    expect(provider.credentialProviderType).toBe('OAUTH');
  });

  test('Should accept OAuth configuration without customParameters', () => {
    const provider: any = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn,
      secretArn,
      scopes: ['openid'],
    });

    expect(provider.customParameters).toBeUndefined();
  });

  test('grantNeededPermissionsToRole should grant OAuth and WorkloadIdentity actions on provider ARN and Secrets actions on secret ARN', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });
    const provider: any = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn,
      secretArn,
      scopes: ['openid'],
    });

    const grant = provider.grantNeededPermissionsToRole(role);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetResourceOauth2Token',
              'bedrock-agentcore:GetWorkloadAccessToken',
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ]),
            Effect: 'Allow',
            Resource: Match.arrayWith([providerArn, secretArn]),
          }),
        ]),
      },
    });
  });

  test('_render should include providerArn, scopes, and customParameters under oauthCredentialProvider', () => {
    const provider: any = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn,
      secretArn,
      scopes: ['openid', 'profile'],
      customParameters: { prompt: 'consent' },
    });

    const rendered = provider._render();

    expect(rendered).toEqual({
      credentialProviderType: 'OAUTH',
      credentialProvider: {
        oauthCredentialProvider: {
          providerArn,
          scopes: ['openid', 'profile'],
          customParameters: { prompt: 'consent' },
        },
      },
    });
  });

  test('_render should set customParameters to undefined when not provided', () => {
    const provider: any = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn,
      secretArn,
      scopes: ['openid'],
    });

    const rendered = provider._render();

    expect(rendered.credentialProvider.oauthCredentialProvider.customParameters).toBeUndefined();
    expect(rendered.credentialProvider.oauthCredentialProvider.scopes).toEqual(['openid']);
  });
});

describe('LambdaInterceptor tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let gateway: Gateway;
  let fn: lambda.Function;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'test-gateway', {
      gatewayName: 'test-gateway',
    });
    fn = new lambda.Function(stack, 'Interceptor', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({});'),
    });
  });

  test('forRequest should create interceptor with REQUEST interception point', () => {
    const interceptor = LambdaInterceptor.forRequest(fn);
    expect(interceptor.interceptionPoint).toBe(InterceptionPoint.REQUEST);
  });

  test('forResponse should create interceptor with RESPONSE interception point', () => {
    const interceptor = LambdaInterceptor.forResponse(fn);
    expect(interceptor.interceptionPoint).toBe(InterceptionPoint.RESPONSE);
  });

  test('bind should grant lambda:InvokeFunction to the gateway role and return CFN configuration', () => {
    const interceptor = LambdaInterceptor.forRequest(fn);
    const bindResult = interceptor.bind(stack, gateway);

    expect(bindResult.configuration.interceptionPoints).toEqual([InterceptionPoint.REQUEST]);
    expect(bindResult.configuration.interceptor.lambda.arn).toBeDefined();
    expect(bindResult.configuration.inputConfiguration.passRequestHeaders).toBe(false);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: Match.anyValue(),
          }),
        ]),
      },
    });
  });

  test('bind should default passRequestHeaders to false when options are not provided', () => {
    const interceptor = LambdaInterceptor.forRequest(fn);
    const bindResult = interceptor.bind(stack, gateway);

    expect(bindResult.configuration.inputConfiguration.passRequestHeaders).toBe(false);
  });

  test('bind should respect passRequestHeaders=true when explicitly set', () => {
    const interceptor = LambdaInterceptor.forRequest(fn, { passRequestHeaders: true });
    const bindResult = interceptor.bind(stack, gateway);

    expect(bindResult.configuration.inputConfiguration.passRequestHeaders).toBe(true);
  });

  test('bind should return RESPONSE interception point for forResponse interceptors', () => {
    const interceptor = LambdaInterceptor.forResponse(fn);
    const bindResult = interceptor.bind(stack, gateway);

    expect(bindResult.configuration.interceptionPoints).toEqual([InterceptionPoint.RESPONSE]);
  });
});

describe('ApiKeyCredentialLocation.queryParameter tests', () => {
  test('Should default credentialParameterName to "api_key" and leave credentialPrefix undefined', () => {
    const location = ApiKeyCredentialLocation.queryParameter();

    expect(location.credentialLocationType).toBe('QUERY_PARAMETER');
    expect(location.credentialParameterName).toBe('api_key');
    expect(location.credentialPrefix).toBeUndefined();
  });

  test('Should accept custom credentialParameterName and credentialPrefix', () => {
    const location = ApiKeyCredentialLocation.queryParameter({
      credentialParameterName: 'myKey',
      credentialPrefix: 'Key-',
    });

    expect(location.credentialLocationType).toBe('QUERY_PARAMETER');
    expect(location.credentialParameterName).toBe('myKey');
    expect(location.credentialPrefix).toBe('Key-');
  });
});

describe('Gateway target convenience methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'test-gateway', {
      gatewayName: 'test-gateway',
    });
  });

  describe('addLambdaTarget', () => {
    test('Should create a Lambda target with default IAM role credentials', () => {
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

      const target = gateway.addLambdaTarget('LambdaTarget', {
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      expect(target).toBeDefined();
      expect(target.name).toBe('lambda-target');
      expect(target.gateway).toBe(gateway);
      // Default credential is IAM role
      expect(target.credentialProviderConfigurations).toBeDefined();
      expect(target.credentialProviderConfigurations).toHaveLength(1);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'lambda-target',
      });
    });

    test('Should use provided credentials when supplied', () => {
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

      const target = gateway.addLambdaTarget('LambdaTarget', {
        lambdaFunction: fn,
        toolSchema: toolSchema,
        credentialProviderConfigurations: creds,
      });

      expect(target.credentialProviderConfigurations).toEqual(creds);
    });

    test('Should set description when provided', () => {
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

      const target = gateway.addLambdaTarget('LambdaTarget', {
        gatewayTargetName: 'lambda-target',
        description: 'My Lambda target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      expect(target.description).toBe('My Lambda target');
    });
  });

  describe('addOpenApiTarget', () => {
    test('Should create an OpenAPI target with inline schema', () => {
      const apiSchema = ApiSchema.fromInline(JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      }));

      const target = gateway.addOpenApiTarget('OpenApiTarget', {
        gatewayTargetName: 'openapi-target',
        apiSchema: apiSchema,
        validateOpenApiSchema: false,
        credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      });

      expect(target).toBeDefined();
      expect(target.name).toBe('openapi-target');
      expect(target.gateway).toBe(gateway);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
    });
  });

  describe('addSmithyTarget', () => {
    test('Should create a Smithy target with default IAM role credentials', () => {
      const smithyModel = ApiSchema.fromInline('{}');

      const target = gateway.addSmithyTarget('SmithyTarget', {
        gatewayTargetName: 'smithy-target',
        smithyModel: smithyModel,
      });

      expect(target).toBeDefined();
      expect(target.name).toBe('smithy-target');
      expect(target.gateway).toBe(gateway);
      // Smithy defaults to IAM role credentials
      expect(target.credentialProviderConfigurations).toBeDefined();
      expect(target.credentialProviderConfigurations).toHaveLength(1);
    });

    test('Should use provided credentials when supplied', () => {
      const smithyModel = ApiSchema.fromInline('{}');
      const creds = [GatewayCredentialProvider.fromIamRole()];

      const target = gateway.addSmithyTarget('SmithyTarget', {
        smithyModel: smithyModel,
        credentialProviderConfigurations: creds,
      });

      expect(target.credentialProviderConfigurations).toEqual(creds);
    });
  });

  describe('addMcpServerTarget', () => {
    test('Should create an MCP server target with required credentials', () => {
      const creds = [GatewayCredentialProvider.fromIamRole()];

      const target = gateway.addMcpServerTarget('McpTarget', {
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: creds,
      });

      expect(target).toBeDefined();
      expect(target.name).toBe('mcp-target');
      expect(target.gateway).toBe(gateway);
      expect(target.credentialProviderConfigurations).toEqual(creds);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
    });

    test('Should not wire default credentials when empty array is provided', () => {
      const target = gateway.addMcpServerTarget('McpTarget', {
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [],
      });

      // MCP server treats empty array as "no credentials"
      expect(target.credentialProviderConfigurations).toBeUndefined();
    });
  });

  describe('addApiGatewayTarget', () => {
    test('Should create an API Gateway target with tool configuration', () => {
      const restApi = new apigateway.RestApi(stack, 'RestApi', {
        restApiName: 'test-api',
        deployOptions: { stageName: 'prod' },
      });
      restApi.root.addResource('test').addMethod('GET');

      const target = gateway.addApiGatewayTarget('ApiGwTarget', {
        gatewayTargetName: 'apigw-target',
        restApi: restApi,
        stage: 'prod',
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/test',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
      });

      expect(target).toBeDefined();
      expect(target.name).toBe('apigw-target');
      expect(target.gateway).toBe(gateway);

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
    });
  });
});
