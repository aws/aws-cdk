/*
 * Integration test for Bedrock Agent construct with existing role
 */

/// !cdk-integ aws-cdk-bedrock-agent-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agent-existing-role-1');

// Create a role
const role = new iam.Role(stack, 'AgentRole', {
  assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
});

// Create an agent with an existing role
new bedrock.Agent(stack, 'Agent', {
  instruction: 'This is a test agent that uses an existing IAM role.',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  existingRole: role,
});

new integ.IntegTest(app, 'BedrockAgentExistingRole', {
  testCases: [stack],
});

app.synth();
