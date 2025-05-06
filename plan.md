# Implementation Plan: Adding Version Permission Behavior Configuration to LambdaInvoke

## Background

AWS Step Functions often use AWS Lambda functions to execute business logic in state machine workflows. For reliability and consistency, developers frequently use versioned Lambda functions to ensure that Step Function executions consistently use specific versions of code throughout their lifetime.

When a Step Function invokes a Lambda function version, it requires IAM permissions specifically for that version. Currently, the AWS CDK's `LambdaInvoke` construct automatically creates IAM permissions for the specific Lambda version referenced, but these permissions are updated during redeployment to only include the new version, removing access to previous versions.

## Problem Statement

During Lambda function updates, the IAM role used by Step Functions is modified to include permissions for the new Lambda version but loses permissions for previous versions. This causes in-flight Step Function executions (started before the deployment) to fail with `lambda:InvokeFunction` permission errors when they attempt to invoke the previous Lambda version they were initially configured to use.

This issue is particularly problematic with Step Function Aliases that use deployment preferences for traffic shaping, where a percentage of new executions are deliberately directed to the previous version of the state machine.

### Why Versioned Lambda Functions Are Necessary

Step Functions that invoke Lambda functions require version stability for several critical reasons:

1. **Execution Consistency**: Long-running Step Functions need to use the same Lambda code version throughout their entire execution to maintain consistent behavior.

2. **Data Compatibility**: New Lambda versions may introduce changes to input/output formats that aren't compatible with data processed by earlier steps.

3. **Predictable Behavior**: When a Step Function invokes a Lambda multiple times during execution, all invocations should use the same code version.

4. **Controlled Deployments**: Step Function Aliases with deployment preferences (like canary deployments) explicitly direct traffic to specific versions.

Using unversioned Lambda references would force Step Functions to always invoke the most recently deployed code, which could change during deployment while executions are still in progress.

## Root Cause Analysis

The issue stems from a fundamental mismatch between:

1. Lambda's immutable versioning model (versions are permanent snapshots)
2. Step Function's mutable IAM role permissions (replaced on each deployment)

CDK's `LambdaInvoke` construct currently generates IAM permissions only for the specific Lambda version referenced, but these permissions don't persist across deployments when new versions are created.

## Proposed Solution: Configurable Version Permission Behavior

We will add a new property to the `LambdaInvoke` construct that allows users to specify how permissions should be granted for Lambda versions:

```typescript
enum LambdaVersionPermission {
  /**
   * Grant permission only to the specific version (current behavior)
   */
  SPECIFIC_VERSION = 'specific',
  
  /**
   * Grant permission to all versions of the function (any version)
   */
  ANY_VERSION = 'any',
  
  /**
   * Grant permission to both the specific version and the unqualified ARN
   */
  BOTH = 'both'
}
```

## Implementation Details

### 1. Add New Enum and Interface Property

Add a new enum and update the `LambdaInvokeProps` interface in `aws-cdk-lib/aws-stepfunctions-tasks/lib/lambda/invoke.ts`:

```typescript
export enum LambdaVersionPermission {
  SPECIFIC_VERSION = 'specific',
  ANY_VERSION = 'any',
  BOTH = 'both'
}

export interface LambdaInvokeProps extends LambdaInvokeBaseProps, sfn.TaskStateBaseProps {
  /**
   * Controls how permissions are granted for Lambda versions
   * @default LambdaVersionPermission.SPECIFIC_VERSION
   */
  versionPermission?: LambdaVersionPermission;
}
```

### 2. Modify the Task Policies Generation

Update the `LambdaInvoke` constructor to handle the new permission options:

