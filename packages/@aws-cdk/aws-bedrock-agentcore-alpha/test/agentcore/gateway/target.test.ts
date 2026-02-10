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
import { Template } from 'aws-cdk-lib/assertions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { ApiSchema } from '../../../lib/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
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
      const target = GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
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

      expect(target).toBeDefined();
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

    test('Should create API Gateway target without metadata configuration', () => {
      const target = GatewayTarget.forApiGateway(stack, 'ApiGwTarget', {
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

      expect(target).toBeDefined();
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::BedrockAgentCore::GatewayTarget');
      const targetResource = Object.values(resources).find((r: any) =>
        r.Properties.Name === 'apigw-target-no-metadata',
      );
      expect(targetResource).toBeDefined();
      expect((targetResource as any).Properties.MetadataConfiguration).toBeUndefined();
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

      const target = GatewayTarget.forLambda(stack, 'LambdaTarget', {
        gateway: gateway,
        gatewayTargetName: 'lambda-target',
        lambdaFunction: fn,
        toolSchema: toolSchema,
      });

      expect(target).toBeDefined();
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::BedrockAgentCore::GatewayTarget');
      const targetResource = Object.values(resources).find((r: any) =>
        r.Properties.Name === 'lambda-target',
      );
      expect((targetResource as any).Properties.MetadataConfiguration).toBeUndefined();
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
      expect(imported.name).toBe('imported-target');
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

      expect(target).toBeDefined();
      expect(target.name).toBe('constructor-target');
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

      expect(target).toBeDefined();
      expect(target.name).toBe('constructor-apigw-target');

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

      expect(target.name).toBeDefined();
      expect(target.name.length).toBeGreaterThan(0);
      expect(target.name.length).toBeLessThanOrEqual(100);
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
      expect(target.name).toBe('attributes-target');
      expect(target.description).toBe('Test target for attributes');
      expect(target.gateway).toBe(gateway);
      expect(target.targetProtocolType).toBeDefined();
      expect(target.targetType).toBeDefined();
    });
  });
});
