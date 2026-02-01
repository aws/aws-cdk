#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';

/**
 * Integration test for adding routes to an imported HttpApi.
 *
 * This test demonstrates the cross-stack use case where:
 * - Stack 1 creates an HttpApi and exports its ID
 * - Stack 2 imports the HttpApi and adds routes using addRoutes()
 *
 * This is a common pattern for microservices architectures where each
 * service stack adds its own routes to a shared API Gateway.
 *
 * Architecture:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │                        ApiStack                             │
 *   │  ┌─────────────────────────────────────────────────────┐   │
 *   │  │              SharedHttpApi                          │   │
 *   │  │              (HttpApi)                              │   │
 *   │  └──────────────────────┬──────────────────────────────┘   │
 *   │                         │                                   │
 *   │                         ▼                                   │
 *   │              CfnOutput: HttpApiId                           │
 *   │              Export: "SharedHttpApiId"                      │
 *   └─────────────────────────┬───────────────────────────────────┘
 *                             │
 *                    Fn::ImportValue
 *                             │
 *   ┌─────────────────────────▼───────────────────────────────────┐
 *   │                      RouteStack                             │
 *   │  ┌─────────────────────────────────────────────────────┐   │
 *   │  │           ImportedApi                               │   │
 *   │  │    (HttpApi.fromHttpApiAttributes)                  │   │
 *   │  └──────────────────────┬──────────────────────────────┘   │
 *   │                         │                                   │
 *   │            ┌────────────┴────────────┐                     │
 *   │            │      addRoutes()        │                     │
 *   │            ▼                         ▼                     │
 *   │   ┌────────────────┐       ┌────────────────┐              │
 *   │   │  GET /pets     │       │  POST /pets    │              │
 *   │   │  (HttpRoute)   │       │  (HttpRoute)   │              │
 *   │   └───────┬────────┘       └───────┬────────┘              │
 *   │           │                        │                       │
 *   │           └──────────┬─────────────┘                       │
 *   │                      ▼                                     │
 *   │           ┌────────────────────┐                           │
 *   │           │  Lambda Handler    │                           │
 *   │           │  (HttpLambda       │                           │
 *   │           │   Integration)     │                           │
 *   │           └────────────────────┘                           │
 *   └─────────────────────────────────────────────────────────────┘
 */

const app = new cdk.App();

// Stack 1: Create the HTTP API
const apiStack = new cdk.Stack(app, 'ApiStack');
const httpApi = new apigw.HttpApi(apiStack, 'SharedHttpApi', {
  apiName: 'SharedApi',
});

// Export the API ID for cross-stack reference
new cdk.CfnOutput(apiStack, 'HttpApiId', {
  value: httpApi.apiId,
  exportName: 'SharedHttpApiId',
});

// Stack 2: Import the API and add routes
const routeStack = new cdk.Stack(app, 'RouteStack');
routeStack.addDependency(apiStack);

// Import the HTTP API using fromHttpApiAttributes
const importedApi = apigw.HttpApi.fromHttpApiAttributes(routeStack, 'ImportedApi', {
  httpApiId: cdk.Fn.importValue('SharedHttpApiId'),
});

// Create a Lambda function for the integration
const handler = new lambda.Function(routeStack, 'Handler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from imported API route!' }),
      };
    };
  `),
});

// Add routes to the imported API - this is the feature being tested
importedApi.addRoutes({
  path: '/pets',
  methods: [apigw.HttpMethod.GET],
  integration: new HttpLambdaIntegration('GetPetsIntegration', handler),
});

importedApi.addRoutes({
  path: '/pets',
  methods: [apigw.HttpMethod.POST],
  integration: new HttpLambdaIntegration('CreatePetIntegration', handler),
});

new IntegTest(app, 'http-api-import-routes', {
  testCases: [apiStack, routeStack],
});
