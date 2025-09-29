/**
 * Integration test for Bedrock AgentCore Runtime construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime

import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime');

// Create a mock ECR repository for testing
const mockRepository = ecr.Repository.fromRepositoryAttributes(
  stack,
  'MockRepository',
  {
    repositoryArn: `arn:aws:ecr:${stack.region}:${stack.account}:repository/bedrock-agentcore-runtime-test`,
    repositoryName: 'bedrock-agentcore-runtime-test',
  },
);

// Create runtime artifact from mock ECR repository
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(
  mockRepository,
  'latest',
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

// Create runtime with JWT authentication
new agentcore.Runtime(stack, 'RuntimeWithAuth', {
  runtimeName: 'runtime_with_auth',
  description: 'Runtime with JWT authentication',
  agentRuntimeArtifact: runtimeArtifact,
  authorizerConfiguration: {
    mode: agentcore.AuthenticationMode.JWT,
    customJWTAuthorizer: {
      discoveryUrl: 'https://auth.example.com/.well-known/openid-configuration',
      allowedClients: ['client1', 'client2'],
      allowedAudience: ['api.example.com'],
    },
  },
});

// Create runtime with custom execution role
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
