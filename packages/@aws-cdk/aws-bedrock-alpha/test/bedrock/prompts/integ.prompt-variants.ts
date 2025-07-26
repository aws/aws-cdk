/*
 * Integration test for Bedrock Prompt Variants
 */

/// !cdk-integ aws-cdk-bedrock-prompt-variants-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-prompt-variants-1');

// Foundation models for testing different variants
const anthropicModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;
const titanModel = bedrock.BedrockFoundationModel.AMAZON_TITAN_TEXT_EXPRESS_V1;

// Test Text Prompt Variants
const basicTextVariant = bedrock.PromptVariant.text({
  variantName: 'basic-text',
  model: anthropicModel,
  promptText: 'Simple text prompt without variables.',
});

const variableTextVariant = bedrock.PromptVariant.text({
  variantName: 'variable-text',
  model: anthropicModel,
  promptText: 'Text prompt with {{variable1}} and {{variable2}} for dynamic content.',
  promptVariables: ['variable1', 'variable2'],
});

const configuredTextVariant = bedrock.PromptVariant.text({
  variantName: 'configured-text',
  model: titanModel,
  promptText: 'Configured text prompt with inference settings for {{topic}}.',
  promptVariables: ['topic'],
  inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
    maxTokens: 150,
    temperature: 0.5,
    topP: 0.8,
    stopSequences: ['END', 'STOP'],
  }),
});

// Test Chat Prompt Variants
const basicChatVariant = bedrock.PromptVariant.chat({
  variantName: 'basic-chat',
  model: anthropicModel,
  messages: [
    bedrock.ChatMessage.user('Hello, how are you?'),
    bedrock.ChatMessage.assistant('I am doing well, thank you for asking!'),
  ],
});

const systemChatVariant = bedrock.PromptVariant.chat({
  variantName: 'system-chat',
  model: anthropicModel,
  messages: [
    bedrock.ChatMessage.user('Tell me about {{subject}}'),
    bedrock.ChatMessage.assistant('I would be happy to explain {{subject}} to you.'),
  ],
  system: 'You are an expert educator who explains complex topics in simple terms.',
  promptVariables: ['subject'],
});

const toolChatVariant = bedrock.PromptVariant.chat({
  variantName: 'tool-chat',
  model: anthropicModel,
  messages: [
    bedrock.ChatMessage.user('I need help with {{task}}. Please use tools if necessary.'),
  ],
  system: 'You are a helpful assistant with access to various tools.',
  promptVariables: ['task'],
  toolConfiguration: {
    toolChoice: bedrock.ToolChoice.AUTO,
    tools: [
      bedrock.Tool.function({
        name: 'search_tool',
        description: 'Search for information on the internet',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      }),
    ],
  },
  inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
    maxTokens: 400,
    temperature: 0.7,
  }),
});

const specificToolChatVariant = bedrock.PromptVariant.chat({
  variantName: 'specific-tool-chat',
  model: anthropicModel,
  messages: [
    bedrock.ChatMessage.user('Calculate {{expression}} for me.'),
  ],
  promptVariables: ['expression'],
  toolConfiguration: {
    toolChoice: bedrock.ToolChoice.specificTool('calculator'),
    tools: [
      bedrock.Tool.function({
        name: 'calculator',
        description: 'Perform mathematical calculations',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Mathematical expression to evaluate',
            },
          },
          required: ['expression'],
        },
      }),
    ],
  },
});

// Create an agent for agent variant testing
const variantTestAgent = new bedrock.Agent(stack, 'VariantTestAgent', {
  agentName: 'variant-test-agent',
  instruction: 'This agent is used for testing agent prompt variants in integration tests',
  foundationModel: anthropicModel,
  forceDelete: true,
});

const variantTestAgentAlias = new bedrock.AgentAlias(stack, 'VariantTestAgentAlias', {
  agentAliasName: 'variant-test-alias',
  agent: variantTestAgent,
});

// Test Agent Prompt Variants
const basicAgentVariant = bedrock.PromptVariant.agent({
  variantName: 'basic-agent',
  model: anthropicModel,
  agentAlias: variantTestAgentAlias,
  promptText: 'Agent, please help with this basic request.',
});

const variableAgentVariant = bedrock.PromptVariant.agent({
  variantName: 'variable-agent',
  model: anthropicModel,
  agentAlias: variantTestAgentAlias,
  promptText: 'Agent, please assist with {{request_type}} for user {{user_name}}.',
  promptVariables: ['request_type', 'user_name'],
});

