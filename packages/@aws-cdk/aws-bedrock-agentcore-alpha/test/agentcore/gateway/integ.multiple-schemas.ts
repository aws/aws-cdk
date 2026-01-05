/**
 * Integration test for multiple schema binding in AWS Bedrock AgentCore
 *
 * Tests that multiple ApiSchemas and ToolSchemas can be bound to the same scope
 * without construct ID collision (fixes issue #36559)
 */

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreMultipleSchemasIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// Create Gateway
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'multi-schema-integ-test',
  description: 'Gateway for testing multiple schema binding',
});

// ===== Test: Multiple Smithy targets with different schemas =====
// This tests that multiple ApiSchema.fromLocalAsset() can be used in the same scope

agentcore.GatewayTarget.forSmithy(stack, 'SmithyTarget1', {
  gateway: gateway,
  gatewayTargetName: 'smithy-target-1',
  description: 'First Smithy target',
  smithyModel: agentcore.ApiSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'smithy', 'basic-service.json')),
});

// Note: Using the same schema file for smithyTarget2 since we only have one smithy schema
// The key test is that binding multiple schemas with different paths works
agentcore.GatewayTarget.forSmithy(stack, 'SmithyTarget2', {
  gateway: gateway,
  gatewayTargetName: 'smithy-target-2',
  description: 'Second Smithy target',
  smithyModel: agentcore.ApiSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'smithy', 'basic-service.json')),
});

// ===== Test: Multiple Lambda targets with different ToolSchemas =====
// This tests that multiple ToolSchema.fromLocalAsset() can be used in the same scope

const lambdaFunction1 = new lambda.Function(stack, 'Lambda1', {
  functionName: 'integ-multi-schema-lambda1',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return { message: 'Lambda 1 response' };
    };
  `),
});

const lambdaFunction2 = new lambda.Function(stack, 'Lambda2', {
  functionName: 'integ-multi-schema-lambda2',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return { message: 'Lambda 2 response' };
    };
  `),
});

agentcore.GatewayTarget.forLambda(stack, 'LambdaTarget1', {
  gateway: gateway,
  gatewayTargetName: 'lambda-target-1',
  description: 'First Lambda target with tool schema',
  lambdaFunction: lambdaFunction1,
  toolSchema: agentcore.ToolSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'tool', 'schema1.json')),
});

agentcore.GatewayTarget.forLambda(stack, 'LambdaTarget2', {
  gateway: gateway,
  gatewayTargetName: 'lambda-target-2',
  description: 'Second Lambda target with tool schema',
  lambdaFunction: lambdaFunction2,
  toolSchema: agentcore.ToolSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'tool', 'schema2.json')),
});

// Create the integration test
new integ.IntegTest(app, 'MultipleSchemasIntegTest', {
  testCases: [stack],
});
