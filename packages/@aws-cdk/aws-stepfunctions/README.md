## AWS Step Functions Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-stepfunctions` package contains constructs for building
serverless workflows using objects. Use this in conjunction with the
`@aws-cdk/aws-stepfunctions-tasks` package, which contains classes used
to call other AWS services.

Defining a workflow looks like this (for the [Step Functions Job Poller
example](https://docs.aws.amazon.com/step-functions/latest/dg/job-status-poller-sample.html)):

### TypeScript example

```ts
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as lambda from '@aws-cdk/aws-lambda';

const submitLambda = new lambda.Function(this, 'SubmitLambda', { ... });
const getStatusLambda = new lambda.Function(this, 'CheckLambda', { ... });

const submitJob = new sfn.Task(this, 'Submit Job', {
    task: new tasks.RunLambdaTask(submitLambda),
    // Lambda's result is in the attribute `Payload`
    outputPath: '$.Payload',
});

const waitX = new sfn.Wait(this, 'Wait X Seconds', {
    time: sfn.WaitTime.secondsPath('$.waitSeconds'),
});

const getStatus = new sfn.Task(this, 'Get Job Status', {
    task: new tasks.RunLambdaTask(getStatusLambda),
    // Pass just the field named "guid" into the Lambda, put the
    // Lambda's result in a field called "status" in the response
    inputPath: '$.guid',
    outputPath: '$.Payload',
});

const jobFailed = new sfn.Fail(this, 'Job Failed', {
    cause: 'AWS Batch Job Failed',
    error: 'DescribeJob returned FAILED',
});

const finalStatus = new sfn.Task(this, 'Get Final Job Status', {
    task: new tasks.RunLambdaTask(getStatusLambda),
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
    timeout: Duration.minutes(5)
});
```

You can find more sample snippets and learn more about the service integrations
in the `@aws-cdk/aws-stepfunctions-tasks` package.

## State Machine

A `stepfunctions.StateMachine` is a resource that takes a state machine
definition. The definition is specified by its start state, and encompasses
all states reachable from the start state:

```ts
const startState = new stepfunctions.Pass(this, 'StartState');

new stepfunctions.StateMachine(this, 'StateMachine', {
    definition: startState
});
```

State machines execute using an IAM Role, which will automatically have all
permissions added that are required to make all state machine tasks execute
properly (for example, permissions to invoke any Lambda functions you add to
your workflow). A role will be created by default, but you can supply an
existing one as well.

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

A `Task` represents some work that needs to be done. The exact work to be
done is determine by a class that implements `IStepFunctionsTask`, a collection
of which can be found in the `@aws-cdk/aws-stepfunctions-tasks` module.

The tasks in the `@aws-cdk/aws-stepfunctions-tasks` module support the
[service integration pattern](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) that integrates Step Functions with services
directly in the Amazon States language.

### Pass

A `Pass` state does no work, but it can optionally transform the execution's
JSON state.

```ts
// Makes the current JSON state { ..., "subObject": { "hello": "world" } }
const pass = new stepfunctions.Pass(this, 'Add Hello World', {
    result: { hello: "world" },
    resultPath: '$.subObject',
});

// Set the next state
pass.next(nextState);
```

### Wait

A `Wait` state waits for a given number of seconds, or until the current time
hits a particular time. The time to wait may be taken from the execution's JSON
state.

```ts
// Wait until it's the time mentioned in the the state object's "triggerTime"
// field.
const wait = new stepfunctions.Wait(this, 'Wait For Trigger Time', {
    time: stepfunctions.WaitTime.timestampPath('$.triggerTime'),
});

// Set the next state
wait.next(startTheWork);
```

### Choice

A `Choice` state can take a different path through the workflow based on the
values in the execution's JSON state:

```ts
const choice = new stepfunctions.Choice(this, 'Did it work?');

// Add conditions with .when()
choice.when(stepfunctions.Condition.stringEqual('$.status', 'SUCCESS'), successState);
choice.when(stepfunctions.Condition.numberGreaterThan('$.attempts', 5), failureState);

// Use .otherwise() to indicate what should be done if none of the conditions match
choice.otherwise(tryAgainState);
```

If you want to temporarily branch your workflow based on a condition, but have
all branches come together and continuing as one (similar to how an `if ...
then ... else` works in a programming language), use the `.afterwards()` method:

```ts
const choice = new stepfunctions.Choice(this, 'What color is it?');
choice.when(stepfunctions.Condition.stringEqual('$.color', 'BLUE'), handleBlueItem);
choice.when(stepfunctions.Condition.stringEqual('$.color', 'RED'), handleRedItem);
choice.otherwise(handleOtherItemColor);

// Use .afterwards() to join all possible paths back together and continue
choice.afterwards().next(shipTheItem);
```

If your `Choice` doesn't have an `otherwise()` and none of the conditions match
the JSON state, a `NoChoiceMatched` error will be thrown. Wrap the state machine
in a `Parallel` state if you want to catch and recover from this.

### Parallel

A `Parallel` state executes one or more subworkflows in parallel. It can also
be used to catch and recover from errors in subworkflows.

```ts
const parallel = new stepfunctions.Parallel(this, 'Do the work in parallel');

// Add branches to be executed in parallel
parallel.branch(shipItem);
parallel.branch(sendInvoice);
parallel.branch(restock);

// Retry the whole workflow if something goes wrong
parallel.addRetry({ maxAttempts: 1 });

// How to recover from errors
parallel.addCatch(sendFailureNotification);

// What to do in case everything succeeded
parallel.next(closeOrder);
```

### Succeed

Reaching a `Succeed` state terminates the state machine execution with a
succesful status.

```ts
const success = new stepfunctions.Succeed(this, 'We did it!');
```

### Fail

Reaching a `Fail` state terminates the state machine execution with a
failure status. The fail state should report the reason for the failure.
Failures can be caught by encompassing `Parallel` states.

```ts
const success = new stepfunctions.Fail(this, 'Fail', {
    error: 'WorkflowFailure',
    cause: "Something went wrong"
});
```

### Map

A `Map` state can be used to run a set of steps for each element of an input array.
A `Map` state will execute the same steps for multiple entries of an array in the state input.

While the `Parallel` state executes multiple branches of steps using the same input, a `Map` state will
execute the same steps for multiple entries of an array in the state input.

```ts
const map = new stepfunctions.Map(this, 'Map State', {
    maxConcurrency: 1,
    itemsPath: stepfunctions.Data.stringAt('$.inputForMap')
});
map.iterator(new stepfunctions.Pass(this, 'Pass State'));
```

### Custom State

It's possible that the high-level constructs for the states or `stepfunctions-tasks` do not have
the states or service integrations you are looking for. The primary reasons for this lack of
functionality are:

* A [service integration](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html) is available through Amazon States Langauge, but not available as construct
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
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as sfn from '@aws-cdk/aws-stepfunctions';

// create a table
const table = new ddb.Table(this, 'montable', {
  partitionKey: {
    name: 'id',
    type: ddb.AttributeType.STRING,
  },
});

const finalStatus = new sfn.Pass(stack, 'final step');

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
  timeout: cdk.Duration.seconds(30),
});

