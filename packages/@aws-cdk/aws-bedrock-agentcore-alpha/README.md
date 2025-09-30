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
When you create an agent runtime, Amazon Bedrock AgentCore automatically creates a "DEFAULT" endpoint which always points to thelatest version
of runtime. You can create explicit endpoints using the `addEndpoint()` helper method to reference specific versions for staging
or production environments. For example, you might keep a "production" endpoint on a stable version while testing newer versions
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
| `authorizerConfiguration` | `AuthorizerConfigurationRuntime` | No | Authorizer configuration for the agent runtime. Supports IAM, Cognito, JWT, and OAuth authentication modes |
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
  agentRuntimeArtifact: agentRuntimeArtifact,
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

### Authentication Configuration

The AgentCore Runtime supports multiple authentication modes to secure access to your agent endpoints. By default, IAM authentication is used, but you can configure Cognito, JWT, or OAuth authentication based on your security requirements.

#### IAM Authentication (Default)

IAM authentication is the default mode and requires no additional configuration. When creating a runtime, IAM authentication is automatically enabled, requiring callers to sign their requests with valid AWS credentials.

#### Cognito Authentication

To configure AWS Cognito User Pool authentication for your runtime, use the `configureCognitoAuth()` method after runtime creation. This method requires:

- **User Pool ID** (required): The Cognito User Pool identifier (e.g., "us-west-2_ABC123")
- **Client ID** (required): The Cognito App Client ID
- **Region** (optional): The AWS region where the User Pool is located (defaults to the stack region)

#### JWT Authentication

To configure custom JWT authentication with your own OpenID Connect (OIDC) provider, use the `configureJWTAuth()` method after runtime creation. This method requires:

- **Discovery URL**: The OIDC discovery URL (must end with /.well-known/openid-configuration)
- **Allowed Client IDs**: An array of client IDs that are allowed to access the runtime
- **Allowed Audiences** (optional): An array of allowed audiences for token validation

#### OAuth Authentication

OAuth 2.0 authentication can be configured during runtime creation by setting the `authorizerConfiguration` property with:

- **Mode**: Set to `AuthenticationMode.OAUTH`
- **OAuth Authorizer**: An object containing:
  - **Discovery URL**: The OAuth provider's discovery URL (must end with /.well-known/openid-configuration)
  - **Client ID**: The OAuth client identifier

**Note**: When using custom authentication modes (Cognito, JWT, OAuth), ensure that your client applications are properly configured to obtain and include valid tokens in their requests to the runtime endpoints.

#### Using a Custom IAM Role

Instead of using the auto-created execution role, you can provide your own IAM role with specific permissions:
The auto-created role includes all necessary baseline permissions for ECR access, CloudWatch logging, and X-Ray tracing. When providing a custom role, ensure these permissions are included.
