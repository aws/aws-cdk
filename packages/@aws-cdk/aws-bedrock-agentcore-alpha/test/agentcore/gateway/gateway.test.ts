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
import { Gateway } from '../../../lib';
import { GatewayExceptionLevel } from '../../../lib/gateway/gateway-base';
import { GatewayAuthorizer } from '../../../lib/gateway/inbound-auth/authorizer';
import { ApiKeyCredentialLocation } from '../../../lib/gateway/outbound-auth/api-key';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { McpProtocolConfiguration, MCPProtocolVersion, McpGatewaySearchType } from '../../../lib/gateway/protocol';
import { ApiSchema } from '../../../lib/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../lib/gateway/targets/target';
import { LambdaTargetConfiguration, McpServerTargetConfiguration, OpenApiTargetConfiguration, SmithyTargetConfiguration } from '../../../lib/gateway/targets/target-configuration';

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

  test('Should create Gateway with custom role', () => {
    const role = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      role: role,
    });

    expect(gateway.role).toBe(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      RoleArn: Match.anyValue(),
    });
  });

  test('Should grant gateway invoke permissions', () => {
    const gateway = new Gateway(stack, 'TestGateway', { gatewayName: 'test-gateway' });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    gateway.grantInvoke(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:InvokeGateway',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should create Gateway with DEBUG exception level', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      exceptionLevel: GatewayExceptionLevel.DEBUG,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      ExceptionLevel: 'DEBUG',
    });
  });

  test('Should create Gateway without exception level', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });

    const template = Template.fromStack(stack);
    const resources = template.findResources('AWS::BedrockAgentCore::Gateway');
    const resourceProps = Object.values(resources)[0].Properties;

    // ExceptionLevel should not be set when not provided
    expect(resourceProps.ExceptionLevel).toBeUndefined();
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
      gatewayTargetName: 'added-lambda-target',
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.name).toBe('added-lambda-target');
    expect(target.targetId).toBeDefined();

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should add OpenAPI target using addOpenApiTarget method', () => {
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    const target = gateway.addOpenApiTarget('TestTarget', {
      gatewayTargetName: 'added-openapi-target',
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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
      gatewayTargetName: 'added-smithy-target',
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
      gatewayTargetName: 'test-lambda-target',
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
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    const target = GatewayTarget.forOpenApi(stack, 'TestTarget', {
      gatewayTargetName: 'test-openapi-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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
      gatewayTargetName: 'test-smithy-target',
      gateway: gateway,
      smithyModel: smithyModel,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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
      gatewayTargetName: 'test-target',
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.credentialProviderConfigurations).toHaveLength(1);
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
      gatewayTargetName: 'test-target',
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
      gatewayTargetName: 'test-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',

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
      gatewayTargetName: 'test-target',
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
      gatewayTargetName: 'target-1',
      gateway: gateway,
      lambdaFunction: fn1,
      toolSchema: toolSchema,
    });

    GatewayTarget.forLambda(stack, 'Target2', {
      gatewayTargetName: 'target-2',
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
        gatewayTargetName: '',
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
        gatewayTargetName: 'test-target',
        description: 'a'.repeat(201),
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
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
      gatewayTargetName: 'test-target',
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
      gatewayTargetName: 'test-target',
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
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    GatewayTarget.forOpenApi(stack, 'TestTarget', {
      gatewayTargetName: 'test-target',
      gateway: gateway,
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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
      gatewayTargetName: 'test-target',
      gateway: gateway,
      smithyModel: smithyModel,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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
    const provider = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
      secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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

  test('Should create OAuth credential provider with only scopes', () => {
    const provider = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
      secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
      scopes: ['read'],
    });

    expect(provider.credentialProviderType).toBe('OAUTH');
    expect((provider as any).scopes).toEqual(['read']);
  });

  test('Should create OAuth credential provider with minimal scopes', () => {
    const provider = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
      secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
      scopes: [],
    });

    expect(provider.credentialProviderType).toBe('OAUTH');
    expect((provider as any).scopes).toEqual([]);
  });

  test('Should create OAuth credential provider with empty arrays', () => {
    const provider = GatewayCredentialProvider.fromOauthIdentityArn({
      providerArn: 'arn:aws:bedrock:us-east-1:123456789012:oauth/test',
      secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
      scopes: [],
      customParameters: {},
    });

    expect(provider.credentialProviderType).toBe('OAUTH');
    expect((provider as any).scopes).toEqual([]);
    expect((provider as any).customParameters).toEqual({});
  });

  test('Should create IAM role credential provider', () => {
    const provider = GatewayCredentialProvider.fromIamRole();

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
    const openApiSpec = JSON.stringify({
      openapi: '3.0.3',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            summary: 'Test endpoint',
            operationId: 'testEndpoint',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    });
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

  test('Should create AWS IAM authorizer', () => {
    const authorizer = GatewayAuthorizer.usingAwsIam();

    // Just verify the authorizer is created with correct type
    expect(authorizer.authorizerType).toBe('AWS_IAM');
  });

  test('Should create Gateway with AWS IAM authorizer', () => {
    new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      authorizerConfiguration: GatewayAuthorizer.usingAwsIam(),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      AuthorizerType: 'AWS_IAM',
    });
  });

  test('Should create custom JWT authorizer with only allowedAudience', () => {
    const authorizer = GatewayAuthorizer.usingCustomJwt({
      discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
      allowedAudience: ['my-app'],
    });

    expect(authorizer.authorizerType).toBe('CUSTOM_JWT');
  });

  test('Should create custom JWT authorizer with only allowedClients', () => {
    const authorizer = GatewayAuthorizer.usingCustomJwt({
      discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
      allowedClients: ['client-123'],
    });

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
        gatewayTargetName: 'test@target!',
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
  });

  test('Should validate gateway name with hyphens at start', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: '-test-gateway',
      });
    }).toThrow(/Gateway name must contain only alphanumeric characters and hyphens/);
  });

  test('Should validate gateway name with consecutive hyphens', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: 'test--gateway',
      });
    }).toThrow(/Gateway name must contain only alphanumeric characters and hyphens/);
  });

  test('Should validate target name with spaces', () => {
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
        gatewayTargetName: 'test target',
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow(/Gateway target name must contain only alphanumeric characters and hyphens/);
  });

  test('Should allow empty description', () => {
    // Empty descriptions are allowed
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      description: '',
    });
    expect(gateway.description).toBe('');
  });

  test('Should create Gateway with valid single character name', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'a',
    });
    expect(gateway.name).toBe('a');
  });

  test('Should create Gateway with KMS key', () => {
    const key = new kms.Key(stack, 'TestKey');
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      kmsKey: key,
    });

    expect(gateway.kmsKey).toBe(key);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      KmsKeyArn: Match.anyValue(),
    });
  });

  test('Should create Gateway without KMS key', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });

    expect(gateway.kmsKey).toBeUndefined();

    const template = Template.fromStack(stack);
    const resources = template.findResources('AWS::BedrockAgentCore::Gateway');
    const resourceProps = Object.values(resources)[0].Properties;
    expect(resourceProps.KmsKeyArn).toBeUndefined();
  });

  test('Should create Gateway with KMS key and verify role permissions', () => {
    const key = new kms.Key(stack, 'TestKey2');
    new Gateway(stack, 'TestGateway2', {
      gatewayName: 'test-gateway2',
      kmsKey: key,
    });

    const template = Template.fromStack(stack);
    // Verify KMS permissions are added when KMS key is provided
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock-agentcore.amazonaws.com',
            },
          }),
        ]),
      },
    });
  });

  test('Should allow gateway name ending with hyphen', () => {
    // Gateway names ending with hyphen are allowed
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway-',
    });
    expect(gateway.name).toBe('test-gateway-');
  });

  test('Should grant manage permissions for gateway', () => {
    const gateway = new Gateway(stack, 'TestGateway', { gatewayName: 'test-gateway' });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    gateway.grantManage(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:CreateGateway',
              'bedrock-agentcore:UpdateGateway',
              'bedrock-agentcore:DeleteGateway',
            ]),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should validate target name exceeding max length', () => {
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
        gatewayTargetName: 'a'.repeat(101),
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
  });

  test('Should validate empty target name', () => {
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
        gatewayTargetName: '',
        gateway: gateway,
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });
    }).toThrow();
  });

  test('Should validate gateway name with underscore', () => {
    expect(() => {
      new Gateway(stack, 'TestGateway', {
        gatewayName: 'test_gateway',
      });
    }).toThrow(/Gateway name must contain only alphanumeric characters and hyphens/);
  });
});

