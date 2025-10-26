/**
 * Integration test for Bedrock AgentCore Runtime constructs with imported role
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-with-imported-role

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-with-imported-role');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

const role = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
});
const imported = iam.Role.fromRoleArn(stack, 'ImportedRole', role.roleArn);

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime',
  agentRuntimeArtifact: runtimeArtifact,
  executionRole: imported,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeWithImportedRole', {
  testCases: [stack],
});
