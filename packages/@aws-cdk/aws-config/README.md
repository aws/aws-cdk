## AWS Config Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

Supported:
* Config rules

Not supported
* Configuration recoder
* Delivery channel
* Aggregation

### Rules

#### AWS managed rules
To set up a managed rule, define a `ManagedRule` and specify its identifier:

```ts
new ManagedRule(this, 'AccessKeysRotated', {
  identifier: 'ACCESS_KEYS_ROTATED'
});
```

Available identifiers and parameters are listed in the [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html).


Higher level constructs for managed rules are available, see [Managed Rules](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-config/lib/managed-rules.ts). Prefer to use those constructs when available (PRs welcome to add more of those).

#### Custom rules
To set up a custom rule, define a `CustomRule` and specify the Lambda Function to run and the trigger types:

```ts
new CustomRule(this, 'CustomRule', {
  lambdaFunction: myFn,
  configurationChanges: true,
  periodic: true
});
```

#### Restricting the scope
By default rules are triggered by changes to all [resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources). Use the `scopeToResource()`, `scopeToResources()` or `scopeToTag()` methods to restrict the scope of both managed and custom rules:

```ts
const sshRule = new ManagedRule(this, 'SSH', {
  identifier: 'INCOMING_SSH_DISABLED'
});

// Restrict to a specific security group
rule.scopeToResource('AWS::EC2::SecurityGroup', 'sg-1234567890abcdefgh');

const customRule = new CustomRule(this, 'CustomRule', {
  lambdaFunction: myFn,
  configurationChanges: true
});

// Restrict to a specific tag
customRule.scopeToTag('Cost Center', 'MyApp');
```

Only one type of scope restriction can be added to a rule (the last call to `scopeToXxx()` sets the scope).

#### Events
To define Amazon CloudWatch event rules, use the `onComplianceChange()` or `onReEvaluationStatus()` methods:

```ts
const rule = new CloudFormationStackDriftDetectionCheck(this, 'Drift');
rule.onComplianceChange('TopicEvent', {
  target: new targets.SnsTopic(topic))
});
```

#### Example
Creating custom and managed rules with scope restriction and events:

[example of setting up rules](test/integ.rule.lit.ts)
