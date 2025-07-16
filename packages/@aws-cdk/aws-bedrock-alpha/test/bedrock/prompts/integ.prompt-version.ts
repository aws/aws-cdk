/*
 * Integration test for Bedrock Prompt Version construct
 */

/// !cdk-integ aws-cdk-bedrock-prompt-version-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-prompt-version-1');

// Foundation model for testing
const foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;

// Create a base prompt for versioning (only 1 variant supported)
const basePrompt = new bedrock.Prompt(stack, 'BasePrompt', {
  promptName: 'versioning-test-prompt',
  description: 'A prompt used for testing versioning capabilities',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'base-variant',
      model: foundationModel,
      promptText: 'Base version of the prompt for {{use_case}}.',
      promptVariables: ['use_case'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        maxTokens: 200,
        temperature: 0.7,
      }),
    }),
  ],
});

// Create multiple versions of the same prompt using PromptVersion construct
new bedrock.PromptVersion(stack, 'Version1', {
  prompt: basePrompt,
  description: 'Version 1.0 - Initial release of the prompt',
});

new bedrock.PromptVersion(stack, 'Version2', {
  prompt: basePrompt,
  description: 'Version 1.1 - Minor improvements and bug fixes',
});

new bedrock.PromptVersion(stack, 'Version3', {
  prompt: basePrompt,
  description: 'Version 2.0 - Major update with enhanced capabilities',
});

// Create a text prompt for versioning
const textPrompt = new bedrock.Prompt(stack, 'TextPrompt', {
  promptName: 'text-versioning-prompt',
  description: 'A text prompt for comprehensive versioning tests',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'text-variant',
      model: foundationModel,
      promptText: 'Text variant for {{scenario}} with {{parameters}}.',
      promptVariables: ['scenario', 'parameters'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        maxTokens: 300,
        temperature: 0.6,
        topP: 0.9,
      }),
    }),
  ],
});

// Create a chat prompt for versioning
const chatPrompt = new bedrock.Prompt(stack, 'ChatPrompt', {
  promptName: 'chat-versioning-prompt',
  description: 'A chat prompt for comprehensive versioning tests',
  variants: [
    bedrock.PromptVariant.chat({
      variantName: 'chat-variant',
      model: foundationModel,
      messages: [
        bedrock.ChatMessage.user('I need help with {{scenario}}'),
        bedrock.ChatMessage.assistant('I can help you with that scenario. What specific aspects would you like to explore?'),
        bedrock.ChatMessage.user('Please focus on {{parameters}}'),
      ],
      system: 'You are an expert assistant specializing in complex scenario analysis.',
      promptVariables: ['scenario', 'parameters'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        maxTokens: 400,
        temperature: 0.8,
      }),
    }),
  ],
});

// Create versions of the text and chat prompts
new bedrock.PromptVersion(stack, 'TextVersion1', {
  prompt: textPrompt,
  description: 'Version 1.0 of text prompt - Initial text release',
});

new bedrock.PromptVersion(stack, 'ChatVersion1', {
  prompt: chatPrompt,
  description: 'Version 1.0 of chat prompt - Initial chat release',
});

const encryptedPrompt = new bedrock.Prompt(stack, 'EncryptedPrompt', {
  promptName: 'encrypted-versioning-prompt',
  description: 'An encrypted prompt for testing secure versioning',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'encrypted-variant',
      model: foundationModel,
      promptText: 'Encrypted prompt content for {{sensitive_data}} processing.',
      promptVariables: ['sensitive_data'],
    }),
  ],
});

// Create versions of the encrypted prompt
new bedrock.PromptVersion(stack, 'EncryptedVersion1', {
  prompt: encryptedPrompt,
  description: 'Version 1.0 of encrypted prompt - Secure baseline',
});

new bedrock.PromptVersion(stack, 'EncryptedVersion2', {
  prompt: encryptedPrompt,
  description: 'Version 1.1 of encrypted prompt - Enhanced security features',
});

// Create an agent-based prompt for versioning
const versioningAgent = new bedrock.Agent(stack, 'VersioningAgent', {
  agentName: 'versioning-test-agent',
  instruction: 'This agent is used for testing prompt versioning with agent variants',
  foundationModel,
  forceDelete: true,
});

const versioningAgentAlias = new bedrock.AgentAlias(stack, 'VersioningAgentAlias', {
  agentAliasName: 'versioning-alias',
  agent: versioningAgent,
});

const agentPrompt = new bedrock.Prompt(stack, 'AgentPrompt', {
  promptName: 'agent-versioning-prompt',
  description: 'A prompt with agent variants for versioning tests',
  variants: [
    bedrock.PromptVariant.agent({
      variantName: 'agent-variant',
      model: foundationModel,
      agentAlias: versioningAgentAlias,
      promptText: 'Agent, handle {{request_type}} with priority {{priority_level}}.',
      promptVariables: ['request_type', 'priority_level'],
    }),
  ],
});

