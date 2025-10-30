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
| ![Typescript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `@aws-cdk/aws-bedrock-agentcore-alpha` |

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
- [Browser Custom tool](#browser)
  - [Browser properties](#browser-properties)
  - [Browser Network modes](#browser-network-modes)
  - [Basic Browser Creation](#basic-browser-creation)
  - [Browser IAM permissions](#browser-iam-permissions)
- [Code Interpreter Custom tool](#code-interpreter)
  - [Code Interpreter properties](#code-interpreter-properties)
  - [Code Interpreter Network Modes](#code-interpreter-network-modes)
  - [Basic Code Interpreter Creation](#basic-code-interpreter-creation)
  - [Code Interpreter IAM permissions](#code-interpreter-iam-permissions)
- [Memory](#memory)
  - [Memory properties](#memory-properties)
  - [Basic Memory Creation](#basic-memory-creation)
  - [LTM Memory Extraction Stategies](#ltm-memory-extraction-stategies)
  - [Memory Strategy Methods](#memory-strategy-methods)


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
| `networkConfiguration` | `NetworkConfiguration` | No | Network configuration for the agent runtime. Defaults to `RuntimeNetworkConfiguration.usingPublicNetwork()` |
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

```typescript fixture=default
// Note: This example uses @aws-cdk/aws-bedrock-alpha which must be installed separately
declare const runtime: agentcore.Runtime;

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

Amazon Bedrock AgentCore automatically manages runtime versioning to provide safe deployments and rollback capabilities. You can follow
the steps below to understand how to use versioning with runtime for controlled deployments across different environments.

##### Step 1: Initial Deployment

When you first create an agent runtime, AgentCore automatically creates Version 1 of your runtime. At this point, a DEFAULT endpoint is
automatically created that points to Version 1. This DEFAULT endpoint serves as the main access point for your runtime.

```ts
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0"),
});
```

##### Step 2: Creating Custom Endpoints

After the initial deployment, you can create additional endpoints for different environments. For example, you might create a "production"
endpoint that explicitly points to Version 1. This allows you to maintain stable access points for specific environments while keeping the
flexibility to test newer versions elsewhere.

```ts
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0"),
});

const prodEndpoint = runtime.addEndpoint("production", {
  version: "1",
  description: "Stable production endpoint - pinned to v1"
});
```

##### Step 3: Runtime Update Deployment

When you update the runtime configuration (such as updating the container image, modifying network settings, or changing protocol
configurations), AgentCore automatically creates a new version (Version 2). Upon this update:

- Version 2 is created automatically with the new configuration
- The DEFAULT endpoint automatically updates to point to Version 2
- Any explicitly pinned endpoints (like the production endpoint) remain on their specified versions

```ts
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

const agentRuntimeArtifactNew = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v2.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifactNew,
});
```

##### Step 4: Testing with Staging Endpoints

Once Version 2 exists, you can create a staging endpoint that points to the new version. This staging endpoint allows you to test the
new version in a controlled environment before promoting it to production. This separation ensures that production traffic continues
to use the stable version while you validate the new version.

```ts
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

const agentRuntimeArtifactNew = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v2.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifactNew,
});

const stagingEndpoint = runtime.addEndpoint("staging", {
  version: "2",
  description: "Staging environment for testing new version"
});
```

##### Step 5: Promoting to Production

After thoroughly testing the new version through the staging endpoint, you can update the production endpoint to point to Version 2.
This controlled promotion process ensures that you can validate changes before they affect production traffic.

```ts
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});

const agentRuntimeArtifactNew = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v2.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifactNew,
});

const prodEndpoint = runtime.addEndpoint("production", {
  version: "2",  // New version added here
  description: "Stable production endpoint"
});
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

### Runtime Authentication Configuration

The AgentCore Runtime supports multiple authentication modes to secure access to your agent endpoints. Authentication is configured during runtime creation using the `RuntimeAuthorizerConfiguration` class's static factory methods.

#### IAM Authentication (Default)

IAM authentication is the default mode, when no authorizerConfiguration is set then the underlying service use IAM.

#### Cognito Authentication

To configure AWS Cognito User Pool authentication:

```typescript
declare const userPool: cognito.UserPool;
declare const userPoolClient: cognito.UserPoolClient;
declare const anotherUserPoolClient: cognito.UserPoolClient;

const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.usingCognito(
    userPool, // User Pool (required)
    [userPoolClient, anotherUserPoolClient], // User Pool Clients
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
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.usingJWT(
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
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.usingOAuth(
    "https://github.com/.well-known/openid-configuration",  
    "oauth_client_123",  
  ),
});
```

#### Using a Custom IAM Role

Instead of using the auto-created execution role, you can provide your own IAM role with specific permissions:
The auto-created role includes all necessary baseline permissions for ECR access, CloudWatch logging, and X-Ray tracing. When providing a custom role, ensure these permissions are included.

### Runtime Network Configuration

The AgentCore Runtime supports two network modes for deployment:

#### Public Network Mode (Default)

By default, runtimes are deployed in PUBLIC network mode, which provides internet access suitable for less sensitive or open-use scenarios:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

// Explicitly using public network (this is the default)
const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
});
```

#### VPC Network Mode

For enhanced security and network isolation, you can deploy your runtime within a VPC:

```typescript
const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

// Create or use an existing VPC
const vpc = new ec2.Vpc(this, 'MyVpc', {
  maxAzs: 2,
});

// Configure runtime with VPC
const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingVpc(this, {
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    // Optionally specify security groups, or one will be created automatically
    // securityGroups: [mySecurityGroup],
  }),
});
```

#### Managing Security Groups with VPC Configuration

When using VPC mode, the Runtime implements `ec2.IConnectable`, allowing you to manage network access using the `connections` property:

```typescript

