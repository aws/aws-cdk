/**
 * Integration test for Bedrock AgentCore Runtime with filesystem configuration
 * This test creates a runtime that mounts a session storage filesystem at /mnt/data.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-filesystem

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-filesystem');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime_filesystem',
  description: 'Integration test runtime with session storage filesystem',
  agentRuntimeArtifact: runtimeArtifact,
  filesystemConfiguration: {
    sessionStorage: { mountPath: '/mnt/data' },
  },
});

new integ.IntegTest(app, 'integ-runtime-filesystem', {
  testCases: [stack],
});
