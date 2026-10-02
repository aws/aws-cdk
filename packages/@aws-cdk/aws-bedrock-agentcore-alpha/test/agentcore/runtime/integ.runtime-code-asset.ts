/**
 * Integration test for Bedrock AgentCore Runtime with code asset deployment
 * This test creates a runtime using the fromCodeAsset method
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-code-asset

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-code-asset');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromCodeAsset({
  path: path.join(__dirname, 'testArtifact'),
  runtime: agentcore.AgentCoreRuntime.PYTHON_3_13,
  entrypoint: ['app.py'],
  exclude: ['Dockerfile'],
});

new agentcore.Runtime(stack, 'TestRuntimeCodeAsset', {
  runtimeName: 'integ_test_runtime_code_asset',
  agentRuntimeArtifact: runtimeArtifact,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeCodeAssetTest', {
  testCases: [stack],
});
