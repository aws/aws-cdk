/**
 * Integration test for Bedrock AgentCore Runtime and RuntimeEndpoint constructs
 * This test creates a single runtime with multiple endpoints to test both constructs together
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime');

// Use fromAsset to build and push Docker image to ECR automatically
// This uses a minimal test application with no external dependencies
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Create a single runtime (similar to the working strands example)
const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime',
  description: 'Integration test runtime for BedrockAgentCore',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  environmentVariables: {
    TEST_ENV: 'integration',
    LOG_LEVEL: 'INFO',
  },
  tags: {
    Environment: 'Integration',
    TestType: 'CDK',
  },
});

// Test RuntimeEndpoint by creating multiple endpoints on the same runtime
// This is more efficient than creating separate runtimes for each endpoint

// Create basic endpoint
const basicEndpoint = new agentcore.RuntimeEndpoint(stack, 'BasicEndpoint', {
  endpointName: 'basic_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1',
  description: 'Basic endpoint for testing',
});

// Create endpoint with tags
const taggedEndpoint = new agentcore.RuntimeEndpoint(stack, 'TaggedEndpoint', {
  endpointName: 'tagged_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1',
  description: 'Endpoint with tags',
  tags: {
    EndpointType: 'Tagged',
    Version: 'v1',
  },
});

// Create version 1 endpoint (second endpoint)
const v1Endpoint2 = new agentcore.RuntimeEndpoint(stack, 'V1Endpoint2', {
  endpointName: 'v1_endpoint_2',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '1',
  description: 'Second version 1 endpoint',
});

// Test grant methods to verify sub-resource permissions
const testFunction = new lambda.Function(stack, 'TestInvokerFunction', {
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'index.handler',
  code: lambda.Code.fromInline('def handler(event, context): return {"statusCode": 200}'),
  description: 'Test function to verify runtime grant permissions with sub-resources',
});

// Grant invoke permissions - this will include sub-resource wildcard in IAM policy
runtime.grantInvoke(testFunction);

// Output runtime and endpoint information for verification
new cdk.CfnOutput(stack, 'RuntimeId', {
  value: runtime.agentRuntimeId,
  description: 'Runtime ID',
});

new cdk.CfnOutput(stack, 'RuntimeArn', {
  value: runtime.agentRuntimeArn,
  description: 'Runtime ARN',
});

new cdk.CfnOutput(stack, 'BasicEndpointId', {
  value: basicEndpoint.endpointId,
  description: 'Basic endpoint ID',
});

new cdk.CfnOutput(stack, 'TaggedEndpointId', {
  value: taggedEndpoint.endpointId,
  description: 'Tagged endpoint ID',
});

new cdk.CfnOutput(stack, 'V1Endpoint2Id', {
  value: v1Endpoint2.endpointId,
  description: 'Second version 1 endpoint ID',
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});
