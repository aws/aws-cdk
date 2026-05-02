/**
 * Integration test for Bedrock AgentCore Runtime with asset deployment
 * This Test creates MULTIPLE Runtime Environments from a SINGLE artifact
 *
 * Motive of this test is to verify the CFN output template contains necessary permissions for ALL of the multiple Runtime roles.
 *
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-multipleRuntimes-with-singleArtifact

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-multipleRuntimes-with-singleArtifact');

// Using fromAsset to build and push Docker image to ECR automatically
const artifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

new agentcore.Runtime(stack, 'Runtime_1', {
  runtimeName: 'Runtime_1',
  agentRuntimeArtifact: artifact,
});

new agentcore.Runtime(stack, 'Runtime_2', {
  runtimeName: 'Runtime_2',
  agentRuntimeArtifact: artifact,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntime-multipleRuntimes-singleArtifact', {
  testCases: [stack],
});