const vpc = new ec2.Vpc(this, 'MyVpc', {
  maxAzs: 2,
});

const repository = new ecr.Repository(this, "TestRepository", {
  repositoryName: "test-agent-runtime",
});
const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(repository, "v1.0.0");

// Create runtime with VPC configuration
const runtime = new agentcore.Runtime(this, "MyAgentRuntime", {
  runtimeName: "myAgent",
  agentRuntimeArtifact: agentRuntimeArtifact,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingVpc(this, {
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  }),
});

// Now you can manage network access using the connections property
// Allow inbound HTTPS traffic from a specific security group
const webServerSecurityGroup = new ec2.SecurityGroup(this, 'WebServerSG', { vpc });
runtime.connections.allowFrom(webServerSecurityGroup, ec2.Port.tcp(443), 'Allow HTTPS from web servers');

// Allow outbound connections to a database
const databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSG', { vpc });
runtime.connections.allowTo(databaseSecurityGroup, ec2.Port.tcp(5432), 'Allow PostgreSQL connection');

// Allow outbound HTTPS to anywhere (for external API calls)
runtime.connections.allowToAnyIpv4(ec2.Port.tcp(443), 'Allow HTTPS outbound');
```

## Browser

The Amazon Bedrock AgentCore Browser provides a secure, cloud-based browser that enables AI agents to interact with websites. It includes security features such as session isolation, built-in observability through live viewing, CloudTrail logging, and session replay capabilities.

Additional information about the browser tool can be found in the [official documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html)

### Browser Network modes

The Browser construct supports the following network modes:

1. **Public Network Mode** (`BrowserNetworkMode.usingPublicNetwork()`) - Default

   - Allows internet access for web browsing and external API calls
   - Suitable for scenarios where agents need to interact with publicly available websites
   - Enables full web browsing capabilities
   - VPC mode is not supported with this option

2. **VPC (Virtual Private Cloud)** (`BrowserNetworkMode.usingVpc()`)

   - Select whether to run the browser in a virtual private cloud (VPC).
   - By configuring VPC connectivity, you enable secure access to private resources such as databases, internal APIs, and services within your VPC.

    While the VPC itself is mandatory, these are optional:
    - Subnets - if not provided, CDK will select appropriate subnets from the VPC
    - Security Groups - if not provided, CDK will create a default security group
    - Specific subnet selection criteria - you can let CDK choose automatically

For more information on VPC connectivity for Amazon Bedrock AgentCore Browser, please refer to the [official documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html).

### Browser Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `browserCustomName` | `string` | Yes | The name of the browser. Must start with a letter and can be up to 48 characters long. Pattern: `[a-zA-Z][a-zA-Z0-9_]{0,47}` |
| `description` | `string` | No | Optional description for the browser. Can have up to 200 characters |
| `networkConfiguration` | `BrowserNetworkConfiguration` | No | Network configuration for browser. Defaults to PUBLIC network mode |
| `recordingConfig` | `RecordingConfig` | No | Recording configuration for browser. Defaults to no recording |
| `executionRole` | `iam.IRole` | No | The IAM role that provides permissions for the browser to access AWS services. A new role will be created if not provided |
| `tags` | `{ [key: string]: string }` | No | Tags to apply to the browser resource |

### Basic Browser Creation

```typescript fixture=default
// Create a basic browser with public network access
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "A browser for web automation",
});
```

### Browser with Tags

```typescript fixture=default
// Create a browser with custom tags
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "A browser for web automation with tags",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  tags: {
    Environment: "Production",
    Team: "AI/ML",
    Project: "AgentCore",
  },
});
```

### Browser with VPC

```typescript fixture=default
const browser = new agentcore.BrowserCustom(this, 'BrowserVpcWithRecording', {
  browserCustomName: 'browser_recording',
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingVpc(this, {
    vpc: new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false }),
  }),
});
```

Browser exposes a [connections](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Connections.html) property. This property returns a connections object, which simplifies the process of defining and managing ingress and egress rules for security groups in your AWS CDK applications. Instead of directly manipulating security group rules, you interact with the Connections object of a construct, which then translates your connectivity requirements into the appropriate security group rules. For instance:

```typescript fixture=default
const vpc = new ec2.Vpc(this, 'testVPC');

