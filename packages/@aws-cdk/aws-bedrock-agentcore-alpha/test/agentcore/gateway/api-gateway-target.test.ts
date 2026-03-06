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
import { Gateway, GatewayTarget } from '../../../lib';
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
    const toolConfig = {
      toolFilters: [{ filterPath: '/test', methods: [ApiGatewayHttpMethod.GET] } as const],
    };

    describe('allowedQueryParameters validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'EmptyQP', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedQueryParameters: [] },
          });
        }).toThrow(/allowedQueryParameters cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'TooManyQP', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedQueryParameters: Array.from({ length: 11 }, (_, i) => `param${i}`) },
          });
        }).toThrow(/allowedQueryParameters cannot exceed 10 items/);
      });

      test('Should reject parameter name longer than 40 characters', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'LongQP', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedQueryParameters: ['a'.repeat(41)] },
          });
        }).toThrow(/allowedQueryParameters\[0\].*must be less than or equal to 40 characters/);
      });

      test('Should accept valid parameter at max length (40 characters)', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'MaxLenQP', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedQueryParameters: ['a'.repeat(40)] },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'Valid10QP', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedQueryParameters: Array.from({ length: 10 }, (_, i) => `param${i}`) },
          });
        }).not.toThrow();
      });
    });

    describe('allowedRequestHeaders validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'EmptyReqH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedRequestHeaders: [] },
          });
        }).toThrow(/allowedRequestHeaders cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'TooManyReqH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedRequestHeaders: Array.from({ length: 11 }, (_, i) => `Header-${i}`) },
          });
        }).toThrow(/allowedRequestHeaders cannot exceed 10 items/);
      });

      test('Should reject header name longer than 100 characters', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'LongReqH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedRequestHeaders: ['X-Custom-Header-' + 'a'.repeat(100)] },
          });
        }).toThrow(/allowedRequestHeaders\[0\].*must be less than or equal to 100 characters/);
      });

      test('Should accept valid header at max length (100 characters)', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'MaxLenReqH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedRequestHeaders: ['X-' + 'a'.repeat(98)] },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'Valid10ReqH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedRequestHeaders: Array.from({ length: 10 }, (_, i) => `X-Header-${i}`) },
          });
        }).not.toThrow();
      });
    });

    describe('allowedResponseHeaders validation', () => {
      test('Should reject empty array', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'EmptyResH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedResponseHeaders: [] },
          });
        }).toThrow(/allowedResponseHeaders cannot be an empty array/);
      });

      test('Should reject more than 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'TooManyResH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedResponseHeaders: Array.from({ length: 11 }, (_, i) => `X-Response-${i}`) },
          });
        }).toThrow(/allowedResponseHeaders cannot exceed 10 items/);
      });

      test('Should reject header name longer than 100 characters', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'LongResH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedResponseHeaders: ['X-Custom-Response-' + 'a'.repeat(100)] },
          });
        }).toThrow(/allowedResponseHeaders\[0\].*must be less than or equal to 100 characters/);
      });

      test('Should accept valid header at max length (100 characters)', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'MaxLenResH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedResponseHeaders: ['X-' + 'a'.repeat(98)] },
          });
        }).not.toThrow();
      });

      test('Should accept valid configuration with 10 items', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'Valid10ResH', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: { allowedResponseHeaders: Array.from({ length: 10 }, (_, i) => `X-Response-${i}`) },
          });
        }).not.toThrow();
      });
    });

    describe('Combined metadata configuration', () => {
      test('Should validate all fields together', () => {
        expect(() => {
          GatewayTarget.forApiGateway(stack, 'AllFields', {
            gateway, restApi, apiGatewayToolConfiguration: toolConfig,
            metadataConfiguration: {
              allowedQueryParameters: ['userId', 'sessionId'],
              allowedRequestHeaders: ['Authorization', 'X-API-Key'],
              allowedResponseHeaders: ['X-Request-ID', 'X-Rate-Limit'],
            },
          });
        }).not.toThrow();
      });

      test('Should not render metadata configuration in apiGateway block', () => {
        const config = ApiGatewayTargetConfiguration.create({
          restApi: restApi,
          apiGatewayToolConfiguration: toolConfig,
        });

        const rendered = config._render();
        expect(rendered.mcp.apiGateway.metadataConfiguration).toBeUndefined();
      });
    });
  });
});
