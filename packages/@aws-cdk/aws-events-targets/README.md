# Event Targets for Amazon EventBridge
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This library contains integration classes to send Amazon EventBridge to any
number of supported AWS Services. Instances of these classes should be passed
to the `rule.addTarget()` method.

Currently supported are:

* Start a CodeBuild build
* Start a CodePipeline pipeline
* Run an ECS task
* Invoke a Lambda function
* Publish a message to an SNS topic
* Send a message to an SQS queue
* Start a StepFunctions state machine
* Queue a Batch job
* Make an AWS API call
* Put a record to a Kinesis stream
* Log an event into a LogGroup

See the README of the `@aws-cdk/aws-events` library for more information on
EventBridge.

## LogGroup

Use the `LogGroup` target to log your events in a CloudWatch LogGroup.

```ts
const rule = new Rule(this, 'rule');

const logGroup = new LogGroup(this, 'logGroup');

rule.addTarget(targets.LogGroup(logGroup));
```

You can also use an [InputTransformer](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_InputTransformer.html).

```ts
const rule = new Rule(this, 'rule');

const logGroup = new LogGroup(this, 'logGroup');

rule.addTarget(targets.LogGroup(logGroup, {
  event: events.RuleTargetInput.fromObject({
    data: events.EventField.fromPath('$.detail.data'),
  })
}));
```