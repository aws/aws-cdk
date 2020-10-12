## AWS Config Construct Library
<!--BEGIN STABILITY BANNER-->
---

| Features | Stability |
| --- | --- |
| CFN Resources | ![Stable](https://img.shields.io/badge/stable-success.svg?style=for-the-badge) |
| Higher level constructs for Config Rules | ![Developer Preview](https://img.shields.io/badge/developer--preview-informational.svg?style=for-the-badge) |
| Higher level constructs for initial set-up (delivery channel & configuration recorder) | ![Not Implemented](https://img.shields.io/badge/not--implemented-black.svg?style=for-the-badge) |

> **CFN Resources:** All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

> **Developer Preview:** Higher level constructs in this module that are marked as developer preview have completed their phase of active development and are looking for adoption and feedback. While the same caveats around non-backward compatible as Experimental constructs apply, they will undergo fewer breaking changes. Just as with Experimental constructs, these are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Initial Setup

Before using the constructs provided in this module, you need to set up AWS Config
in the region in which it will be used. This setup includes the one-time creation of the
following resources per region:

- `ConfigurationRecorder`: Configure which resources will be recorded for config changes.
- `DeliveryChannel`: Configure where to store the recorded data.

Following are the guides to setup AWS Config:

- [Using the AWS Console](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html)
- [Using the AWS CLI](https://docs.aws.amazon.com/config/latest/developerguide/gs-cli.html)

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

By default rules are triggered by changes to all [resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources).

Use the `scopeToResource()`, `scopeToResources()` or `scopeToTag()` APIs to restrict
the scope of both managed and custom rules:

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

The following example creates a custom rule that runs on configuration changes to EC2 instances and publishes
compliance events to an SNS topic.

```ts
import * as config from '@aws-cdk/aws-config';
import * as lambda from '@aws-cdk/aws-lambda';

// A custom rule that runs on configuration changes of EC2 instances
const fn = new lambda.Function(this, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

const customRule = new config.CustomRule(this, 'Custom', {
  configurationChanges: true,
  lambdaFunction: fn,
});

customRule.scopeToResource('AWS::EC2::Instance');

// A rule to detect stack drifts
const driftRule = new config.CloudFormationStackDriftDetectionCheck(this, 'Drift');

// Topic to which compliance notification events will be published
const complianceTopic = new sns.Topic(this, 'ComplianceTopic');

// Send notification on compliance change
driftRule.onComplianceChange('ComplianceChange', {
  target: new targets.SnsTopic(complianceTopic),
});
```
