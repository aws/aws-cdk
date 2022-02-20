# Triggers
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

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
import * as lambda from '@aws-cdk/aws-lambda';
import * as triggers from '@aws-cdk/triggers';
import { Stack } from '@aws-cdk/core';

declare const stack: Stack;

new triggers.TriggerFunction(stack, 'MyTrigger', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(__dirname + '/my-trigger'),
});
```

In the above example, the AWS Lambda function defined in `myLambdaFunction` will
be invoked when the stack is deployed.

> `TriggerFunction` uses `Trigger` under the hood. The above example is
> equivalent to:
>
> ```ts
> import * as triggers from '@aws-cdk/triggers';
> import * as lambda from '@aws-cdk/aws-lambda';
> import { Stack } from '@aws-cdk/core';
> 
> declare const stack: Stack;
> declare const lambdaFunction: lambda.Function; 
>
> new triggers.Trigger(stack, 'MyTrigger', { 
>   handlerVersion: lambdaFunction.currentVersion
> });
> ```

## Trigger Failures

If the trigger handler fails (e.g. an exception is raised), the CloudFormation
deployment will fail, as if a resource failed to provision. This makes it easy
to implement "self tests" via triggers by simply making a set of assertions on
some provisioned infrastructure.

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
import { Construct, Node } from 'constructs';
import * as triggers from '@aws-cdk/triggers';

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

The trigger handler gets executed only once upon first deployment. Subsequent
deployments ***will not*** execute the trigger as long as the handler did not
change. The trigger ***will*** get re-executed if the code of the AWS Lambda
function, environment variables or other configuration changes.

> Under the hood, the trigger resource is bound to the `lambda.currentVersion`
  resource which is recreated automatically when the function changes.