```typescript
constructor(scope: Construct, id: string, private readonly props: LambdaInvokeProps) {
  super(scope, id, props);
  this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

  validatePatternSupported(this.integrationPattern, LambdaInvoke.SUPPORTED_INTEGRATION_PATTERNS);

  // Existing code...

  // Generate appropriate taskPolicies based on versionPermission setting
  const versionPermission = props.versionPermission ?? LambdaVersionPermission.SPECIFIC_VERSION;
  
  let resources: string[];
  
  switch (versionPermission) {
    case LambdaVersionPermission.ANY_VERSION:
      // Grant permissions to any version (unqualified ARN)
      resources = [
        this.props.lambdaFunction.functionArn.replace(/:[^:]*$/, ''),  // Remove version qualifier if present
        `${this.props.lambdaFunction.functionArn.replace(/:[^:]*$/, '')}:*`  // Add wildcard for all versions
      ];
      break;
    
    case LambdaVersionPermission.BOTH:
      // Grant permissions to both specific version and any version
      resources = [
        this.props.lambdaFunction.functionArn,  // The specific version
        this.props.lambdaFunction.functionArn.replace(/:[^:]*$/, ''),  // Unqualified
        `${this.props.lambdaFunction.functionArn.replace(/:[^:]*$/, '')}:*`  // All versions
      ];
      break;
    
    case LambdaVersionPermission.SPECIFIC_VERSION:
    default:
      // Default/current behavior - grant permission only to the specific version
      resources = [this.props.lambdaFunction.functionArn];
      break;
  }

  this.taskPolicies = [
    new iam.PolicyStatement({
      resources: resources,
      actions: ['lambda:InvokeFunction'],
    }),
  ];

  // Existing code...
}
```

### 3. Documentation Updates

Update documentation in the `LambdaInvoke` class to explain the new property:

```typescript
/**
 * Invoke a Lambda function as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
 * 
 * By default, when using a Lambda version, permissions are granted only 
 * to that specific version. This can cause issues during deployments when 
 * in-flight Step Function executions attempt to invoke a previous version.
 * 
 * To address this issue, you can use the `versionPermission` property:
 * 
 * ```ts
 * new LambdaInvoke(this, "Invoke", {
 *   lambdaFunction: myFunction.currentVersion,
 *   versionPermission: LambdaVersionPermission.ANY_VERSION // Allow invoking any version
 * });
 * ```
 */
```

### 4. Testing Strategy

Implement the following tests in `packages/aws-cdk-lib/aws-stepfunctions-tasks/test/lambda/invoke.test.ts`:

1. Test default behavior (SPECIFIC_VERSION) - permissions only for specific version
2. Test ANY_VERSION - permissions for unqualified ARN and wildcard
3. Test BOTH - permissions for specific version, unqualified ARN, and wildcard
4. Integration test with actual deployment showing that in-flight executions continue to work

## Backward Compatibility

This change maintains backward compatibility because:
1. The default behavior remains unchanged (SPECIFIC_VERSION)
2. The new property is optional
3. No existing behavior is modified unless users opt-in to the new feature

## Migration Path

For users experiencing this issue, the migration path is simple:

```typescript
// Previous code
const lambdaInvoke = new tasks.LambdaInvoke(this, "Invoke", { 
  lambdaFunction: lambdaFunction.currentVersion 
});

// Updated code with fix
const lambdaInvoke = new tasks.LambdaInvoke(this, "Invoke", { 
  lambdaFunction: lambdaFunction.currentVersion,
  versionPermission: LambdaVersionPermission.ANY_VERSION
});
```

## Security Considerations

While granting permission to all Lambda versions solves the operational issue, we must provide version-specific permission options for security-conscious customers. This is necessary when:

1. A security vulnerability is discovered in a specific Lambda version
2. Organizations must comply with strict least-privilege requirements
3. Security teams need to explicitly block access to older, vulnerable versions

The configurable approach gives customers the flexibility to choose between operational reliability and stronger security controls based on their specific risk tolerance and compliance needs.

## Release Notes

```
feature(aws-stepfunctions-tasks): Add version permission behavior configuration to LambdaInvoke

Adds a new `versionPermission` property to the LambdaInvoke construct that allows users 
to configure how permissions are granted for Lambda versions. This addresses an issue where
in-flight Step Function executions would fail during deployments when trying to invoke
previous Lambda versions.

By setting `versionPermission: LambdaVersionPermission.ANY_VERSION`, users can ensure that
Step Functions have permission to invoke any version of a Lambda function, preventing
permission failures during deployments.
```

## Example Implementation

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { LambdaVersionPermission } from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class ExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    });
    
    // Create a version
    const version = lambdaFunction.currentVersion;
    
    // Use the version but ensure permissions for all versions
    const lambdaInvoke = new tasks.LambdaInvoke(this, "Invoke", { 
      lambdaFunction: version,
      versionPermission: LambdaVersionPermission.ANY_VERSION
    });
    
    new sfn.StateMachine(this, "StateMachine", { 
      definitionBody: sfn.DefinitionBody.fromChainable(lambdaInvoke)
    });
  }
}
