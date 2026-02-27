# AWS CDK Core

See top-level [README](../README.md).

## SSM-Based Cross-Stack References

By default, when you reference a resource in one stack from another stack,
CDK uses CloudFormation Exports (`Fn::ImportValue`). While safe, this creates
a "strong" reference that prevents the exported value from being updated or
deleted while in use, which can cause deployment failures.

As an alternative, you can opt in to SSM Parameter-based references that use
CloudFormation dynamic references (`{{resolve:ssm:...}}`). These create
"soft" references that allow the producer stack to update values freely.

> **Warning:** SSM-based references trade "deployment failure" for potential
> "service disruption". When the producer changes an exported value, consumer
> stacks will pick up the new value on their next deployment, which may cause
> runtime errors if the new value is incompatible.

### Configuring SSM References

Use `StackReferences.of(scope)` to control the reference mechanism at the
construct scope level:

```ts
import { CrossStackReferenceType, StackReferences } from 'aws-cdk-lib';

// Configure all references TO this resource to use SSM
StackReferences.of(myBucket).toHere([CrossStackReferenceType.SSM]);

// Configure all references FROM this scope to use SSM
StackReferences.of(myDashboard).fromHere([CrossStackReferenceType.SSM]);

// Apply to an entire stack
StackReferences.of(producerStack).toHere([CrossStackReferenceType.SSM]);
```

When both `toHere` and `fromHere` are set, `toHere` takes priority
(the producer controls how its values are published).

If no configuration is set, the default behavior (`CFN_EXPORTS`) is used.

### Migrating from CloudFormation Exports to SSM

Switching an existing reference from CloudFormation Exports to SSM requires
a two-phase deployment using MIXED mode:

```ts
// Phase 1: MIXED mode - creates both CFN Export and SSM Parameter
StackReferences.of(myBucket).toHere([
  CrossStackReferenceType.CFN_EXPORTS,
  CrossStackReferenceType.SSM,
]);
// Deploy both producer and consumer stacks

// Phase 2: SSM only - remove the CFN Export
StackReferences.of(myBucket).toHere([CrossStackReferenceType.SSM]);
// Deploy both stacks again
```

In Phase 1, the producer stack creates both the CFN Export and the SSM
Parameter, while the consumer switches to reading from SSM. Since the
CFN Export is no longer imported by anyone after Phase 1, it can be
safely removed in Phase 2.

### IAM Permissions

SSM-based cross-stack references create `AWS::SSM::Parameter` resources
directly via CloudFormation (no custom resources or Lambda functions are
involved). The CloudFormation execution role must have `ssm:PutParameter`,
`ssm:GetParameter`, and `ssm:DeleteParameter` permissions. The default
CDK bootstrap role includes these permissions.