describe('Tool Schema Error Cases', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('AssetToolSchema should throw error when rendering without binding', () => {
    const toolSchema = ToolSchema.fromLocalAsset('path/to/schema.json');

    // Attempt to render without binding should throw
    expect(() => {
      (toolSchema as any)._render();
    }).toThrow('ToolSchema must be bound to a scope before rendering. Call bind() first.');
  });

  test('AssetToolSchema should throw error when granting permissions without binding', () => {
    const toolSchema = ToolSchema.fromLocalAsset('path/to/schema.json');
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Attempt to grant permissions without binding should throw
    expect(() => {
      (toolSchema as any).grantPermissionsToRole(role);
    }).toThrow('ToolSchema must be bound to a scope before rendering. Call bind() first.');
  });

  test('InlineToolSchema bind method should handle scope parameter', () => {
    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'Test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    // Should not throw when binding with scope
    expect(() => {
      (toolSchema as any).bind(stack);
    }).not.toThrow();

    // Should not throw when binding with null/undefined
    expect(() => {
      (toolSchema as any).bind(null);
    }).not.toThrow();
  });

  test('S3ToolSchema bind method should handle scope parameter', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'test-bucket');
    const toolSchema = ToolSchema.fromS3File(bucket, 'schema.json');

    // Should not throw when binding with scope
    expect(() => {
      (toolSchema as any).bind(stack);
    }).not.toThrow();

    // Should not throw when binding with null/undefined
    expect(() => {
      (toolSchema as any).bind(null);
    }).not.toThrow();
  });

  test('S3ToolSchema should render with bucketOwnerAccountId when provided', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'test-bucket');
    const toolSchema = ToolSchema.fromS3File(bucket, 'schema.json', '123456789012');

    const rendered = (toolSchema as any)._render();

    expect(rendered.s3.bucketOwnerAccountId).toBe('123456789012');
  });
});

