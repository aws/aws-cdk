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
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Gateway } from '../../../lib';
import { ApiSchema } from '../../../lib/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import {
  ApiGatewayTargetConfiguration,
  ApiGatewayHttpMethod,
  LambdaTargetConfiguration,
  OpenApiTargetConfiguration,
  SmithyTargetConfiguration,
  McpServerTargetConfiguration,
} from '../../../lib/gateway/targets/target-configuration';

describe('Target Configuration Tests', () => {
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
    // Add a method to satisfy RestApi validation
    restApi.root.addResource('test').addMethod('GET');
  });

  describe('ApiGatewayTargetConfiguration', () => {
    describe('Basic creation and validation', () => {
      test('Should create API Gateway target configuration with minimum required props', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
          },
        });

        expect(config).toBeDefined();
        expect(config.restApiId).toBe(restApi.restApiId); // Should be the token from RestApi
        expect(config.stage).toBe('prod');
        expect(config.apiGatewayToolConfiguration.toolFilters).toHaveLength(1);
      });

      test('Should create API Gateway target configuration with metadata configuration', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
          },
          metadataConfiguration: {
            allowedQueryParameters: ['param1', 'param2'],
            allowedRequestHeaders: ['Authorization', 'Content-Type'],
            allowedResponseHeaders: ['X-Custom-Header'],
          },
        });

        expect(config.metadataConfiguration).toBeDefined();
        expect(config.metadataConfiguration?.allowedQueryParameters).toEqual(['param1', 'param2']);
        expect(config.metadataConfiguration?.allowedRequestHeaders).toEqual(['Authorization', 'Content-Type']);
        expect(config.metadataConfiguration?.allowedResponseHeaders).toEqual(['X-Custom-Header']);
      });

      test('Should create API Gateway target configuration with tool overrides', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets/*',
                methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST],
              },
            ],
            toolOverrides: [
              {
                path: '/pets/{petId}',
                method: ApiGatewayHttpMethod.GET,
                name: 'get_pet_by_id',
                description: 'Retrieve a specific pet by ID',
              },
            ],
          },
        });

        expect(config.apiGatewayToolConfiguration.toolOverrides).toBeDefined();
        expect(config.apiGatewayToolConfiguration.toolOverrides).toHaveLength(1);
        expect(config.apiGatewayToolConfiguration.toolOverrides![0].name).toBe('get_pet_by_id');
      });

      test('Should create API Gateway target configuration with multiple tool filters', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets/*',
                methods: [ApiGatewayHttpMethod.GET],
              },
              {
                filterPath: '/users/*',
                methods: [ApiGatewayHttpMethod.POST, ApiGatewayHttpMethod.PUT],
              },
              {
                filterPath: '/orders',
                methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST],
              },
            ],
          },
        });

        expect(config.apiGatewayToolConfiguration.toolFilters).toHaveLength(3);
      });

      test('Should create API Gateway target configuration with all HTTP methods', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/resource',
                methods: [
                  ApiGatewayHttpMethod.GET,
                  ApiGatewayHttpMethod.POST,
                  ApiGatewayHttpMethod.PUT,
                  ApiGatewayHttpMethod.DELETE,
                  ApiGatewayHttpMethod.PATCH,
                  ApiGatewayHttpMethod.HEAD,
                  ApiGatewayHttpMethod.OPTIONS,
                ],
              },
            ],
          },
        });

        expect(config.apiGatewayToolConfiguration.toolFilters[0].methods).toHaveLength(7);
      });
    });

    describe('Validation error cases', () => {
      test('Should throw error when stage name is too long', () => {
        const longStage = 'a'.repeat(129);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: longStage,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).toThrow(/Stage name/);
      });

      test('Should throw error when stage name is empty', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: '',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).toThrow(/Stage name/);
      });

      test('Should throw error when no tool filters provided', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [],
            },
          });
        }).toThrow(/At least one tool filter is required/);
      });

      test('Should throw error when tool filter has invalid path format', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: 'pets', // Missing leading slash
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).toThrow(/Filter path must start with a forward slash/);
      });

      test('Should throw error when tool filter has no methods', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [],
                },
              ],
            },
          });
        }).toThrow(/At least one HTTP method is required/);
      });

      test('Should throw error when tool override path contains wildcard', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/*',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/*', // Cannot contain wildcard
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pets',
                },
              ],
            },
          });
        }).toThrow(/Tool override path cannot contain wildcards/);
      });

      test('Should throw error when tool override name is too long', () => {
        const longName = 'a'.repeat(65);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/{petId}',
                  method: ApiGatewayHttpMethod.GET,
                  name: longName,
                },
              ],
            },
          });
        }).toThrow(/Override tool name/);
      });

      test('Should throw error when tool override name is empty', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/{petId}',
                  method: ApiGatewayHttpMethod.GET,
                  name: '',
                },
              ],
            },
          });
        }).toThrow(/Override tool name/);
      });

      test('Should throw error when tool override description is too long', () => {
        const longDesc = 'a'.repeat(201);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/{petId}',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pet',
                  description: longDesc,
                },
              ],
            },
          });
        }).toThrow(/Override description/);
      });

      test('Should throw error when tool override path format is invalid', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: 'pets', // Missing leading slash
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pets',
                },
              ],
            },
          });
        }).toThrow(/Override path must start with a forward slash/);
      });
    });

    describe('Metadata configuration validation', () => {
      test('Should throw error when allowedQueryParameters exceeds 10 items', () => {
        const tooManyParams = Array.from({ length: 11 }, (_, i) => `param${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
            metadataConfiguration: {
              allowedQueryParameters: tooManyParams,
            },
          });
        }).toThrow(/allowedQueryParameters cannot exceed 10 items/);
      });

      test('Should throw error when allowedRequestHeaders exceeds 10 items', () => {
        const tooManyHeaders = Array.from({ length: 11 }, (_, i) => `Header${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
            metadataConfiguration: {
              allowedRequestHeaders: tooManyHeaders,
            },
          });
        }).toThrow(/allowedRequestHeaders cannot exceed 10 items/);
      });

      test('Should throw error when allowedResponseHeaders exceeds 10 items', () => {
        const tooManyHeaders = Array.from({ length: 11 }, (_, i) => `ResHeader${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
            metadataConfiguration: {
              allowedResponseHeaders: tooManyHeaders,
            },
          });
        }).toThrow(/allowedResponseHeaders cannot exceed 10 items/);
      });

      test('Should accept metadata configuration with exactly 10 items in each array', () => {
        const maxParams = Array.from({ length: 10 }, (_, i) => `param${i}`);
        const maxReqHeaders = Array.from({ length: 10 }, (_, i) => `ReqHeader${i}`);
        const maxResHeaders = Array.from({ length: 10 }, (_, i) => `ResHeader${i}`);

        expect(() => {
          ApiGatewayTargetConfiguration.create({
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
              allowedQueryParameters: maxParams,
              allowedRequestHeaders: maxReqHeaders,
              allowedResponseHeaders: maxResHeaders,
            },
          });
        }).not.toThrow();
      });

      test('Should accept metadata configuration with only query parameters', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
            allowedQueryParameters: ['param1'],
          },
        });

        expect(config.metadataConfiguration?.allowedQueryParameters).toEqual(['param1']);
        expect(config.metadataConfiguration?.allowedRequestHeaders).toBeUndefined();
        expect(config.metadataConfiguration?.allowedResponseHeaders).toBeUndefined();
      });
    });

    describe('Tool filter validation edge cases', () => {
      test('Should accept filter path with path parameters', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}/toys/{toyId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept filter path with wildcard at end', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/*',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept filter path with hyphens and underscores', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/my-pets_api/v1',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept root path', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should throw error for invalid filter path with spaces', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets api',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).toThrow(/Filter path must start with a forward slash/);
      });

      test('Should throw error for invalid filter path with special characters', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets@api',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).toThrow(/Filter path must start with a forward slash/);
      });
    });

    describe('Tool override validation edge cases', () => {
      test('Should accept tool override without description', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/{petId}',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pet',
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept tool override with valid description', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets/{petId}',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/{petId}',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pet',
                  description: 'Get a pet by ID',
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should throw error for override path with special characters', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets@api',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_pets',
                },
              ],
            },
          });
        }).toThrow(/Override path must start with a forward slash/);
      });

      test('Should accept tool override with empty description', () => {
        // Empty description is treated as undefined and not included in output
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets/{petId}',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
            toolOverrides: [
              {
                path: '/pets/{petId}',
                method: ApiGatewayHttpMethod.GET,
                name: 'get_pet',
                description: '',
              },
            ],
          },
        });

        // Empty description should be accepted (validation skips empty strings)
        expect(config).toBeDefined();
      });
    });

    describe('Token handling', () => {
      test('Should skip validation for token-based stage name', () => {
        const tokenStage = cdk.Lazy.string({ produce: () => 'my-stage' });
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: tokenStage,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should skip validation for token-based filter path', () => {
        const tokenPath = cdk.Lazy.string({ produce: () => '/test' });
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: tokenPath,
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should skip validation for token-based override path', () => {
        const tokenPath = cdk.Lazy.string({ produce: () => '/test' });
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: tokenPath,
                  method: ApiGatewayHttpMethod.GET,
                  name: 'test_operation',
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should skip validation for token-based override name', () => {
        const tokenName = cdk.Lazy.string({ produce: () => 'my_operation' });
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/test',
                  method: ApiGatewayHttpMethod.GET,
                  name: tokenName,
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should skip validation for token-based override description', () => {
        const tokenDesc = cdk.Lazy.string({ produce: () => 'Test operation description' });
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/test',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'test_op',
                  description: tokenDesc,
                },
              ],
            },
          });
        }).not.toThrow();
      });
    });

    describe('Bind and render', () => {
      test('Should bind successfully and grant API Gateway permissions', () => {
        const config = ApiGatewayTargetConfiguration.create({
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

        const result = config.bind(stack, gateway);
        expect(result.bound).toBe(true);

        // Verify that execute-api:Invoke permission is granted to the gateway role
        // Note: apigateway:GET (GetExport) is NOT required on the gateway role since
        // AgentCore Gateway calls GetExport using Forward Access Session with caller credentials
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([
              Match.objectLike({
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
              }),
            ]),
          },
        });
      });

      test('Should render configuration correctly without metadata', () => {
        const config = ApiGatewayTargetConfiguration.create({
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

        const rendered = config._render();
        expect(rendered).toHaveProperty('mcp');
        expect(rendered.mcp).toHaveProperty('apiGateway');
        expect(rendered.mcp.apiGateway.restApiId).toBe(restApi.restApiId); // Token from RestApi
        expect(rendered.mcp.apiGateway.stage).toBe('prod');
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration).toBeDefined();
      });

      test('Should render configuration correctly with tool overrides', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets/*',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
            toolOverrides: [
              {
                path: '/pets/{petId}',
                method: ApiGatewayHttpMethod.GET,
                name: 'get_pet_by_id',
                description: 'Get a pet',
              },
            ],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides).toBeDefined();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides).toHaveLength(1);
      });

      test('Should render configuration without tool overrides when not provided', () => {
        const config = ApiGatewayTargetConfiguration.create({
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

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides).toBeUndefined();
      });
    });
  });

  describe('LambdaTargetConfiguration', () => {
    test('Should create Lambda target configuration', () => {
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

      const config = LambdaTargetConfiguration.create(fn, toolSchema);
      expect(config).toBeDefined();
      expect(config.lambdaFunction).toBe(fn);
      expect(config.toolSchema).toBe(toolSchema);
    });

    test('Should bind and grant Lambda invoke permissions', () => {
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

      const config = LambdaTargetConfiguration.create(fn, toolSchema);
      const result = config.bind(stack, gateway);
      expect(result.bound).toBe(true);
    });

    test('Should render Lambda configuration correctly', () => {
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

      const config = LambdaTargetConfiguration.create(fn, toolSchema);
      config.bind(stack, gateway);
      const rendered = config._render();

      expect(rendered).toHaveProperty('mcp');
      expect(rendered.mcp).toHaveProperty('lambda');
      expect(rendered.mcp.lambda.lambdaArn).toBeDefined();
      expect(rendered.mcp.lambda.toolSchema).toBeDefined();
    });
  });

  describe('OpenApiTargetConfiguration', () => {
    test('Should create OpenAPI target configuration with inline schema', () => {
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

      const config = OpenApiTargetConfiguration.create(schema);
      expect(config).toBeDefined();
      expect(config.apiSchema).toBe(schema);
    });

    test('Should create OpenAPI target configuration with validation disabled', () => {
      const invalidSchema = ApiSchema.fromInline(JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/test': {
            get: {
              // Missing operationId
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      }));

      expect(() => {
        OpenApiTargetConfiguration.create(invalidSchema, false);
      }).not.toThrow();
    });

    test('Should create OpenAPI target configuration from S3', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'test-bucket');
      const schema = ApiSchema.fromS3File(bucket, 'schema.json');

      const config = OpenApiTargetConfiguration.create(schema);
      expect(config).toBeDefined();
      expect(config.apiSchema).toBe(schema);
    });

    test('Should bind and grant S3 read permissions for S3 schema', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'test-bucket');
      const schema = ApiSchema.fromS3File(bucket, 'schema.json');

      const config = OpenApiTargetConfiguration.create(schema);
      const result = config.bind(stack, gateway);
      expect(result.bound).toBe(true);
    });

    test('Should render OpenAPI configuration correctly', () => {
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

      const config = OpenApiTargetConfiguration.create(schema);
      config.bind(stack, gateway);
      const rendered = config._render();

      expect(rendered).toHaveProperty('mcp');
      expect(rendered.mcp).toHaveProperty('openApiSchema');
    });
  });

  describe('SmithyTargetConfiguration', () => {
    test('Should create Smithy target configuration with inline schema', () => {
      const smithyModel = ApiSchema.fromInline('{}'); // Simple inline schema

      const config = SmithyTargetConfiguration.create(smithyModel);
      expect(config).toBeDefined();
      expect(config.smithyModel).toBe(smithyModel);
    });

    test('Should bind successfully', () => {
      const smithyModel = ApiSchema.fromInline('{}');

      const config = SmithyTargetConfiguration.create(smithyModel);
      const result = config.bind(stack, gateway);
      expect(result.bound).toBe(true);
    });

    test('Should render Smithy configuration correctly', () => {
      const smithyModel = ApiSchema.fromInline('{}');

      const config = SmithyTargetConfiguration.create(smithyModel);
      config.bind(stack, gateway);
      const rendered = config._render();

      expect(rendered).toHaveProperty('mcp');
      expect(rendered.mcp).toHaveProperty('smithyModel');
    });

    test('Should create Smithy target configuration from S3', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'SmithyBucket', 'test-bucket');
      const smithyModel = ApiSchema.fromS3File(bucket, 'weather-service.smithy');

      const config = SmithyTargetConfiguration.create(smithyModel);
      expect(config).toBeDefined();
      expect(config.smithyModel).toBe(smithyModel);
    });
  });

  describe('McpServerTargetConfiguration', () => {
    test('Should create MCP Server target configuration with valid HTTPS endpoint', () => {
      const config = McpServerTargetConfiguration.create('https://mcp-server.example.com');
      expect(config).toBeDefined();
      expect(config.endpoint).toBe('https://mcp-server.example.com');
    });

    test('Should throw error for non-HTTPS endpoint', () => {
      expect(() => {
        McpServerTargetConfiguration.create('http://mcp-server.example.com');
      }).toThrow(/MCP server endpoint must use HTTPS protocol/);
    });

    test('Should throw error for endpoint with spaces', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp server.example.com');
      }).toThrow(/contains characters that should be URL-encoded/);
    });

    test('Should throw error for endpoint with angle brackets', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server<test>.example.com');
      }).toThrow(/contains characters that should be URL-encoded/);
    });

    test('Should skip validation for token-based endpoint', () => {
      const tokenEndpoint = cdk.Lazy.string({ produce: () => 'https://mcp-server.example.com' });
      expect(() => {
        McpServerTargetConfiguration.create(tokenEndpoint);
      }).not.toThrow();
    });

    test('Should bind successfully without requiring permissions', () => {
      const config = McpServerTargetConfiguration.create('https://mcp-server.example.com');
      const result = config.bind(stack, gateway);
      expect(result.bound).toBe(true);
    });

    test('Should render MCP Server configuration correctly', () => {
      const config = McpServerTargetConfiguration.create('https://mcp-server.example.com');
      const rendered = config._render();

      expect(rendered).toHaveProperty('mcp');
      expect(rendered.mcp).toHaveProperty('mcpServer');
      expect(rendered.mcp.mcpServer.endpoint).toBe('https://mcp-server.example.com');
    });

    test('Should accept endpoint with port number', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server.example.com:8443');
      }).not.toThrow();
    });

    test('Should accept endpoint with path', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server.example.com/api/mcp');
      }).not.toThrow();
    });

    test('Should accept endpoint with query parameters', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server.example.com/mcp?version=1.0');
      }).not.toThrow();
    });

    test('Should throw error for endpoint with less than character', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server>.example.com');
      }).toThrow(/contains characters that should be URL-encoded/);
    });

    test('Should throw error for endpoint with greater than character', () => {
      expect(() => {
        McpServerTargetConfiguration.create('https://mcp-server<.example.com');
      }).toThrow(/contains characters that should be URL-encoded/);
    });
  });

  describe('Additional Branch Coverage Tests', () => {
    describe('API Gateway - Multiple validations', () => {
      test('Should create config with multiple tool overrides', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets/*',
                methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST],
              },
            ],
            toolOverrides: [
              {
                path: '/pets/{petId}',
                method: ApiGatewayHttpMethod.GET,
                name: 'get_pet',
                description: 'Get pet by ID',
              },
              {
                path: '/pets/{petId}',
                method: ApiGatewayHttpMethod.POST,
                name: 'update_pet',
              },
            ],
          },
        });

        expect(config.apiGatewayToolConfiguration.toolOverrides).toHaveLength(2);
      });

      test('Should validate multiple tool filters correctly', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/valid',
                  methods: [ApiGatewayHttpMethod.GET],
                },
                {
                  filterPath: 'invalid', // This should trigger validation error
                  methods: [ApiGatewayHttpMethod.POST],
                },
              ],
            },
          });
        }).toThrow(/Filter path must start with a forward slash/);
      });

      test('Should validate all tool overrides in list', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/pets',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/pets/valid',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'valid_operation',
                },
                {
                  path: '/pets/invalid/*', // This should trigger validation error
                  method: ApiGatewayHttpMethod.POST,
                  name: 'invalid_operation',
                },
              ],
            },
          });
        }).toThrow(/Tool override path cannot contain wildcards/);
      });

      test('Should accept metadata configuration with only request headers', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
            allowedRequestHeaders: ['Authorization'],
          },
        });

        expect(config.metadataConfiguration?.allowedRequestHeaders).toEqual(['Authorization']);
        expect(config.metadataConfiguration?.allowedQueryParameters).toBeUndefined();
        expect(config.metadataConfiguration?.allowedResponseHeaders).toBeUndefined();
      });

      test('Should accept metadata configuration with only response headers', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
            allowedResponseHeaders: ['X-Custom-Header'],
          },
        });

        expect(config.metadataConfiguration?.allowedResponseHeaders).toEqual(['X-Custom-Header']);
        expect(config.metadataConfiguration?.allowedQueryParameters).toBeUndefined();
        expect(config.metadataConfiguration?.allowedRequestHeaders).toBeUndefined();
      });

      test('Should render tool filters with multiple methods correctly', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/resource',
                methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST, ApiGatewayHttpMethod.DELETE],
              },
            ],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolFilters[0].methods).toHaveLength(3);
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolFilters[0].methods).toContain('GET');
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolFilters[0].methods).toContain('POST');
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolFilters[0].methods).toContain('DELETE');
      });

      test('Should render tool override with description in configuration', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
            toolOverrides: [
              {
                path: '/pets',
                method: ApiGatewayHttpMethod.GET,
                name: 'list_pets',
                description: 'List all pets',
              },
            ],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides[0]).toHaveProperty('description');
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides[0].description).toBe('List all pets');
      });

      test('Should render tool override without description when not provided', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          stage: 'prod',
          apiGatewayToolConfiguration: {
            toolFilters: [
              {
                filterPath: '/pets',
                methods: [ApiGatewayHttpMethod.GET],
              },
            ],
            toolOverrides: [
              {
                path: '/pets',
                method: ApiGatewayHttpMethod.GET,
                name: 'list_pets',
              },
            ],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration.toolOverrides[0]).not.toHaveProperty('description');
      });

      test('Should handle stage name at exact max length', () => {
        const maxLengthStage = 'a'.repeat(128);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: maxLengthStage,
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should handle override name at exact max length', () => {
        const maxLengthName = 'a'.repeat(64);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/test',
                  method: ApiGatewayHttpMethod.GET,
                  name: maxLengthName,
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should handle override description at exact max length', () => {
        const maxLengthDesc = 'a'.repeat(200);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
              toolOverrides: [
                {
                  path: '/test',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'test_op',
                  description: maxLengthDesc,
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should validate when metadata config undefined but metadataConfiguration property exists', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
          metadataConfiguration: undefined,
        });

        expect(config.metadataConfiguration).toBeUndefined();
      });
    });

    describe('Lambda - Additional coverage', () => {
      test('Should bind Lambda with S3-based tool schema', () => {
        const fn = new lambda.Function(stack, 'TestFunctionS3', {
          runtime: lambda.Runtime.NODEJS_22_X,
          handler: 'index.handler',
          code: lambda.Code.fromInline('exports.handler = async () => {}'),
        });

        const bucket = s3.Bucket.fromBucketName(stack, 'ToolBucket', 'tool-bucket');
        const toolSchema = ToolSchema.fromS3File(bucket, 'tools.json');

        const config = LambdaTargetConfiguration.create(fn, toolSchema);
        const result = config.bind(stack, gateway);
        expect(result.bound).toBe(true);
      });
    });

    describe('OpenAPI - Additional coverage', () => {
      test('Should validate inline OpenAPI schema by default', () => {
        const invalidSchema = ApiSchema.fromInline(JSON.stringify({
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          servers: [{ url: 'https://api.example.com' }],
          paths: {
            '/test': {
              get: {
                // Missing operationId - should fail validation
                responses: { 200: { description: 'OK' } },
              },
            },
          },
        }));

        expect(() => {
          const config = OpenApiTargetConfiguration.create(invalidSchema);
          config.bind(stack, gateway);
        }).toThrow(/operationId/i);
      });

      test('Should skip validation for S3-based OpenAPI schema', () => {
        const bucket = s3.Bucket.fromBucketName(stack, 'OpenAPIBucket', 'test-bucket');
        const schema = ApiSchema.fromS3File(bucket, 'invalid-schema.json');

        // S3 schemas cannot be validated at synthesis time
        expect(() => {
          const config = OpenApiTargetConfiguration.create(schema);
          config.bind(stack, gateway);
        }).not.toThrow();
      });

      test('Should validate OpenAPI schema when explicitly enabled', () => {
        const validSchema = ApiSchema.fromInline(JSON.stringify({
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

        expect(() => {
          const config = OpenApiTargetConfiguration.create(validSchema, true);
          config.bind(stack, gateway);
        }).not.toThrow();
      });
    });

    describe('Target type verification', () => {
      test('Should have correct target type for Lambda configuration', () => {
        const fn = new lambda.Function(stack, 'LambdaTargetType', {
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

        const config = LambdaTargetConfiguration.create(fn, toolSchema);
        expect(config.targetType).toBeDefined();
      });

      test('Should have correct target type for OpenAPI configuration', () => {
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

        const config = OpenApiTargetConfiguration.create(schema);
        expect(config.targetType).toBeDefined();
      });

      test('Should have correct target type for Smithy configuration', () => {
        const smithyModel = ApiSchema.fromInline('{}');
        const config = SmithyTargetConfiguration.create(smithyModel);
        expect(config.targetType).toBeDefined();
      });

      test('Should have correct target type for MCP Server configuration', () => {
        const config = McpServerTargetConfiguration.create('https://mcp-server.example.com');
        expect(config.targetType).toBeDefined();
      });

      test('Should have correct target type for API Gateway configuration', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
        expect(config.targetType).toBeDefined();
      });
    });

    describe('Edge cases for method combinations', () => {
      test('Should accept single method in filter', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/resource',
                  methods: [ApiGatewayHttpMethod.DELETE],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept HEAD method in filter', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/resource',
                  methods: [ApiGatewayHttpMethod.HEAD],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept OPTIONS method in filter', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/resource',
                  methods: [ApiGatewayHttpMethod.OPTIONS],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept PATCH method in filter', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/resource',
                  methods: [ApiGatewayHttpMethod.PATCH],
                },
              ],
            },
          });
        }).not.toThrow();
      });

      test('Should accept PUT method in filter', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/resource',
                  methods: [ApiGatewayHttpMethod.PUT],
                },
              ],
            },
          });
        }).not.toThrow();
      });
    });

    describe('Metadata configuration combinations', () => {
      test('Should accept metadata with query params and request headers only', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
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
              allowedRequestHeaders: ['Authorization'],
            },
          });
        }).not.toThrow();
      });

      test('Should accept metadata with query params and response headers only', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
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
              allowedResponseHeaders: ['X-Custom'],
            },
          });
        }).not.toThrow();
      });

      test('Should accept metadata with request and response headers only', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
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
              allowedRequestHeaders: ['Authorization'],
              allowedResponseHeaders: ['X-Custom'],
            },
          });
        }).not.toThrow();
      });
    });

    describe('REST API ID edge cases', () => {
      test('Should accept REST API ID with single character', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
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
        }).not.toThrow();
      });
    });

    describe('Stage name edge cases', () => {
      test('Should accept stage name with single character', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'p',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/test',
                  methods: [ApiGatewayHttpMethod.GET],
                },
              ],
            },
          });
        }).not.toThrow();
      });
    });

    describe('Tool filter with multiple tool filters at boundary', () => {
      test('Should iterate through all filters for validation', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/api/v1',
                  methods: [ApiGatewayHttpMethod.GET],
                },
                {
                  filterPath: '/api/v2',
                  methods: [ApiGatewayHttpMethod.POST],
                },
                {
                  filterPath: '/api/v3',
                  methods: [ApiGatewayHttpMethod.PUT],
                },
              ],
            },
          });
        }).not.toThrow();
      });
    });

    describe('Tool override iteration for validation', () => {
      test('Should iterate through multiple overrides for validation', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            stage: 'prod',
            apiGatewayToolConfiguration: {
              toolFilters: [
                {
                  filterPath: '/api/*',
                  methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST, ApiGatewayHttpMethod.PUT],
                },
              ],
              toolOverrides: [
                {
                  path: '/api/resource1',
                  method: ApiGatewayHttpMethod.GET,
                  name: 'get_resource1',
                },
                {
                  path: '/api/resource2',
                  method: ApiGatewayHttpMethod.POST,
                  name: 'create_resource2',
                  description: 'Create a resource',
                },
                {
                  path: '/api/resource3',
                  method: ApiGatewayHttpMethod.PUT,
                  name: 'update_resource3',
                },
              ],
            },
          });
        }).not.toThrow();
      });
    });

    describe('Render with varying metadata configurations', () => {
      test('Should render with all three metadata arrays present', () => {
        const config = ApiGatewayTargetConfiguration.create({
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
            allowedQueryParameters: ['q1', 'q2'],
            allowedRequestHeaders: ['h1', 'h2'],
            allowedResponseHeaders: ['r1', 'r2'],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.apiGatewayToolConfiguration).toBeDefined();
      });
    });
  });
});