const browser = new agentcore.BrowserCustom(this, 'test-browser', {
  browserCustomName: 'test_browser',
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingVpc(this, {
    vpc: vpc,
  }),
});

browser.connections.addSecurityGroup(new ec2.SecurityGroup(this, 'AdditionalGroup', { vpc }));
```

So security groups can be added after the browser construct creation. You can use methods like allowFrom() and allowTo() to grant ingress access to/egress access from a specified peer over a given portRange. The Connections object automatically adds the necessary ingress or egress rules to the security group(s) associated with the calling construct.

### Browser with Recording Configuration

```typescript fixture=default
// Create an S3 bucket for recordings
const recordingBucket = new s3.Bucket(this, "RecordingBucket", {
  bucketName: "my-browser-recordings",
  removalPolicy: RemovalPolicy.DESTROY, // For demo purposes
});

// Create browser with recording enabled
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "Browser with recording enabled",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  recordingConfig: {
    enabled: true,
    s3Location: {
      bucketName: recordingBucket.bucketName,
      objectKey: "browser-recordings/",
    },
  },
});
```

### Browser with Custom Execution Role

```typescript fixture=default
// Create a custom execution role
const executionRole = new iam.Role(this, "BrowserExecutionRole", {
  assumedBy: new iam.ServicePrincipal("bedrock-agentcore.amazonaws.com"),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockAgentCoreBrowserExecutionRolePolicy"),
  ],
});

// Create browser with custom execution role
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "Browser with custom execution role",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  executionRole: executionRole,
});
```

### Browser with S3 Recording and Permissions

```typescript fixture=default
// Create an S3 bucket for recordings
const recordingBucket = new s3.Bucket(this, "RecordingBucket", {
  bucketName: "my-browser-recordings",
  removalPolicy: RemovalPolicy.DESTROY, // For demo purposes
});

// Create browser with recording enabled
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "Browser with recording enabled",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
  recordingConfig: {
    enabled: true,
    s3Location: {
      bucketName: recordingBucket.bucketName,
      objectKey: "browser-recordings/",
    },
  },
});

// The browser construct automatically grants S3 permissions to the execution role
// when recording is enabled, so no additional IAM configuration is needed
```

### Browser IAM Permissions

The Browser construct provides convenient methods for granting IAM permissions:

```typescript fixture=default
// Create a browser
const browser = new agentcore.BrowserCustom(this, "MyBrowser", {
  browserCustomName: "my_browser",
  description: "Browser for web automation",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingPublicNetwork(),
});