// Create prompts with single variants (only one variant supported for now)
const textVariantsPrompt = new bedrock.Prompt(stack, 'TextVariantsPrompt', {
  promptName: 'text-variants-test',
  description: 'Testing text prompt variant',
  variants: [variableTextVariant],
  defaultVariant: variableTextVariant,
});

const chatVariantsPrompt = new bedrock.Prompt(stack, 'ChatVariantsPrompt', {
  promptName: 'chat-variants-test',
  description: 'Testing chat prompt variant',
  variants: [systemChatVariant],
  defaultVariant: systemChatVariant,
});

new bedrock.Prompt(stack, 'AgentVariantsPrompt', {
  promptName: 'agent-variants-test',
  description: 'Testing agent prompt variant',
  variants: [variableAgentVariant],
  defaultVariant: variableAgentVariant,
});

// Basic text prompt
new bedrock.Prompt(stack, 'BasicTextPrompt', {
  promptName: 'basic-text-test',
  description: 'Testing basic text prompt variant',
  variants: [basicTextVariant],
  defaultVariant: basicTextVariant,
});

// Configured text prompt
new bedrock.Prompt(stack, 'ConfiguredTextPrompt', {
  promptName: 'configured-text-test',
  description: 'Testing configured text prompt variant',
  variants: [configuredTextVariant],
  defaultVariant: configuredTextVariant,
});

// Basic chat prompt
new bedrock.Prompt(stack, 'BasicChatPrompt', {
  promptName: 'basic-chat-test',
  description: 'Testing basic chat prompt variant',
  variants: [basicChatVariant],
  defaultVariant: basicChatVariant,
});

// Tool chat prompt
new bedrock.Prompt(stack, 'ToolChatPrompt', {
  promptName: 'tool-chat-test',
  description: 'Testing tool chat prompt variant',
  variants: [toolChatVariant],
  defaultVariant: toolChatVariant,
});

// Specific tool chat prompt
new bedrock.Prompt(stack, 'SpecificToolChatPrompt', {
  promptName: 'specific-tool-chat-test',
  description: 'Testing specific tool chat prompt variant',
  variants: [specificToolChatVariant],
  defaultVariant: specificToolChatVariant,
});

// Basic agent prompt
new bedrock.Prompt(stack, 'BasicAgentPrompt', {
  promptName: 'basic-agent-test',
  description: 'Testing basic agent prompt variant',
  variants: [basicAgentVariant],
  defaultVariant: basicAgentVariant,
});

// Test different inference configurations
new bedrock.Prompt(stack, 'LowTempPrompt', {
  promptName: 'low-temp-test',
  description: 'Testing low temperature inference configuration',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'low-temp',
      model: anthropicModel,
      promptText: 'Low temperature variant for {{query}}',
      promptVariables: ['query'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        temperature: 0.1,
        maxTokens: 100,
      }),
    }),
  ],
});

new bedrock.Prompt(stack, 'HighTempPrompt', {
  promptName: 'high-temp-test',
  description: 'Testing high temperature inference configuration',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'high-temp',
      model: anthropicModel,
      promptText: 'High temperature variant for {{query}}',
      promptVariables: ['query'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        temperature: 0.9,
        maxTokens: 200,
        topP: 0.95,
      }),
    }),
  ],
});

new bedrock.Prompt(stack, 'ChatConfigPrompt', {
  promptName: 'chat-config-test',
  description: 'Testing chat inference configuration',
  variants: [
    bedrock.PromptVariant.chat({
      variantName: 'chat-config',
      model: anthropicModel,
      messages: [
        bedrock.ChatMessage.user('Chat with custom config for {{query}}'),
      ],
      promptVariables: ['query'],
      inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
        temperature: 0.6,
        maxTokens: 300,
        topP: 0.8,
        stopSequences: ['Human:', 'Assistant:'],
      }),
    }),
  ],
});

// Create versions of variant prompts
new bedrock.PromptVersion(stack, 'TextVariantsVersion', {
  prompt: textVariantsPrompt,
  description: 'Version 1.0 of text variants prompt',
});

new bedrock.PromptVersion(stack, 'ChatVariantsVersion', {
  prompt: chatVariantsPrompt,
  description: 'Version 1.0 of chat variants prompt',
});

new integ.IntegTest(app, 'BedrockPromptVariants', {
  testCases: [stack],
});

app.synth();
