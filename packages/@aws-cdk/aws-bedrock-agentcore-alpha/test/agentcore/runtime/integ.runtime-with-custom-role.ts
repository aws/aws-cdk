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
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});
