/*
 * Integration test for Bedrock Agent construct
 */

/// !cdk-integ aws-cdk-bedrock-agent-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agent-1', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Create a Bedrock Agent with default values
new bedrock.Agent(stack, 'MyAgent', {
  agentName: 'test-agent-1',
  instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
});

new integ.IntegTest(app, 'BedrockAgent', {
  testCases: [stack],
});

app.synth();

