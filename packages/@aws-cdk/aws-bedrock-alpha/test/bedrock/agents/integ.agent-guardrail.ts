/*
 * Integration test for Bedrock Agent with Guardrail construct
 */

/// !cdk-integ aws-cdk-bedrock-agent-guardrail-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agent-guardrail-1');

// Create a guardrail
const guardrail = new bedrock.Guardrail(stack, 'Guardrail', {
  guardrailName: 'guardrail',
  description: 'This is a guardrail with at least 40 characters of description',
});

guardrail.addContentFilter({
  type: bedrock.ContentFilterType.SEXUAL,
  inputStrength: bedrock.ContentFilterStrength.HIGH,
  outputStrength: bedrock.ContentFilterStrength.MEDIUM,
});

// Create an agent with a guardrail
new bedrock.Agent(stack, 'AgentWithGuardrail', {
  agentName: 'agent-with-guardrail',
  instruction: 'You are a helpful and friendly agent that answers questions about literature.',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  guardrail: guardrail,
  forceDelete: true,
});

new integ.IntegTest(app, 'BedrockAgentGuardrail', {
  testCases: [stack],
});

app.synth();