// Create versions of the agent prompt
new bedrock.PromptVersion(stack, 'AgentVersion1', {
  prompt: agentPrompt,
  description: 'Version 1.0 of agent prompt - Initial agent integration',
});

new bedrock.PromptVersion(stack, 'AgentVersion2', {
  prompt: agentPrompt,
  description: 'Version 1.1 of agent prompt - Improved agent handling',
});

// Test versioning with tool-enabled chat prompts
const toolPrompt = new bedrock.Prompt(stack, 'ToolPrompt', {
  promptName: 'tool-versioning-prompt',
  description: 'A prompt with tool configuration for versioning tests',
  variants: [
    bedrock.PromptVariant.chat({
      variantName: 'tool-chat-variant',
      model: foundationModel,
      messages: [
        bedrock.ChatMessage.user('Help me with {{task}} using available tools.'),
      ],
      system: 'You have access to various tools to help users complete their tasks.',
      promptVariables: ['task'],
      toolConfiguration: {
        toolChoice: bedrock.ToolChoice.AUTO,
        tools: [
          bedrock.Tool.function({
            name: 'data_analyzer',
            description: 'Analyze data and provide insights',
            inputSchema: {
              type: 'object',
              properties: {
                data: {
                  type: 'string',
                  description: 'Data to analyze',
                },
                analysis_type: {
                  type: 'string',
                  enum: ['statistical', 'trend', 'comparative'],
                  description: 'Type of analysis to perform',
                },
              },
              required: ['data'],
            },
          }),
        ],
      },
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        maxTokens: 500,
        temperature: 0.7,
      }),
    }),
  ],
});

// Create versions of the tool prompt
new bedrock.PromptVersion(stack, 'ToolVersion1', {
  prompt: toolPrompt,
  description: 'Version 1.0 of tool prompt - Basic tool integration',
});

new bedrock.PromptVersion(stack, 'ToolVersion2', {
  prompt: toolPrompt,
  description: 'Version 1.1 of tool prompt - Enhanced tool capabilities',
});

// Test edge cases for versioning
const edgeCasePrompt = new bedrock.Prompt(stack, 'EdgeCasePrompt', {
  promptName: 'edge-case-versioning-prompt',
  description: 'Testing edge cases in prompt versioning',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'edge-case-variant',
      model: foundationModel,
      promptText: 'Edge case prompt for testing versioning scenarios with {{parameter}}.',
      promptVariables: ['parameter'],
    }),
  ],
});

// Version with no description
new bedrock.PromptVersion(stack, 'NoDescriptionVersion', {
  prompt: edgeCasePrompt,
});

// Version with minimal description (minimum length is 1)
new bedrock.PromptVersion(stack, 'MinimalDescriptionVersion', {
  prompt: edgeCasePrompt,
  description: 'A',
});

// Version with maximum allowed description (maximum length is 200)
const maxDescription = 'A'.repeat(189) + ' - Max'; // 189 + 7 = 196 characters (within limit)
new bedrock.PromptVersion(stack, 'MaxDescriptionVersion', {
  prompt: edgeCasePrompt,
  description: maxDescription,
});

// Version with special characters in description
new bedrock.PromptVersion(stack, 'SpecialCharVersion', {
  prompt: edgeCasePrompt,
  description: 'Version with special chars: !@#$%^&*()_+-=[]{}|;:,.<>? and unicode: 🚀✨🔧',
});

// Test createVersion method (create separate prompts to avoid duplicate construct names)
const methodTestPrompt1 = new bedrock.Prompt(stack, 'MethodTestPrompt1', {
  promptName: 'method-test-prompt-1',
  description: 'Testing createVersion method - prompt 1',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'method-variant-1',
      model: foundationModel,
      promptText: 'Method test prompt 1 for {{purpose}}.',
      promptVariables: ['purpose'],
    }),
  ],
});

const methodTestPrompt2 = new bedrock.Prompt(stack, 'MethodTestPrompt2', {
  promptName: 'method-test-prompt-2',
  description: 'Testing createVersion method - prompt 2',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'method-variant-2',
      model: foundationModel,
      promptText: 'Method test prompt 2 for {{purpose}}.',
      promptVariables: ['purpose'],
    }),
  ],
});

// Create versions using the prompt's createVersion method (one per prompt to avoid conflicts)
methodTestPrompt1.createVersion('Version 2.1 - Created via prompt method');
methodTestPrompt2.createVersion('Version 2.2 - Another method-created version');

new integ.IntegTest(app, 'BedrockPromptVersion', {
  testCases: [stack],
});

app.synth();
