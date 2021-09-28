# AWS IoT Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Rules

The `TopicRule` construct defined Rules that give your devices the ability to interact with AWS services.
Rules are analyzed and actions are performed based on the MQTT topic stream.
The `TopicRule` construct can use actions like these:

- Write data received from a device to an Amazon DynamoDB database.
- Save a file to Amazon S3.
- Send a push notification to all users using Amazon SNS.
- Publish data to an Amazon SQS queue.
- Invoke a Lambda function to extract data.
- Process messages from a large number of devices using Amazon Kinesis. (*To be developed*)
- Send data to the Amazon OpenSearch Service. (*To be developed*)
- Capture a CloudWatch metric.
- Change a CloudWatch alarm.
- Send message data to an AWS IoT Analytics channel. (*To be developed*)
- Start execution of a Step Functions state machine. (*To be developed*)
- Send message data to an AWS IoT Events input. (*To be developed*)
- Send message data an asset property in AWS IoT SiteWise. (*To be developed*)
- Send message data to a web application or service. (*To be developed*)

For example, to define a rule that triggers to invoke a lambda function and to put to a S3 bucket:

```ts
new TopicRule(stack, 'MyTopicRule', {
  topicRuleName: 'MyRuleName', // optional property
  topicRulePayload: {
    description: 'Some description.', // optional property
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    acctions: [
      new actions.LambdaAction(lambdaFn),
      new actions.S3Action(bucket),
    ],
  },
});
```

Or you can add action after constructing instance as following:

```ts
const topicRule = new TopicRule(stack, 'MyTopicRule', {
  topicRulePayload: {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  },
});
topicRule.addAction(new actions.LambdaAction(lambdaFn));
```

If a problem occurs when triggering actions, the rules engine triggers an error action, if one is specified for the rule:

```ts
new TopicRule(stack, 'MyTopicRule', {
  topicRulePayload: {
    sql: "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
    errorAction: new actions.CloudwatchLogsAction(logGroup),
  },
});
```

### Add action to set state of an Amazon CloudWatch alarm

```ts
topicRule.addAction(
  new iot.CloudwatchAlarmAction(
    cloudwatchAlarm,
    cloudwatch.AlarmState.ALARM,
  ),
);
```

### Add action to send data to Amazon CloudWatch Logs

```ts
topicRule.addAction(new iot.CloudwatchLogsAction(logGroup));
```

### Add action to capture an Amazon CloudWatch metric

```ts
topicRule.addAction(new iot.CloudwatchMetricAction({
  metricName: '${topic(2)}',
  metricNamespace: '${namespace}',
  metricUnit: '${unit}',
  metricValue: '${value}',
  metricTimestamp: '${timestamp}',
}));
```

### Add action to write all or part of an MQTT message to an Amazon DynamoDB table

```ts
topicRule.addAction(new iot.DynamoDBAction({
  table,
  partitionKeyValue: '${topic(2)}',
  sortKeyValue: '${timestamp()}',
  payloadField: 'custom-payload-field',
}));
```

Or you can define more easily with dynamodb v2 action:

```ts
topicRule.addAction(new iot.DynamoDBv2Action(table));
```

Dynamodb v2 action is easy to use, but only v1 action supports [substitution templates](https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html).

### Add action to invoke an AWS Lambda function, passing in an MQTT message

```ts
topicRule.addAction(new actions.LambdaAction(lambdaFn));
```

### Add action to republish an MQTT message to another MQTT topic

```ts
topicRule.addAction(new iot.RepublishAction('test-topic'));
```

### Add action to write the data from an MQTT message to an Amazon S3 bucket

```ts
topicRule.addAction(new iot.S3Action(bucket));
```

### Add action to send the data from an MQTT message as an Amazon SNS push notification

```ts
topicRule.addAction(new iot.SnsAction(topic));
```

### Add action to send data from an MQTT message to an Amazon SQS queue

```ts
topicRule.addAction(new iot.SqsAction(queue));
```
