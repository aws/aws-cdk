# Amazon Bedrock Prompt Management

Amazon Bedrock provides the ability to create and save prompts using Prompt management so that you can save time by applying the same prompt to different workflows. You can include variables in the prompt so that you can adjust the prompt for different use case.

The `Prompt` resource allows you to create a new prompt.

## Table of Contents

- [Prompt Variants](#prompt-variants)
- [Basic Text Prompt](#basic-text-prompt)
- [Chat Prompt](#chat-prompt)
- [Agent Prompt](#agent-prompt)
- [Prompt properties](#prompt-properties)
- [Prompt Routing](#prompt-routing)
- [Prompt Version](#prompt-version)
- [Permissions and Methods](#permissions-and-methods)
- [Import Methods](#import-methods)

## Prompt Variants

Prompt variants in the context of Amazon Bedrock refer to alternative configurations of a prompt, including its message or the model and inference configurations used. Prompt variants are the building blocks of prompts - you must create at least one prompt variant to create a prompt. Prompt variants allow you to create different versions of a prompt, test them, and save the variant that works best for your use case.

There are three types of prompt variants:

- **Basic Text Prompt**: Simple text-based prompts for straightforward interactions
- **Chat variant**: Conversational prompts that support system messages, user/assistant message history, and tools
- **Agent variant**: Prompts designed to work with Bedrock Agents

## Basic Text Prompt

Text prompts are the simplest form of prompts, consisting of plain text instructions with optional variables. They are ideal for straightforward tasks like summarization, content generation, or question answering where you need a direct text-based interaction with the model.

```ts
const cmk = new kms.Key(this, 'cmk', {});
const claudeModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_SONNET_V1_0;

const variant1 = bedrock.PromptVariant.text({
  variantName: 'variant1',
  model: claudeModel,
  promptVariables: ['topic'],
  promptText: 'This is my first text prompt. Please summarize our conversation on: {{topic}}.',
  inferenceConfiguration: {
    temperature: 1.0,
    topP: 0.999,
    maxTokens: 2000,
  },
});

const prompt1 = new bedrock.Prompt(this, 'prompt1', {
  promptName: 'prompt1',
  description: 'my first prompt',
  defaultVariant: variant1,
  variants: [variant1],
  kmsKey: cmk,
});
```

## Chat Prompt

Use this template type when the model supports the Converse API or the Anthropic Claude Messages API. This allows you to include a System prompt and previous User messages and Assistant messages for context.

```ts
const cmk = new kms.Key(this, 'cmk', {});

const variantChat = bedrock.PromptVariant.chat({
  variantName: 'variant1',
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
  messages: [
    bedrock.ChatMessage.userMessage('From now on, you speak Japanese!'),
    bedrock.ChatMessage.assistantMessage('Konnichiwa!'),
    bedrock.ChatMessage.userMessage('From now on, you speak {{language}}!'),
  ],
  system: 'You are a helpful assistant that only speaks the language you`re told.',
  promptVariables: ['language'],
  toolConfiguration: {
    toolChoice: bedrock.ToolChoice.AUTO,
    tools: [
      {
        toolSpec: {
          name: 'top_song',
          description: 'Get the most popular song played on a radio station.',
          inputSchema: {
            json: {
              type: 'object',
              properties: {
                sign: {
                  type: 'string',
                  description:
                    'The call sign for the radio station for which you want the most popular song. Example calls signs are WZPZ and WKR.',
                },
              },
              required: ['sign'],
            },
          },
        },
      },
    ],
  },
});

new bedrock.Prompt(this, 'prompt1', {
  promptName: 'prompt-chat',
  description: 'my first chat prompt',
  defaultVariant: variantChat,
  variants: [variantChat],
  kmsKey: cmk,
});
```

## Agent Prompt

Agent prompts are designed to work with Bedrock Agents, allowing you to create prompts that can be used by agents to perform specific tasks. Agent prompts use text prompts as their foundation and can reference agent aliases and include custom instructions for how the agent should behave.

```ts

const cmk = new kms.Key(this, 'cmk', {});

// Assuming you have an existing agent and alias
const agent = bedrock.Agent.fromAgentAttributes(this, 'ImportedAgent', {
  agentArn: 'arn:aws:bedrock:region:account:agent/agent-id',
  roleArn: 'arn:aws:iam::account:role/agent-role',
});

const agentAlias = bedrock.AgentAlias.fromAttributes(this, 'ImportedAlias', {
  aliasId: 'alias-id',
  aliasName: 'my-alias',
  agentVersion: '1',
  agent: agent,
});

const agentVariant = bedrock.PromptVariant.agent({
  variantName: 'agent-variant',
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
  agentAlias: agentAlias,
  promptText: 'Use the agent to help with: {{task}}. Please be thorough and provide detailed explanations.',
  promptVariables: ['task'],
  inferenceConfiguration: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 1500,
  },
});

new bedrock.Prompt(this, 'agentPrompt', {
  promptName: 'agent-prompt',
  description: 'Prompt for agent interactions',
  defaultVariant: agentVariant,
  variants: [agentVariant],
  kmsKey: cmk,
});
```

## Prompt properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| promptName | string | Yes | The name of the prompt |
| description | string | No | A description of the prompt |
| defaultVariant | PromptVariant | Yes | The default variant to use for the prompt |
| variants | PromptVariant[] | No | Additional variants for the prompt |
| kmsKey | kms.IKey | No | The KMS key to use for encrypting the prompt. Defaults to AWS managed key |
| tags | Record<string, string> | No | Tags to apply to the prompt |

## Permissions and Methods

### Prompt Methods

| Method | Description |
|--------|-------------|
| `addVariant(variant)` | Adds a variant to the prompt |
| `createVersion(description?)` | Creates a new version of the prompt with an optional description |
| `grantGet(grantee)` | Grants the given identity permissions to get the prompt |

### PromptVariant Methods

| Method | Description |
|--------|-------------|
| `PromptVariant.text(props)` | Creates a text prompt variant |
| `PromptVariant.chat(props)` | Creates a chat prompt variant |
| `PromptVariant.agent(props)` | Creates an agent prompt variant |

### ChatMessage Methods

| Method | Description |
|--------|-------------|
| `ChatMessage.user(text)` | Creates a user message |
| `ChatMessage.assistant(text)` | Creates an assistant message |

### ToolChoice Methods

| Method | Description |
|--------|-------------|
| `ToolChoice.ANY` | Allows the model to use any tool |
| `ToolChoice.AUTO` | Allows the model to automatically decide which tool to use |
| `ToolChoice.specificTool(toolName)` | Forces the model to use a specific tool |

## Prompt Routing

Amazon Bedrock intelligent prompt routing provides a single serverless endpoint for efficiently routing requests between different foundational models within the same model family. It can help you optimize for response quality and cost. They offer a comprehensive solution for managing multiple AI models through a single serverless endpoint, simplifying the process for you. Intelligent prompt routing predicts the performance of each model for each request, and dynamically routes each request to the model that it predicts is most likely to give the desired response at the lowest cost.

```ts

const variant = bedrock.PromptVariant.text({
  variantName: 'variant1',
  promptText: 'What is the capital of France?',
  model: bedrock.PromptRouter.fromDefaultId(bedrock.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1, this.region),
});

new bedrock.Prompt(this, 'Prompt', {
  promptName: 'prompt-router-test',
  variants: [variant],
});
```

## Prompt Version

A prompt version is a snapshot of a prompt at a specific point in time that you create when you are satisfied with a set of configurations. Versions allow you to deploy your prompt and easily switch between different configurations for your prompt and update your application with the most appropriate version for your use-case.

You can create a Prompt version by using the PromptVersion class or by using the .createVersion(..) on a Prompt object. It is recommended to use the .createVersion(..) method. It uses a hash based mechanism to update the version whenever a certain configuration property changes.

```ts
new bedrock.PromptVersion(this, 'MyPromptVersion', {
  prompt: prompt1,
  description: 'my first version',
});
```

or alternatively:

```ts
prompt1.createVersion('my first version');
```

## Import Methods

You can use the `fromPromptAttributes` method to import an existing Bedrock Prompt into your CDK application.

```ts
// Import an existing prompt by ARN
const importedPrompt = bedrock.Prompt.fromPromptAttributes(this, 'ImportedPrompt', {
  promptArn: 'arn:aws:bedrock:region:account:prompt/prompt-id',
  kmsKey: kms.Key.fromKeyArn(this, 'ImportedKey', 'arn:aws:kms:region:account:key/key-id'), // optional
  promptVersion: '1', // optional, defaults to 'DRAFT'
});
