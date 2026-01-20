/**
 * Integration test for Bedrock AgentCore Runtime constructs with custom role
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-with-custom-role

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-with-custom-role');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

const role = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
});

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime',
  agentRuntimeArtifact: runtimeArtifact,
  executionRole: role,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeWithCustomRole', {
  testCases: [stack],
});
