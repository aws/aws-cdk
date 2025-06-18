# Amazon Bedrock Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

| **Language**                                                                                   | **Package**                             |
| :--------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![Typescript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `@aws-cdk/aws-bedrock-alpha` |

[Amazon Bedrock](https://aws.amazon.com/bedrock/) is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies and Amazon through a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI.

This construct library facilitates the deployment of Bedrock Agents and Prompts, enabling you to create sophisticated AI applications that can interact with your systems and data sources.

## Table of contents

- [Agents](#agents)
- [Prompts](#prompts)

## Agents

Amazon Bedrock Agents allow generative AI applications to automate complex, multistep tasks by seamlessly integrating with your company's systems, APIs, and data sources. Agents use the reasoning capabilities of foundation models to break down user requests, gather relevant information, and efficiently complete tasks through a combination of API calls, data retrieval, and step-by-step processing.

### Key Agent Features

- **[Create an Agent](./bedrock/agents/README.md#create-an-agent)** - Build agents with simple instructions and foundation models
- **[Action Groups](./bedrock/agents/README.md#action-groups)** - Define functions your agent can call using Lambda functions and OpenAPI schemas
- **[Function Schema](./bedrock/agents/README.md#using-functionschema-with-action-groups)** - Type-safe function definitions as an alternative to OpenAPI schemas
- **[Prompt Override Configuration](./bedrock/agents/README.md#prompt-override-configuration)** - Customize prompts and LLM configuration for different agent steps
- **[Memory Configuration](./bedrock/agents/README.md#memory-configuration)** - Enable agents to maintain context across sessions
- **[Agent Collaboration](./bedrock/agents/README.md#agent-collaboration)** - Allow multiple agents to work together on complex tasks
- **[Custom Orchestration](./bedrock/agents/README.md#custom-orchestration)** - Override default orchestration with custom Lambda functions
- **[Agent Alias](./bedrock/agents/README.md#agent-alias)** - Deploy and manage different versions of your agents

### Agent Quick Start

```ts fixture=default
const agent = new bedrock.Agent(this, 'Agent', {
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0,
  instruction: 'You are a helpful and friendly agent that answers questions about literature.',
});
```

For comprehensive documentation on all agent features, configurations, and examples, see the [**Agents README**](./bedrock/agents/README.md).

## Prompts

Amazon Bedrock Prompt Management allows you to create, save, and version prompts that can be reused across different workflows and applications. Prompts can include variables for dynamic content and support multiple variants for testing and optimization.

### Key Prompt Features

- **[Basic Text Prompts](./bedrock/prompts/README.md#basic-text-prompt)** - Create simple text-based prompts with variables
- **[Chat Prompts](./bedrock/prompts/README.md#chat-prompt)** - Build conversational prompts with system messages and chat history
- **[Prompt Variants](./bedrock/prompts/README.md#prompt-variants)** - Create multiple versions of prompts for testing and optimization
- **[Prompt Versioning](./bedrock/prompts/README.md#prompt-versioning)** - Create stable snapshots of prompts for production deployment
- **[Tool Configuration](./bedrock/prompts/README.md#chat-prompt)** - Configure tools and function calling capabilities
- **[Integration with Agents](./bedrock/prompts/README.md#integration-with-bedrock-agents)** - Use prompts with Bedrock Agents for consistent templates

### Prompt Quick Start

```ts fixture=default
const variant = bedrock.PromptVariant.text({
  variantName: 'variant1',
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  promptVariables: ['topic'],
  promptText: 'Please summarize our conversation on: {{topic}}.',
});

const prompt = new bedrock.Prompt(this, 'MyPrompt', {
  promptName: 'my-first-prompt',
  description: 'My first prompt for summarization',
  defaultVariant: variant,
});
```

For comprehensive documentation on all prompt features, configurations, and examples, see the [**Prompts README**](./bedrock/prompts/README.md).
