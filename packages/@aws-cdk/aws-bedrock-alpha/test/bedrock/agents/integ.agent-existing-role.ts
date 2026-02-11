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
  regions: ['ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'sa-east-1', 'us-east-1', 'us-east-2', 'us-west-2'],
});

app.synth();
