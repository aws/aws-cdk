# Amazon Bedrock Prompt Management

Amazon Bedrock provides the ability to create and save prompts using Prompt management so that you can save time by applying the same prompt to different workflows. You can include variables in the prompt so that you can adjust the prompt for different use cases.

## How it works

`PromptVariant` are a specific set of inputs that guide FMs on Amazon Bedrock to generate an appropriate response or output for a given task or instruction. You can optimize the prompt for specific use cases and models.

**Test the prompt**
Test the prompt by inputting sample values for your variables and running it in the test window.

**Use the prompt**
When you're satisfied with your prompt and its configurations, create a snapshot of it by publishing a version of it. You can deploy your prompt to production by including it in a flow and setting up your application to invoke the flow.

The `Prompt` construct allows you to create a new prompt with CDK.

## Table of Contents

- [Basic Text Prompt](#basic-text-prompt)
- [Chat Prompt](#chat-prompt)
- [Prompt Properties](#prompt-properties)
- [Prompt Variants](#prompt-variants)
- [Prompt Versioning](#prompt-versioning)
- [Permissions and Methods](#permissions-and-methods)
- [Import Methods](#import-methods)

## Basic Text Prompt

### TypeScript

```ts
import { BedrockFoundationModel, Prompt, PromptVariant } from '@aws-cdk/aws-bedrock-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';

const cmk = new kms.Key(this, 'PromptKey');
const claudeModel = BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;

const variant1 = PromptVariant.text({
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

const prompt1 = new Prompt(this, 'MyPrompt', {
  promptName: 'my-first-prompt',
  description: 'My first prompt for summarization',
  defaultVariant: variant1,
  variants: [variant1],
  kmsKey: cmk,
});
```

## Chat Prompt

Use this template type when the model supports the Converse API or the Anthropic Claude Messages API. This allows you to include a System prompt and previous User messages and Assistant messages for context.

### TypeScript

```ts
import { 
  BedrockFoundationModel, 
  Prompt, 
  PromptVariant, 
  ChatMessage, 
  ToolChoice 
} from '@aws-cdk/aws-bedrock-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';

const cmk = new kms.Key(this, 'PromptKey');

const variantChat = PromptVariant.chat({
  variantName: 'chat-variant',
  model: BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  messages: [
    ChatMessage.user('From now on, you speak Japanese!'),
    ChatMessage.assistant('Konnichiwa!'),
    ChatMessage.user('From now on, you speak {{language}}!'),
  ],
  system: 'You are a helpful assistant that only speaks the language you are told.',
  promptVariables: ['language'],
  toolConfiguration: {
    toolChoice: ToolChoice.AUTO,
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
                  description: 'The call sign for the radio station for which you want the most popular song. Example calls signs are WZPZ and WKR.',
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

const chatPrompt = new Prompt(this, 'ChatPrompt', {
  promptName: 'my-chat-prompt',
  description: 'My first chat prompt with tool support',
  defaultVariant: variantChat,
  variants: [variantChat],
  kmsKey: cmk,
});
```

## Prompt Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| promptName | string | Yes | The name of the prompt |
| description | string | No | A description of the prompt |
| defaultVariant | PromptVariant | No | The default variant to use for the prompt |
| variants | PromptVariant[] | No | Additional variants for the prompt (max 3 total) |
| kmsKey | kms.IKey | No | The KMS key to use for encrypting the prompt. Defaults to AWS managed key |
| tags | Record<string, string> | No | Tags to apply to the prompt |

## Prompt Variants

Prompt variants in the context of Amazon Bedrock refer to alternative configurations of a prompt, including its message or the model and inference configurations used. Prompt variants allow you to create different versions of a prompt, test them, and save the variant that works best for your use case.

You can add prompt variants to a prompt by creating a `PromptVariant` object and specify the variants on prompt creation, or by using the `.addVariant(..)` method on a `Prompt` object.

### TypeScript

```ts
const variant2 = PromptVariant.text({
  variantName: 'variant2',
  model: claudeModel,
  promptVariables: ['topic'],
  promptText: 'This is my second text prompt. Please summarize our conversation on: {{topic}}.',
  inferenceConfiguration: {
    temperature: 0.5,
    topP: 0.999,
    maxTokens: 2000,
  },
});

prompt1.addVariant(variant2);
```

## Prompt Versioning

A prompt version is a snapshot of a prompt at a specific point in time that you create when you are satisfied with a set of configurations. Versions allow you to deploy your prompt and easily switch between different configurations for your prompt and update your application with the most appropriate version for your use-case.

You can create a Prompt version by using the `PromptVersion` construct or by using the `.createVersion(..)` method on a `Prompt` object. It is recommended to use the `.createVersion(..)` method as it uses a hash-based mechanism to update the version whenever a certain configuration property changes.

### TypeScript

```ts
import { PromptVersion } from '@aws-cdk/aws-bedrock-alpha';

// Using the PromptVersion construct
const promptVersion = new PromptVersion(this, 'MyPromptVersion', {
  prompt: prompt1,
  description: 'Version 1 of my prompt',
});

// Or using the createVersion method (recommended)
const versionString = prompt1.createVersion('Version 1 of my prompt');
```

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

## Import Methods

You can use the `fromPromptAttributes` method to import an existing Bedrock Prompt into your CDK application.

### TypeScript

```ts
import { Prompt } from '@aws-cdk/aws-bedrock-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';

// Import an existing prompt by ARN
const importedPrompt = Prompt.fromPromptAttributes(this, 'ImportedPrompt', {
  promptArn: 'arn:aws:bedrock:region:account:prompt/prompt-id',
  kmsKey: kms.Key.fromKeyArn(this, 'ImportedKey', 'arn:aws:kms:region:account:key/key-id'), // optional
  promptVersion: '1', // optional, defaults to 'DRAFT'
});
```

## Integration with Bedrock Agents

Prompts can be used with Bedrock Agents to provide consistent and reusable prompt templates. When creating agent prompt variants, you can reference existing agent aliases:

### TypeScript

```ts
import { Agent, AgentAlias, PromptVariant } from '@aws-cdk/aws-bedrock-alpha';

// Assuming you have an existing agent and alias
const agent = Agent.fromAgentAttributes(this, 'ImportedAgent', {
  agentArn: 'arn:aws:bedrock:region:account:agent/agent-id',
  roleArn: 'arn:aws:iam::account:role/agent-role',
});

const agentAlias = AgentAlias.fromAttributes(this, 'ImportedAlias', {
  aliasId: 'alias-id',
  aliasName: 'my-alias',
  agentVersion: '1',
  agent: agent,
});

const agentVariant = PromptVariant.agent({
  variantName: 'agent-variant',
  model: BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  agentAlias: agentAlias,
  promptText: 'Use the agent to help with: {{task}}',
  promptVariables: ['task'],
});
```

## Best Practices

1. **Use descriptive names**: Choose clear, descriptive names for your prompts and variants to make them easy to identify and manage.

2. **Version your prompts**: Use prompt versions to create stable snapshots of your prompts for production use.

3. **Test variants**: Create multiple variants with different configurations to test and optimize performance.

4. **Use variables**: Leverage prompt variables to make your prompts reusable across different contexts.

5. **Secure with KMS**: Use customer-managed KMS keys for sensitive prompts to maintain control over encryption.

6. **Tag your resources**: Apply consistent tags to your prompts for better organization and cost tracking.

## Limitations

- Maximum of 3 variants per prompt
- Prompt names must follow the pattern: `^([0-9a-zA-Z][_-]?){1,100}$`
- Variables in prompts must be enclosed in double curly braces: `{{variable_name}}`
