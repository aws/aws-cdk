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

import * as path from 'path';
import { Template, Match } from '../../../../assertions';
import * as apigateway from '../../../../aws-apigateway';
import * as iam from '../../../../aws-iam';
import * as lambda from '../../../../aws-lambda';
import * as s3 from '../../../../aws-s3';
import * as cdk from '../../../../core';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import {
  ApiSchema,
  S3ApiSchema,
} from '../../../lib/gateway/targets/schema/api-schema';
import {
  AssetToolSchema,
  S3ToolSchema,
  SchemaDefinitionType,
  ToolSchema,
} from '../../../lib/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../lib/gateway/targets/target';
import {
  ApiGatewayTargetConfiguration,
  ApiGatewayHttpMethod,
  LambdaTargetConfiguration,
} from '../../../lib/gateway/targets/target-configuration';

describe('GatewayTarget Tests', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let restApi: apigateway.RestApi;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
    restApi = new apigateway.RestApi(stack, 'TestRestApi', {
      restApiName: 'test-api',
      deployOptions: { stageName: 'prod' },
    });
    restApi.root.addResource('test').addMethod('GET');
  });

  // These tests verify construct internal state (credentialProviderConfigurations array assignment).
  // CFN rendering of credential providers is covered by template assertions in gateway-coverage.test.ts.
  describe('Credential provider configuration by target type', () => {
    test('Should use default IAM role for Lambda target when no credentials provided', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = GatewayTarget.forLambda(stack, 'LambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      expect(target.credentialProviderConfigurations).toBeDefined();
      expect(target.credentialProviderConfigurations).toHaveLength(1);
    });

    test('Should use default IAM role for Smithy target when no credentials provided', () => {
      const smithyModel = ApiSchema.fromInline('{}');

      const target = GatewayTarget.forSmithy(stack, 'SmithyTarget', {
        gateway: gateway,
        gatewayTargetName: 'smithy-target',
        smithyModel: smithyModel,
      });

      expect(target.credentialProviderConfigurations).toBeDefined();
      expect(target.credentialProviderConfigurations).toHaveLength(1);
    });

    test('Should use undefined credentials for MCP Server target when no credentials provided', () => {
      const target = GatewayTarget.forMcpServer(stack, 'McpTarget', {
        gateway: gateway,
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [],
      });

      expect(target.credentialProviderConfigurations).toBeUndefined();
    });

    test('Should use undefined credentials for OpenAPI target when no credentials provided', () => {
      const schema = ApiSchema.fromInline(JSON.stringify({
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

      const target = GatewayTarget.forOpenApi(stack, 'OpenApiTarget', {
        gateway: gateway,
        gatewayTargetName: 'openapi-target',
        apiSchema: schema,
        validateOpenApiSchema: false,
      });

      expect(target.credentialProviderConfigurations).toBeUndefined();
    });

    test('Should use undefined credentials for API Gateway target when no credentials provided', () => {
      const target = GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
        gateway: gateway,
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

      expect(target.credentialProviderConfigurations).toBeUndefined();
    });

    test('Should use provided credentials for Lambda target', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const customCredentials = [GatewayCredentialProvider.fromIamRole()];

      const target = GatewayTarget.forLambda(stack, 'LambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
        credentialProviderConfigurations: customCredentials,
      });

      expect(target.credentialProviderConfigurations).toBe(customCredentials);
    });

    test('Should use provided credentials for MCP Server target', () => {
      const customCredentials = [GatewayCredentialProvider.fromIamRole()];

      const target = GatewayTarget.forMcpServer(stack, 'McpTarget', {
        gateway: gateway,
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: customCredentials,
      });

      expect(target.credentialProviderConfigurations).toBe(customCredentials);
    });

    test('Should use provided credentials for OpenAPI target', () => {
      const schema = ApiSchema.fromInline(JSON.stringify({
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

      const customCredentials = [GatewayCredentialProvider.fromIamRole()];

      const target = GatewayTarget.forOpenApi(stack, 'OpenApiTarget', {
        gateway: gateway,
        gatewayTargetName: 'openapi-target',
        apiSchema: schema,
        validateOpenApiSchema: false,
        credentialProviderConfigurations: customCredentials,
      });

      expect(target.credentialProviderConfigurations).toBe(customCredentials);
    });

    test('Should use provided credentials for API Gateway target', () => {
      const customCredentials = [GatewayCredentialProvider.fromIamRole()];

      const target = GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
        gateway: gateway,
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
        credentialProviderConfigurations: customCredentials,
      });

      expect(target.credentialProviderConfigurations).toBe(customCredentials);
    });
  });

  describe('API Gateway target with metadata configuration', () => {
    test('Should create API Gateway target with metadata configuration', () => {
      GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
        gateway: gateway,
        gatewayTargetName: 'apigw-target-with-metadata',
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
        metadataConfiguration: {
          allowedQueryParameters: ['id', 'name'],
          allowedRequestHeaders: ['Authorization'],
          allowedResponseHeaders: ['X-Custom-Header'],
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'apigw-target-with-metadata',
        MetadataConfiguration: {
          AllowedQueryParameters: ['id', 'name'],
          AllowedRequestHeaders: ['Authorization'],
          AllowedResponseHeaders: ['X-Custom-Header'],
        },
      });
    });

    test('Should render full API Gateway target configuration in CFN', () => {
      GatewayTarget.forApiGateway(stack, 'FullApiGwTarget', {
        gateway: gateway,
        gatewayTargetName: 'full-apigw-target',
        restApi: restApi,
        stage: 'prod',
        apiGatewayToolConfiguration: {
          toolFilters: [
            { filterPath: '/users', methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST] },
          ],
          toolOverrides: [
            { name: 'getUser', path: '/users/{id}', method: ApiGatewayHttpMethod.GET },
          ],
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'full-apigw-target',
        TargetConfiguration: {
          Mcp: {
            ApiGateway: {
              RestApiId: { Ref: 'TestRestApiB7B4EFDA' },
              Stage: 'prod',
              ApiGatewayToolConfiguration: {
                ToolFilters: [
                  { FilterPath: '/users', Methods: ['GET', 'POST'] },
                ],
                ToolOverrides: [
                  { Name: 'getUser', Path: '/users/{id}', Method: 'GET' },
                ],
              },
            },
          },
        },
      });
    });

    test('Should render full Lambda target configuration in CFN', () => {
      const fn = new lambda.Function(stack, 'LambdaFn', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'get_user',
          description: 'Get a user',
          inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
        },
      ]);

      GatewayTarget.forLambda(stack, 'FullLambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'full-lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'full-lambda-target',
        TargetConfiguration: {
          Mcp: {
            Lambda: {
              LambdaArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('LambdaFn.*'), 'Arn'] },
              ToolSchema: { InlinePayload: [{ Name: 'get_user', Description: 'Get a user', InputSchema: { Type: 'object', Properties: {} } }] },
            },
          },
        },
      });
    });

    test('Should create API Gateway target without metadata configuration', () => {
      GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
        gateway: gateway,
        gatewayTargetName: 'apigw-target-no-metadata',
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

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'apigw-target-no-metadata',
        MetadataConfiguration: Match.absent(),
      });
    });

    test('Should not include metadata configuration for non-API Gateway targets', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      GatewayTarget.forLambda(stack, 'LambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'lambda-target',
        MetadataConfiguration: Match.absent(),
      });
    });
  });

  describe('GatewayTarget validation', () => {
    test('Should validate gateway target name pattern', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      expect(() => {
        GatewayTarget.forLambda(stack, 'InvalidTarget', {
          gateway: gateway,
          gatewayTargetName: 'invalid_target_name', // Underscore not allowed
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).toThrow(/Gateway target name must contain only alphanumeric characters and hyphens/);
    });

    test('Should validate gateway target name with hyphens only between characters', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      expect(() => {
        GatewayTarget.forLambda(stack, 'InvalidTarget', {
          gateway: gateway,
          gatewayTargetName: '-invalid', // Cannot start with hyphen
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).toThrow(/Gateway target name must contain only alphanumeric characters and hyphens/);
    });

    test('Should validate gateway target name max length', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const longName = 'a'.repeat(101);
      expect(() => {
        GatewayTarget.forLambda(stack, 'InvalidTarget', {
          gateway: gateway,
          gatewayTargetName: longName,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).toThrow(/Gateway target name/);
    });

    test('Should accept gateway target name at max length', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const maxName = 'a'.repeat(100);
      expect(() => {
        GatewayTarget.forLambda(stack, 'ValidTarget', {
          gateway: gateway,
          gatewayTargetName: maxName,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).not.toThrow();
    });

    test('Should validate description max length', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const longDesc = 'a'.repeat(201);
      expect(() => {
        GatewayTarget.forLambda(stack, 'InvalidTarget', {
          gateway: gateway,
          gatewayTargetName: 'test-target',
          description: longDesc,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).toThrow(/Gateway target description/);
    });

    test('Should accept description at max length', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const maxDesc = 'a'.repeat(200);
      expect(() => {
        GatewayTarget.forLambda(stack, 'ValidTarget', {
          gateway: gateway,
          gatewayTargetName: 'test-target',
          description: maxDesc,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based gateway target name', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const tokenName = cdk.Lazy.string({ produce: () => 'my-target' });
      expect(() => {
        GatewayTarget.forLambda(stack, 'TokenTarget', {
          gateway: gateway,
          gatewayTargetName: tokenName,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based description', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const tokenDesc = cdk.Lazy.string({ produce: () => 'My description' });
      expect(() => {
        GatewayTarget.forLambda(stack, 'TokenTarget', {
          gateway: gateway,
          gatewayTargetName: 'test-target',
          description: tokenDesc,
          lambdaFunction: fn,
          toolSchema: toolSchema,
        });
      }).not.toThrow();
    });
  });

  // These tests verify the import factory contract (attribute passthrough, defaults).
  // The 'imported target ARN is used correctly in grants' test below verifies the imported ARN flows into CFN via template assertion.
  describe('GatewayTarget.fromGatewayTargetAttributes', () => {
    test('Should import target from attributes', () => {
      const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
        targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target',
        targetId: 'test-target-id',
        gatewayTargetName: 'imported-target',
        gateway: gateway,
      });

      expect(imported).toBeDefined();
      expect(imported.targetArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target');
      expect(imported.targetId).toBe('test-target-id');
      expect(imported.gatewayTargetName).toBe('imported-target');
      expect(imported.gateway).toBe(gateway);
    });

    test('Should import target with optional attributes', () => {
      const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
        targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target',
        targetId: 'test-target-id',
        gatewayTargetName: 'imported-target',
        gateway: gateway,
        status: 'AVAILABLE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      });

      expect(imported.status).toBe('AVAILABLE');
      expect(imported.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(imported.updatedAt).toBe('2024-01-02T00:00:00Z');
    });

    test('Should have empty credential configurations for imported target', () => {
      const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
        targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target',
        targetId: 'test-target-id',
        gatewayTargetName: 'imported-target',
        gateway: gateway,
      });

      expect(imported.credentialProviderConfigurations).toEqual([]);
    });

    test('imported target ARN is used correctly in grants', () => {
      const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
        targetArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target',
        targetId: 'test-target-id',
        gatewayTargetName: 'imported-target',
        gateway: gateway,
      });
      const role = new iam.Role(stack, 'GrantRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      imported.grant(role, 'bedrock-agentcore:InvokeGatewayTarget');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Resource: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/test-target',
            }),
          ]),
        },
      });
    });
  });

  describe('GatewayTarget grantSync', () => {
    test('Should grant sync permissions to grantee', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = GatewayTarget.forLambda(stack, 'LambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      const grant = target.grantSync(role);

      expect(grant.success).toBe(true);
      expect(grant.principalStatement).toBeDefined();
    });
  });

  describe('Constructor with direct configuration', () => {
    test('Should create target using constructor with Lambda configuration', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = new GatewayTarget(stack, 'ConstructorTarget', {
        gateway: gateway,
        gatewayTargetName: 'constructor-target',
        targetConfiguration: LambdaTargetConfiguration.create(fn, toolSchema),
      });

      expect(target.gatewayTargetName).toBe('constructor-target');
    });

    test('Should create target with API Gateway configuration using constructor', () => {
      const target = new GatewayTarget(stack, 'ConstructorApiGwTarget', {
        gateway: gateway,
        gatewayTargetName: 'constructor-apigw-target',
        targetConfiguration: ApiGatewayTargetConfiguration.create({
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
          metadataConfiguration: {
            allowedQueryParameters: ['id'],
          },
        }),
      });

      expect(target.gatewayTargetName).toBe('constructor-apigw-target');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'constructor-apigw-target',
        MetadataConfiguration: {
          AllowedQueryParameters: ['id'],
        },
      });
    });

    test('Should create target without description using constructor', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = new GatewayTarget(stack, 'NoDescTarget', {
        gateway: gateway,
        gatewayTargetName: 'no-desc-target',
        targetConfiguration: LambdaTargetConfiguration.create(fn, toolSchema),
      });

      expect(target.description).toBeUndefined();
    });
  });

  describe('Auto-generated names', () => {
    test('Should auto-generate target name when not provided', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = new GatewayTarget(stack, 'AutoNameTarget', {
        gateway: gateway,
        targetConfiguration: LambdaTargetConfiguration.create(fn, toolSchema),
      });

      expect(target.gatewayTargetName).toBeDefined();
      expect(target.gatewayTargetName.length).toBeGreaterThan(0);
      expect(target.gatewayTargetName.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Target attributes', () => {
    test('Should have all expected attributes after creation', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
      });

      const toolSchema = ToolSchema.fromInline([
        {
          name: 'test_tool',
          description: 'Test tool',
          inputSchema: {
            type: SchemaDefinitionType.OBJECT,
            properties: {},
          },
        },
      ]);

      const target = GatewayTarget.forLambda(stack, 'AttributesTarget', {
        gateway: gateway,
        gatewayTargetName: 'attributes-target',
        description: 'Test target for attributes',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      expect(target.targetArn).toBeDefined();
      expect(target.targetId).toBeDefined();
      expect(target.gatewayTargetName).toBe('attributes-target');
      expect(target.description).toBe('Test target for attributes');
      expect(target.gateway).toBe(gateway);
      expect(target.targetProtocolType).toBeDefined();
      expect(target.targetType).toBeDefined();
    });
  });
});

describe('ToolSchema asset and S3 tests', () => {
  let stack: cdk.Stack;
  const toolAssetPath = path.join(__dirname, 'schemas', 'tool', 'schema1.json');

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('ToolSchema.fromLocalAsset', () => {
    let schema: ToolSchema;

    beforeEach(() => {
      schema = ToolSchema.fromLocalAsset(toolAssetPath);
    });

    test('Should create an AssetToolSchema instance', () => {
      expect(schema).toBeInstanceOf(AssetToolSchema);
    });

    test('bind should initialize the S3 asset and render should return S3 URI', () => {
      schema.bind(stack);

      const rendered = schema._render();
      expect(rendered.s3).toBeDefined();
      expect(rendered.s3.uri).toMatch(/^s3:\/\//);
    });

    test('_render should throw when called before bind', () => {
      expect(() => schema._render()).toThrow(/must be bound to a scope before rendering/);
    });

    test('grantPermissionsToRole should throw when called before bind', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      expect(() => schema.grantPermissionsToRole(role)).toThrow(/must be bound to a scope before rendering/);
    });

    test('grantPermissionsToRole should grant read access to the S3 asset after bind', () => {
      schema.bind(stack);
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      schema.grantPermissionsToRole(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:GetObject*']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    test('bind should be idempotent and reuse the same asset across multiple calls', () => {
      schema.bind(stack);
      const firstRender = schema._render();

      schema.bind(stack);
      const secondRender = schema._render();

      expect(secondRender.s3.uri).toBe(firstRender.s3.uri);
    });
  });

  describe('ToolSchema.fromS3File', () => {
    let bucket: s3.IBucket;
    let schema: ToolSchema;

    beforeEach(() => {
      bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'my-bucket');
      schema = ToolSchema.fromS3File(bucket, 'schema.json');
    });

    test('Should create an S3ToolSchema instance', () => {
      expect(schema).toBeInstanceOf(S3ToolSchema);
    });

    test('_render should return S3 URI without bucketOwner when not provided', () => {
      const rendered = schema._render();
      expect(rendered.s3).toBeDefined();
      expect(rendered.s3.uri).toBe('s3://my-bucket/schema.json');
      expect(rendered.s3.bucketOwnerAccountId).toBeUndefined();
    });

    test('_render should include bucketOwnerAccountId when provided', () => {
      const schemaWithOwner = ToolSchema.fromS3File(bucket, 'schema.json', '987654321098');

      const rendered = schemaWithOwner._render();
      expect(rendered.s3.uri).toBe('s3://my-bucket/schema.json');
      expect(rendered.s3.bucketOwnerAccountId).toBe('987654321098');
    });

    test('bind should be a no-op and allow subsequent _render', () => {
      expect(() => schema.bind(stack)).not.toThrow();
      expect(schema._render().s3.uri).toBe('s3://my-bucket/schema.json');
    });

    test('grantPermissionsToRole should grant s3:GetObject on the object ARN', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      schema.grantPermissionsToRole(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3:GetObject',
              Effect: 'Allow',
              Resource: Match.objectLike({
                'Fn::Join': Match.arrayWith([
                  '',
                  Match.arrayWith([Match.stringLikeRegexp(':s3:::my-bucket/schema.json')]),
                ]),
              }),
            }),
          ]),
        },
      });
    });
  });
});

