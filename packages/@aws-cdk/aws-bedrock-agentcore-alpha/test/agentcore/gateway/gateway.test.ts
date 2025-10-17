/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Gateway } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/gateway';
import { GatewayExceptionLevel } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/gateway-base';
import { GatewayAuthorizer } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/inbound-auth/authorizer';
import { ApiKeyCredentialLocation } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/outbound-auth/api-key';
import { GatewayCredentialProvider } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/outbound-auth/credential-provider';
import { McpProtocolConfiguration, MCPProtocolVersion, McpGatewaySearchType } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/protocol';
import { ApiSchema } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/targets/target';
import { LambdaTargetConfiguration } from '../../../../aws-bedrock-agentcore-alpha/agentcore/gateway/targets/target-configuration';

describe('Gateway Core Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create Gateway with default configuration', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });

    expect(gateway.name).toBe('test-gateway');
    expect(gateway.gatewayId).toBeDefined();
    expect(gateway.gatewayArn).toBeDefined();

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::Gateway', 1);
    template.resourceCountIs('AWS::Cognito::UserPool', 1);
  });

  test('Should create Gateway with custom protocol', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      protocolConfiguration: new McpProtocolConfiguration({
        instructions: 'Use this gateway for testing',
        searchType: McpGatewaySearchType.SEMANTIC,
        supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway',
      ProtocolType: 'MCP',
    });
  });

  test('Should create Gateway with custom JWT authorizer', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      authorizerConfiguration: GatewayAuthorizer.usingCustomJwt({
        discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
        allowedAudience: ['my-app'],
        allowedClients: ['client-123'],
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      AuthorizerType: 'CUSTOM_JWT',
    });
  });

  test('Should create Gateway with KMS encryption', () => {
    const key = new kms.Key(stack, 'TestKey');

    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      kmsKey: key,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      KmsKeyArn: Match.anyValue(),
    });
  });

  test('Should validate gateway name pattern', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', { gatewayName: 'test_gateway' });
    }).toThrow(/Gateway name must contain only alphanumeric characters and hyphens/);
  });

  test('Should validate description length', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: 'test-gateway',
        description: 'a'.repeat(201),
      });
    }).toThrow();
  });

  test('Should grant read permissions', () => {
    const gateway = new Gateway(stack, 'TestGateway', { gatewayName: 'test-gateway' });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    gateway.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['bedrock-agentcore:GetGateway']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should create Gateway with tags', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      tags: { Environment: 'Test' },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Tags: { Environment: 'Test' },
    });
  });
});

describe('Gateway Add Target Methods Tests', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
  });

  test('Should add Lambda target using addLambdaTarget method', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = gateway.addLambdaTarget('TestTarget', {
      targetName: 'added-lambda-target',
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.name).toBe('added-lambda-target');
    expect(target.targetId).toBeDefined();

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should add OpenAPI target using addOpenApiTarget method', () => {
    const apiSchema = ApiSchema.fromInline('openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0');

    const target = gateway.addOpenApiTarget('TestTarget', {
      targetName: 'added-openapi-target',
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.apiKey({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          credentialLocation: ApiKeyCredentialLocation.queryParameter(),
        }),
      ],
    });

    expect(target.name).toBe('added-openapi-target');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should add Smithy target using addSmithyTarget method', () => {
    const smithyModel = ApiSchema.fromInline('{ "smithy": "1.0" }');

    const target = gateway.addSmithyTarget('TestTarget', {
      targetName: 'added-smithy-target',
      smithyModel: smithyModel,
    });

    expect(target.name).toBe('added-smithy-target');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });
});

