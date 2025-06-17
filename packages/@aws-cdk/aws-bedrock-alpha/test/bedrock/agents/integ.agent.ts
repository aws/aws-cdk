/*
 * Integration test for Bedrock Agent construct
 */

/// !cdk-integ aws-cdk-bedrock-agent-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agent-1');

// Create a collaborator agent
const collaboratorAgent = new bedrock.Agent(stack, 'CollaboratorAgent', {
  agentName: 'collaborator-agent',
  instruction: 'This is a collaborator agent with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
});

// Create a custom alias for the collaborator agent
const collaboratorAlias = new bedrock.AgentAlias(stack, 'CollaboratorAlias', {
  agentAliasName: 'collaborator-alias',
  agent: collaboratorAgent,
});

// Create a Bedrock Agent with collaboration enabled
new bedrock.Agent(stack, 'MyAgent', {
  agentName: 'test-agent-1',
  instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  // Configure collaboration
  agentCollaboration: new bedrock.AgentCollaboration({
    type: bedrock.AgentCollaboratorType.SUPERVISOR,
    collaborators: [
      new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias,
        collaborationInstruction: 'Help the primary agent with complex tasks and provide additional context',
        collaboratorName: 'HelperAgent',
        relayConversationHistory: true,
      }),
    ],
  }),
});

new integ.IntegTest(app, 'BedrockAgent', {
  testCases: [stack],
});

app.synth();
