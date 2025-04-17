/*
 * Integration test for Bedrock Agent construct
 *
 * Stack verification steps:
 * * Verify that a Bedrock Agent is created with the specified instruction
 * * Verify that the agent uses Claude 3.5 Sonnet v2.0 as its foundation model
 * * Verify that the agent is configured to be deleted when the stack is destroyed
 */

import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Bedrock Agent with minimal properties
    new bedrock.Agent(this, 'TestAgent', {
      agentName: 'test-agent-1',
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
      // Clean up the agent after test
      forceDelete: true,
    });
  }
}

const stack = new TestStack(app, 'agentIntegTestStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new IntegTest(app, 'BedrockAgentIntegTest', {
  testCases: [stack],

});

app.synth();