describe('Gateway Metrics Tests', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
  });

  test('Should create invocations metric', () => {
    const metric = gateway.metricInvocations();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Invocations');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create throttles metric', () => {
    const metric = gateway.metricThrottles();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Throttles');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create system errors metric', () => {
    const metric = gateway.metricSystemErrors();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('SystemErrors');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create user errors metric', () => {
    const metric = gateway.metricUserErrors();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('UserErrors');
    expect(metric.statistic).toBe('Sum');
  });

  test('Should create latency metric', () => {
    const metric = gateway.metricLatency();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Latency');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create duration metric', () => {
    const metric = gateway.metricDuration();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Duration');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create target execution time metric', () => {
    const metric = gateway.metricTargetExecutionTime();

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('TargetExecutionTime');
    expect(metric.statistic).toBe('Average');
  });

  test('Should create target type metric', () => {
    const metric = gateway.metricTargetType('Lambda');

    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('TargetType');
    expect(metric.statistic).toBe('Sum');
  });
});

describe('Gateway Target Core Tests', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      authorizerConfiguration: GatewayAuthorizer.usingCustomJwt({
        discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
        allowedAudience: ['my-app'],
      }),
    });
  });

  test('Should create Lambda target using convenience method', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = GatewayTarget.forLambda(stack, 'TestTarget', {
      targetName: 'test-lambda-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.name).toBe('test-lambda-target');
    expect(target.targetId).toBeDefined();

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create OpenAPI target using convenience method', () => {
    const apiSchema = ApiSchema.fromInline('openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0');

    const target = GatewayTarget.forOpenApi(stack, 'TestTarget', {
      targetName: 'test-openapi-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.apiKey({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          credentialLocation: ApiKeyCredentialLocation.header(),
        }),
      ],
    });

    expect(target.name).toBe('test-openapi-target');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create Smithy target using convenience method', () => {
    const smithyModel = ApiSchema.fromInline('{ "smithy": "1.0" }');

    const target = GatewayTarget.forSmithy(stack, 'TestTarget', {
      targetName: 'test-smithy-target',
      gateway: gateway,
      smithyModel: smithyModel,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.oauth({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.name).toBe('test-smithy-target');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should use IAM role credential by default for Lambda', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = GatewayTarget.forLambda(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.credentialProviderConfigurations).toHaveLength(1);
    expect(target.credentialProviderConfigurations[0].credentialProviderType).toBe('GATEWAY_IAM_ROLE');
  });

  test('Should grant Lambda invoke permissions', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    GatewayTarget.forLambda(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should create target with S3 schema', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'test-bucket');
    const apiSchema = ApiSchema.fromS3File(bucket, 'schemas/test-api.yaml');

    GatewayTarget.forOpenApi(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.apiKey({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create target using direct constructor', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = new GatewayTarget(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      targetConfiguration: LambdaTargetConfiguration.create(fn, toolSchema),
    });

    expect(target.name).toBe('test-target');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create multiple targets for same gateway', () => {
    const fn1 = new lambda.Function(stack, 'Fn1', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const fn2 = new lambda.Function(stack, 'Fn2', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    GatewayTarget.forLambda(stack, 'Target1', {
      targetName: 'target-1',
      gateway: gateway,
      lambdaFunction: fn1,
      toolSchema: toolSchema,
    });

    GatewayTarget.forLambda(stack, 'Target2', {
      targetName: 'target-2',
      gateway: gateway,
      lambdaFunction: fn2,
      toolSchema: toolSchema,
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 2);
  });

  test('Should validate target name', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    expect(() => {
      GatewayTarget.forLambda(stack, 'TestTarget', {
        targetName: '',
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
  });

  test('Should validate target description length', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    expect(() => {
      GatewayTarget.forLambda(stack, 'TestTarget', {
        targetName: 'test-target',
        description: 'a'.repeat(201),
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow(/must be between 1 and 200 characters/);
  });

  test('Should grant target read permissions', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = GatewayTarget.forLambda(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    target.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetGatewayTarget',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should grant target manage permissions', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const target = GatewayTarget.forLambda(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    target.grantManage(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:CreateGatewayTarget',
              'bedrock-agentcore:UpdateGatewayTarget',
              'bedrock-agentcore:DeleteGatewayTarget',
            ]),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should create target with API Key in header', () => {
    const apiSchema = ApiSchema.fromInline('openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0');

    GatewayTarget.forOpenApi(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.apiKey({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          credentialLocation: ApiKeyCredentialLocation.header(),
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create target with OAuth provider', () => {
    const smithyModel = ApiSchema.fromInline('{ "smithy": "1.0" }');

    GatewayTarget.forSmithy(stack, 'TestTarget', {
      targetName: 'test-target',
      gateway: gateway,
      smithyModel: smithyModel,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.oauth({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
          scopes: ['read'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });
});

describe('Credential Provider Tests', () => {
  // No stack needed for these tests since they test static methods

  test('Should create API Key credential location with header', () => {
    const location = ApiKeyCredentialLocation.header({
      credentialParameterName: 'X-Custom-Key',
      credentialPrefix: 'Custom ',
    });

    expect(location.credentialParameterName).toBe('X-Custom-Key');
    expect(location.credentialPrefix).toBe('Custom ');
    expect(location.credentialLocationType).toBe('HEADER');
  });

  test('Should create API Key credential location with query parameter', () => {
    const location = ApiKeyCredentialLocation.queryParameter({
      credentialParameterName: 'apiKey',
    });

    expect(location.credentialParameterName).toBe('apiKey');
    expect(location.credentialPrefix).toBeUndefined();
    expect(location.credentialLocationType).toBe('QUERY_PARAMETER');
  });

  test('Should use default values for header location', () => {
    const location = ApiKeyCredentialLocation.header();

    expect(location.credentialParameterName).toBe('Authorization');
    expect(location.credentialPrefix).toBe('Bearer ');
    expect(location.credentialLocationType).toBe('HEADER');
  });

  test('Should use default values for query parameter location', () => {
    const location = ApiKeyCredentialLocation.queryParameter();

    expect(location.credentialParameterName).toBe('api_key');
    expect(location.credentialPrefix).toBeUndefined();
    expect(location.credentialLocationType).toBe('QUERY_PARAMETER');
  });

  test('Should create OAuth credential provider with custom parameters', () => {
    const provider = GatewayCredentialProvider.oauth({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
      scopes: ['read', 'write'],
      customParameters: {
        audience: 'https://api.example.com',
        grant_type: 'authorization_code',
      },
    });

    expect(provider.credentialProviderType).toBe('OAUTH');
    expect((provider as any).scopes).toEqual(['read', 'write']);
    expect((provider as any).customParameters).toEqual({
      audience: 'https://api.example.com',
      grant_type: 'authorization_code',
    });
  });

  test('Should create IAM role credential provider', () => {
    const provider = GatewayCredentialProvider.iamRole();

    expect(provider.credentialProviderType).toBe('GATEWAY_IAM_ROLE');
  });

  // Tests removed - testing private implementation details
  // The credential providers are already tested through the Gateway and Target tests
});

describe('Schema Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create ToolSchema with complex nested structure', () => {
    const schema = ToolSchema.fromInline([
      {
        name: 'complex_tool',
        description: 'A complex tool with nested properties',
        inputSchema: {
          type: SchemaDefinitionType.OBJECT,
          properties: {
            user: {
              type: SchemaDefinitionType.OBJECT,
              properties: {
                name: { type: SchemaDefinitionType.STRING },
                age: { type: SchemaDefinitionType.NUMBER },
                active: { type: SchemaDefinitionType.BOOLEAN },
              },
              required: ['name'],
            },
            items: {
              type: SchemaDefinitionType.ARRAY,
              items: {
                type: SchemaDefinitionType.OBJECT,
                properties: {
                  id: { type: SchemaDefinitionType.STRING },
                  quantity: { type: SchemaDefinitionType.INTEGER },
                },
              },
            },
          },
          required: ['user'],
        },
        outputSchema: {
          type: SchemaDefinitionType.OBJECT,
          properties: {
            success: { type: SchemaDefinitionType.BOOLEAN },
            message: { type: SchemaDefinitionType.STRING },
          },
        },
      },
    ]);

    // Just verify the schema object is created successfully
    expect(schema).toBeDefined();
  });

  test('Should create ApiSchema from S3 with version', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'test-bucket');
    const schema = ApiSchema.fromS3File(bucket, 'schemas/api.yaml', 'v1.2.3');

    // Just verify the schema object is created successfully
    expect(schema).toBeDefined();
  });

  test('Should create ApiSchema from inline content', () => {
    const openApiSpec = `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
      responses:
        '200':
          description: Success
`;
    const schema = ApiSchema.fromInline(openApiSpec);

    // Just verify the schema object is created successfully
    expect(schema).toBeDefined();
  });
});

describe('Authorizer Configuration Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create Cognito authorizer with multiple clients', () => {
    const userPool = new cdk.aws_cognito.UserPool(stack, 'TestUserPool', {
      userPoolName: 'test-pool',
    });

    const client1 = userPool.addClient('Client1');
    const client2 = userPool.addClient('Client2');

    const authorizer = GatewayAuthorizer.usingCognito({
      userPool: userPool,
      allowedClients: [client1, client2],
    });

    // Just verify the authorizer is created with correct type
    expect(authorizer.authorizerType).toBe('CUSTOM_JWT'); // Cognito creates a JWT authorizer
  });

  test('Should create custom JWT authorizer with all options', () => {
    const authorizer = GatewayAuthorizer.usingCustomJwt({
      discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
      allowedAudience: ['app1', 'app2', 'app3'],
      allowedClients: ['client1', 'client2'],
    });

    // Just verify the authorizer is created with correct type
    expect(authorizer.authorizerType).toBe('CUSTOM_JWT');
  });
});

describe('Gateway Error Handling Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should throw error for invalid gateway name with special characters', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: 'test@gateway!',
      });
    }).toThrow(/Gateway name must contain only alphanumeric characters and hyphens/);
  });

  test('Should throw error for empty gateway name', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: '',
      });
    }).toThrow();
  });

  test('Should throw error for gateway name exceeding max length', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: 'a'.repeat(101),
      });
    }).toThrow();
  });

  test('Should throw error for invalid target name pattern', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });

    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    expect(() => {
      GatewayTarget.forLambda(stack, 'TestTarget', {
        targetName: 'test@target!',
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
  });
});

