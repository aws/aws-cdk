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
import { Gateway } from '../../../lib';
import {
  ApiGatewayTargetConfiguration,
  ApiGatewayHttpMethod,
} from '../../../lib/gateway/targets/target-configuration';

describe('ApiGatewayTargetConfiguration with IRestApi', () => {
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
      deployOptions: {
        stageName: 'prod',
      },
    });
    // Add a resource and method to satisfy RestApi validation
    restApi.root.addResource('test').addMethod('GET');
  });

  describe('Using IRestApi', () => {
    test('Should extract restApiId from IRestApi', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/test',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
      });

      expect(config).toBeDefined();
      expect(config.restApiId).toBe(restApi.restApiId);
      expect(config.stage).toBe(restApi.deploymentStage.stageName); // Should use default stage
    });

    test('Should use default stage from RestApi when stage not specified', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/pets',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
      });

      expect(config.stage).toBe(restApi.deploymentStage.stageName);
    });

    test('Should use explicit stage when provided', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        stage: 'staging',
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/test',
              methods: [ApiGatewayHttpMethod.POST],
            },
          ],
        },
      });

      expect(config.stage).toBe('staging');
    });

    test('Should bind and grant permissions using IRestApi', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/users',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
      });

      const result = config.bind(stack, gateway);
      expect(result.bound).toBe(true);
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
    test('Should work with imported RestApi', () => {
      const importedApi = apigateway.RestApi.fromRestApiAttributes(stack, 'ImportedApi', {
        restApiId: 'imported-api-id',
        rootResourceId: 'root-id',
      });

      // Create a stage for the imported API
      const stage = new apigateway.Stage(stack, 'ImportedStage', {
        deployment: new apigateway.Deployment(stack, 'ImportedDeployment', {
          api: importedApi,
        }),
        stageName: 'production',
      });

      // Manually set deploymentStage since imported APIs don't have it by default
      (importedApi as any).deploymentStage = stage;

      const config = ApiGatewayTargetConfiguration.create({
        restApi: importedApi,
        stage: 'production',
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/imported',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
      });

      expect(config.restApiId).toBe('imported-api-id');
      expect(config.stage).toBe('production');
    });

    test('Should render configuration correctly with IRestApi', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/products',
              methods: [ApiGatewayHttpMethod.GET, ApiGatewayHttpMethod.POST],
            },
          ],
        },
      });

      const rendered = config._render();
      expect(rendered.mcp.apiGateway.restApiId).toBe(restApi.restApiId);
      expect(rendered.mcp.apiGateway.stage).toBe(restApi.deploymentStage.stageName);
    });

    test('Should work with metadata configuration', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        stage: 'dev',
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/api/*',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
        },
        metadataConfiguration: {
          allowedQueryParameters: ['userId'],
          allowedRequestHeaders: ['Authorization'],
          allowedResponseHeaders: ['X-Request-ID'],
        },
      });

      expect(config.metadataConfiguration).toBeDefined();
      expect(config.metadataConfiguration?.allowedQueryParameters).toEqual(['userId']);
    });

    test('Should work with tool overrides', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/pets/*',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
          toolOverrides: [
            {
              path: '/pets/{id}',
              method: ApiGatewayHttpMethod.GET,
              name: 'get_pet_by_id',
              description: 'Get pet details',
            },
          ],
        },
      });

      expect(config.apiGatewayToolConfiguration.toolOverrides).toBeDefined();
      expect(config.apiGatewayToolConfiguration.toolOverrides).toHaveLength(1);
    });
  });

  describe('Edge cases with IRestApi', () => {
    test('Should accept metadata with exact limit (10 items)', () => {
      const exactLimit = Array.from({ length: 10 }, (_, i) => `param${i}`);
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
            allowedQueryParameters: exactLimit,
          },
        });
      }).not.toThrow();
    });

    test('Should accept empty tool overrides array', () => {
      const config = ApiGatewayTargetConfiguration.create({
        restApi: restApi,
        apiGatewayToolConfiguration: {
          toolFilters: [
            {
              filterPath: '/test',
              methods: [ApiGatewayHttpMethod.GET],
            },
          ],
          toolOverrides: [],
        },
      });

      expect(config.apiGatewayToolConfiguration.toolOverrides).toEqual([]);
    });
  });

  describe('MetadataConfiguration validation', () => {
    describe('allowedQueryParameters validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: [],
            },
          });
        }).toThrow(/allowedQueryParameters cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        const tooMany = Array.from({ length: 11 }, (_, i) => `param${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: tooMany,
            },
          });
        }).toThrow(/allowedQueryParameters cannot exceed 10 items/);
      });

      test('Should reject parameter name longer than 40 characters', () => {
        const longParam = 'a'.repeat(41);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: [longParam],
            },
          });
        }).toThrow(/allowedQueryParameters\[0\].*must be less than or equal to 40 characters/);
      });

      test('Should accept valid parameter at max length (40 characters)', () => {
        const maxLengthParam = 'a'.repeat(40);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: [maxLengthParam],
            },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        const validParams = Array.from({ length: 10 }, (_, i) => `param${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: validParams,
            },
          });
        }).not.toThrow();
      });
    });

    describe('allowedRequestHeaders validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedRequestHeaders: [],
            },
          });
        }).toThrow(/allowedRequestHeaders cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        const tooMany = Array.from({ length: 11 }, (_, i) => `Header-${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedRequestHeaders: tooMany,
            },
          });
        }).toThrow(/allowedRequestHeaders cannot exceed 10 items/);
      });

      test('Should reject header name longer than 100 characters', () => {
        const longHeader = 'X-Custom-Header-' + 'a'.repeat(100);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedRequestHeaders: [longHeader],
            },
          });
        }).toThrow(/allowedRequestHeaders\[0\].*must be less than or equal to 100 characters/);
      });

      test('Should accept valid header at max length (100 characters)', () => {
        const maxLengthHeader = 'X-' + 'a'.repeat(98);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedRequestHeaders: [maxLengthHeader],
            },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        const validHeaders = Array.from({ length: 10 }, (_, i) => `X-Header-${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedRequestHeaders: validHeaders,
            },
          });
        }).not.toThrow();
      });
    });

    describe('allowedResponseHeaders validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedResponseHeaders: [],
            },
          });
        }).toThrow(/allowedResponseHeaders cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        const tooMany = Array.from({ length: 11 }, (_, i) => `X-Response-${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedResponseHeaders: tooMany,
            },
          });
        }).toThrow(/allowedResponseHeaders cannot exceed 10 items/);
      });

      test('Should reject header name longer than 100 characters', () => {
        const longHeader = 'X-Custom-Response-' + 'a'.repeat(100);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedResponseHeaders: [longHeader],
            },
          });
        }).toThrow(/allowedResponseHeaders\[0\].*must be less than or equal to 100 characters/);
      });

      test('Should accept valid header at max length (100 characters)', () => {
        const maxLengthHeader = 'X-' + 'a'.repeat(98);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedResponseHeaders: [maxLengthHeader],
            },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        const validHeaders = Array.from({ length: 10 }, (_, i) => `X-Response-${i}`);
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedResponseHeaders: validHeaders,
            },
          });
        }).not.toThrow();
      });
    });

    describe('Combined metadata configuration', () => {
      test('Should validate all fields together', () => {
        expect(() => {
          ApiGatewayTargetConfiguration.create({
            restApi: restApi,
            apiGatewayToolConfiguration: {
              toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
            },
            metadataConfiguration: {
              allowedQueryParameters: ['userId', 'sessionId'],
              allowedRequestHeaders: ['Authorization', 'X-API-Key'],
              allowedResponseHeaders: ['X-Request-ID', 'X-Rate-Limit'],
            },
          });
        }).not.toThrow();
      });

      test('Should render metadata configuration in CloudFormation output', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          apiGatewayToolConfiguration: {
            toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
          },
          metadataConfiguration: {
            allowedQueryParameters: ['userId'],
            allowedRequestHeaders: ['Authorization'],
            allowedResponseHeaders: ['X-Request-ID'],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.metadataConfiguration).toBeDefined();
        expect(rendered.mcp.apiGateway.metadataConfiguration.allowedQueryParameters).toEqual(['userId']);
        expect(rendered.mcp.apiGateway.metadataConfiguration.allowedRequestHeaders).toEqual(['Authorization']);
        expect(rendered.mcp.apiGateway.metadataConfiguration.allowedResponseHeaders).toEqual(['X-Request-ID']);
      });

      test('Should not render metadata configuration when not provided', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          apiGatewayToolConfiguration: {
            toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] }],
          },
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.metadataConfiguration).toBeUndefined();
      });
    });
  });
});
