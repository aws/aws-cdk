# AWS Config Construct Library


[AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html) provides a detailed view of the configuration of AWS resources in your AWS account.
This includes how the resources are related to one another and how they were configured in the
past so that you can see how the configurations and relationships change over time. 

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Initial Setup

Before using the constructs provided in this module, you need to set up AWS Config
in the region in which it will be used. This setup includes the one-time creation of the
following resources per region:

- `ConfigurationRecorder`: Configure which resources will be recorded for config changes.
- `DeliveryChannel`: Configure where to store the recorded data.

The following guides provide the steps for getting started with AWS Config:

- [Using the AWS Console](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html)
- [Using the AWS CLI](https://docs.aws.amazon.com/config/latest/developerguide/gs-cli.html)

## Rules

AWS Config can evaluate the configuration settings of your AWS resources by creating AWS Config rules,
which represent your ideal configuration settings.

See [Evaluating Resources with AWS Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html) to learn more about AWS Config rules.

### AWS Managed Rules

AWS Config provides AWS managed rules, which are predefined, customizable rules that AWS Config
uses to evaluate whether your AWS resources comply with common best practices.

For example, you could create a managed rule that checks whether active access keys are rotated
within the number of days specified.

```ts
// https://docs.aws.amazon.com/config/latest/developerguide/access-keys-rotated.html
new config.ManagedRule(this, 'AccessKeysRotated', {
  identifier: config.ManagedRuleIdentifiers.ACCESS_KEYS_ROTATED,
  inputParameters: {
    maxAccessKeyAge: 60, // default is 90 days
  },

  // default is 24 hours
  maximumExecutionFrequency: config.MaximumExecutionFrequency.TWELVE_HOURS,
});
```

Identifiers for AWS managed rules are available through static constants in the `ManagedRuleIdentifiers` class.
You can find supported input parameters in the [List of AWS Config Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html).

The following higher level constructs for AWS managed rules are available.

#### Access Key rotation

Checks whether your active access keys are rotated within the number of days specified.

```ts
// compliant if access keys have been rotated within the last 90 days
new config.AccessKeysRotated(this, 'AccessKeyRotated');
```

#### CloudFormation Stack drift detection

Checks whether your CloudFormation stack's actual configuration differs, or has drifted,
from it's expected configuration. 

```ts
// compliant if stack's status is 'IN_SYNC'
// non-compliant if the stack's drift status is 'DRIFTED'
new config.CloudFormationStackDriftDetectionCheck(this, 'Drift', {
  ownStackOnly: true, // checks only the stack containing the rule
});
```

#### CloudFormation Stack notifications

Checks whether your CloudFormation stacks are sending event notifications to a SNS topic.

```ts
// topics to which CloudFormation stacks may send event notifications
const topic1 = new sns.Topic(this, 'AllowedTopic1');
const topic2 = new sns.Topic(this, 'AllowedTopic2');

// non-compliant if CloudFormation stack does not send notifications to 'topic1' or 'topic2'
new config.CloudFormationStackNotificationCheck(this, 'NotificationCheck', {
  topics: [topic1, topic2],
});
```

### Custom rules

You can develop custom rules and add them to AWS Config. You associate each custom rule with an
AWS Lambda function and Guard.

#### Custom Lambda Rules

Lambda function which contains the logic that evaluates whether your AWS resources comply with the rule.

```ts
// Lambda function containing logic that evaluates compliance with the rule.
const evalComplianceFn = new lambda.Function(this, "CustomFunction", {
  code: lambda.AssetCode.fromInline(
    "exports.handler = (event) => console.log(event);"
  ),
  handler: "index.handler",
  runtime: lambda.Runtime.NODEJS_14_X,
});

// A custom rule that runs on configuration changes of EC2 instances
const customRule = new config.CustomRule(this, "Custom", {
  configurationChanges: true,
  lambdaFunction: evalComplianceFn,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.EC2_INSTANCE),
});
```

#### Custom Policy Rules

Guard which contains the logic that evaluates whether your AWS resources comply with the rule.

```ts
const samplePolicyText = `
# This rule checks if point in time recovery (PITR) is enabled on active Amazon DynamoDB tables
let status = ['ACTIVE']

rule tableisactive when
    resourceType == "AWS::DynamoDB::Table" {
    configuration.tableStatus == %status
}

rule checkcompliance when
    resourceType == "AWS::DynamoDB::Table"
    tableisactive {
        let pitr = supplementaryConfiguration.ContinuousBackupsDescription.pointInTimeRecoveryDescription.pointInTimeRecoveryStatus
        %pitr == "ENABLED"
}
`;

new config.CustomPolicy(stack, "Custom", {
  policyText: samplePolicyText,
  enableDebugLog: true,
  ruleScope: config.RuleScope.fromResources([
    config.ResourceType.DYNAMODB_TABLE,
  ]),
});
```

### Triggers

AWS Lambda executes functions in response to events that are published by AWS Services.
The function for a custom Config rule receives an event that is published by AWS Config,
and is responsible for evaluating the compliance of the rule.

Evaluations can be triggered by configuration changes, periodically, or both.
To create a custom rule, define a `CustomRule` and specify the Lambda Function
to run and the trigger types.

```ts
declare const evalComplianceFn: lambda.Function;

new config.CustomRule(this, 'CustomRule', {
  lambdaFunction: evalComplianceFn,
  configurationChanges: true,
  periodic: true,

  // default is 24 hours
  maximumExecutionFrequency: config.MaximumExecutionFrequency.SIX_HOURS,
});
```

When the trigger for a rule occurs, the Lambda function is invoked by publishing an event.
See [example events for AWS Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules_example-events.html)  

The AWS documentation has examples of Lambda functions for evaluations that are
[triggered by configuration changes](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules_nodejs-sample.html#event-based-example-rule) and [triggered periodically](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules_nodejs-sample.html#periodic-example-rule)


### Scope

By default rules are triggered by changes to all [resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html#supported-resources).

Use the `RuleScope` APIs (`fromResource()`, `fromResources()` or `fromTag()`) to restrict
the scope of both managed and custom rules:

```ts
const sshRule = new config.ManagedRule(this, 'SSH', {
  identifier: config.ManagedRuleIdentifiers.EC2_SECURITY_GROUPS_INCOMING_SSH_DISABLED,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.EC2_SECURITY_GROUP, 'sg-1234567890abcdefgh'), // restrict to specific security group
});

declare const evalComplianceFn: lambda.Function;
const customRule = new config.CustomRule(this, 'Lambda', {
  lambdaFunction: evalComplianceFn,
  configurationChanges: true,
  ruleScope: config.RuleScope.fromResources([config.ResourceType.CLOUDFORMATION_STACK, config.ResourceType.S3_BUCKET]), // restrict to all CloudFormation stacks and S3 buckets
});

const tagRule = new config.CustomRule(this, 'CostCenterTagRule', {
  lambdaFunction: evalComplianceFn,
  configurationChanges: true,
  ruleScope: config.RuleScope.fromTag('Cost Center', 'MyApp'), // restrict to a specific tag
});
```

### Events

You can define Amazon EventBridge event rules which trigger when a compliance check fails
or when a rule is re-evaluated.

Use the `onComplianceChange()` APIs to trigger an EventBridge event when a compliance check
of your AWS Config Rule fails:

```ts
// Topic to which compliance notification events will be published
const complianceTopic = new sns.Topic(this, 'ComplianceTopic');

const rule = new config.CloudFormationStackDriftDetectionCheck(this, 'Drift');
rule.onComplianceChange('TopicEvent', {
  target: new targets.SnsTopic(complianceTopic),
});
```

Use the `onReEvaluationStatus()` status to trigger an EventBridge event when an AWS Config
rule is re-evaluated.

```ts
// Topic to which re-evaluation notification events will be published
const reEvaluationTopic = new sns.Topic(this, 'ComplianceTopic');

const rule = new config.CloudFormationStackDriftDetectionCheck(this, 'Drift');
rule.onReEvaluationStatus('ReEvaluationEvent', {
  target: new targets.SnsTopic(reEvaluationTopic),
});
```

### Example

The following example creates a custom rule that evaluates whether EC2 instances are compliant.
Compliance events are published to an SNS topic.

```ts
// Lambda function containing logic that evaluates compliance with the rule.
const evalComplianceFn = new lambda.Function(this, 'CustomFunction', {
  code: lambda.AssetCode.fromInline('exports.handler = (event) => console.log(event);'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

// A custom rule that runs on configuration changes of EC2 instances
const customRule = new config.CustomRule(this, 'Custom', {
  configurationChanges: true,
  lambdaFunction: evalComplianceFn,
  ruleScope: config.RuleScope.fromResource(config.ResourceType.EC2_INSTANCE),
});

// A rule to detect stack drifts
const driftRule = new config.CloudFormationStackDriftDetectionCheck(this, 'Drift');

// Topic to which compliance notification events will be published
const complianceTopic = new sns.Topic(this, 'ComplianceTopic');

// Send notification on compliance change events
driftRule.onComplianceChange('ComplianceChange', {
  target: new targets.SnsTopic(complianceTopic),
});
```