describe('Gateway Integration Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create complete gateway setup with multiple targets', () => {
    // Create gateway with full configuration
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'integration-test-gateway',
      description: 'Integration test gateway',
      protocolConfiguration: new McpProtocolConfiguration({
        instructions: 'Test instructions',
        searchType: McpGatewaySearchType.SEMANTIC,
        supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
      }),
      exceptionLevel: GatewayExceptionLevel.DEBUG,
      tags: {
        Environment: 'Test',
        Owner: 'TestTeam',
      },
    });

    // Add Lambda target
    const lambdaFn = new lambda.Function(stack, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'lambda_tool',
      description: 'Lambda tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    gateway.addLambdaTarget('LambdaTarget', {
      targetName: 'lambda-target',
      lambdaFunction: lambdaFn,
      toolSchema: toolSchema,
    });

    // Add OpenAPI target
    const apiSchema = ApiSchema.fromInline('openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0');

    gateway.addOpenApiTarget('OpenApiTarget', {
      targetName: 'openapi-target',
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.apiKey({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          credentialLocation: ApiKeyCredentialLocation.header(),
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::Gateway', 1);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 2);
  });

  test('Should handle gateway with all optional parameters', () => {
    const key = new kms.Key(stack, 'TestKey');
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    const userPool = new cdk.aws_cognito.UserPool(stack, 'TestUserPool');
    const client = userPool.addClient('TestClient');

    new Gateway(stack, 'TestGateway', {
      gatewayName: 'full-config-gateway',
      description: 'Gateway with all optional parameters',
      protocolConfiguration: new McpProtocolConfiguration({
        instructions: 'Complete configuration',
        searchType: McpGatewaySearchType.SEMANTIC,
        supportedVersions: [MCPProtocolVersion.MCP_2025_03_26],
      }),
      authorizerConfiguration: GatewayAuthorizer.usingCognito({
        userPool: userPool,
        allowedClients: [client],
      }),
      exceptionLevel: GatewayExceptionLevel.DEBUG,
      kmsKey: key,
      role: role,
      tags: {
        Test: 'true',
        Version: '1.0',
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'full-config-gateway',
      Description: 'Gateway with all optional parameters',
      ExceptionLevel: 'DEBUG',
      KmsKeyArn: Match.anyValue(),
      RoleArn: Match.anyValue(),
      Tags: {
        Test: 'true',
        Version: '1.0',
      },
    });
  });
});
