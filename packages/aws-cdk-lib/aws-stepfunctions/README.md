# AWS Step Functions Construct Library


The `@aws-cdk/aws-stepfunctions` package contains constructs for building
serverless workflows using objects. Use this in conjunction with the
`@aws-cdk/aws-stepfunctions-tasks` package, which contains classes used
to call other AWS services.

Defining a workflow looks like this (for the [Step Functions Job Poller
example](https://docs.aws.amazon.com/step-functions/latest/dg/job-status-poller-sample.html)):

## Example

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const submitLambda: lambda.Function;
declare const getStatusLambda: lambda.Function;

const submitJob = new tasks.LambdaInvoke(this, 'Submit Job', {
  lambdaFunction: submitLambda,
  // Lambda's result is in the attribute `guid`
  outputPath: '$.guid',
});

const waitX = new sfn.Wait(this, 'Wait X Seconds', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds'),
});

const getStatus = new tasks.LambdaInvoke(this, 'Get Job Status', {
  lambdaFunction: getStatusLambda,
  // Pass just the field named "guid" into the Lambda, put the
  // Lambda's result in a field called "status" in the response
  inputPath: '$.guid',
  outputPath: '$.status',
});

const jobFailed = new sfn.Fail(this, 'Job Failed', {
  cause: 'AWS Batch Job Failed',
  error: 'DescribeJob returned FAILED',
});

const finalStatus = new tasks.LambdaInvoke(this, 'Get Final Job Status', {
  lambdaFunction: getStatusLambda,
  // Use "guid" field as input
  inputPath: '$.guid',
  outputPath: '$.Payload',
});

const definition = submitJob
  .next(waitX)
  .next(getStatus)
  .next(new sfn.Choice(this, 'Job Complete?')
    // Look at the "status" field
    .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
    .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
    .otherwise(waitX));

new sfn.StateMachine(this, 'StateMachine', {
  definition,
  timeout: Duration.minutes(5),
});
```

You can find more sample snippets and learn more about the service integrations
in the `@aws-cdk/aws-stepfunctions-tasks` package.

## State Machine

A `stepfunctions.StateMachine` is a resource that takes a state machine
definition. The definition is specified by its start state, and encompasses
all states reachable from the start state:

```ts
const startState = new sfn.Pass(this, 'StartState');

new sfn.StateMachine(this, 'StateMachine', {
  definition: startState,
});
```

State machines are made up of a sequence of **Steps**, which represent different actions
taken in sequence. Some of these steps represent *control flow* (like `Choice`, `Map` and `Wait`)
while others represent calls made against other AWS services (like `LambdaInvoke`).
The second category are called `Task`s and they can all be found in the module [`aws-stepfunctions-tasks`].

[`aws-stepfunctions-tasks`]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_stepfunctions_tasks-readme.html

State machines execute using an IAM Role, which will automatically have all
permissions added that are required to make all state machine tasks execute
properly (for example, permissions to invoke any Lambda functions you add to
your workflow). A role will be created by default, but you can supply an
existing one as well.

Set the `removalPolicy` prop to `RemovalPolicy.RETAIN` if you want to retain the execution
history when CloudFormation deletes your state machine.

## State Machine Data

An Execution represents each time the State Machine is run. Every Execution has [State Machine
Data](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-data.html):
a JSON document containing keys and values that is fed into the state machine,
gets modified by individual steps as the state machine progresses, and finally
is produced as output.

By default, the entire Data object is passed into every state, and the return data of the step
becomes new the new Data object. This behavior can be modified by supplying values for `inputPath`,
`resultSelector`, `resultPath` and `outputPath`.

### Manipulating state machine data using inputPath, resultSelector, resultPath and outputPath

These properties impact how each individual step interacts with the state machine data:

* `inputPath`: the part of the data object that gets passed to the step (`itemsPath` for `Map` states)
* `resultSelector`: the part of the step result that should be added to the state machine data
* `resultPath`: where in the state machine data the step result should be inserted
* `outputPath`: what part of the state machine data should be retained

Their values should be a string indicating a [JSON path](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-paths.html) into the State Machine Data object (like `"$.MyKey"`). If absent, the values are treated as if they were `"$"`, which means the entire object.

The following pseudocode shows how AWS Step Functions uses these parameters when executing a step:

```js
// Schematically show how Step Functions evaluates functions.
// [] represents indexing into an object by a using JSON path.

input = state[inputPath]

result = invoke_step(select_parameters(input))

state[resultPath] = result[resultSelector]

state = state[outputPath]
```

Instead of a JSON path string, each of these paths can also have the special value `JsonPath.DISCARD`, which causes the corresponding indexing expression to return an empty object (`{}`). Effectively, that means there will be an empty input object, an empty result object, no effect on the state, or an empty state, respectively.

Some steps (mostly Tasks) have *Parameters*, which are selected differently. See the next section.

See the official documentation on [input and output processing in Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-input-output-filtering.html).

### Passing Parameters to Tasks

Tasks take parameters, whose values can be taken from the State Machine Data object. For example, your
workflow may want to start a CodeBuild with an environment variable that is taken from the State Machine data, or pass part of the State Machine Data into an AWS Lambda Function.

In the original JSON-based states language used by AWS Step Functions, you would
add `.$` to the end of a key to indicate that a value needs to be interpreted as
a JSON path. In the CDK API you do not change the names of any keys. Instead, you
pass special values. There are 3 types of task inputs to consider:

* Tasks that accept a "payload" type of input (like AWS Lambda invocations, or posting messages to SNS topics or SQS queues), will take an object of type `TaskInput`, like `TaskInput.fromObject()` or `TaskInput.fromJsonPathAt()`.
* When tasks expect individual string or number values to customize their behavior, you can also pass a value constructed by `JsonPath.stringAt()` or `JsonPath.numberAt()`.
* When tasks expect strongly-typed resources and you want to vary the resource that is referenced based on a name from the State Machine Data, reference the resource as if it was external (using `JsonPath.stringAt()`). For example, for a Lambda function: `Function.fromFunctionName(this, 'ReferencedFunction', JsonPath.stringAt('$.MyFunctionName'))`.

For example, to pass the value that's in the data key of `OrderId` to a Lambda
function as you invoke it, use `JsonPath.stringAt('$.OrderId')`, like so:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const orderFn: lambda.Function;

const submitJob = new tasks.LambdaInvoke(this, 'InvokeOrderProcessor', {
  lambdaFunction: orderFn,
  payload: sfn.TaskInput.fromObject({
    OrderId: sfn.JsonPath.stringAt('$.OrderId'),
  }),
});
```

The following methods are available:

| Method | Purpose |
|--------|---------|
| `JsonPath.stringAt('$.Field')` | reference a field, return the type as a `string`. |
| `JsonPath.listAt('$.Field')` | reference a field, return the type as a list of strings. |
| `JsonPath.numberAt('$.Field')` | reference a field, return the type as a number. Use this for functions that expect a number argument. |
| `JsonPath.objectAt('$.Field')` | reference a field, return the type as an `IResolvable`. Use this for functions that expect an object argument. |
| `JsonPath.entirePayload` | reference the entire data object (equivalent to a path of `$`). |
| `JsonPath.taskToken` | reference the [Task Token](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token), used for integration patterns that need to run for a long time. |

You can also call [intrinsic functions](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html) using the methods on `JsonPath`:

| Method | Purpose |
|--------|---------|
| `JsonPath.array(JsonPath.stringAt('$.Field'), ...)` | make an array from other elements. |
| `JsonPath.arrayPartition(JsonPath.listAt('$.inputArray'), 4)` | partition an array. |
| `JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), 5)` | determine if a specific value is present in an array. |
| `JsonPath.arrayRange(1, 9, 2)` | create a new array containing a specific range of elements. |
| `JsonPath.arrayGetItem(JsonPath.listAt('$.inputArray'), 5)` | get a specified index's value in an array. |
| `JsonPath.arrayLength(JsonPath.listAt('$.inputArray'))` | get the length of an array. |
| `JsonPath.arrayUnique(JsonPath.listAt('$.inputArray'))` | remove duplicate values from an array. |
| `JsonPath.base64Encode(JsonPath.stringAt('$.input'))` | encode data based on MIME Base64 encoding scheme. |
| `JsonPath.base64Decode(JsonPath.stringAt('$.base64'))` | decode data based on MIME Base64 decoding scheme. |
| `JsonPath.hash(JsonPath.objectAt('$.Data'), JsonPath.stringAt('$.Algorithm'))` | calculate the hash value of a given input. |
| `JsonPath.jsonMerge(JsonPath.objectAt('$.Obj1'), JsonPath.objectAt('$.Obj2'))` | merge two JSON objects into a single object. |
| `JsonPath.stringToJson(JsonPath.stringAt('$.ObjStr'))` | parse a JSON string to an object |
| `JsonPath.jsonToString(JsonPath.objectAt('$.Obj'))` | stringify an object to a JSON string |
| `JsonPath.mathRandom(1, 999)` | return a random number. |
| `JsonPath.mathAdd(JsonPath.numberAt('$.value1'), JsonPath.numberAt('$.step'))` | return the sum of two numbers. |
| `JsonPath.stringSplit(JsonPath.stringAt('$.inputString'), JsonPath.stringAt('$.splitter'))` | split a string into an array of values. |
| `JsonPath.uuid()` | return a version 4 universally unique identifier (v4 UUID). |
| `JsonPath.format('The value is {}.', JsonPath.stringAt('$.Value'))` | insert elements into a format string. |

## Amazon States Language

This library comes with a set of classes that model the [Amazon States
Language](https://states-language.net/spec.html). The following State classes
are supported:

* [`Task`](#task)
* [`Pass`](#pass)
* [`Wait`](#wait)
* [`Choice`](#choice)
* [`Parallel`](#parallel)
* [`Succeed`](#succeed)
* [`Fail`](#fail)
* [`Map`](#map)
* [`Custom State`](#custom-state)

An arbitrary JSON object (specified at execution start) is passed from state to
state and transformed during the execution of the workflow. For more
information, see the States Language spec.

### Task

A `Task` represents some work that needs to be done. Do not use the `Task` class directly.

Instead, use one of the classes in the `@aws-cdk/aws-stepfunctions-tasks` module,
which provide a much more ergonomic way to integrate with various AWS services.

### Pass

A `Pass` state passes its input to its output, without performing work.
Pass states are useful when constructing and debugging state machines.

The following example injects some fixed data into the state machine through
the `result` field. The `result` field will be added to the input and the result
will be passed as the state's output.

```ts
// Makes the current JSON state { ..., "subObject": { "hello": "world" } }
const pass = new sfn.Pass(this, 'Add Hello World', {
  result: sfn.Result.fromObject({ hello: 'world' }),
  resultPath: '$.subObject',
});

// Set the next state
const nextState = new sfn.Pass(this, 'NextState');
pass.next(nextState);
```

The `Pass` state also supports passing key-value pairs as input. Values can
be static, or selected from the input with a path.

The following example filters the `greeting` field from the state input
and also injects a field called `otherData`.

```ts
const pass = new sfn.Pass(this, 'Filter input and inject data', {
  parameters: { // input to the pass state
    input: sfn.JsonPath.stringAt('$.input.greeting'),
    otherData: 'some-extra-stuff',
  },
});
```

The object specified in `parameters` will be the input of the `Pass` state.
Since neither `Result` nor `ResultPath` are supplied, the `Pass` state copies
its input through to its output.

Learn more about the [Pass state](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-pass-state.html)

### Wait

A `Wait` state waits for a given number of seconds, or until the current time
hits a particular time. The time to wait may be taken from the execution's JSON
state.

```ts
// Wait until it's the time mentioned in the the state object's "triggerTime"
// field.
const wait = new sfn.Wait(this, 'Wait For Trigger Time', {
  time: sfn.WaitTime.timestampPath('$.triggerTime'),
});

// Set the next state
const startTheWork = new sfn.Pass(this, 'StartTheWork');
wait.next(startTheWork);
```

### Choice

A `Choice` state can take a different path through the workflow based on the
values in the execution's JSON state:

```ts
const choice = new sfn.Choice(this, 'Did it work?');

// Add conditions with .when()
const successState = new sfn.Pass(this, 'SuccessState');
const failureState = new sfn.Pass(this, 'FailureState');
choice.when(sfn.Condition.stringEquals('$.status', 'SUCCESS'), successState);
choice.when(sfn.Condition.numberGreaterThan('$.attempts', 5), failureState);

// Use .otherwise() to indicate what should be done if none of the conditions match
const tryAgainState = new sfn.Pass(this, 'TryAgainState');
choice.otherwise(tryAgainState);
```

If you want to temporarily branch your workflow based on a condition, but have
all branches come together and continuing as one (similar to how an `if ...
then ... else` works in a programming language), use the `.afterwards()` method:

```ts
const choice = new sfn.Choice(this, 'What color is it?');
const handleBlueItem = new sfn.Pass(this, 'HandleBlueItem');
const handleRedItem = new sfn.Pass(this, 'HandleRedItem');
const handleOtherItemColor = new sfn.Pass(this, 'HanldeOtherItemColor');
choice.when(sfn.Condition.stringEquals('$.color', 'BLUE'), handleBlueItem);
choice.when(sfn.Condition.stringEquals('$.color', 'RED'), handleRedItem);
choice.otherwise(handleOtherItemColor);

// Use .afterwards() to join all possible paths back together and continue
const shipTheItem = new sfn.Pass(this, 'ShipTheItem');
choice.afterwards().next(shipTheItem);
```

If your `Choice` doesn't have an `otherwise()` and none of the conditions match
the JSON state, a `NoChoiceMatched` error will be thrown. Wrap the state machine
in a `Parallel` state if you want to catch and recover from this.

#### Available Conditions

see [step function comparison operators](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-choice-state.html#amazon-states-language-choice-state-rules)

* `Condition.isPresent` - matches if a json path is present
* `Condition.isNotPresent` - matches if a json path is not present
* `Condition.isString` - matches if a json path contains a string
* `Condition.isNotString` - matches if a json path is not a string
* `Condition.isNumeric` - matches if a json path is numeric
* `Condition.isNotNumeric` - matches if a json path is not numeric
* `Condition.isBoolean` - matches if a json path is boolean
* `Condition.isNotBoolean` - matches if a json path is not boolean
* `Condition.isTimestamp` - matches if a json path is a timestamp
* `Condition.isNotTimestamp` - matches if a json path is not a timestamp
* `Condition.isNotNull` - matches if a json path is not null
* `Condition.isNull` - matches if a json path is null
* `Condition.booleanEquals` - matches if a boolean field has a given value
* `Condition.booleanEqualsJsonPath` - matches if a boolean field equals a value in a given mapping path
* `Condition.stringEqualsJsonPath` - matches if a string field equals a given mapping path
* `Condition.stringEquals` - matches if a field equals a string value
* `Condition.stringLessThan` - matches if a string field sorts before a given value
* `Condition.stringLessThanJsonPath` - matches if a string field sorts before a value at given mapping path
* `Condition.stringLessThanEquals` - matches if a string field sorts equal to or before a given value
* `Condition.stringLessThanEqualsJsonPath` - matches if a string field sorts equal to or before a given mapping
* `Condition.stringGreaterThan` - matches if a string field sorts after a given value
* `Condition.stringGreaterThanJsonPath` - matches if a string field sorts after a value at a given mapping path
* `Condition.stringGreaterThanEqualsJsonPath` - matches if a string field sorts after or equal to value at a given mapping path
* `Condition.stringGreaterThanEquals` - matches if a string field sorts after or equal to a given value
* `Condition.numberEquals` - matches if a numeric field has the given value
* `Condition.numberEqualsJsonPath` - matches if a numeric field has the value in a given mapping path
* `Condition.numberLessThan` - matches if a numeric field is less than the given value
* `Condition.numberLessThanJsonPath` - matches if a numeric field is less than the value at the given mapping path
* `Condition.numberLessThanEquals` - matches if a numeric field is less than or equal to the given value
* `Condition.numberLessThanEqualsJsonPath` - matches if a numeric field is less than or equal to the numeric value at given mapping path
* `Condition.numberGreaterThan` - matches if a numeric field is greater than the given value
* `Condition.numberGreaterThanJsonPath` - matches if a numeric field is greater than the value at a given mapping path
* `Condition.numberGreaterThanEquals` - matches if a numeric field is greater than or equal to the given value
* `Condition.numberGreaterThanEqualsJsonPath` - matches if a numeric field is greater than or equal to the value at a given mapping path
* `Condition.timestampEquals` - matches if a timestamp field is the same time as the given timestamp
* `Condition.timestampEqualsJsonPath` - matches if a timestamp field is the same time as the timestamp at a given mapping path
* `Condition.timestampLessThan` - matches if a timestamp field is before the given timestamp
* `Condition.timestampLessThanJsonPath` - matches if a timestamp field is before the timestamp at a given mapping path
* `Condition.timestampLessThanEquals` - matches if a timestamp field is before or equal to the given timestamp
* `Condition.timestampLessThanEqualsJsonPath` - matches if a timestamp field is before or equal to the timestamp at a given mapping path
* `Condition.timestampGreaterThan` - matches if a timestamp field is after the timestamp at a given mapping path
* `Condition.timestampGreaterThanJsonPath` - matches if a timestamp field is after the timestamp at a given mapping path
* `Condition.timestampGreaterThanEquals` - matches if a timestamp field is after or equal to the given timestamp
* `Condition.timestampGreaterThanEqualsJsonPath` - matches if a timestamp field is after or equal to the timestamp at a given mapping path
* `Condition.stringMatches` - matches if a field matches a string pattern that can contain a wild card (\*) e.g: log-\*.txt or \*LATEST\*. No other characters other than "\*" have any special meaning - \* can be escaped: \\\\*

### Parallel

A `Parallel` state executes one or more subworkflows in parallel. It can also
be used to catch and recover from errors in subworkflows.

```ts
const parallel = new sfn.Parallel(this, 'Do the work in parallel');

// Add branches to be executed in parallel
const shipItem = new sfn.Pass(this, 'ShipItem');
const sendInvoice = new sfn.Pass(this, 'SendInvoice');
const restock = new sfn.Pass(this, 'Restock');
parallel.branch(shipItem);
parallel.branch(sendInvoice);
parallel.branch(restock);

// Retry the whole workflow if something goes wrong
parallel.addRetry({ maxAttempts: 1 });

// How to recover from errors
const sendFailureNotification = new sfn.Pass(this, 'SendFailureNotification');
parallel.addCatch(sendFailureNotification);

// What to do in case everything succeeded
const closeOrder = new sfn.Pass(this, 'CloseOrder');
parallel.next(closeOrder);
```

### Succeed

Reaching a `Succeed` state terminates the state machine execution with a
successful status.

```ts
const success = new sfn.Succeed(this, 'We did it!');
```

### Fail

Reaching a `Fail` state terminates the state machine execution with a
failure status. The fail state should report the reason for the failure.
Failures can be caught by encompassing `Parallel` states.

```ts
const success = new sfn.Fail(this, 'Fail', {
  error: 'WorkflowFailure',
  cause: "Something went wrong",
});
```

### Map

A `Map` state can be used to run a set of steps for each element of an input array.
A `Map` state will execute the same steps for multiple entries of an array in the state input.

While the `Parallel` state executes multiple branches of steps using the same input, a `Map` state will
execute the same steps for multiple entries of an array in the state input.

```ts
const map = new sfn.Map(this, 'Map State', {
  maxConcurrency: 1,
  itemsPath: sfn.JsonPath.stringAt('$.inputForMap'),
});
map.iterator(new sfn.Pass(this, 'Pass State'));
```

### Custom State

It's possible that the high-level constructs for the states or `stepfunctions-tasks` do not have
the states or service integrations you are looking for. The primary reasons for this lack of
functionality are:

* A [service integration](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html) is available through Amazon States Language, but not available as construct
  classes in the CDK.
* The state or state properties are available through Step Functions, but are not configurable
  through constructs

If a feature is not available, a `CustomState` can be used to supply any Amazon States Language
JSON-based object as the state definition.

[Code Snippets](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-code-snippet.html#tutorial-code-snippet-1) are available and can be plugged in as the state definition.

Custom states can be chained together with any of the other states to create your state machine
definition. You will also need to provide any permissions that are required to the `role` that
the State Machine uses.

The following example uses the `DynamoDB` service integration to insert data into a DynamoDB table.

```ts
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// create a table
const table = new dynamodb.Table(this, 'montable', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
});

const finalStatus = new sfn.Pass(this, 'final step');

// States language JSON to put an item into DynamoDB
// snippet generated from https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-code-snippet.html#tutorial-code-snippet-1
const stateJson = {
  Type: 'Task',
  Resource: 'arn:aws:states:::dynamodb:putItem',
  Parameters: {
    TableName: table.tableName,
    Item: {
      id: {
        S: 'MyEntry',
      },
    },
  },
  ResultPath: null,
};

// custom state which represents a task to insert data into DynamoDB
const custom = new sfn.CustomState(this, 'my custom task', {
  stateJson,
});

const chain = sfn.Chain.start(custom)
  .next(finalStatus);

const sm = new sfn.StateMachine(this, 'StateMachine', {
  definition: chain,
  timeout: Duration.seconds(30),
});

// don't forget permissions. You need to assign them
table.grantWriteData(sm);
```

## Task Chaining

To make defining work flows as convenient (and readable in a top-to-bottom way)
as writing regular programs, it is possible to chain most methods invocations.
In particular, the `.next()` method can be repeated. The result of a series of
`.next()` calls is called a **Chain**, and can be used when defining the jump
targets of `Choice.on` or `Parallel.branch`:

```ts
const step1 = new sfn.Pass(this, 'Step1');
const step2 = new sfn.Pass(this, 'Step2');
const step3 = new sfn.Pass(this, 'Step3');
const step4 = new sfn.Pass(this, 'Step4');
const step5 = new sfn.Pass(this, 'Step5');
const step6 = new sfn.Pass(this, 'Step6');
const step7 = new sfn.Pass(this, 'Step7');
const step8 = new sfn.Pass(this, 'Step8');
const step9 = new sfn.Pass(this, 'Step9');
const step10 = new sfn.Pass(this, 'Step10');
const choice = new sfn.Choice(this, 'Choice');
const condition1 = sfn.Condition.stringEquals('$.status', 'SUCCESS');
const parallel = new sfn.Parallel(this, 'Parallel');
const finish = new sfn.Pass(this, 'Finish');

const definition = step1
  .next(step2)
  .next(choice
    .when(condition1, step3.next(step4).next(step5))
    .otherwise(step6)
    .afterwards())
  .next(parallel
    .branch(step7.next(step8))
    .branch(step9.next(step10)))
  .next(finish);

new sfn.StateMachine(this, 'StateMachine', {
  definition,
});
```

If you don't like the visual look of starting a chain directly off the first
step, you can use `Chain.start`:

```ts
const step1 = new sfn.Pass(this, 'Step1');
const step2 = new sfn.Pass(this, 'Step2');
const step3 = new sfn.Pass(this, 'Step3');

const definition = sfn.Chain
  .start(step1)
  .next(step2)
  .next(step3)
  // ...
```

## Task Credentials

Tasks are executed using the State Machine's execution role. In some cases, e.g. cross-account access, an IAM role can be assumed by the State Machine's execution role to provide access to the resource.
This can be achieved by providing the optional `credentials` property which allows using a fixed role or a json expression to resolve the role at runtime from the task's inputs.

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const submitLambda: lambda.Function;
declare const iamRole: iam.Role;

// use a fixed role for all task invocations
const role = sfn.TaskRole.fromRole(iamRole);
// or use a json expression to resolve the role at runtime based on task inputs
//const role = sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn');

const submitJob = new tasks.LambdaInvoke(this, 'Submit Job', {
  lambdaFunction: submitLambda,
  outputPath: '$.Payload',
  // use credentials
  credentials: { role },
});
```

See [the AWS documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html)
to learn more about AWS Step Functions support for accessing resources in other AWS accounts.

## State Machine Fragments

It is possible to define reusable (or abstracted) mini-state machines by
defining a construct that implements `IChainable`, which requires you to define
two fields:

* `startState: State`, representing the entry point into this state machine.
* `endStates: INextable[]`, representing the (one or more) states that outgoing
  transitions will be added to if you chain onto the fragment.

Since states will be named after their construct IDs, you may need to prefix the
IDs of states if you plan to instantiate the same state machine fragment
multiples times (otherwise all states in every instantiation would have the same
name).

The class `StateMachineFragment` contains some helper functions (like
`prefixStates()`) to make it easier for you to do this. If you define your state
machine as a subclass of this, it will be convenient to use:

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

interface MyJobProps {
  jobFlavor: string;
}

class MyJob extends sfn.StateMachineFragment {
  public readonly startState: sfn.State;
  public readonly endStates: sfn.INextable[];

  constructor(parent: Construct, id: string, props: MyJobProps) {
    super(parent, id);

    const choice = new sfn.Choice(this, 'Choice')
      .when(sfn.Condition.stringEquals('$.branch', 'left'), new sfn.Pass(this, 'Left Branch'))
      .when(sfn.Condition.stringEquals('$.branch', 'right'), new sfn.Pass(this, 'Right Branch'));

    // ...

    this.startState = choice;
    this.endStates = choice.afterwards().endStates;
  }
}

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // Do 3 different variants of MyJob in parallel
    const parallel = new sfn.Parallel(this, 'All jobs')
      .branch(new MyJob(this, 'Quick', { jobFlavor: 'quick' }).prefixStates())
      .branch(new MyJob(this, 'Medium', { jobFlavor: 'medium' }).prefixStates())
      .branch(new MyJob(this, 'Slow', { jobFlavor: 'slow' }).prefixStates());

    new sfn.StateMachine(this, 'MyStateMachine', {
      definition: parallel,
    });
  }
}
```

A few utility functions are available to parse state machine fragments.

* `State.findReachableStates`: Retrieve the list of states reachable from a given state.
* `State.findReachableEndStates`: Retrieve the list of end or terminal states reachable from a given state.

## Activity

**Activities** represent work that is done on some non-Lambda worker pool. The
Step Functions workflow will submit work to this Activity, and a worker pool
that you run yourself, probably on EC2, will pull jobs from the Activity and
submit the results of individual jobs back.

You need the ARN to do so, so if you use Activities be sure to pass the Activity
ARN into your worker pool:

```ts
const activity = new sfn.Activity(this, 'Activity');

// Read this CloudFormation Output from your application and use it to poll for work on
// the activity.
new CfnOutput(this, 'ActivityArn', { value: activity.activityArn });
```

### Activity-Level Permissions

Granting IAM permissions to an activity can be achieved by calling the `grant(principal, actions)` API:

```ts
const activity = new sfn.Activity(this, 'Activity');

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

activity.grant(role, 'states:SendTaskSuccess');
```

This will grant the IAM principal the specified actions onto the activity.

## Metrics

`Task` object expose various metrics on the execution of that particular task. For example,
to create an alarm on a particular task failing:

```ts
declare const task: sfn.Task;
new cloudwatch.Alarm(this, 'TaskAlarm', {
  metric: task.metricFailed(),
  threshold: 1,
  evaluationPeriods: 1,
});
```

There are also metrics on the complete state machine:

```ts
declare const stateMachine: sfn.StateMachine;
new cloudwatch.Alarm(this, 'StateMachineAlarm', {
  metric: stateMachine.metricFailed(),
  threshold: 1,
  evaluationPeriods: 1,
});
```

And there are metrics on the capacity of all state machines in your account:

```ts
new cloudwatch.Alarm(this, 'ThrottledAlarm', {
  metric: sfn.StateTransitionMetric.metricThrottledEvents(),
  threshold: 10,
  evaluationPeriods: 2,
});
```

## Error names

Step Functions identifies errors in the Amazon States Language using case-sensitive strings, known as error names.
The Amazon States Language defines a set of built-in strings that name well-known errors, all beginning with the `States.` prefix.

* `States.ALL` - A wildcard that matches any known error name.
* `States.Runtime` - An execution failed due to some exception that could not be processed. Often these are caused by errors at runtime, such as attempting to apply InputPath or OutputPath on a null JSON payload. A `States.Runtime` error is not retriable, and will always cause the execution to fail. A retry or catch on `States.ALL` will NOT catch States.Runtime errors.
* `States.DataLimitExceeded` - A States.DataLimitExceeded exception will be thrown for the following:
  * When the output of a connector is larger than payload size quota.
  * When the output of a state is larger than payload size quota.
  * When, after Parameters processing, the input of a state is larger than the payload size quota.
  * See [the AWS documentation](https://docs.aws.amazon.com/step-functions/latest/dg/limits-overview.html) to learn more about AWS Step Functions Quotas.
* `States.HeartbeatTimeout` - A Task state failed to send a heartbeat for a period longer than the HeartbeatSeconds value.
* `States.Timeout` - A Task state either ran longer than the TimeoutSeconds value, or failed to send a heartbeat for a period longer than the HeartbeatSeconds value.
* `States.TaskFailed`- A Task state failed during the execution. When used in a retry or catch, `States.TaskFailed` acts as a wildcard that matches any known error name except for `States.Timeout`.

## Logging

Enable logging to CloudWatch by passing a logging configuration with a
destination LogGroup:

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const logGroup = new logs.LogGroup(this, 'MyLogGroup');

new sfn.StateMachine(this, 'MyStateMachine', {
  definition: sfn.Chain.start(new sfn.Pass(this, 'Pass')),
  logs: {
    destination: logGroup,
    level: sfn.LogLevel.ALL,
  },
});
```

## X-Ray tracing

Enable X-Ray tracing for StateMachine:

```ts
new sfn.StateMachine(this, 'MyStateMachine', {
  definition: sfn.Chain.start(new sfn.Pass(this, 'Pass')),
  tracingEnabled: true,
});
```

See [the AWS documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-xray-tracing.html)
to learn more about AWS Step Functions's X-Ray support.

## State Machine Permission Grants

IAM roles, users, or groups which need to be able to work with a State Machine should be granted IAM permissions.

Any object that implements the `IGrantable` interface (has an associated principal) can be granted permissions by calling:

* `stateMachine.grantStartExecution(principal)` - grants the principal the ability to execute the state machine
* `stateMachine.grantRead(principal)` - grants the principal read access
* `stateMachine.grantTaskResponse(principal)` - grants the principal the ability to send task tokens to the state machine
* `stateMachine.grantExecution(principal, actions)` - grants the principal execution-level permissions for the IAM actions specified
* `stateMachine.grant(principal, actions)` - grants the principal state-machine-level permissions for the IAM actions specified

### Start Execution Permission

Grant permission to start an execution of a state machine by calling the `grantStartExecution()` API.

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

declare const definition: sfn.IChainable;
const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definition,
});

// Give role permission to start execution of state machine
stateMachine.grantStartExecution(role);
```

The following permission is provided to a service principal by the `grantStartExecution()` API:

* `states:StartExecution` - to state machine

### Read Permissions

Grant `read` access to a state machine by calling the `grantRead()` API.

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

declare const definition: sfn.IChainable;
const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definition,
});

// Give role read access to state machine
stateMachine.grantRead(role);
```

The following read permissions are provided to a service principal by the `grantRead()` API:

* `states:ListExecutions` - to state machine
* `states:ListStateMachines` - to state machine
* `states:DescribeExecution` - to executions
* `states:DescribeStateMachineForExecution` - to executions
* `states:GetExecutionHistory` - to executions
* `states:ListActivities` - to `*`
* `states:DescribeStateMachine` - to `*`
* `states:DescribeActivity` - to `*`

### Task Response Permissions

Grant permission to allow task responses to a state machine by calling the `grantTaskResponse()` API:

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

declare const definition: sfn.IChainable;
const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definition,
});

// Give role task response permissions to the state machine
stateMachine.grantTaskResponse(role);
```

The following read permissions are provided to a service principal by the `grantRead()` API:

* `states:SendTaskSuccess` - to state machine
* `states:SendTaskFailure` - to state machine
* `states:SendTaskHeartbeat` - to state machine

### Execution-level Permissions

Grant execution-level permissions to a state machine by calling the `grantExecution()` API:

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

declare const definition: sfn.IChainable;
const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definition,
});

// Give role permission to get execution history of ALL executions for the state machine
stateMachine.grantExecution(role, 'states:GetExecutionHistory');
```

### Custom Permissions

You can add any set of permissions to a state machine by calling the `grant()` API.

```ts
const user = new iam.User(this, 'MyUser');

declare const definition: sfn.IChainable;
const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definition,
});

//give user permission to send task success to the state machine
stateMachine.grant(user, 'states:SendTaskSuccess');
```

## Import

Any Step Functions state machine that has been created outside the stack can be imported
into your CDK stack.

State machines can be imported by their ARN via the `StateMachine.fromStateMachineArn()` API.
In addition, the StateMachine can be imported via the `StateMachine.fromStateMachineName()` method, as long as they are in the same account/region as the current construct.

```ts
const app = new App();
const stack = new Stack(app, 'MyStack');
sfn.StateMachine.fromStateMachineArn(
  stack,
  "ViaArnImportedStateMachine",
  "arn:aws:states:us-east-1:123456789012:stateMachine:StateMachine2E01A3A5-N5TJppzoevKQ"
);

sfn.StateMachine.fromStateMachineName(
  stack,
  "ViaResourceNameImportedStateMachine",
  "StateMachine2E01A3A5-N5TJppzoevKQ"
);
```
