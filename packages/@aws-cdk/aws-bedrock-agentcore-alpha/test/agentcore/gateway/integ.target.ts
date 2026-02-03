/**
 * Integration test for AWS Bedrock AgentCore GatewayTarget
 *
 * Tests GatewayTarget using static factory methods and constructor
 * Differentiates from integ.gateway.ts by testing low-level Target API
 */

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreTargetIntegTest');

// Create Gateway
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'target-integ-test-gateway',
  description: 'Gateway for testing GatewayTarget static methods and constructor',
});

// ===== Test 1: GatewayTarget.forLambda() Static Method =====
const lambdaFunction1 = new lambda.Function(stack, 'Lambda1', {
  functionName: 'integ-test-target-lambda1',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return { message: 'From forLambda() static method' };
    };
  `),
});

const toolSchema1 = agentcore.ToolSchema.fromInline([
  {
    name: 'tool1',
    description: 'Tool via forLambda static method',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        param: { type: agentcore.SchemaDefinitionType.STRING },
      },
    },
  },
]);

const lambdaTarget = agentcore.GatewayTarget.forLambda(stack, 'LambdaTarget', {
  gateway: gateway,
  gatewayTargetName: 'lambda-via-static',
  description: 'Target created via forLambda static method',
  lambdaFunction: lambdaFunction1,
  toolSchema: toolSchema1,
});

// ===== Test 2: GatewayTarget.forOpenApi() Static Method =====
// NOTE: OpenAPI targets are NOT included in this integration test because they require
// either API_KEY or OAUTH credential providers (IAM is not supported for OpenAPI targets).
// Setting up these credential providers requires external resources (Secrets Manager, OAuth providers)
// that are not suitable for automated integration tests.

// ===== Test 3: GatewayTarget.forSmithy() Static Method =====
// Using Smithy AST JSON format (required by AWS Bedrock AgentCore)
const smithyTarget = agentcore.GatewayTarget.forSmithy(stack, 'SmithyTarget', {
  gateway: gateway,
  gatewayTargetName: 'smithy-via-static',
  description: 'Target created via forSmithy static method',
  smithyModel: agentcore.ApiSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'smithy', 'basic-service.json')),
});

// ===== Test 4: GatewayTarget Constructor with LambdaTargetConfiguration =====
const lambdaFunction2 = new lambda.Function(stack, 'Lambda2', {
  functionName: 'integ-test-target-lambda2',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return { message: 'From constructor with LambdaTargetConfiguration' };
    };
  `),
});

const toolSchema2 = agentcore.ToolSchema.fromInline([
  {
    name: 'tool2',
    description: 'Tool via constructor',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        data: { type: agentcore.SchemaDefinitionType.STRING },
      },
    },
  },
]);

const constructorTarget = new agentcore.GatewayTarget(stack, 'ConstructorTarget', {
  gateway: gateway,
  gatewayTargetName: 'lambda-via-constructor',
  description: 'Target created via constructor',
  targetConfiguration: agentcore.LambdaTargetConfiguration.create(
    lambdaFunction2,
    toolSchema2,
  ),
});

lambdaTarget.node.addDependency(gateway.role);
constructorTarget.node.addDependency(gateway.role);

// ===== Outputs =====
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
});

new cdk.CfnOutput(stack, 'LambdaTargetId', {
  value: lambdaTarget.targetId,
});

new cdk.CfnOutput(stack, 'SmithyTargetId', {
  value: smithyTarget.targetId,
});

new cdk.CfnOutput(stack, 'ConstructorTargetId', {
  value: constructorTarget.targetId,
});

// Create the integration test
// Note: Assertions are not included because they create cross-stack references
// which fail when tests run in parallel across regions.
// The test validates that all target creation methods work correctly and can be deployed.
new integ.IntegTest(app, 'TargetIntegTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});

