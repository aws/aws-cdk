/**
 * IMPORTANT: For this test to work, the foundational model must be enabled in your AWS account.
 * Go to the Amazon Bedrock console and request access to the Claude 3.5 Sonnet model before running this test.
 *
 * This integration test demonstrates the ModelAccessValidator functionality with a foundational model.
 * The validator will create IAM policies and custom resources to verify model access permissions.
 */

/// !cdk-integ bedrock-agent-model-validation

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

// Use short stack name to avoid CDK truncation in Lambda function names
const stackName = 'bedrock-model-val';
const stack = new cdk.Stack(app, stackName);

new bedrock.Agent(stack, 'TestAgent', {
  agentName: 'model-validation-agent',
  instruction: 'You are a helpful assistant for testing model validation with at least 40 characters.',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  // validateModelAccess is true by default, so ModelAccessValidator will be created
});

const integTest = new integ.IntegTest(app, 'BedrockAgentModelValidationTest', {
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