// Create a role that needs access to the browser
const userRole = new iam.Role(this, "UserRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// Grant read permissions (Get and List actions)
browser.grantRead(userRole);

// Grant use permissions (Start, Update, Stop actions)
browser.grantUse(userRole);

// Grant specific custom permissions
browser.grant(userRole, "bedrock-agentcore:GetBrowserSession");
```

## Code Interpreter

The Amazon Bedrock AgentCore Code Interpreter enables AI agents to write and execute code securely in sandbox environments, enhancing their accuracy and expanding their ability to solve complex end-to-end tasks. This is critical in Agentic AI applications where the agents may execute arbitrary code that can lead to data compromise or security risks. The AgentCore Code Interpreter tool provides secure code execution, which helps you avoid running into these issues.

For more information about code interpreter, please refer to the [official documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)

### Code Interpreter Network Modes

The Code Interpreter construct supports the following network modes:

1. **Public Network Mode** (`CodeInterpreterNetworkMode.usingPublicNetwork()`) - Default

   - Allows internet access for package installation and external API calls
   - Suitable for development and testing environments
   - Enables downloading Python packages from PyPI

2. **Sandbox Network Mode** (`CodeInterpreterNetworkMode.usingSandboxNetwork()`)
   - Isolated network environment with no internet access
   - Suitable for production environments with strict security requirements
   - Only allows access to pre-installed packages and local resources

3. **VPC (Virtual Private Cloud)** (`CodeInterpreterNetworkMode.usingVpc()`)
   - Select whether to run the browser in a virtual private cloud (VPC).
   - By configuring VPC connectivity, you enable secure access to private resources such as databases, internal APIs, and services within your VPC.

    While the VPC itself is mandatory, these are optional:
    - Subnets - if not provided, CDK will select appropriate subnets from the VPC
    - Security Groups - if not provided, CDK will create a default security group
    - Specific subnet selection criteria - you can let CDK choose automatically

For more information on VPC connectivity for Amazon Bedrock AgentCore Browser, please refer to the [official documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-vpc.html).

### Code Interpreter Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `codeInterpreterCustomName` | `string` | Yes | The name of the code interpreter. Must start with a letter and can be up to 48 characters long. Pattern: `[a-zA-Z][a-zA-Z0-9_]{0,47}` |
| `description` | `string` | No | Optional description for the code interpreter. Can have up to 200 characters |
| `executionRole` | `iam.IRole` | No | The IAM role that provides permissions for the code interpreter to access AWS services. A new role will be created if not provided |
| `networkConfiguration` | `CodeInterpreterNetworkConfiguration` | No | Network configuration for code interpreter. Defaults to PUBLIC network mode |
| `tags` | `{ [key: string]: string }` | No | Tags to apply to the code interpreter resource |

### Basic Code Interpreter Creation

```typescript fixture=default
// Create a basic code interpreter with public network access
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_code_interpreter",
  description: "A code interpreter for Python execution",
});
```

### Code Interpreter with VPC

```typescript fixture=default
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_sandbox_interpreter",
  description: "Code interpreter with isolated network access",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingVpc(this, {
    vpc: new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false }),
  }),
});
```

Code Interpreter exposes a [connections](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Connections.html) property. This property returns a connections object, which simplifies the process of defining and managing ingress and egress rules for security groups in your AWS CDK applications. Instead of directly manipulating security group rules, you interact with the Connections object of a construct, which then translates your connectivity requirements into the appropriate security group rules. For instance:

```typescript fixture=default
const vpc = new ec2.Vpc(this, 'testVPC');

const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_sandbox_interpreter",
  description: "Code interpreter with isolated network access",
  networkConfiguration: agentcore.BrowserNetworkConfiguration.usingVpc(this, {
    vpc: vpc,
  }),
});

codeInterpreter.connections.addSecurityGroup(new ec2.SecurityGroup(this, 'AdditionalGroup', { vpc }));
```

So security groups can be added after the browser construct creation. You can use methods like allowFrom() and allowTo() to grant ingress access to/egress access from a specified peer over a given portRange. The Connections object automatically adds the necessary ingress or egress rules to the security group(s) associated with the calling construct.

### Code Interpreter with Sandbox Network Mode

```typescript fixture=default
// Create code interpreter with sandbox network mode (isolated)
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_sandbox_interpreter",
  description: "Code interpreter with isolated network access",
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingSandboxNetwork(),
});
```

### Code Interpreter with Custom Execution Role

```typescript fixture=default
// Create a custom execution role
const executionRole = new iam.Role(this, "CodeInterpreterExecutionRole", {
  assumedBy: new iam.ServicePrincipal("bedrock-agentcore.amazonaws.com"),
});

// Create code interpreter with custom execution role
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_code_interpreter",
  description: "Code interpreter with custom execution role",
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
  executionRole: executionRole,
});
```

### Code Interpreter IAM Permissions

The Code Interpreter construct provides convenient methods for granting IAM permissions:

```typescript fixture=default
// Create a code interpreter
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_code_interpreter",
  description: "Code interpreter for Python execution",
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
});

