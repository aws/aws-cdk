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

> **Note:** Users need to ensure their CDK deployment role has the `iam:CreateServiceLinkedRole` permission for AgentCore service-linked roles.

## Table of contents

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
- [Gateway](#gateway)
  - [Gateway Properties](#gateway-properties)
  - [Basic Gateway Creation](#basic-gateway-creation)
  - [Protocol configuration](#protocol-configuration)
  - [Inbound authorization](#inbound-authorization)
  - [Gateway with KMS Encryption](#gateway-with-kms-encryption)
  - [Gateway with Custom Execution Role](#gateway-with-custom-execution-role)
  - [Gateway IAM Permissions](#gateway-iam-permissions)
- [Gateway Target](#gateway-target)
  - [Gateway Target Properties](#gateway-target-properties)
  - [Targets types](#targets-types)
  - [Outbound auth](#outbound-auth)
  - [Api schema](#api-schema)
  - [Basic Gateway Target Creation](#basic-gateway-target-creation)
    - [Using addTarget methods (Recommended)](#using-addtarget-methods-recommended)
    - [Using static factory methods](#using-static-factory-methods)
  - [Lambda Target with Tool Schema](#lambda-target-with-tool-schema)
  - [Smithy Model Target with OAuth](#smithy-model-target-with-oauth)
  - [Complex Lambda Target with S3 Tool Schema](#complex-lambda-target-with-s3-tool-schema)
  - [Lambda Target with Local Asset Tool Schema](#lambda-target-with-local-asset-tool-schema)
  - [Gateway Target IAM Permissions](#gateway-target-iam-permissions)
  - [Target Configuration Types](#target-configuration-types)

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

## Gateway

The Gateway construct provides a way to create Amazon Bedrock Agent Core Gateways, which serve as integration points between agents and external services.

### Gateway Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `gatewayName` | `string` | Yes | The name of the gateway. Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen). Maximum 100 characters |
| `description` | `string` | No | Optional description for the gateway. Maximum 200 characters |
| `protocolConfiguration` | `IGatewayProtocol` | No | The protocol configuration for the gateway. Defaults to MCP protocol |
| `authorizerConfiguration` | `IGatewayAuthorizer` | No | The authorizer configuration for the gateway. Defaults to Cognito |
| `exceptionLevel` | `GatewayExceptionLevel` | No | The verbosity of exception messages. Use DEBUG mode to see granular exception messages |
| `kmsKey` | `kms.IKey` | No | The AWS KMS key used to encrypt data associated with the gateway |
| `role` | `iam.IRole` | No | The IAM role that provides permissions for the gateway to access AWS services. A new role will be created if not provided |
| `tags` | `{ [key: string]: string }` | No | Tags for the gateway. A list of key:value pairs of tags to apply to this Gateway resource |

### Basic Gateway Creation

The protocol configuration defaults to MCP and the inbound auth configuration uses Cognito (it is automatically created on your behalf).

```typescript fixture=default
// Create a basic gateway with default MCP protocol and Cognito authorizer
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
});
```

### Protocol configuration

Currently MCP is the only protocol available. To configure it, use the `protocol` property with `McpProtocolConfiguration`:

- Instructions: Guidance for how to use the gateway with your tools
- Semantic search: Smart tool discovery that finds the right tools without typical limits. It improves accuracy by finding relevant tools based on context
- Supported versions: Which MCP protocol versions the gateway can use

```typescript fixture=default
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
});
```

### Inbound authorization

Before you create your gateway, you must set up inbound authorization. Inbound authorization validates users who attempt to access targets through
your AgentCore gateway. By default, if not provided, the construct will create and configure Cognito as the default identity provider
(inbound Auth setup). AgentCore supports the following types of inbound authorization:

**JSON Web Token (JWT)** – A secure and compact token used for authorization. After creating the JWT, you specify it as the authorization
configuration when you create the gateway. You can create a JWT with any of the identity providers at Provider setup and configuration.

You can configure a custom authorization provider using the `inboundAuthorizer` property with `GatewayAuthorizer.usingCustomJwt()`.
You need to specify an OAuth discovery server and client IDs/audiences when you create the gateway. You can specify the following:

- Discovery Url — String that must match the pattern ^.+/\.well-known/openid-configuration$ for OpenID Connect discovery URLs
- At least one of the below options depending on the chosen identity provider.
- Allowed audiences — List of allowed audiences for JWT tokens
- Allowed clients — List of allowed client identifiers

```typescript fixture=default
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
});
```

**IAM** – Authorizes through the credentials of the AWS IAM identity trying to access the gateway.

```typescript fixture=default
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  authorizerConfiguration: agentcore.GatewayAuthorizer.awsIam,
});

// Grant access to a Lambda function's role
const lambdaRole = new iam.Role(this, "LambdaRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// The Lambda needs permission to invoke the gateway
gateway.grantInvoke(lambdaRole);
```

### Gateway with KMS Encryption

You can provide a KMS key, and configure the authorizer as well as the protocol configuration.

```typescript fixture=default
// Create a KMS key for encryption
const encryptionKey = new kms.Key(this, "GatewayEncryptionKey", {
  enableKeyRotation: true,
  description: "KMS key for gateway encryption",
});

// Create gateway with KMS encryption
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-encrypted-gateway",
  description: "Gateway with KMS encryption",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
  kmsKey: encryptionKey,
  exceptionLevel: agentcore.GatewayExceptionLevel.DEBUG,
});
```

### Gateway with Custom Execution Role

```typescript fixture=default
// Create a custom execution role
const executionRole = new iam.Role(this, "GatewayExecutionRole", {
  assumedBy: new iam.ServicePrincipal("bedrock-agentcore.amazonaws.com"),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockAgentCoreGatewayExecutionRolePolicy"),
  ],
});

// Create gateway with custom execution role
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  description: "Gateway with custom execution role",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
  role: executionRole,
});
```

### Gateway IAM Permissions

The Gateway construct provides convenient methods for granting IAM permissions:

```typescript fixture=default
// Create a gateway
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  description: "Gateway for external service integration",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
});

// Create a role that needs access to the gateway
const userRole = new iam.Role(this, "UserRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// Grant read permissions (Get and List actions)
gateway.grantRead(userRole);

// Grant manage permissions (Create, Update, Delete actions)
gateway.grantManage(userRole);

// Grant specific custom permissions
gateway.grant(userRole, "bedrock-agentcore:GetGateway");
```

## Gateway Target

After Creating gateways, you can add targets which define the tools that your gateway will host. Gateway supports multiple target
types including Lambda functions and API specifications (either OpenAPI schemas or Smithy models). Gateway allows you to attach multiple
targets to a Gateway and you can change the targets / tools attached to a gateway at any point. Each target can have its own
credential provider attached enabling you to securely access targets whether they need IAM, API Key, or OAuth credentials.

### Gateway Target Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `gatewayTargetName` | `string` | Yes | The name of the gateway target. Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen) |
| `description` | `string` | No | Optional description for the gateway target. Maximum 200 characters |
| `gateway` | `IGateway` | Yes | The gateway this target belongs to |
| `targetConfiguration` | `ITargetConfiguration` | Yes | The target configuration (Lambda, OpenAPI, or Smithy). Use `LambdaTargetConfiguration.create()`, `OpenApiTargetConfiguration.create()`, or `SmithyTargetConfiguration.create()` |
| `credentialProviderConfigurations` | `IGatewayCredentialProvider[]` | No | Credential providers for authentication. Defaults to `[GatewayCredentialProvider.iamRole()]`. Use `GatewayCredentialProvider.apiKey()`, `GatewayCredentialProvider.oauth()`, or `GatewayCredentialProvider.iamRole()` |

### Targets types

You can create the following targets types:

**Lambda Target**: Lambda targets allow you to connect your gateway to AWS Lambda functions that implement your tools. This is useful
when you want to execute custom code in response to tool invocations.

- Supports GATEWAY_IAM_ROLE credential provider only
- Ideal for custom serverless function integration
- Need tool schema (tool schema is a blueprint that describes the functions your Lambda provides to AI agents).
  The construct provide 3 ways to upload a tool schema to Lambda target

**OpenAPI Schema Target** : OpenAPI widely used standard for describing RESTful APIs. Gateway supports OpenAPI 3.0
specifications for defining API targets. It onnects to REST APIs using OpenAPI specifications

- Supports OAUTH and API_KEY credential providers
- Ideal for integrating with external REST services
- Need API schema. The construct provide 3 ways to upload a API schema to OpenAPI target

**Smithy Model Target** : Smithy is a language for defining services and software development kits (SDKs). Smithy models provide
a more structured approach to defining APIs compared to OpenAPI, and are particularly useful for connecting to AWS services.
AgentCore Gateway supports built-in AWS service models only. It Connects to services using Smithy model definitions

- Supports OAUTH and API_KEY credential providers
- Ideal for AWS service integrations
- Need API schema. The construct provide 3 ways to upload a API schema to Smity target

> Note: For Smithy model targets that access AWS services, your Gateway's execution role needs permissions to access those services.
For example, for a DynamoDB target, your execution role needs permissions to perform DynamoDB operations.
This is not managed by the construct due to the large number of options.

### Tools schema For Lambda target

The lambda target need tools schema to understand the fuunction lambda provides. You can upload the tool schema by following 3 ways:

- From a local asset file

```typescript
const toolSchema = agentcore.ToolSchema.fromLocalAsset(
    path.join(__dirname, "schemas", "my-tool-schema.json")
  );
```

- From an existing S3 file:

```typescript

const toolSchema = agentcore.ToolSchema.fromS3File(
    s3.Bucket.fromBucketName(this, "SchemasBucket", "my-schemas-bucket"),
    "tools/complex-tool-schema.json",
    "123456789012"
  );
```

- From Inline:

```typescript
const toolSchema = agentcore.ToolSchema.fromInline([{
      name: "hello_world",
      description: "A simple hello world tool",
      inputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          name: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: "The name to greet",
          },
        },
        required: ["name"],
      },
    }]);

```

### Api schema For OpenAPI and Smithy target

The OpenAPI and Smithy target need API Schema. The Gateway construct provide three ways to upload API schema for your target:

- From a local asset file (requires binding to scope):

```typescript fixture=default
// When using ApiSchema.fromLocalAsset, you must bind the schema to a scope
const schema = agentcore.ApiSchema.fromLocalAsset(path.join(__dirname, "mySchema.yml"));
schema.bind(this);
```

- From an inline schema:

```typescript fixture=default
const inlineSchema = agentcore.ApiSchema.fromInline(`
openapi: 3.0.3
info:
  title: Library API
  version: 1.0.0
paths:
  /search:
    get:
      summary: Search for books
      operationId: searchBooks
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
`);
```

- From an existing S3 file:

```typescript fixture=default
const bucket = s3.Bucket.fromBucketName(this, "ExistingBucket", "my-schema-bucket");
const s3Schema = agentcore.ApiSchema.fromS3File(bucket, "schemas/action-group.yaml");
```

### Outbound auth

Outbound authorization lets Amazon Bedrock AgentCore gateways securely access gateway targets on behalf of users authenticated
and authorized during Inbound Auth.

AgentCore Gateway supports the following types of outbound authorization:

**IAM-based outbound authorization** – The gateway uses its execution role to authenticate with AWS services. This is the default
 and most common approach for Lambda targets and AWS service integrations.

**2-legged OAuth (OAuth 2LO)** – Use OAuth 2.0 two-legged flow (2LO) for targets that require OAuth authentication.
The gateway authenticates on its own behalf, not on behalf of a user.

**API key** – Use the AgentCore service/AWS console to generate an API key to authenticate access to the gateway target.

**Note > You need to set up the outbound identity before you can create a gateway target.

### Basic Gateway Target Creation

You can create targets in two ways: using the static factory methods on `GatewayTarget` or using the convenient `addTarget` methods on the gateway instance.

#### Using addTarget methods (Recommended)

Below are the examples on how you can create Lambda , Smity and OpenAPI target using `addTarget` method.

```typescript fixture=default
// Create a gateway first
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
});

// These ARNs are returned when creating the API key credential provider via Console or API
const apiKeyProviderArn = "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc123/apikeycredentialprovider/my-apikey"
const apiKeySecretArn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-apikey-secret-abc123"

const bucket = s3.Bucket.fromBucketName(this, "ExistingBucket", "my-schema-bucket");
const s3mySchema = agentcore.ApiSchema.fromS3File(bucket, "schemas/myschema.yaml");

// Add an OpenAPI target directly to the gateway
const target = gateway.addOpenApiTarget("MyTarget", {
  gatewayTargetName: "my-api-target",
  description: "Target for external API integration",
  apiSchema: s3mySchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.apiKey({
      providerArn: apiKeyProviderArn,
      secretArn: apiKeySecretArn, 
      credentialLocation: agentcore.ApiKeyCredentialLocation.header({
        credentialParameterName: "X-API-Key",
      }),
    }),
  ],
});

// Add a Lambda target
const lambdaFunction = new lambda.Function(this, "MyFunction", {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: "index.handler",
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from Lambda!' })
      };
    };
  `),
});

const lambdaTarget = gateway.addLambdaTarget("MyLambdaTarget", {
  gatewayTargetName: "my-lambda-target",
  description: "Lambda function target",
  lambdaFunction: lambdaFunction,
  toolSchema: agentcore.ToolSchema.fromInline([
    {
      name: "hello_world",
      description: "A simple hello world tool",
      inputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        properties: {
          name: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: "The name to greet",
          },
        },
        required: ["name"],
      },
    },
  ]),
});

// Add a Smithy target
const smithySchema = agentcore.ApiSchema.fromS3File(bucket, "schemas/mymodel.json");
const smithyTarget = gateway.addSmithyTarget("MySmithyTarget", {
  gatewayTargetName: "my-smithy-target",
  description: "Smithy model target",
  smithyModel: smithySchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.iamRole(),
  ],
});
```

#### Using static factory methods

Create Gateway target using static convienence method.

```typescript fixture=default
// Create a gateway first
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
});

const apiKeyIdentityArn = "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc123/apikeycredentialprovider/my-apikey"
const apiKeySecretArn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-apikey-secret-abc123"

const bucket = s3.Bucket.fromBucketName(this, "ExistingBucket", "my-schema-bucket");
const s3Schema = agentcore.ApiSchema.fromS3File(bucket, "schemas/myschema.yaml");

// Create a gateway target with OpenAPI Schema 
const openApitarget = agentcore.GatewayTarget.forOpenApi(this, "MyTarget", {
  gatewayTargetName: "my-api-target",
  description: "Target for external API integration",
  gateway: gateway,  // Note: you need to pass the gateway reference
  apiSchema: s3Schema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.apiKey({
     providerArn: apiKeyIdentityArn,
     secretArn: apiKeySecretArn,
      credentialLocation: agentcore.ApiKeyCredentialLocation.header({
        credentialParameterName: "X-API-Key",
      }),
    }),
  ],
});

// Create a Lambda function
const lambdaFunction = new lambda.Function(this, "MyFunction", {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: "index.handler",
  code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Hello from Lambda!' })
            };
        };
    `),
});

// Create a gateway target with Lambda and tool schema 
const lambdaTarget = agentcore.GatewayTarget.forLambda(this, "MyLambdaTarget", {
  gatewayTargetName: "my-lambda-target",
  description: "Target for Lambda function integration",
  gateway: gateway,
  lambdaFunction: lambdaFunction,
  toolSchema: agentcore.ToolSchema.fromInline([
    {
      name: "hello_world",
      description: "A simple hello world tool",
      inputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        description: "Input schema for hello world tool",
        properties: {
          name: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: "The name to greet",
          },
        },
        required: ["name"],
      },
      outputSchema: {
        type: agentcore.SchemaDefinitionType.OBJECT,
        description: "Output schema for hello world tool",
        properties: {
          message: {
            type: agentcore.SchemaDefinitionType.STRING,
            description: "The greeting message",
          },
        },
      },
    },
  ]),
  credentialProviderConfigurations: [agentcore.GatewayCredentialProvider.iamRole()],
});


// Create an OAuth identity
const oauthIdentityArn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-oauth123"
const oauthSecretArn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-apikey-secret-abc123"

const schemaBucket = s3.Bucket.fromBucketName(this, "SchemaBucket", "my-schema-bucket");
const s3SmithySchema = agentcore.ApiSchema.fromS3File(schemaBucket, "schemas/myschema.json");

// Create a gateway target with Smithy Model and OAuth
const target = agentcore.GatewayTarget.forSmithy(this, "MySmithyTarget", {
  gatewayTargetName: "my-smithy-target",
  description: "Target for Smithy model integration",
  gateway: gateway,
  smithyModel: s3SmithySchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.oauth({
      providerArn: oauthIdentityArn,
      secretArn: oauthSecretArn,
      scopes: ["read", "write"],
      customParameters: {
        audience: "https://api.example.com",
        response_type: "code",
      },
    }),
  ],
});

```

### Gateway Target IAM Permissions

The Gateway Target construct provides convenient methods for granting IAM permissions:

```typescript fixture=default
// Create a gateway and target
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  protocolConfiguration: new agentcore.McpProtocolConfiguration({
    instructions: "Use this gateway to connect to external MCP tools",
    searchType: agentcore.McpGatewaySearchType.SEMANTIC,
    supportedVersions: [agentcore.MCPProtocolVersion.MCP_2025_03_26],
  }),
  authorizerConfiguration: agentcore.GatewayAuthorizer.usingCustomJwt({
    discoveryUrl: "https://auth.example.com/.well-known/openid-configuration",
    allowedAudience: ["my-app"],
    allowedClients: ["my-client-id"],
  }),
});

const apiKeyIdentityArn = "arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/abc123/apikeycredentialprovider/my-apikey"
const apiKeySecretArn = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-apikey-secret-abc123"

const bucket = s3.Bucket.fromBucketName(this, "ExistingBucket", "my-schema-bucket");
const s3apiSchema = agentcore.ApiSchema.fromS3File(bucket, "schemas/myschema.yaml");

const target = agentcore.GatewayTarget.forOpenApi(this, "MyTarget", {
  gatewayTargetName: "my-target",
  gateway: gateway,
  apiSchema: s3apiSchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.apiKey({
     providerArn: apiKeyIdentityArn,
     secretArn: apiKeySecretArn,
      credentialLocation: agentcore.ApiKeyCredentialLocation.header({
        credentialParameterName: "X-API-Key",
      }),
    }),
  ],
});

// Create a role that needs access to the gateway target
const userRole = new iam.Role(this, "UserRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// Grant read permissions (Get and List actions)
target.grantRead(userRole);

// Grant manage permissions (Create, Update, Delete actions)
target.grantManage(userRole);

// Grant specific custom permissions
target.grant(userRole, "bedrock-agentcore:GetGatewayTarget");
```
