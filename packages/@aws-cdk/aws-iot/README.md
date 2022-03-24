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

```ts nofixture
import * as iot from '@aws-cdk/aws-iot';
import * as actions from '@aws-cdk/aws-iot-actions';
```

## `TopicRule`

Create a topic rule that give your devices the ability to interact with AWS services.
You can create a topic rule with an action that invoke the Lambda action as following:

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
  topicRuleName: 'MyTopicRule', // optional
  description: 'invokes the lambda function', // optional
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  actions: [new actions.LambdaFunctionAction(func)],
});
```

Or, you can add an action after constructing the `TopicRule` instance as following:

```ts
declare const func: lambda.Function;

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
});
topicRule.addAction(new actions.LambdaFunctionAction(func));
```

You can also supply `errorAction` as following,
and the IoT Rule will trigger it if a rule's action is unable to perform:

```ts
import * as logs from '@aws-cdk/aws-logs';

const logGroup = new logs.LogGroup(this, 'MyLogGroup');

new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  errorAction: new actions.CloudWatchLogsAction(logGroup),
});
```

If you wanna make the topic rule disable, add property `enabled: false` as following:

```ts
new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'"),
  enabled: false,
});
```

See also [@aws-cdk/aws-iot-actions](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-iot-actions-readme.html) for other actions.