// Create a role that needs access to the code interpreter
const userRole = new iam.Role(this, "UserRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// Grant read permissions (Get and List actions)
codeInterpreter.grantRead(userRole);

// Grant use permissions (Start, Invoke, Stop actions)
codeInterpreter.grantUse(userRole);

// Grant specific custom permissions
codeInterpreter.grant(userRole, "bedrock-agentcore:GetCodeInterpreterSession");
```

### Code interpreter with tags

```typescript fixture=default
// Create code interpreter with sandbox network mode (isolated)
const codeInterpreter = new agentcore.CodeInterpreterCustom(this, "MyCodeInterpreter", {
  codeInterpreterCustomName: "my_sandbox_interpreter",
  description: "Code interpreter with isolated network access",
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
  tags: {
    Environment: "Production",
    Team: "AI/ML",
    Project: "AgentCore",
  },
});
```

## Memory

Memory is a critical component of intelligence. While Large Language Models (LLMs) have impressive capabilities, they lack persistent memory across conversations. Amazon Bedrock AgentCore Memory addresses this limitation by providing a managed service that enables AI agents to maintain context over time, remember important facts, and deliver consistent, personalized experiences.

AgentCore Memory operates on two levels:

- **Short-Term Memory**: Immediate conversation context and session-based information that provides continuity within a single interaction or closely related sessions.
- **Long-Term Memory**: Persistent information extracted and stored across multiple conversations, including facts, preferences, and summaries that enable personalized experiences over time.

When you interact with the memory via the `CreateEvent` API, you store interactions in Short-Term Memory (STM) instantly. These interactions can include everything from user messages, assistant responses, to tool actions.

To write to long-term memory, you need to configure extraction strategies which define how and where to store information from conversations for future use. These strategies are asynchronously processed from raw events after every few turns based on the strategy that was selected. You can't create long term memory records directly, as they are extracted asynchronously by AgentCore Memory.

### Memory Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `memoryName` | `string` | Yes | The name of the memory |
| `expirationDuration` | `Duration` | No | Short-term memory expiration in days (between 7 and 365). Default: 90 days |
| `description` | `string` | No | Optional description for the memory. Default: no description. |
| `kmsKey` | `IKey` | No | Custom KMS key to use for encryption. Default: Your data is encrypted with a key that AWS owns and manages for you |
| `memoryStrategies` | `MemoryStrategyBase[]` | No | Built-in extraction strategies to use for this memory. Default: No extraction strategies (short term memory only) |
| `executionRole` | `iam.IRole` | No | The IAM role that provides permissions for the memory to access AWS services. Default: A new role will be created. |
| `tags` | `{ [key: string]: string }` | No | Tags for memory. Default: no tags. |

### Basic Memory Creation

Below you can find how to configure a simple short-term memory (STM) with no long-term memory extraction strategies.
Note how you set `expirationDuration`, which defines the time the events will be stored in the short-term memory before they expire.

```typescript fixture=default

// Create a basic memory with default settings, no LTM strategies
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my_memory",
  description: "A memory for storing user interactions for a period of 90 days",
  expirationDuration: cdk.Duration.days(90),
});
```

Basic Memory with Custom KMS Encryption

```typescript fixture=default
// Create a custom KMS key for encryption
const encryptionKey = new kms.Key(this, "MemoryEncryptionKey", {
  enableKeyRotation: true,
  description: "KMS key for memory encryption",
});

