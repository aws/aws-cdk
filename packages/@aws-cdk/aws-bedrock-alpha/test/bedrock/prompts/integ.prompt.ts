/*
 * Integration test for Bedrock Prompt construct
 */

/// !cdk-integ aws-cdk-bedrock-prompt-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-prompt-1');

// Foundation model for testing
const foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;

// Create a simple text prompt
new bedrock.Prompt(stack, 'SimplePrompt', {
  promptName: 'simple-test-prompt',
  description: 'A simple prompt for integration testing',
});

// Create a text variant
const textVariant = bedrock.PromptVariant.text({
  variantName: 'text-variant',
  model: foundationModel,
  promptText: 'Hello {{name}}, how can I help you with {{topic}} today?',
  promptVariables: ['name', 'topic'],
  inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
    maxTokens: 200,
    temperature: 0.7,
    topP: 0.9,
  }),
});

// Create a chat variant
const chatVariant = bedrock.PromptVariant.chat({
  variantName: 'chat-variant',
  model: foundationModel,
  messages: [
    bedrock.ChatMessage.user('Hello, I need help with {{topic}}'),
    bedrock.ChatMessage.assistant('I\'d be happy to help you with that topic. What specific questions do you have?'),
    bedrock.ChatMessage.user('Please explain {{concept}} in simple terms'),
  ],
  system: 'You are a helpful assistant that explains complex topics in simple, easy-to-understand language.',
  promptVariables: ['topic', 'concept'],
  inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
    maxTokens: 300,
    temperature: 0.8,
  }),
});

// Create separate prompts for text and chat variants (only 1 variant supported currently)
const textPrompt = new bedrock.Prompt(stack, 'TextPrompt', {
  promptName: 'text-test-prompt',
  description: 'A text prompt for comprehensive testing',
  variants: [textVariant],
  defaultVariant: textVariant,
  tags: {
    Environment: 'test',
    Purpose: 'integration-testing',
    Team: 'bedrock-team',
    Type: 'text',
  },
});

const chatPrompt = new bedrock.Prompt(stack, 'ChatPrompt', {
  promptName: 'chat-test-prompt',
  description: 'A chat prompt for comprehensive testing',
  variants: [chatVariant],
  defaultVariant: chatVariant,
  tags: {
    Environment: 'test',
    Purpose: 'integration-testing',
    Team: 'bedrock-team',
    Type: 'chat',
  },
});

// Create prompt versions
new bedrock.PromptVersion(stack, 'TextPromptVersion', {
  prompt: textPrompt,
  description: 'Version 1.0 of the text prompt for production deployment',
});

new bedrock.PromptVersion(stack, 'ChatPromptVersion', {
  prompt: chatPrompt,
  description: 'Version 1.0 of the chat prompt for production deployment',
});

// Create another version using the prompt's method
textPrompt.createVersion('Version 1.1 created via prompt method');
chatPrompt.createVersion('Version 1.1 created via prompt method');

const encryptedPrompt = new bedrock.Prompt(stack, 'EncryptedPrompt', {
  promptName: 'encrypted-test-prompt',
  description: 'A prompt encrypted with customer-managed KMS key',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'encrypted-variant',
      model: foundationModel,
      promptText: 'This is an encrypted prompt with sensitive data: {{data}}',
      promptVariables: ['data'],
    }),
  ],
});

// Create a chat prompt with tool configuration
const toolConfig = {
  toolChoice: bedrock.ToolChoice.AUTO,
  tools: [
    bedrock.Tool.function({
      name: 'weather_tool',
      description: 'Get current weather information for a location',
      inputSchema: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'The unit for temperature',
          },
        },
        required: ['location'],
      },
    }),
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
};

const chatWithToolsVariant = bedrock.PromptVariant.chat({
  variantName: 'chat-with-tools',
  model: foundationModel,
  messages: [
    bedrock.ChatMessage.user('I need help with {{request}}. Please use the appropriate tools if needed.'),
  ],
  system: 'You are a helpful assistant with access to weather and calculator tools. Use them when appropriate to help users.',
  promptVariables: ['request'],
  toolConfiguration: toolConfig,
  inferenceConfiguration: bedrock.PromptInferenceConfiguration.text({
    maxTokens: 500,
    temperature: 0.6,
  }),
});

new bedrock.Prompt(stack, 'ToolPrompt', {
  promptName: 'tool-enabled-prompt',
  description: 'A prompt that demonstrates tool usage capabilities',
  variants: [chatWithToolsVariant],
  defaultVariant: chatWithToolsVariant,
});

// Create an agent for agent prompt variant testing
const testAgent = new bedrock.Agent(stack, 'TestAgent', {
  agentName: 'integration-test-agent',
  instruction: 'This is a test agent for integration testing prompt variants with agent capabilities',
  foundationModel,
  forceDelete: true,
});

const testAgentAlias = new bedrock.AgentAlias(stack, 'TestAgentAlias', {
  agentAliasName: 'test-alias',
  agent: testAgent,
});

// Create an agent prompt variant
const agentVariant = bedrock.PromptVariant.agent({
  variantName: 'agent-variant',
  model: foundationModel,
  agentAlias: testAgentAlias,
  promptText: 'Agent, please help the user with {{task}} using your specialized capabilities.',
  promptVariables: ['task'],
});

new bedrock.Prompt(stack, 'AgentPrompt', {
  promptName: 'agent-integration-prompt',
  description: 'A prompt that uses an agent variant for specialized task handling',
  variants: [agentVariant],
  defaultVariant: agentVariant,
});

// Test prompt import functionality
const importedPrompt = bedrock.Prompt.fromPromptAttributes(stack, 'ImportedPrompt', {
  promptArn: 'arn:aws:bedrock:us-east-1:123456789012:prompt/IMPORTED12345',
  promptVersion: '1',
});

// Grant permissions to a role
const testRole = new cdk.aws_iam.Role(stack, 'TestRole', {
  assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Role for testing prompt permissions',
});

textPrompt.grantGet(testRole);
chatPrompt.grantGet(testRole);
encryptedPrompt.grantGet(testRole);
importedPrompt.grantGet(testRole);

new integ.IntegTest(app, 'BedrockPrompt', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
  regions: ['us-east-1'],
});

app.synth();
