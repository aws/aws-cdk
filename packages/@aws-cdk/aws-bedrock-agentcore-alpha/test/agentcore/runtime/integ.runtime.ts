/**
 * Integration test for Bedrock AgentCore Runtime construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime');

// Use fromAsset to build and push Docker image to ECR automatically
// This will create an ECR repository in the stack's account and push the image
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Create a basic runtime
const basicRuntime = new agentcore.Runtime(stack, 'BasicRuntime', {
  runtimeName: 'basic_runtime',
  description: 'Basic runtime for integration testing',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: {
    networkMode: agentcore.NetworkMode.PUBLIC,
  },
});

// Create runtime with environment variables
const runtimeWithEnv = new agentcore.Runtime(stack, 'RuntimeWithEnv', {
  runtimeName: 'runtime_with_env',
  description: 'Runtime with environment variables',
  agentRuntimeArtifact: runtimeArtifact,
  environmentVariables: {
    API_ENDPOINT: 'https://api.example.com',
    LOG_LEVEL: 'DEBUG',
    MAX_CONNECTIONS: '100',
  },
});

// Test runtime with custom execution role
const customRole = new iam.Role(stack, 'CustomExecutionRole', {
  assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
  description: 'Custom execution role for runtime',
});

new agentcore.Runtime(stack, 'RuntimeWithCustomRole', {
  runtimeName: 'runtime_custom_role',
  description: 'Runtime with custom execution role',
  agentRuntimeArtifact: runtimeArtifact,
  executionRole: customRole,
});

// Grant permissions example
const testRole = new iam.Role(stack, 'TestRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

basicRuntime.grantInvoke(testRole);
runtimeWithEnv.grantInvoke(testRole);

new integ.IntegTest(app, 'BedrockAgentCoreRuntime', {
  testCases: [stack],
});

app.synth();