// Create memory with custom encryption
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my_encrypted_memory",
  description: "Memory with custom KMS encryption",
  expirationDuration: cdk.Duration.days(90),
  kmsKey: encryptionKey,
});
```

### LTM Memory Extraction Stategies

If you need long-term memory for context recall across sessions, you can setup memory extraction strategies
to extract the relevant memory from the raw events.

Amazon Bedrock AgentCore Memory has different memory strategies for extracting and organizing information:

- **Summarization**: to summarize interactions to preserve critical context and key insights.
- **Semantic Memory**: to extract general factual knowledge, concepts and meanings from raw conversations using vector embeddings.
This enables similarity-based retrieval of relevant facts and context.
- **User Preferences**: to extract user behavior patterns from raw conversations.

You can use built-in extraction strategies for quick setup, or create custom extraction strategies with specific models and prompt templates.

### Memory with Built-in Strategies

The library provides three built-in LTM strategies. These are default strategies for organizing and extracting memory data,
each optimized for specific use cases.

For example: An agent helps multiple users with cloud storage setup. From these conversations,
see how each strategy processes users expressing confusion about account connection:

1. **Summarization Strategy** (`MemoryStrategy.usingBuiltInSummarization()`)
This strategy compresses conversations into concise overviews, preserving essential context and key insights for quick recall.
Extracted memory example: Users confused by cloud setup during onboarding.

   - Extracts concise summaries to preserve critical context and key insights
   - Namespace: `/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}`

2. **Semantic Memory Strategy** (`MemoryStrategy.usingBuiltInSemantic()`)
Distills general facts, concepts, and underlying meanings from raw conversational data, presenting the information in a context-independent format.
Extracted memory example: In-context learning = task-solving via examples, no training needed.

   - Extracts general factual knowledge, concepts and meanings from raw conversations
   - Namespace: `/strategies/{memoryStrategyId}/actors/{actorId}`

3. **User Preference Strategy** (`MemoryStrategy.usingBuiltInUserPreference()`)
Captures individual preferences, interaction patterns, and personalized settings to enhance future experiences.
Extracted memory example: User needs clear guidance on cloud storage account connection during onboarding.

   - Extracts user behavior patterns from raw conversations
   - Namespace: `/strategies/{memoryStrategyId}/actors/{actorId}`

```typescript fixture=default
// Create memory with built-in strategies
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my_memory",
  description: "Memory with built-in strategies",
  expirationDuration: cdk.Duration.days(90),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingBuiltInSummarization(),
    agentcore.MemoryStrategy.usingBuiltInSemantic(),
    agentcore.MemoryStrategy.usingBuiltInUserPreference(),
  ],
});
```

The name generated for each built in memory strategy is as follows:

- For Summarization: `summary_builtin_cdk001`
- For Semantic:`semantic_builtin_cdk001>`
- For User Preferences: `preference_builtin_cdk001`

### Memory with custom Strategies

With Long-Term Memory, organization is managed through Namespaces.

An `actor` refers to entity such as end users or agent/user combinations. For example, in a coding support chatbot,
the actor is usually the developer asking questions. Using the actor ID helps the system know which user the memory belongs to,
keeping each user's data separate and organized.

A `session` is usually a single conversation or interaction period between the user and the AI agent.
It groups all related messages and events that happen during that conversation.

A `namespace` is used to logically group and organize long-term memories. It ensures data stays neat, separate, and secure.

With AgentCore Memory, you need to add a namespace when you define a memory strategy. This namespace helps define where the long-term memory
will be logically grouped. Every time a new long-term memory is extracted using this memory strategy, it is saved under the namespace you set.
This means that all long-term memories are scoped to their specific namespace, keeping them organized and preventing any mix-ups with other
users or sessions. You should use a hierarchical format separated by forward slashes /. This helps keep memories organized clearly. As needed,
you can choose to use the below pre-defined variables within braces in the namespace based on your applications' organization needs:

- `actorId` – Identifies who the long-term memory belongs to, such as a user
- `memoryStrategyId` – Shows which memory strategy is being used. This strategy identifier is auto-generated when you create a memory using CreateMemory operation.
- `sessionId` – Identifies which session or conversation the memory is from.

For example, if you define the following namespace as the input to your strategy in CreateMemory operation:

```shell
/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}
```

After memory creation, this namespace might look like:

```shell
/strategy/summarization-93483043//actor/actor-9830m2w3/session/session-9330sds8
```

You can customise the namespace, i.e. where the memories are stored by using the following methods:

1. **Summarization Strategy** (`MemoryStrategy.usingSummarization(props)`)
1. **Semantic Memory Strategy** (`MemoryStrategy.usingSemantic(props)`)
1. **User Preference Strategy** (`MemoryStrategy.usingUserPreference(props)`)

```typescript fixture=default
// Create memory with built-in strategies
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my_memory",
  description: "Memory with built-in strategies",
  expirationDuration: cdk.Duration.days(90),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingUserPreference({
        name: "CustomerPreferences",
        namespaces: ["support/customer/{actorId}/preferences"]
    }),
    agentcore.MemoryStrategy.usingSemantic({
        name: "CustomerSupportSemantic",
        namespaces: ["support/customer/{actorId}/semantic"]
    }),
  ],
});
```

Custom memory strategies let you tailor memory extraction and consolidation to your specific domain or use case.
You can override the prompts for extracting and consolidating semantic, summary, or user preferences.
You can also choose the model that you want to use for extraction and consolidation.

The custom prompts you create are appended to a non-editable system prompt.

Since a custom strategy requires you to invoke certain FMs, you need a role with appropriate permissions. For that, you can:

- Let the L2 construct create a minimum permission role for you when use L2 Bedrock Foundation Models.
- Use a custom role with the overly permissive `AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy` managed policy.
- Use a custom role with your own custom policies.

#### Memory with Custom Execution Role

Keep in mind that memories that **do not** use custom strategies do not require a service role.
So even if you provide it, it will be ignored as it will never be used.

```typescript fixture=default
// Create a custom execution role
const executionRole = new iam.Role(this, "MemoryExecutionRole", {
  assumedBy: new iam.ServicePrincipal("bedrock-agentcore.amazonaws.com"),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonBedrockAgentCoreMemoryBedrockModelInferenceExecutionRolePolicy"
    ),
  ],
});