describe('Gateway Import Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should import Gateway from attributes', () => {
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    const imported = Gateway.fromGatewayAttributes(stack, 'ImportedGateway', {
      gatewayArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway-id',
      gatewayId: 'test-gateway-id',
      gatewayName: 'test-gateway',
      role: role,
    });

    expect(imported.gatewayArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway-id');
    expect(imported.gatewayId).toBe('test-gateway-id');
    expect(imported.name).toBe('test-gateway');
    expect(imported.role).toBe(role);
  });
});

describe('Gateway Target Import Tests', () => {
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

  test('Should import GatewayTarget from attributes', () => {
    const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
      targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/gateway-id/target/target-id',
      targetId: 'target-id',
      gatewayTargetName: 'test-target',
      gateway: gateway,
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });

    expect(imported.targetArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/gateway-id/target/target-id');
    expect(imported.targetId).toBe('target-id');
    expect(imported.name).toBe('test-target');
    expect(imported.gateway).toBe(gateway);
    expect(imported.status).toBe('ACTIVE');
    expect(imported.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(imported.updatedAt).toBe('2024-01-01T00:00:00Z');
  });

  test('Should grant permissions to imported GatewayTarget', () => {
    const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
      targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/gateway-id/target/target-id',
      targetId: 'target-id',
      gatewayTargetName: 'test-target',
      gateway: gateway,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    imported.grantRead(role);
    imported.grantManage(role);

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
});

describe('Gateway Validation Edge Cases', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should handle Token.isUnresolved for description validation', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
      description: cdk.Lazy.string({ produce: () => 'lazy-description' }),
    });

    expect(gateway.description).toBeDefined();
  });

  test('Should handle Token.isUnresolved for target description validation', () => {
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

    const target = GatewayTarget.forLambda(stack, 'TestTarget', {
      gatewayTargetName: 'test-target',
      description: cdk.Lazy.string({ produce: () => 'lazy-description' }),
      gateway: gateway,
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.description).toBeDefined();
  });

  test('Should handle Gateway with Lazy string for name', () => {
    // This should NOT throw since CDK Tokens are handled
    const gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: cdk.Lazy.string({ produce: () => 'lazy-gateway-name' }),
    });

    expect(gateway.name).toBeDefined();
  });
});

