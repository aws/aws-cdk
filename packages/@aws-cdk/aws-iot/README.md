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

AWS IoT Core lets you connect billions of IoT devices and route trillions of
messages to AWS services without managing infrastructure.

## Installation

Install the module:

```console
$ npm i @aws-cdk/aws-iot
```

Import it into your code:

```ts
import * as iot from '@aws-cdk/aws-iot';
```

## `TopicRule`

The `TopicRule` construct defined Rules that give your devices the ability to
interact with AWS services. Rules are analyzed and actions are performed based
on the MQTT topic stream. The `TopicRule` construct can use actions like these:

- Augment or filter data received from a device.
- Write data received from a device to an Amazon DynamoDB database.
- Save a file to Amazon S3.
- Send a push notification to all users using Amazon SNS.
- Publish data to an Amazon SQS queue.
- Invoke a Lambda function to extract data.
- Process messages from a large number of devices using Amazon Kinesis.
- Send data to the Amazon OpenSearch Service.
- Capture a CloudWatch metric.
- Change a CloudWatch alarm.
- Send message data to an AWS IoT Analytics channel.
- Start execution of a Step Functions state machine.
- Send message data to an AWS IoT Events input.
- Send message data an asset property in AWS IoT SiteWise.
- Send message data to a web application or service.

For example, to define a rule that triggers to put to a S3 bucket:

```ts
new iot.TopicRule(stack, 'MyTopicRule', {
  topicRuleName: 'MyRuleName', // optional property
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  ),
  acctions: [
    {
      bind: () => ({
        configuration: {
          s3: {
            bucketName: 'your-bucket-name',
            key: 'your-bucket-key',
            roleArn: 'your-role-arn',
          },
        },
      }),
    },
  ],
});
```

Or you can add action after constructing instance as following:

```ts
const topicRule = new TopicRule(stack, 'MyTopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, temperature FROM 'device/+/data'",
  ),
});
topicRule.addAction({
  bind: () => ({
    configuration: {
      lambda: {
        functionArn: 'your-lambda-function-arn',
      },
    },
  }),
});
```
