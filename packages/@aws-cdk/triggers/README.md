# Triggers
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


Execute code as part of a CDK app deployment.

## Usage

You can trigger the execution of an AWS Lambda function during deployment after
a resource or groups of resources are provisioned.

The library includes constructs that represent different triggers. The `BeforeCreate` and `AfterCreate` constructs can be used to trigger a handler before/after a set of resources have been created.

```ts
import { Trigger } from '@aws-cdk/triggers';

new Trigger(this, 'MyTrigger', {
  dependencies: [resource1, resource2, stack, ...],
  handler: myLambdaFunction,
});
```

Where `dependencies` is a list of __construct scopes__ which determine when
`handler` is invoked. Scopes can be either specific resources or composite
constructs (in which case all the resources in the construct will be used as a
group). The scope can also be a `Stack`, in which case the trigger will apply to
all the resources within the stack (same as any composite construct). All scopes
must roll up to the same stack.

Let's look at an example. Say we want to publish a notification to an SNS topic
that says "hello, topic!" after the topic is created.

```ts
// define a topic
const topic = new sns.Topic(this, 'MyTopic');

// define a lambda function which publishes a message to the topic
const publisher = new NodeJsFunction(this, 'PublishToTopic');
publisher.addEnvironment('TOPIC_ARN', topic.topicArn);
publisher.addEnvironment('MESSAGE', 'Hello, topic!');
topic.grantPublish(publisher);

// trigger the lambda function after the topic is created
new triggers.Trigger(this, 'SayHello', {
  handler: publisher
});
```

NOTE: since `publisher` already takes an implicit dependency on `topic.topicArn`
(through its environment), we don't have to explicitly specify `dependencies`.

## Additional Notes

* If the trigger fails, deployment fails. This is a useful property that can be
  leveraged to create triggers that "self-test" a stack.
* If the handler changes (configuration or code), the trigger gets re-executed
  (trigger is bound to `lambda.currentVersion` which gets recreated when the
  function changes).

## Roadmap

* Additional periodic execution after deployment (`repeatOnSchedule`).
* Async checks (`retryWithTimeout`)
* Execute shell command inside a Docker image

## Use Cases

Here are some examples of use cases for triggers:

* __Intrinsic validations__: execute a check to verify that a resource or set of resources have been deployed correctly
  * Test connections to external systems (e.g. security tokens are valid)
  * Verify integration between resources is working as expected
  * Execute as one-off and also periodically after deployment
  * Wait for data to start flowing (e.g. wait for a metric) before deployment is successful
* __Data priming__: add data to resources after they are created
  * CodeCommit repo + initial commit
  * Database + test data for development
* Check prerequisites before deployment
  * Account limits
  * Availability of external services
* Connect to other accounts

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