describe('Gateway Schema Binding Tests', () => {
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

  test('Should bind Lambda target configuration properly', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'complex_tool',
      description: 'A complex tool',
      inputSchema: {
        type: SchemaDefinitionType.OBJECT,
        properties: {
          test: { type: SchemaDefinitionType.STRING },
        },
      },
    }]);

    const config = LambdaTargetConfiguration.create(fn, toolSchema);
    const boundConfig = config.bind(stack, gateway);

    expect(boundConfig).toBeDefined();
    expect(config.targetType).toBe('LAMBDA');
  });

  test('Should bind OpenAPI target configuration properly', () => {
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));
    const config = OpenApiTargetConfiguration.create(apiSchema);
    const boundConfig = config.bind(stack, gateway);

    expect(boundConfig).toBeDefined();
    expect(config.targetType).toBe('OPENAPI_SCHEMA');
  });

  test('Should bind Smithy target configuration properly', () => {
    const smithyModel = ApiSchema.fromInline('{ "smithy": "1.0" }');
    const config = SmithyTargetConfiguration.create(smithyModel);
    const boundConfig = config.bind(stack, gateway);

    expect(boundConfig).toBeDefined();
    expect(config.targetType).toBe('SMITHY_MODEL');
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
      gatewayTargetName: 'lambda-target',
      lambdaFunction: lambdaFn,
      toolSchema: toolSchema,
    });

    // Add OpenAPI target
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    gateway.addOpenApiTarget('OpenApiTarget', {
      gatewayTargetName: 'openapi-target',
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
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

describe('MCP Server Target Core Tests', () => {
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

  test('Should create MCP server target using addMcpServerTarget method', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read', 'write'],
        }),
      ],
    });

    expect(target.name).toBe('test-mcp-server');
    expect(target.targetId).toBeDefined();
    expect(target.targetType).toBe('MCP_SERVER');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create MCP server target using GatewayTarget.forMcpServer static method', () => {
    const target = GatewayTarget.forMcpServer(stack, 'TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      gateway: gateway,
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.name).toBe('test-mcp-server');
    expect(target.targetType).toBe('MCP_SERVER');

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 1);
  });

  test('Should create MCP server target with description', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      description: 'External MCP server for tool integration',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.description).toBe('External MCP server for tool integration');
  });

  test('Should verify CloudFormation structure for MCP server target', () => {
    gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'test-mcp-server',
      GatewayIdentifier: Match.anyValue(),
    });
  });
});