// don't forget permissions. You need to assign them
table.grantWriteData(sm.role);
```

## Task Chaining

To make defining work flows as convenient (and readable in a top-to-bottom way)
as writing regular programs, it is possible to chain most methods invocations.
In particular, the `.next()` method can be repeated. The result of a series of
`.next()` calls is called a **Chain**, and can be used when defining the jump
targets of `Choice.on` or `Parallel.branch`:

```ts
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

new stepfunctions.StateMachine(this, 'StateMachine', {
    definition,
});
```

If you don't like the visual look of starting a chain directly off the first
step, you can use `Chain.start`:

```ts
const definition = stepfunctions.Chain
    .start(step1)
    .next(step2)
    .next(step3)
    // ...
```


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

```ts
interface MyJobProps {
    jobFlavor: string;
}

class MyJob extends stepfunctions.StateMachineFragment {
    public readonly startState: State;
    public readonly endStates: INextable[];

    constructor(parent: cdk.Construct, id: string, props: MyJobProps) {
        super(parent, id);

        const first = new stepfunctions.Task(this, 'First', { ... });
        // ...
        const last = new stepfunctions.Task(this, 'Last', { ... });

        this.startState = first;
        this.endStates = [last];
    }
}

// Do 3 different variants of MyJob in parallel
new stepfunctions.Parallel(this, 'All jobs')
    .branch(new MyJob(this, 'Quick', { jobFlavor: 'quick' }).prefixStates())
    .branch(new MyJob(this, 'Medium', { jobFlavor: 'medium' }).prefixStates())
    .branch(new MyJob(this, 'Slow', { jobFlavor: 'slow' }).prefixStates());
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
const activity = new stepfunctions.Activity(this, 'Activity');

// Read this CloudFormation Output from your application and use it to poll for work on
// the activity.
new cdk.CfnOutput(this, 'ActivityArn', { value: activity.activityArn });
```

## Metrics

`Task` object expose various metrics on the execution of that particular task. For example,
to create an alarm on a particular task failing:

```ts
new cloudwatch.Alarm(this, 'TaskAlarm', {
    metric: task.metricFailed(),
    threshold: 1,
    evaluationPeriods: 1,
});
```

There are also metrics on the complete state machine:

```ts
new cloudwatch.Alarm(this, 'StateMachineAlarm', {
    metric: stateMachine.metricFailed(),
    threshold: 1,
    evaluationPeriods: 1,
});
```

And there are metrics on the capacity of all state machines in your account:

```ts
new cloudwatch.Alarm(this, 'ThrottledAlarm', {
    metric: StateTransitionMetrics.metricThrottledEvents(),
    threshold: 10,
    evaluationPeriods: 2,
});
```

## Logging

Enable logging to CloudWatch by passing a logging configuration with a
destination LogGroup:

```ts
const logGroup = new logs.LogGroup(stack, 'MyLogGroup');

new stepfunctions.StateMachine(stack, 'MyStateMachine', {
    definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
    logs: {
      destinations: logGroup,
      level: stepfunctions.LogLevel.ALL,
    }
});
```

## Future work

Contributions welcome:

- [ ] A single `LambdaTask` class that is both a `Lambda` and a `Task` in one
  might make for a nice API.
- [ ] Expression parser for Conditions.
- [ ] Simulate state machines in unit tests.
