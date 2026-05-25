/**
 * Integration test for Bedrock AgentCore Runtime application log group tagging.
 * Deploys a runtime with `applicationLogGroupTags` and asserts that the
 * pre-created CloudWatch Log Group exists with the expected tags.
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
const runtime = new agentcore.Runtime(stack, 'TaggedLogGroupRuntime', {
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

const testCase = new integ.IntegTest(app, 'BedrockAgentCoreRuntimeApplicationLogGroupTagsTest', {
  testCases: [stack],
});

// Assert the pre-created log group exists and carries the expected tags.
const logGroupName = cdk.Fn.join('', [
  '/aws/bedrock-agentcore/runtimes/',
  runtime.agentRuntimeId,
  '-DEFAULT',
]);

testCase.assertions
  .awsApiCall('CloudWatchLogs', 'listTagsForResource', {
    resourceArn: cdk.Fn.join('', [
      'arn:',
      stack.partition,
      ':logs:',
      stack.region,
      ':',
      stack.account,
      ':log-group:',
      logGroupName,
    ]),
  })
  .expect(
    integ.ExpectedResult.objectLike({
      tags: {
        DataClassification: 'PII',
        Environment: 'integ',
        CostCenter: 'platform-test',
      },
    }),
  );