describe('MCP Server Target Validation Tests', () => {
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

  test('Should reject HTTP endpoints - must use HTTPS', () => {
    expect(() => {
      gateway.addMcpServerTarget('TestMcpTarget', {
        gatewayTargetName: 'test-mcp-server',
        endpoint: 'http://my-mcp-server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromOauthIdentityArn({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
            scopes: ['read'],
          }),
        ],
      });
    }).toThrow(/MCP server endpoint must use HTTPS protocol/);
  });

  test('Should accept valid HTTPS endpoints', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
  });

  test('Should reject endpoints with spaces', () => {
    expect(() => {
      gateway.addMcpServerTarget('TestMcpTarget', {
        gatewayTargetName: 'test-mcp-server',
        endpoint: 'https://my mcp server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromOauthIdentityArn({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
            scopes: ['read'],
          }),
        ],
      });
    }).toThrow(/MCP server endpoint contains characters that should be URL-encoded/);
  });

  test('Should reject endpoints with < character', () => {
    expect(() => {
      gateway.addMcpServerTarget('TestMcpTarget', {
        gatewayTargetName: 'test-mcp-server',
        endpoint: 'https://my-mcp-server.example.com/<test>',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromOauthIdentityArn({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
            scopes: ['read'],
          }),
        ],
      });
    }).toThrow(/MCP server endpoint contains characters that should be URL-encoded/);
  });

  test('Should reject endpoints with > character', () => {
    expect(() => {
      gateway.addMcpServerTarget('TestMcpTarget', {
        gatewayTargetName: 'test-mcp-server',
        endpoint: 'https://my-mcp-server.example.com/>test',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromOauthIdentityArn({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
            scopes: ['read'],
          }),
        ],
      });
    }).toThrow(/MCP server endpoint contains characters that should be URL-encoded/);
  });

  test('Should reject empty endpoint', () => {
    expect(() => {
      gateway.addMcpServerTarget('TestMcpTarget', {
        gatewayTargetName: 'test-mcp-server',
        endpoint: '',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromOauthIdentityArn({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
            scopes: ['read'],
          }),
        ],
      });
    }).toThrow(/MCP server endpoint must use HTTPS protocol/);
  });

  test('Should accept HTTPS endpoint with port', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com:8443',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
  });

  test('Should accept HTTPS endpoint with path', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com/api/v1/mcp',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
  });

  test('Should handle Token.isUnresolved for endpoint validation', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: cdk.Lazy.string({ produce: () => 'https://dynamic-server.example.com' }),
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
  });
});

describe('MCP Server Target Permission Tests', () => {
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

  test('Should grant OAuth2 permissions to Gateway role automatically', () => {
    gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-oauth-secret',
          scopes: ['read', 'write'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    // OAuth provider grants combine all permissions into a single statement
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetResourceOauth2Token',
              'bedrock-agentcore:GetWorkloadAccessToken',
              'secretsmanager:GetSecretValue',
            ]),
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.stringLikeRegexp('.*token-vault.*oauth2credentialprovider.*'),
              Match.stringLikeRegexp('.*secretsmanager.*secret.*'),
            ]),
          }),
        ]),
      },
    });
  });

  test('Should grant Secrets Manager permissions for OAuth2', () => {
    gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-oauth-secret',
          scopes: ['read'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    // Verify secrets manager permissions are granted (as part of consolidated statement)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue']),
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.stringLikeRegexp('.*secretsmanager.*secret.*test-oauth-secret'),
            ]),
          }),
        ]),
      },
    });
  });

  test('Should grant read permissions on MCP server target', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
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

  test('Should grant manage permissions on MCP server target', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
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
});