describe('ApiSchema asset and S3 tests', () => {
  let stack: cdk.Stack;
  const apiAssetPath = path.join(__dirname, 'schemas', 'openapi', 'pet-api.json');

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('AssetApiSchema', () => {
    let schema: ApiSchema;

    beforeEach(() => {
      schema = ApiSchema.fromLocalAsset(apiAssetPath);
    });

    test('_render should throw when called before bind', () => {
      expect(() => schema._render()).toThrow(/must be bound to a scope before rendering/);
    });

    test('_render should return S3 URI after bind', () => {
      schema.bind(stack);

      const rendered = schema._render();
      expect(rendered.s3).toBeDefined();
      expect(rendered.s3.uri).toMatch(/^s3:\/\//);
    });

    test('grantPermissionsToRole should be a no-op when called before bind', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      // Does not throw — AssetApiSchema silently skips when asset isn't bound
      expect(() => schema.grantPermissionsToRole(role)).not.toThrow();
    });

    test('grantPermissionsToRole should grant read access after bind', () => {
      schema.bind(stack);
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      schema.grantPermissionsToRole(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:GetObject*']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });
  });

  describe('S3ApiSchema', () => {
    let bucket: s3.IBucket;

    let schema: ApiSchema;

    beforeEach(() => {
      bucket = s3.Bucket.fromBucketName(stack, 'TestBucket', 'my-bucket');
      schema = ApiSchema.fromS3File(bucket, 'schema.json');
    });

    test('Should create an S3ApiSchema instance via factory', () => {
      expect(schema).toBeInstanceOf(S3ApiSchema);
    });

    test('_render should return S3 URI without bucketOwner when not provided', () => {
      const rendered = schema._render();
      expect(rendered.s3.uri).toBe('s3://my-bucket/schema.json');
      expect(rendered.s3.bucketOwnerAccountId).toBeUndefined();
    });

    test('_render should include bucketOwnerAccountId when provided', () => {
      const schemaWithOwner = ApiSchema.fromS3File(bucket, 'schema.json', '987654321098');

      const rendered = schemaWithOwner._render();
      expect(rendered.s3.uri).toBe('s3://my-bucket/schema.json');
      expect(rendered.s3.bucketOwnerAccountId).toBe('987654321098');
    });

    test('grantPermissionsToRole should grant s3:GetObject on the object ARN', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      schema.grantPermissionsToRole(role);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3:GetObject',
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });
  });
});

describe('GatewayTargetBase grant methods and grantSync tests', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let target: GatewayTarget;
  let role: iam.Role;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
    gateway = new Gateway(stack, 'TestGateway', {});

    const fn = new lambda.Function(stack, 'TargetFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {}'),
    });
    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'Test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);
    target = GatewayTarget.forLambda(stack, 'LambdaTarget', {
      gateway: gateway,
      gatewayTargetName: 'lambda-target',
      lambdaFunction: fn,
      toolSchema: toolSchema,
    });
    role = new iam.Role(stack, 'GrantRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
  });

  test('grant should grant custom actions scoped to the target ARN', () => {
    target.grant(role, 'bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:UpdateGatewayTarget');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:UpdateGatewayTarget'],
            Effect: 'Allow',
            Resource: { Ref: Match.stringLikeRegexp('LambdaTarget.*') },
          }),
        ]),
      },
    });
  });

  test('grantRead should grant GetGatewayTarget on target ARN and ListGatewayTargets on all resources', () => {
    target.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetGatewayTarget',
            Effect: 'Allow',
            Resource: { Ref: Match.stringLikeRegexp('LambdaTarget.*') },
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListGatewayTargets',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('grantManage should grant Create, Update, and Delete actions on the target ARN', () => {
    target.grantManage(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              'bedrock-agentcore:CreateGatewayTarget',
              'bedrock-agentcore:UpdateGatewayTarget',
              'bedrock-agentcore:DeleteGatewayTarget',
            ],
            Effect: 'Allow',
            Resource: { Ref: Match.stringLikeRegexp('LambdaTarget.*') },
          }),
        ]),
      },
    });
  });

  test('grantSync should grant SynchronizeGatewayTargets on the gateway ARN', () => {
    target.grantSync(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:SynchronizeGatewayTargets',
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('TestGateway.*'), 'GatewayArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Imported target via fromGatewayTargetAttributes should support grant methods', () => {
    const importedArn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/test-gateway/target/imported';
    const imported = GatewayTarget.fromGatewayTargetAttributes(stack, 'ImportedTarget', {
      targetArn: importedArn,
      targetId: 'imported-id',
      gatewayTargetName: 'imported-target',
      gateway: gateway,
    });

    imported.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetGatewayTarget',
            Effect: 'Allow',
            Resource: importedArn,
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListGatewayTargets',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });
});
