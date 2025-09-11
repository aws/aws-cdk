/**
 * IMPORTANT: For this test to work, the foundational model must be enabled in your AWS account.
 * Go to the Amazon Bedrock console and request access to the Claude 3.5 Sonnet V2 model in the
 * US region before running this test.
 *
 * This integration test demonstrates the ModelAccessValidator functionality with a cross-region inference profile.
 * The validator will create IAM policies with cross-region permissions and custom resources to verify access.
 */

/// !cdk-integ bedrock-agent-cross-region-validation

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

// Use short stack name to avoid CDK truncation in Lambda function names
const stackName = 'bedrock-cross-val';
const stack = new cdk.Stack(app, stackName);

const crossRegionProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
  geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
});

new bedrock.Agent(stack, 'TestAgent', {
  agentName: 'cross-region-validation-agent',
  instruction: 'You are a helpful assistant for testing cross-region model validation with at least 40 characters.',
  foundationModel: crossRegionProfile,
  // validateModelAccess is true by default, so ModelAccessValidator will be created
});

const integTest = new integ.IntegTest(app, 'BedrockAgentCrossRegionValidationTest', {
  testCases: [stack],
});

// Validate that the ModelAccessValidator Lambda function was created
// Lambda name will be: {stackName}-{hash}-{suffix}
const listFunctions = integTest.assertions.awsApiCall('Lambda', 'listFunctions', {});

listFunctions.expect(integ.ExpectedResult.objectLike({
  Functions: integ.Match.arrayWith([
    integ.Match.objectLike({
      FunctionName: integ.Match.stringLikeRegexp(`${stackName}.*`),
    }),
  ]),
}));
