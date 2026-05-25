/**
 * Integration test for Bedrock AgentCore Runtime application log group tagging.
 * Verifies that CDK pre-creates the service-managed log group with user-specified
 * tags when `applicationLogGroupTags` is provided.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-application-log-group-tags

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-application-log-group-tags');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Runtime with applicationLogGroupTags — CDK pre-creates the log group so that
// mandatory data-classification tags are present before the first invocation.
new agentcore.Runtime(stack, 'TaggedLogGroupRuntime', {
  runtimeName: 'integ_tagged_log_group_runtime',
  description: 'Runtime with tagged application log group for PII data isolation',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  applicationLogGroupTags: {
    DataClassification: 'PII',
    Environment: 'integ',
    CostCenter: 'platform-test',
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeApplicationLogGroupTagsTest', {
  testCases: [stack],
});
