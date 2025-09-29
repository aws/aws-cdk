/**
 * Integration test for Bedrock AgentCore Runtime Endpoint construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-endpoint

import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-endpoint');

// Create ECR repository for runtime artifact
const repository = new ecr.Repository(stack, 'RuntimeRepository', {
  repositoryName: 'agentcore-endpoint-integ',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Create runtime artifact
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(
  repository,
  'v1.0.0',
);

// Create runtime first
const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  agentRuntimeName: 'endpoint_test_runtime',
  description: 'Runtime for endpoint integration testing',
  agentRuntimeArtifact: runtimeArtifact,
});

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
    Environment: 'Integration',
    Project: 'AgentCore',
    Team: 'Platform',
  },
});

// Create multiple version endpoints
const v2Endpoint = new agentcore.RuntimeEndpoint(stack, 'V2Endpoint', {
  endpointName: 'v2_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '2',
  description: 'Version 2 endpoint',
});

const v3Endpoint = new agentcore.RuntimeEndpoint(stack, 'V3Endpoint', {
  endpointName: 'v3_endpoint',
  agentRuntimeId: runtime.agentRuntimeId,
  agentRuntimeVersion: '3',
  description: 'Version 3 endpoint',
});

// Output endpoint IDs for verification
new cdk.CfnOutput(stack, 'BasicEndpointId', {
  value: basicEndpoint.endpointId,
  description: 'Basic endpoint ID',
});

new cdk.CfnOutput(stack, 'TaggedEndpointId', {
  value: taggedEndpoint.endpointId,
  description: 'Tagged endpoint ID',
});

new cdk.CfnOutput(stack, 'V2EndpointId', {
  value: v2Endpoint.endpointId,
  description: 'Version 2 endpoint ID',
});

new cdk.CfnOutput(stack, 'V3EndpointId', {
  value: v3Endpoint.endpointId,
  description: 'Version 3 endpoint ID',
});

new integ.IntegTest(app, 'BedrockAgentCoreEndpoint', {
  testCases: [stack],
});

app.synth();
