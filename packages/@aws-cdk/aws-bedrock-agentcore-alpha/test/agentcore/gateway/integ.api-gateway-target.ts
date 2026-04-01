/**
 * Integration test for AWS Bedrock AgentCore Gateway with API Gateway Target
 *
 * Tests GatewayTarget with ApiGatewayTargetConfiguration to validate:
 * - API Gateway REST API integration with Gateway
 * - IAM-based authorization for execute-api:Invoke
 * - Tool filters and metadata configuration
 * - End-to-end deployment and permissions
 */

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreApiGatewayTargetIntegTest', {
});

// Create Gateway
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'api-gateway-target-integ-test',
  description: 'Gateway for testing API Gateway target integration',
});

// ===== Create a REST API with Lambda backend =====
// This simulates a real REST API that the Gateway will call
const backendFunction = new lambda.Function(stack, 'BackendFunction', {
  functionName: 'integ-test-apigateway-backend',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Backend API called:', JSON.stringify(event));

      const path = event.path || event.resource;
      const method = event.httpMethod;

      // Handle different paths
      if (path === '/pets' && method === 'GET') {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pets: [
              { id: '1', name: 'Fluffy', type: 'cat' },
              { id: '2', name: 'Buddy', type: 'dog' }
            ]
          })
        };
      }

      if (path.startsWith('/pets/') && method === 'GET') {
        const petId = path.split('/')[2];
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: petId,
            name: 'Pet ' + petId,
            type: 'unknown'
          })
        };
      }

      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Not found' })
      };
    };
  `),
  description: 'Backend Lambda for API Gateway integration test',
});

// Create REST API
const restApi = new apigateway.RestApi(stack, 'TestRestApi', {
  restApiName: 'integ-test-api-gateway-target',
  description: 'REST API for testing Gateway API Gateway target integration',
  deployOptions: {
    stageName: 'prod',
  },
  defaultMethodOptions: {
    authorizationType: apigateway.AuthorizationType.IAM,
  },
});

// Define response models for OpenAPI spec
const responseModel = restApi.addModel('ResponseModel', {
  contentType: 'application/json',
  modelName: 'PetsResponse',
  schema: {
    type: apigateway.JsonSchemaType.OBJECT,
    properties: {
      pets: {
        type: apigateway.JsonSchemaType.ARRAY,
        items: {
          type: apigateway.JsonSchemaType.OBJECT,
          properties: {
            id: { type: apigateway.JsonSchemaType.STRING },
            name: { type: apigateway.JsonSchemaType.STRING },
            type: { type: apigateway.JsonSchemaType.STRING },
          },
        },
      },
    },
  },
});

const petResponseModel = restApi.addModel('PetResponseModel', {
  contentType: 'application/json',
  modelName: 'PetResponse',
  schema: {
    type: apigateway.JsonSchemaType.OBJECT,
    properties: {
      id: { type: apigateway.JsonSchemaType.STRING },
      name: { type: apigateway.JsonSchemaType.STRING },
      type: { type: apigateway.JsonSchemaType.STRING },
    },
  },
});

// Add /pets resource with GET method
const petsResource = restApi.root.addResource('pets');
petsResource.addMethod(
  'GET',
  new apigateway.LambdaIntegration(backendFunction),
  {
    authorizationType: apigateway.AuthorizationType.IAM,
    operationName: 'listPets',
    methodResponses: [
      {
        statusCode: '200',
        responseModels: {
          'application/json': responseModel,
        },
      },
    ],
  },
);

// Add /pets/{petId} resource with GET method
const petIdResource = petsResource.addResource('{petId}');
petIdResource.addMethod(
  'GET',
  new apigateway.LambdaIntegration(backendFunction),
  {
    authorizationType: apigateway.AuthorizationType.IAM,
    operationName: 'getPetById',
    methodResponses: [
      {
        statusCode: '200',
        responseModels: {
          'application/json': petResponseModel,
        },
      },
    ],
  },
);

// ===== Test 1: GatewayTarget with ApiGatewayTargetConfiguration using forApiGateway =====
const apiGatewayTarget = agentcore.GatewayTarget.forApiGateway(stack, 'ApiGatewayTarget', {
  gateway: gateway,
  gatewayTargetName: 'api-gateway-via-static',
  description: 'Target created with API Gateway REST API',
  restApi: restApi,
  stage: 'prod',
  apiGatewayToolConfiguration: {
    toolFilters: [
      {
        filterPath: '/pets',
        methods: [agentcore.ApiGatewayHttpMethod.GET],
      },
      {
        filterPath: '/pets/{petId}',
        methods: [agentcore.ApiGatewayHttpMethod.GET],
      },
    ],
  },
});

// Ensure Gateway role and its policies are created before the target
apiGatewayTarget.node.addDependency(gateway.role);

// ===== Test 2: GatewayTarget with ApiGatewayTargetConfiguration using constructor =====
const apiGatewayTarget2 = new agentcore.GatewayTarget(stack, 'ApiGatewayTargetConstructor', {
  gateway: gateway,
  gatewayTargetName: 'api-gateway-via-constructor',
  description: 'Target created via constructor with ApiGatewayTargetConfiguration',
  targetConfiguration: agentcore.ApiGatewayTargetConfiguration.create({
    restApi: restApi,
    stage: 'prod',
    apiGatewayToolConfiguration: {
      toolFilters: [
        {
          filterPath: '/pets/*',
          methods: [agentcore.ApiGatewayHttpMethod.GET],
        },
      ],
    },
    metadataConfiguration: {
      allowedQueryParameters: ['limit', 'offset'],
      allowedRequestHeaders: ['X-Request-ID'],
      allowedResponseHeaders: ['X-Custom-Header'],
    },
  }),
});

// Ensure Gateway role and its policies are created before the target
apiGatewayTarget2.node.addDependency(gateway.role);

// ===== Outputs =====
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
  description: 'ID of the Gateway',
});

new cdk.CfnOutput(stack, 'RestApiId', {
  value: restApi.restApiId,
  description: 'ID of the REST API',
});

new cdk.CfnOutput(stack, 'RestApiUrl', {
  value: restApi.url,
  description: 'URL of the REST API',
});

new cdk.CfnOutput(stack, 'ApiGatewayTargetId', {
  value: apiGatewayTarget.targetId,
  description: 'ID of the API Gateway target (static method)',
});

new cdk.CfnOutput(stack, 'ApiGatewayTarget2Id', {
  value: apiGatewayTarget2.targetId,
  description: 'ID of the API Gateway target (constructor)',
});

// Create the integration test
// Note: This test validates that the API Gateway target can be deployed successfully
// and that all permissions are correctly configured for the Gateway to call the REST API
new integ.IntegTest(app, 'ApiGatewayTargetIntegTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});
