# AWS IoT Construct Library


AWS IoT Core lets you connect billions of IoT devices and route trillions of
messages to AWS services without managing infrastructure.

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
import * as logs from 'aws-cdk-lib/aws-logs';

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
