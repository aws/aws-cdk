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

import { Match, Template } from '../../../../assertions';
import * as apigateway from '../../../../aws-apigateway';
import * as lambda from '../../../../aws-lambda';
import * as cdk from '../../../../core';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { GatewayIamRoleCredentialProviderConfig } from '../../../lib/gateway/outbound-auth/iam-role';
import { ApiSchema } from '../../../lib/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../lib/gateway/targets/target';
import { ApiGatewayHttpMethod } from '../../../lib/gateway/targets/target-configuration';

describe('IAM credential provider', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let lambdaFunction: lambda.Function;
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
  const openApiSchema = () => ApiSchema.fromInline(JSON.stringify({
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

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
    lambdaFunction = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {}'),
    });
  });

  describe('rendering', () => {
    test('renders only credentialProviderType when no props are provided (backwards compatible)', () => {
      // Bare fromIamRole() is still valid for Lambda targets.
      GatewayTarget.forLambda(stack, 'Target', {
        gateway,
        gatewayTargetName: 'target',
        lambdaFunction,
        toolSchema,
        credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: Match.absent(),
          },
        ],
      });
    });

    test('renders iamCredentialProvider with service when service is provided', () => {
      gateway.addMcpServerTarget('McpTarget', {
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: {
              IamCredentialProvider: {
                Service: 'bedrock-runtime',
                Region: Match.absent(),
              },
            },
          },
        ],
      });
    });

    test('renders iamCredentialProvider with service and region when both are provided', () => {
      gateway.addMcpServerTarget('McpTarget', {
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({
            service: 'bedrock-runtime',
            region: 'us-east-1',
          }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: {
              IamCredentialProvider: {
                Service: 'bedrock-runtime',
                Region: 'us-east-1',
              },
            },
          },
        ],
      });
    });

    test('renders iamCredentialProvider with service and region for an OpenAPI target', () => {
      GatewayTarget.forOpenApi(stack, 'OpenApiTarget', {
        gateway,
        gatewayTargetName: 'openapi-target',
        apiSchema: openApiSchema(),
        validateOpenApiSchema: false,
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({
            service: 'execute-api',
            region: 'us-west-2',
          }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: {
              IamCredentialProvider: {
                Service: 'execute-api',
                Region: 'us-west-2',
              },
            },
          },
        ],
      });
    });
  });

  describe('validation', () => {
    test('fails when region is provided without service', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ region: 'us-east-1' })).toThrow(
        'service must be provided when region is specified for the IAM credential provider',
      );
    });

    test('fails when service is empty', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: '' })).toThrow(
        /IAM credential provider service is 0 characters long but must be at least 1 characters/,
      );
    });

    test('fails when service exceeds 64 characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: 'a'.repeat(65) })).toThrow(
        /IAM credential provider service is 65 characters long but must be less than or equal to 64 characters/,
      );
    });

    test('fails when service contains invalid characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: 'bedrock runtime' })).toThrow(
        /The field IAM credential provider service with value "bedrock runtime" does not match the required pattern/,
      );
    });

    test('fails when region exceeds 32 characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: 'bedrock',
        region: 'a'.repeat(33),
      })).toThrow(
        /IAM credential provider region is 33 characters long but must be less than or equal to 32 characters/,
      );
    });

    test('fails when region contains invalid characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: 'bedrock',
        region: 'us_east_1',
      })).toThrow(
        /The field IAM credential provider region with value "us_east_1" does not match the required pattern/,
      );
    });

    test('skips validation for unresolved tokens', () => {
      const tokenStack = new cdk.Stack();
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: cdk.Token.asString({ resolve: () => 'bedrock-runtime' }),
        region: tokenStack.region,
      })).not.toThrow();
    });

    test.each([
      ['Lambda', () => GatewayTarget.forLambda(stack, 'Target', {
        gateway,
        gatewayTargetName: 'target',
        lambdaFunction,
        toolSchema,
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
        ],
      })],
      ['API Gateway', () => {
        const restApi = new apigateway.RestApi(stack, 'TestRestApi', {
          restApiName: 'test-api',
          deployOptions: { stageName: 'prod' },
        });
        restApi.root.addResource('test').addMethod('GET');
        return GatewayTarget.forApiGateway(stack, 'Target', {
          gateway,
          gatewayTargetName: 'target',
          restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/test',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
          },
          credentialProviderConfigurations: [
            GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
          ],
        });
      }],
      ['Smithy', () => GatewayTarget.forSmithy(stack, 'Target', {
        gateway,
        gatewayTargetName: 'target',
        smithyModel: ApiSchema.fromInline('{}'),
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
        ],
      })],
    ])('fails when explicit service/region is used with a %s target', (_targetType, createTarget) => {
      expect(createTarget).toThrow(
        /IamCredentialProvider with explicit service\/region is only supported for MCP Server and OpenAPI targets/,
      );
    });
  });

  describe('GatewayIamRoleCredentialProviderConfig', () => {
    test('grantNeededPermissionsToRole returns undefined', () => {
      const config = new GatewayIamRoleCredentialProviderConfig({ service: 'bedrock' });
      expect(config.grantNeededPermissionsToRole(gateway)).toBeUndefined();
    });

    test('exposes service and region as readonly properties', () => {
      const config = new GatewayIamRoleCredentialProviderConfig({
        service: 'bedrock-runtime',
        region: 'us-east-1',
      });
      expect(config.service).toBe('bedrock-runtime');
      expect(config.region).toBe('us-east-1');
    });
  });
});
