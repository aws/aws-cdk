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

> The **Policy** submodule is the only submodule that remains in alpha. All other constructs have graduated to stable in `aws-cdk-lib/aws-bedrockagentcore` and we recommend migrating to the stable versions.

| **Language**                                                                                   | **Package**                             |
| :--------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![Typescript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `@aws-cdk/aws-bedrock-agentcore-alpha` |

## Migration to Stable

All constructs except Policy have moved to `aws-cdk-lib/aws-bedrockagentcore`:

```ts nofixture
// Before
import * as agentcore from '@aws-cdk/aws-bedrock-agentcore-alpha';
```

```ts nofixture
// After (for all non-Policy constructs)
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
```

The following constructs are now in stable:

- **Runtime**: `Runtime`, `RuntimeEndpoint`, `AgentRuntimeArtifact`, `NetworkConfiguration`, `Observability`
- **Gateway**: `Gateway`, `GatewayTarget`, `GatewayAuthorizer`, `GatewayCredentialProvider`, `Interceptor`
- **Tools**: `BrowserCustom`, `CodeInterpreterCustom`
- **Memory**: `Memory`, `MemoryStrategy`
- **Evaluation**: `OnlineEvaluationConfig`, `Evaluator`, `EvaluatorSelector`
- **Identity**: `OAuth2CredentialProvider`, `ApiKeyCredentialProvider`, `WorkloadIdentity`

## What Remains in Alpha

The Policy submodule remains experimental:

- `PolicyEngine`
- `Policy`
- `PolicyStatement`
- `PolicyValidationMode`
- `PolicyEngineMode`

## Policy Engine

A policy engine is a collection of policies that evaluates and authorizes agent tool calls. When associated with a gateway, the policy engine intercepts all agent requests and determines whether to allow or deny each action based on the defined policies.

For more information, see the [Policy in Amazon Bedrock AgentCore documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html).

### PolicyEngine Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `policyEngineName` | `string` | No | The name of the policy engine. Valid characters: a-z, A-Z, 0-9, _ (underscore). Must start with a letter, 1-48 characters. If not provided, a unique name will be auto-generated |
| `description` | `string` | No | Optional description for the policy engine (max 4,096 characters). Default: no description |
| `kmsKey` | `IKey` | No | Custom KMS key for encryption. **IMPORTANT**: Once set, cannot be changed (requires replacement). Must be symmetric ENCRYPT_DECRYPT key. If key becomes inaccessible, all authorization decisions will be DENIED. Default: AWS owned key |
| `tags` | `{ [key: string]: string }` | No | Tags for the policy engine (max 50 tags). Default: no tags |

### Understanding Cedar Policies in AgentCore

Policies are constructed using [Cedar language](https://www.cedarpolicy.com/en/tutorial), an open source language for writing and enforcing authorization policies.
Cedar policies in AgentCore follow a specific structure with three main components: **Principal**, **Action**, and **Resource**. Understanding how these components work together is critical for writing effective policies.

#### Policy Structure

Every Cedar policy has this basic structure:

```cedar
permit(              // or forbid
  principal,         // Who is making the request
  action,            // What operation they want to perform
  resource           // What Gateway/tool they want to access
)
when {               // Optional conditions
  // Additional constraints
};
```

Example Policy

```cedar
permit(
  principal,
  action == AgentCore::Action::"ApplicationToolTarget___create_application",
  resource == AgentCore::Gateway::"<gateway-arn>"
) when {
  context.input.coverage_amount <= 1000000
};
```

### Basic PolicyEngine and Policy Creation

Create a policy engine and add policies to it.

#### Policy Engine Mode

When associating a policy engine with a gateway, you can control the enforcement behavior using `PolicyEngineMode`:

- `PolicyEngineMode.LOG_ONLY` (default) — evaluates actions and adds traces but does not enforce decisions. Use this mode for testing and validation before enabling enforcement.
- `PolicyEngineMode.ENFORCE` — actively allows or denies agent operations based on Cedar policy evaluation.

```typescript fixture=default

// Create a Policy engine
const policyEngine = new agentcore.PolicyEngine(this, "MyPolicyEngine", {
  policyEngineName: "my_policy_engine",
  description: "Policy engine for access control",
});

const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
  policyEngineConfiguration: {
    policyEngine: policyEngine,
    mode: agentcore.PolicyEngineMode.ENFORCE, // Default is LOG_ONLY
  },
});

// Add policy to policy engine
policyEngine.addPolicy("AllowAllActions", {
  definition: `
    permit(
      principal,
      action,
      resource == AgentCore::Gateway::"${gateway.gatewayArn}"
    );
  `,
  description: "Allow all actions on specific gateway (development)",
  validationMode: agentcore.PolicyValidationMode.IGNORE_ALL_FINDINGS, // This will ignore all cedar warnings
});

// you can add multiple policies to the policy engine
policyEngine.addPolicy("SpecificToolPolicy", {
  definition: `
    permit(
      principal is AgentCore::OAuthUser,
      action == AgentCore::Action::"WeatherTool__get_forecast",
      resource == AgentCore::Gateway::"${gateway.gatewayArn}"
    );
  `,
  description: "Allow specific weather tool access",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS, // This will fail policy creation for any cedar warning
});
```

### Type-Safe Policy Builder

For a more type-safe approach, use the `PolicyStatement` builder instead of writing raw Cedar syntax.

```typescript fixture=default
const gateway = new agentcore.Gateway(this, "MyGateway", {
  gatewayName: "my-gateway",
});

const policyEngine = new agentcore.PolicyEngine(this, "MyPolicyEngine", {
  policyEngineName: "my_policy_engine",
});

const allowAllPolicy = new agentcore.Policy(this, "AllowAllPolicy", {
  policyEngine: policyEngine,
  policyName: "allow_all",
  statement: agentcore.PolicyStatement.permit()
    .forAllPrincipals() // ** This will give overly permission to all principals
    .onAllActions()
    .onResource('AgentCore::Gateway', gateway.gatewayArn),
  description: "Allow all actions on specific gateway (development only)",
  validationMode: agentcore.PolicyValidationMode.IGNORE_ALL_FINDINGS,
});

// Generated Cedar:
// permit(
//   principal,
//   action,
//   resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:region:account:gateway/gateway-id"
// );
```

#### Policy with Specific Actions

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;
declare const gateway: agentcore.Gateway;

// Allow specific tool actions on specific gateway
// Action names follow pattern: "ToolName__operation"
policyEngine.addPolicy("SpecificToolPolicy", {
  statement: agentcore.PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser::your-client-id')
    .onActions([
      'AgentCore::Action::WeatherTool__get_forecast',
      'AgentCore::Action::WeatherTool__get_current',
    ])
    .onResource('AgentCore::Gateway', gateway.gatewayArn),
  description: "Allow specific weather tool operations",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});

// Generated Cedar:
// permit(
//   principal is AgentCore::OAuthUser,
//   action in [
//     AgentCore::Action::"WeatherTool__get_forecast",
//     AgentCore::Action::"WeatherTool__get_current"
//   ],
//   resource == AgentCore::Gateway::"arn:aws:bedrock-agentcore:us-east-1:123:gateway/gw-123"
// );
```

#### Policy with Conditions

Use `when` clauses to add advanced conditions based on principal tags (from OAuth token) or context:

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;
declare const gateway: agentcore.Gateway;

// Policy with when conditions using principal tags
const conditionalPolicy = new agentcore.Policy(this, "ConditionalPolicy", {
  policyEngine: policyEngine,
  policyName: "conditional_access",
  statement: agentcore.PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser')  // Type constraint
    .onAllActions()
    .onResource('AgentCore::Gateway', gateway.gatewayArn)  // Specific ARN
    .when()
      .principalAttribute('department').equalTo('Engineering')
      .and()
      .contextAttribute('input.priority').equalTo('high')
      .done(),
  description: "Allow engineers for high-priority requests",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});

// Generated Cedar:
// permit(
//   principal is AgentCore::OAuthUser,
//   action,
//   resource == AgentCore::Gateway::"arn:..."
// )
// when {
//   principal.department == "Engineering" && context.input.priority == "high"
// };
```

#### Policy with Exclusions (unless)

Use `unless` clauses to exclude specific conditions from a policy. The policy applies when the `unless` conditions are NOT met:

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;
declare const gateway: agentcore.Gateway;

// Allow access unless the user is suspended
const policyWithUnless = new agentcore.Policy(this, "UnlessPolicy", {
  policyEngine: policyEngine,
  policyName: "unless_suspended",
  statement: agentcore.PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser')
    .onAllActions()
    .onResource('AgentCore::Gateway', gateway.gatewayArn)
    .unless()
      .principalAttribute('suspended').equalTo(true)
      .done(),
  description: "Allow all actions unless user is suspended",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});

// Generated Cedar:
// permit(
//   principal is AgentCore::OAuthUser,
//   action,
//   resource == AgentCore::Gateway::"arn:..."
// )
// unless {
//   principal.suspended == true
// };
```

You can combine `when` and `unless` clauses in the same policy:

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;
declare const gateway: agentcore.Gateway;

// Allow engineers unless they are on probation
policyEngine.addPolicy("CombinedConditions", {
  statement: agentcore.PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser')
    .onAllActions()
    .onResource('AgentCore::Gateway', gateway.gatewayArn)
    .when()
      .principalAttribute('department').equalTo('Engineering')
      .done()
    .unless()
      .principalAttribute('status').equalTo('probation')
      .done(),
  description: "Allow engineers unless on probation",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});
```

#### Forbid (Deny) Policy

Use `forbid` to explicitly deny access. Forbid policies override permit policies.

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;
declare const gateway: agentcore.Gateway;

// Explicitly deny dangerous tool operations
policyEngine.addPolicy("DenyDangerous", {
  statement: agentcore.PolicyStatement.forbid()
    .forAllPrincipals()
    .onAction('AgentCore::Action::DeleteTool__delete_all')
    .onResource('AgentCore::Gateway', gateway.gatewayArn),
  description: "Forbid delete_all operation for all users",
  validationMode: agentcore.PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});

// Generated Cedar:
// forbid(
//   principal,
//   action == AgentCore::Action::"DeleteTool__delete_all",
//   resource == AgentCore::Gateway::"arn:..."
// );
```

#### Raw Cedar for Advanced Cases

For advanced Cedar features not supported by the builder, use raw Cedar strings:

```typescript fixture=default
declare const policyEngine: agentcore.PolicyEngine;

// Option 1: Using definition property
const advancedPolicy = new agentcore.Policy(this, "AdvancedPolicy", {
  policyEngine: policyEngine,
  definition: 'permit(principal, action, resource) when { context.custom > 10 };',
  description: "Advanced policy with custom Cedar logic",
});

// Option 2: Using fromCedar() with statement property
policyEngine.addPolicy("CustomPolicy", {
  statement: agentcore.PolicyStatement.fromCedar(
    'forbid(principal, action, resource) when { resource.confidential == true };'
  ),
  description: "Custom policy from Cedar string",
});
```

**Note**: You must specify **either** `definition` (raw Cedar string) **or** `statement` (PolicyStatement builder), but not both.

#### Accessing Policies on PolicyEngine

You can access the list of policies added to a PolicyEngine using policyEngine.policies.

### PolicyEngine with KMS Encryption

Encrypt policy data with a custom KMS key.

```typescript fixture=default
// Create a custom KMS key
const policyKey = new kms.Key(this, "PolicyEngineKey", {
  enableKeyRotation: true,
  description: "KMS key for policy engine encryption",
});

// Create policy engine with encryption
const policyEngine = new agentcore.PolicyEngine(this, "EncryptedEngine", {
  policyEngineName: "encrypted_engine",
  description: "Policy engine with KMS encryption",
  kmsKey: policyKey,
});
```

### Importing Existing PolicyEngine

Import an existing policy engine from its ARN:

```typescript fixture=default
const importedEngine = agentcore.PolicyEngine.fromPolicyEngineAttributes(
  this,
  "ImportedEngine",
  {
    policyEngineArn: "policy-engine-arn",
    kmsKeyArn: "kms-arn",
  }
);

// Use the imported engine
const policy = new agentcore.Policy(this, "PolicyForImportedEngine", {
  policyEngine: importedEngine,
  definition: "permit(principal, action, resource);",
});
```

### Importing Existing Policy

Import an existing policy from its ARN:

```typescript fixture=default
const importedEngine = agentcore.PolicyEngine.fromPolicyEngineAttributes(
  this,
  "ImportedEngine",
  {
    policyEngineArn: "policy-engine/my-engine-id",
  }
);

const importedPolicy = agentcore.Policy.fromPolicyAttributes(
  this,
  "ImportedPolicy",
  {
    policyArn: "my-policy-arn",
    policyEngine: importedEngine,
  }
);

// Grant permissions to the imported policy
const role = new iam.Role(this, "PolicyRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

importedPolicy.grantRead(role);
```

### PolicyEngine IAM Permissions

Grant various levels of access to policy engines:

```typescript fixture=default
const policyEngine = new agentcore.PolicyEngine(this, "MyEngine", {
  policyEngineName: "my_engine",
});

const lambdaRole = new iam.Role(this, "LambdaRole", {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
});

// Grant read permissions
policyEngine.grantRead(lambdaRole);

// Grant evaluation permissions
policyEngine.grantEvaluate(lambdaRole);
```

## Using Policy with Stable Gateway

Since Gateway is now in `aws-cdk-lib/aws-bedrockagentcore` but Policy remains in alpha, use the L1 escape hatch to associate a policy engine with a stable gateway:

> Proper L2 integration will be added in a future update.

```ts fixture=policy
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as agentcoreAlpha from '@aws-cdk/aws-bedrock-agentcore-alpha';

// Create policy engine (alpha)
const policyEngine = new agentcoreAlpha.PolicyEngine(this, 'Engine', {
  policyEngineName: 'my_engine',
});

// Create gateway (stable)
const gateway = new agentcore.Gateway(this, 'Gateway', {
  gatewayName: 'my-gateway',
});

// Wire policy engine to gateway via the L1 construct
const cfnGateway = gateway.node.defaultChild as agentcore.CfnGateway;
cfnGateway.policyEngineConfiguration = {
  arn: policyEngine.policyEngineArn,
  mode: agentcoreAlpha.PolicyEngineMode.ENFORCE.value,
};

// Grant evaluate permissions to the gateway role
gateway.role.addToPrincipalPolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:GetPolicyEngine'],
  resources: [policyEngine.policyEngineArn],
}));
gateway.role.addToPrincipalPolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:AuthorizeAction', 'bedrock-agentcore:PartiallyAuthorizeActions'],
  resources: [policyEngine.policyEngineArn, gateway.gatewayArn],
}));
```
