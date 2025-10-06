# Amazon Bedrock AgentCore Construct Library

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
| ![Typescript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `@aws-cdk/aws-aws-bedrock-agentcore-alpha` |

[Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) enables you to deploy and operate highly capable AI agents securely, at scale. It offers infrastructure purpose-built for dynamic agent workloads, powerful tools to enhance agents, and essential controls for real-world deployment. AgentCore services can be used together or independently and work with any framework including CrewAI, LangGraph, LlamaIndex, and Strands Agents, as well as any foundation model in or outside of Amazon Bedrock, giving you ultimate flexibility. AgentCore eliminates the undifferentiated heavy lifting of building specialized agent infrastructure, so you can accelerate agents to production.

This construct library facilitates the deployment of Bedrock AgentCore primitives, enabling you to create sophisticated AI applications that can interact with your systems and data sources.

## Table of contents

- [AgentCore Runtime](#agentcore-runtime)
  - [Runtime Versioning](#runtime-versioning)
  - [Runtime Endpoints](#runtime-endpoints)
  - [AgentCore Runtime Properties](#agentcore-runtime-properties)
  - [Runtime Endpoint Properties](#runtime-endpoint-properties)
  - [Creating a Runtime](#creating-a-runtime)
    - [Option 1: Use an existing image in ECR](#option-1-use-an-existing-image-in-ecr)
    - [Managing Endpoints and Versions](#managing-endpoints-and-versions)
    - [Option 2: Use a local asset](#option-2-use-a-local-asset)

## AgentCore Runtime

The AgentCore Runtime construct enables you to deploy containerized agents on Amazon Bedrock AgentCore.
This L2 construct simplifies runtime creation just pass your ECR repository name
and the construct handles all the configuration with sensible defaults.

### Runtime Endpoints

Endpoints provide a stable way to invoke specific versions of your agent runtime, enabling controlled deployments across different environments.
When you create an agent runtime, Amazon Bedrock AgentCore automatically creates a "DEFAULT" endpoint which always points to the latest version
of runtime.

You can create additional endpoints in two ways:

1. **Using Runtime.addEndpoint()** - Convenient method when creating endpoints alongside the runtime.
2. **Using RuntimeEndpoint** - Flexible approach for existing runtimes.

For example, you might keep a "production" endpoint on a stable version while testing newer versions
through a "staging" endpoint. This separation allows you to test changes thoroughly before promoting them
to production by simply updating the endpoint to point to the newer version.

### AgentCore Runtime Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runtimeName` | `string` | Yes | The name of the agent runtime. Valid characters are a-z, A-Z, 0-9, _ (underscore). Must start with a letter and can be up to 48 characters long |
| `agentRuntimeArtifact` | `AgentRuntimeArtifact` | Yes | The artifact configuration for the agent runtime containing the container configuration with ECR URI |
| `executionRole` | `iam.IRole` | No | The IAM role that provides permissions for the agent runtime. If not provided, a role will be created automatically |
| `networkConfiguration` | `NetworkConfiguration` | No | Network configuration for the agent runtime. Defaults to `{ networkMode: NetworkMode.PUBLIC }` |
| `description` | `string` | No | Optional description for the agent runtime |
| `protocolConfiguration` | `ProtocolType` | No | Protocol configuration for the agent runtime. Defaults to `ProtocolType.HTTP` |
| `authorizerConfiguration` | `RuntimeAuthorizerConfiguration` | No | Authorizer configuration for the agent runtime. Use `RuntimeAuthorizerConfiguration` static methods to create configurations for IAM, Cognito, JWT, or OAuth authentication |
| `environmentVariables` | `{ [key: string]: string }` | No | Environment variables for the agent runtime. Maximum 50 environment variables |
| `tags` | `{ [key: string]: string }` | No | Tags for the agent runtime. A list of key:value pairs of tags to apply to this Runtime resource |

### Runtime Endpoint Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `endpointName` | `string` | Yes | The name of the runtime endpoint. Valid characters are a-z, A-Z, 0-9, _ (underscore). Must start with a letter and can be up to 48 characters long |
| `agentRuntimeId` | `string` | Yes | The Agent Runtime ID for this endpoint |
| `agentRuntimeVersion` | `string` | Yes | The Agent Runtime version for this endpoint. Must be between 1 and 5 characters long.|
| `description` | `string` | No | Optional description for the runtime endpoint |
| `tags` | `{ [key: string]: string }` | No | Tags for the runtime endpoint |

### Creating a Runtime

#### Option 1: Use an existing image in ECR

Reference an image available within ECR.

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

// The runtime by default create ECR permission only for the repository available in the account the stack is being deployed
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

// Create runtime using the built image
const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact
});
```

To grant the runtime permission to invoke a Bedrock model or inference profile:

```text
// Note: This example uses @aws-cdk/aws-bedrock-alpha which must be installed separately
import * as bedrock from '@aws-cdk/aws-bedrock-alpha';

// Create a cross-region inference profile for Claude 3.7 Sonnet
const inferenceProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
  geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_7_SONNET_V1_0
});

// Grant the runtime permission to invoke the inference profile
inferenceProfile.grantInvoke(runtime);
```

#### Option 2: Use a local asset

Reference a local directory containing a Dockerfile.
Images are built from a local Docker context directory (with a Dockerfile), uploaded to Amazon Elastic Container Registry (ECR)
by the CDK toolkit,and can be naturally referenced in your CDK app .

```typescript
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, "path to agent dockerfile directory")
);

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
});
```

### Runtime Versioning

Amazon Bedrock AgentCore automatically manages runtime versioning to ensure safe deployments and rollback capabilities.
When you create an agent runtime, AgentCore automatically creates version 1 (V1). Each subsequent update to the
runtime configuration (such as updating the container image, modifying network settings, or changing protocol configurations)
creates a new immutable version. These versions contain complete, self-contained configurations that can be referenced by endpoints,
allowing you to maintain different versions for different environments or gradually roll out updates.

#### Managing Endpoints and Versions

Amazon Bedrock AgentCore automatically manages runtime versioning. Here's how versions are created and how to manage endpoints:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

//Initial Deployment - Automatically creates Version 1
const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0"),
});
// At this point: A DEFAULT endpoint is created which points to version 1

// You can create a new endpoint (production) which points to version1
const prodEndpoint = runtime.addEndpoint("production", {
  version: "1",
  description: "Stable production endpoint - pinned to v1"
});

// When you update the runtime configuration e.g. new container image, protocol change, network settings
// a new version (Version 2) is automatically created

// After update: Version 2 is created automatically
// DEFAULT endpoint automatically updates to Version 2
// Production endpoint remains on Version 1 (explicitly pinned)

// Now that Version 2 exists, create a staging endpoint for testing
const stagingEndpoint = runtime.addEndpoint("staging", {
  version: "2",
  description: "Staging environment for testing new version"
});

// Staging endpoint: Points to Version 2 (testing)
// After testing, you can update production endpoint to Version 2 using the AWS Console or APIs
```

### Creating Standalone Runtime Endpoints

RuntimeEndpoint can also be created as a standalone resource.

#### Example: Creating an endpoint for an existing runtime

```typescript
// Reference an existing runtime by its ID
const existingRuntimeId = "abc123-runtime-id"; // The ID of an existing runtime

// Create a standalone endpoint
const endpoint = new agentcore.RuntimeEndpoint(this, "MyEndpoint", {
  endpointName: "production",
  agentRuntimeId: existingRuntimeId,
  agentRuntimeVersion: "1", // Specify which version to use
  description: "Production endpoint for existing runtime"
});
```

#### Updating endpoint versions

Standalone endpoints can update their runtime version using the `updateRuntimeVersion()` method:

```typescript
const runtimeId = "abc123-runtime-id";

const endpoint = new agentcore.RuntimeEndpoint(this, "MyEndpoint", {
  endpointName: "production",
  agentRuntimeId: runtimeId,
  agentRuntimeVersion: "1",
});

// Later, update to a new version
endpoint.updateRuntimeVersion("2");
```

### Runtime Authentication Configuration

The AgentCore Runtime supports multiple authentication modes to secure access to your agent endpoints. Authentication is configured during runtime creation using the `RuntimeAuthorizerConfiguration` class's static factory methods.

#### IAM Authentication (Default)

IAM authentication is the default mode, when no authorizerConfiguration is set then the underlying service use IAM.

#### Cognito Authentication

To configure AWS Cognito User Pool authentication:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.configureCognito(
    "us-west-2_ABC123",  // User Pool ID (required)
    "client123",         // Client ID (required)
    "us-west-2"         // Region (optional, defaults to stack region)
  ),
});
```

#### JWT Authentication

To configure custom JWT authentication with your own OpenID Connect (OIDC) provider:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.configureJWT(
    "https://example.com/.well-known/openid-configuration",  // Discovery URL (required)
    ["client1", "client2"],  // Allowed Client IDs (optional)
    ["audience1"]           // Allowed Audiences (optional)
  ),
});
```

**Note**: The discovery URL must end with `/.well-known/openid-configuration`.

#### OAuth Authentication

To configure OAuth 2.0 authentication:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.configureOAuth(
    "github",  // Provider name (e.g., 'google', 'github', 'custom')
    "https://github.com/.well-known/openid-configuration",  // Discovery URL
    "oauth_client_123",  // Client ID
    ["read:user", "repo"]  // Scopes (optional)
  ),
});
```

#### Using a Custom IAM Role

Instead of using the auto-created execution role, you can provide your own IAM role with specific permissions:
The auto-created role includes all necessary baseline permissions for ECR access, CloudWatch logging, and X-Ray tracing. When providing a custom role, ensure these permissions are included.
