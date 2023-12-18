# Triggers


Triggers allows you to execute code during deployments. This can be used for a
variety of use cases such as:

* Self tests: validate something after a resource/construct been provisioned
* Data priming: add initial data to resources after they are created
* Preconditions: check things such as account limits or external dependencies
  before deployment.

## Usage

The `TriggerFunction` construct will define an AWS Lambda function which is
triggered *during* deployment:

```ts
import * as triggers from 'aws-cdk-lib/triggers';

new triggers.TriggerFunction(this, 'MyTrigger', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(__dirname + '/my-trigger'),
});
```

In the above example, the AWS Lambda function defined in `MyTrigger` will
be invoked when the stack is deployed.

It is also possible to trigger a predefined Lambda function by using the `Trigger` construct:

```ts
import * as triggers from 'aws-cdk-lib/triggers';

const func = new lambda.Function(this, 'MyFunction', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromInline('foo'),
});

new triggers.Trigger(this, 'MyTrigger', {
  handler: func,
  timeout: Duration.minutes(10),
  invocationType: triggers.InvocationType.EVENT,
});
```

Addition properties can be used to fine-tune the behaviour of the trigger.
The `timeout` property can be used to determine how long the invocation of the function should take.
The `invocationType` property can be used to change the invocation type of the function.
This might be useful in scenarios where a fire-and-forget strategy for invoking the function is sufficient.

## Trigger Failures

If the trigger handler fails (e.g. an exception is raised), the CloudFormation
deployment will fail, as if a resource failed to provision. This makes it easy
to implement "self tests" via triggers by simply making a set of assertions on
some provisioned infrastructure.

Note that this behavior is only applied when invocationType is `REQUEST_RESPONSE`. When invocationType is `EVENT`, Lambda function is invoked asynchronously.
In that case, if Lambda function is invoked successfully, the trigger will success regardless of the result for the function execution.

## Order of Execution

By default, a trigger will be executed by CloudFormation after the associated
handler is provisioned. This means that if the handler takes an implicit
dependency on other resources (e.g. via environment variables), those resources
will be provisioned *before* the trigger is executed.

In most cases, implicit ordering should be sufficient, but you can also use
`executeAfter` and `executeBefore` to control the order of execution.

The following example defines the following order: `(hello, world) => myTrigger => goodbye`.
The resources under `hello` and `world` will be provisioned in
parallel, and then the trigger `myTrigger` will be executed. Only then the
resources under `goodbye` will be provisioned:

```ts
import * as triggers from 'aws-cdk-lib/triggers';

declare const myTrigger: triggers.Trigger;
declare const hello: Construct;
declare const world: Construct;
declare const goodbye: Construct;

myTrigger.executeAfter(hello, world);
myTrigger.executeBefore(goodbye);
```

Note that `hello` and `world` are construct *scopes*. This means that they can
be specific resources (such as an `s3.Bucket` object) or groups of resources
composed together into constructs.

## Re-execution of Triggers

By default, `executeOnHandlerChange` is enabled. This implies that the trigger
is re-executed every time the handler function code or configuration changes. If
this option is disabled, the trigger will be executed only once upon first
deployment.

In the future we will consider adding support for additional re-execution modes:

* `executeOnEveryDeployment: boolean` - re-executes every time the stack is
  deployed (add random "salt" during synthesis).
* `executeOnResourceChange: Construct[]` - re-executes when one of the resources
  under the specified scopes has changed (add the hash the CloudFormation
  resource specs).