// Create memory with custom execution role
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my_memory",
  description: "Memory with custom execution role",
  expirationDuration: cdk.Duration.days(90),
  executionRole: executionRole,
});
```

In customConsolidation and customExtraction, the model property uses the [@aws-cdk/aws-bedrock-alph](https://www.npmjs.com/package/@aws-cdk/aws-bedrock-alpha) library which must be installed separately.

```typescript fixture=default
// Create a custom semantic memory strategy
const customSemanticStrategy = agentcore.MemoryStrategy.usingSemantic({
  name: "customSemanticStrategy",
  description: "Custom semantic memory strategy",
  namespaces: ["/custom/strategies/{memoryStrategyId}/actors/{actorId}"],
  customConsolidation: {
    model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    appendToPrompt: "Custom consolidation prompt for semantic memory",
  },
  customExtraction: {
    model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    appendToPrompt: "Custom extraction prompt for semantic memory",
  },
});

// Create memory with custom strategy
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my-custom-memory",
  description: "Memory with custom strategy",
  expirationDuration: cdk.Duration.days(90),
  memoryStrategies: [customSemanticStrategy],
});
```

### Memory with self-managed Strategies

A self-managed strategy in Amazon Bedrock AgentCore Memory gives you complete control over your memory extraction and consolidation pipelines. 
With a self-managed strategy, you can build custom memory processing workflows while leveraging Amazon Bedrock AgentCore for storage and retrieval.

For additional information, you can refer to the [developer guide for self managed strategies](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-self-managed-strategies.html).

Create the required AWS resources including:

- an S3 bucket in your account where Amazon Bedrock AgentCore will deliver batched event payloads.
- an SNS topic for job notifications. Use FIFO topics if processing order within sessions is important for your use case.

The construct will apply the correct permissions to the memory execution role to access these resources.

```typescript fixture=default

const bucket = new s3.Bucket(this, 'memoryBucket', {
  bucketName: 'test-memory',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const topic = new sns.Topic(this, 'topic');

// Create a custom semantic memory strategy
const selfManagedStrategy = agentcore.MemoryStrategy.usingSelfManaged({
  name: "selfManagedStrategy",
  description: "self managed memory strategy",
  historicalContextWindowSize: 5,
  invocationConfiguration: {
    topic: topic,
    s3Location: {
      bucketName: bucket.bucketName,
      objectKey: 'memory/',
    }
  },
  triggerConditions: {
    messageBasedTrigger: 1,
    timeBasedTrigger: cdk.Duration.seconds(10),
    tokenBasedTrigger: 100
  }
});

// Create memory with custom strategy
const memory = new agentcore.Memory(this, "MyMemory", {
  memoryName: "my-custom-memory",
  description: "Memory with custom strategy",
  expirationDuration: cdk.Duration.days(90),
  memoryStrategies: [selfManagedStrategy],
});
```

### Memory Strategy Methods

You can add new memory strategies to the memory construct using the `addMemoryStrategy()` method, for instance:

```typescript fixture=default
// Create memory without initial strategies
const memory = new agentcore.Memory(this, "test-memory", {
  memoryName: "test_memory_add_strategy",
  description: "A test memory for testing addMemoryStrategy method",
  expirationDuration: cdk.Duration.days(90),
});

// Add strategies after instantiation
memory.addMemoryStrategy(agentcore.MemoryStrategy.usingBuiltInSummarization());
memory.addMemoryStrategy(agentcore.MemoryStrategy.usingBuiltInSemantic());
```
