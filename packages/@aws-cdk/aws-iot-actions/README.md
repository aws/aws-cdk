# Actions for AWS IoT Rule
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

This library contains integration classes to send data to any number of
supported AWS Services. Instances of these classes should be passed to
`TopicRule` defined in `@aws-cdk/aws-iot`.

Currently supported are:

- Republish a message to another MQTT topic
- Invoke a Lambda function
- Put objects to a S3 bucket
- Put logs to CloudWatch Logs
- Capture CloudWatch metrics
- Change state for a CloudWatch alarm
- Put records to Kinesis Data stream
- Put records to Kinesis Data Firehose stream
- Send messages to SQS queues
- Publish messages on SNS topics
- Put messages IoT Events input

## Republish a message to another MQTT topic

The code snippet below creates an AWS IoT Rule that republish a message to
another MQTT topic when it is triggered.

```ts
new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp, temperature FROM 'device/+/data'"),
  actions: [
    new actions.IotRepublishMqttAction('${topic()}/republish', {
      qualityOfService: actions.MqttQualityOfService.AT_LEAST_ONCE, // optional property, default is MqttQualityOfService.ZERO_OR_MORE_TIMES
    }),
  ],
});
```

## Invoke a Lambda function

The code snippet below creates an AWS IoT Rule that invoke a Lambda function
when it is triggered.

```ts
const func = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = (event) => {
      console.log("It is test for lambda action of AWS IoT Rule.", event);
    };`
  ),
});

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp, temperature FROM 'device/+/data'"),
  actions: [new actions.LambdaFunctionAction(func)],
});
```

## Put objects to a S3 bucket

The code snippet below creates an AWS IoT Rule that puts objects to a S3 bucket
when it is triggered.

```ts
const bucket = new s3.Bucket(this, 'MyBucket');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  actions: [new actions.S3PutObjectAction(bucket)],
});
```

The property `key` of `S3PutObjectAction` is given the value `${topic()}/${timestamp()}` by default. This `${topic()}`
and `${timestamp()}` is called Substitution templates. For more information see 
[this documentation](https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html).
In above sample, `${topic()}` is replaced by a given MQTT topic as `device/001/data`. And `${timestamp()}` is replaced
by the number of the current timestamp in milliseconds as `1636289461203`. So if the MQTT broker receives an MQTT topic
`device/001/data` on `2021-11-07T00:00:00.000Z`, the S3 bucket object will be put to `device/001/data/1636243200000`. 

You can also set specific `key` as following:

```ts
const bucket = new s3.Bucket(this, 'MyBucket');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
  ),
  actions: [
    new actions.S3PutObjectAction(bucket, {
      key: '${year}/${month}/${day}/${topic(2)}',
    }),
  ],
});
```

If you wanna set access control to the S3 bucket object, you can specify `accessControl` as following:

```ts
const bucket = new s3.Bucket(this, 'MyBucket');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
  actions: [
    new actions.S3PutObjectAction(bucket, {
      accessControl: s3.BucketAccessControl.PUBLIC_READ,
    }),
  ],
});
```

## Put logs to CloudWatch Logs

The code snippet below creates an AWS IoT Rule that puts logs to CloudWatch Logs
when it is triggered.

```ts
import * as logs from '@aws-cdk/aws-logs';

const logGroup = new logs.LogGroup(this, 'MyLogGroup');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  actions: [new actions.CloudWatchLogsAction(logGroup)],
});
```

## Capture CloudWatch metrics

The code snippet below creates an AWS IoT Rule that capture CloudWatch metrics
when it is triggered.

```ts
const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'",
  ),
  actions: [
    new actions.CloudWatchPutMetricAction({
      metricName: '${topic(2)}',
      metricNamespace: '${namespace}',
      metricUnit: '${unit}',
      metricValue: '${value}',
      metricTimestamp: '${timestamp}',
    }),
  ],
});
```

## Change the state of an Amazon CloudWatch alarm

The code snippet below creates an AWS IoT Rule that changes the state of an Amazon CloudWatch alarm when it is triggered:

```ts
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

const metric = new cloudwatch.Metric({
  namespace: 'MyNamespace',
  metricName: 'MyMetric',
  dimensions: { MyDimension: 'MyDimensionValue' },
});
const alarm = new cloudwatch.Alarm(this, 'MyAlarm', {
  metric: metric,
  threshold: 100,
  evaluationPeriods: 3,
  datapointsToAlarm: 2,
});

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  actions: [
    new actions.CloudWatchSetAlarmStateAction(alarm, {
      reason: 'AWS Iot Rule action is triggered',
      alarmStateToSet: cloudwatch.AlarmState.ALARM,
    }),
  ],
});
```

## Put records to Kinesis Data stream

The code snippet below creates an AWS IoT Rule that puts records to Kinesis Data
stream when it is triggered.

```ts
import * as kinesis from '@aws-cdk/aws-kinesis';

const stream = new kinesis.Stream(this, 'MyStream');

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
  actions: [
    new actions.KinesisPutRecordAction(stream, {
      partitionKey: '${newuuid()}',
    }),
  ],
});
```

## Put records to Kinesis Data Firehose stream

The code snippet below creates an AWS IoT Rule that puts records to Put records
to Kinesis Data Firehose stream when it is triggered.

```ts
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations';

const bucket = new s3.Bucket(this, 'MyBucket');
const stream = new firehose.DeliveryStream(this, 'MyStream', {
  destinations: [new destinations.S3Bucket(bucket)],
});

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
  actions: [
    new actions.FirehosePutRecordAction(stream, {
      batchMode: true,
      recordSeparator: actions.FirehoseRecordSeparator.NEWLINE,
    }),
  ],
});
```

## Send messages to an SQS queue

The code snippet below creates an AWS IoT Rule that send messages
to an SQS queue when it is triggered:

```ts
import * as sqs from '@aws-cdk/aws-sqs';

const queue = new sqs.Queue(this, 'MyQueue');

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
  ),
  actions: [
    new actions.SqsQueueAction(queue, {
      useBase64: true, // optional property, default is 'false'
    }),
  ],
});
```

## Publish messages on an SNS topic

The code snippet below creates and AWS IoT Rule that publishes messages to an SNS topic when it is triggered:

```ts
import * as sns from '@aws-cdk/aws-sns';

const topic = new sns.Topic(this, 'MyTopic');

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
  ),
  actions: [
    new actions.SnsTopicAction(topic, {
      messageFormat: actions.SnsActionMessageFormat.JSON, // optional property, default is SnsActionMessageFormat.RAW
    }),
  ],
});
```

## Put messages IoT Events input

The code snippet below creates an AWS IoT Rule that puts messages
to an IoT Events input when it is triggered:

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as iam from '@aws-cdk/aws-iam';

declare role: iam.IRole;

const input = new iotevents.Input(this, 'MyInput', {
  attributeJsonPaths: ['payload.temperature', 'payload.transactionId'],
});
const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT * FROM 'device/+/data'",
  ),
  actions: [
    new actions.IotEventsPutMessageAction(input, {
      batchMode: true, // optional property, default is 'false'
      messageId: '${payload.transactionId}', // optional property, default is a new UUID
      role: // optional property, default is a new UUID
    }),
  ],
});
```