describe('MCP Server Target Configuration Tests', () => {
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

  test('Should create McpServerTargetConfiguration with factory method', () => {
    const config = McpServerTargetConfiguration.create('https://my-mcp-server.example.com');

    expect(config.targetType).toBe('MCP_SERVER');
    expect(config.endpoint).toBe('https://my-mcp-server.example.com');
  });

  test('Should bind McpServerTargetConfiguration successfully', () => {
    const config = McpServerTargetConfiguration.create('https://my-mcp-server.example.com');
    const boundConfig = config.bind(stack, gateway);

    expect(boundConfig.bound).toBe(true);
  });

  test('Should render McpServerTargetConfiguration correctly', () => {
    const config = McpServerTargetConfiguration.create('https://my-mcp-server.example.com');
    const rendered = config._render();

    expect(rendered).toEqual({
      mcp: {
        mcpServer: {
          endpoint: 'https://my-mcp-server.example.com',
        },
      },
    });
  });

  test('Should validate HTTPS requirement in McpServerTargetConfiguration', () => {
    expect(() => {
      McpServerTargetConfiguration.create('http://insecure-server.example.com');
    }).toThrow(/MCP server endpoint must use HTTPS protocol/);
  });

  test('Should create multiple MCP server targets on same gateway', () => {
    gateway.addMcpServerTarget('McpTarget1', {
      gatewayTargetName: 'mcp-server-1',
      endpoint: 'https://server1.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test1',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret-1',
          scopes: ['read'],
        }),
      ],
    });

    gateway.addMcpServerTarget('McpTarget2', {
      gatewayTargetName: 'mcp-server-2',
      endpoint: 'https://server2.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test2',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret-2',
          scopes: ['write'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 2);
  });

  test('Should create gateway with mixed target types including MCP server', () => {
    // Add Lambda target
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

    gateway.addLambdaTarget('LambdaTarget', {
      gatewayTargetName: 'lambda-target',
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    // Add MCP server target
    gateway.addMcpServerTarget('McpTarget', {
      gatewayTargetName: 'mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::GatewayTarget', 2);
  });

  test('Should accept HTTPS endpoint with query parameters', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com/api?version=1',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read'],
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
  });

  test('Should create MCP server target with OAuth custom parameters', () => {
    const target = gateway.addMcpServerTarget('TestMcpTarget', {
      gatewayTargetName: 'test-mcp-server',
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read', 'write'],
          customParameters: {
            audience: 'https://my-mcp-server.example.com',
            grant_type: 'client_credentials',
          },
        }),
      ],
    });

    expect(target.targetType).toBe('MCP_SERVER');
    expect(target.credentialProviderConfigurations).toHaveLength(1);
  });
});

describe('Optional Physical Names', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create Gateway without gatewayName (auto-generated)', () => {
    const gateway = new Gateway(stack, 'TestGateway', {
    });

    expect(gateway.name).toBeDefined();
    expect(gateway.name).not.toBe('');
  });
});

describe('Gateway Target Optional Physical Names', () => {
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

  test('Should create Lambda target without gatewayTargetName (auto-generated)', () => {
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
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });

    expect(target.name).toBeDefined();
    expect(target.name).not.toBe('');
  });

  test('Should create OpenAPI target without gatewayTargetName (auto-generated)', () => {
    const apiSchema = ApiSchema.fromInline(JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    const target = gateway.addOpenApiTarget('TestTarget', {
      apiSchema: apiSchema,
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromApiKeyIdentityArn({
          providerArn: 'arn:aws:bedrock:us-east-1:123456789012:api-key/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          credentialLocation: ApiKeyCredentialLocation.header(),
        }),
      ],
    });

    expect(target.name).toBeDefined();
    expect(target.name).not.toBe('');
  });

  test('Should create Smithy target without gatewayTargetName (auto-generated)', () => {
    const smithyModel = ApiSchema.fromInline('{ "smithy": "1.0" }');

    const target = gateway.addSmithyTarget('TestTarget', {
      smithyModel: smithyModel,
    });

    expect(target.name).toBeDefined();
    expect(target.name).not.toBe('');
  });

  test('Should create MCP server target without gatewayTargetName (auto-generated)', () => {
    const target = gateway.addMcpServerTarget('TestTarget', {
      endpoint: 'https://my-mcp-server.example.com',
      credentialProviderConfigurations: [
        GatewayCredentialProvider.fromOauthIdentityArn({
          providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc/oauth2credentialprovider/test',
          secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          scopes: ['read', 'write'],
        }),
      ],
    });

    expect(target.name).toBeDefined();
    expect(target.name).not.toBe('');
  });
});
