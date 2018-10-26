## AWS Step Functions Construct Library

The `@aws-cdk/aws-stepfunctions` package contains constructs for building
serverless workflows. Using objects. Defining a workflow looks like this
(for the [Step Functions Job Poller
example](https://docs.aws.amazon.com/step-functions/latest/dg/job-status-poller-sample.html)):

### TypeScript example

```ts
const submitLambda = new lambda.Function(this, 'SubmitLambda', { ... });
const getStatusLambda = new lambda.Function(this, 'CheckLambda', { ... });

const submitJob = new stepfunctions.Task(this, 'Submit Job', {
    resource: submitLambda,
    // Put Lambda's result here in the execution's state object
    resultPath: '$.guid',
});

const waitX = new stepfunctions.Wait(this, 'Wait X Seconds', { secondsPath: '$.wait_time' });

const getStatus = new stepfunctions.Task(this, 'Get Job Status', {
    resource: getStatusLambda,
    // Pass just the field named "guid" into the Lambda, put the
    // Lambda's result in a field called "status"
    inputPath: '$.guid',
    resultPath: '$.status',
});

const jobFailed = new stepfunctions.Fail(this, 'Job Failed', {
    cause: 'AWS Batch Job Failed',
    error: 'DescribeJob returned FAILED',
});

const finalStatus = new stepfunctions.Task(this, 'Get Final Job Status', {
    resource: getStatusLambda,
    // Use "guid" field as input, output of the Lambda becomes the
    // entire state machine output.
    inputPath: '$.guid',
});

const definition = submitJob
    .next(waitX)
    .next(getStatus)
    .next(new stepfunctions.Choice(this, 'Job Complete?')
        // Look at the "status" field
        .when(stepfunctions.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
        .when(stepfunctions.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
        .otherwise(waitX));

new stepfunctions.StateMachine(this, 'StateMachine', {
    definition,
    timeoutSec: 300
});
```

### .NET Example

```csharp
var submitLambda = new Function(this, "SubmitLambda", new FunctionProps
{
    // ...
});

var getStatusLambda = new Function(this, "CheckLambda", new FunctionProps
{
    // ...
});

var submitJob = new Task(this, "Submit Job", new TaskProps
{
    Resource = submitLambda,
    ResultPath = "$.guid"
});

var waitX = new Wait(this, "Wait X Seconds", new WaitProps
{
    SecondsPath = "$.wait_time"
});

var getStatus = new Task(this, "Get Job Status", new TaskProps
{
    Resource = getStatusLambda,
    InputPath = "$.guid",
    ResultPath = "$.status"
});

var jobFailed = new Fail(this, "Job Failed", new FailProps
{
    Cause = "AWS Batch Job Failed",
    Error = "DescribeJob returned FAILED"
});

var finalStatus = new Task(this, "Get Final Job Status", new TaskProps
{
    Resource = getStatusLambda,
    // Use "guid" field as input, output of the Lambda becomes the
    // entire state machine output.
    InputPath = "$.guid"
});

var definition = submitJob
    .Next(waitX)
    .Next(getStatus)
    .Next(new Choice(this, "Job Complete?", new ChoiceProps())
        .When(Amazon.CDK.AWS.StepFunctions.Condition.StringEquals("$.status", "FAILED"), jobFailed)
        .When(Amazon.CDK.AWS.StepFunctions.Condition.StringEquals("$.status", "SUCCEEDED"), finalStatus)
        .Otherwise(waitX));

new StateMachine(this, "StateMachine", new StateMachineProps
{
    Definition = definition,
    TimeoutSec = 300
});
```

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

* `Task`
* `Pass`
* `Wait`
* `Choice`
* `Parallel`
* `Succeed`
* `Fail`

An arbitrary JSON object (specified at execution start) is passed from state to
state and transformed during the execution of the workflow. For more
information, see the States Language spec.

### Task

A `Task` represents some work that needs to be done. It takes a `resource`
property that is either a Lambda `Function` or a Step Functions `Activity`
(A Lambda Function runs your task's code on AWS Lambda, whereas an `Activity`
is used to run your task's code on an arbitrary compute fleet you manage).

```ts
const task = new stepfunctions.Task(this, 'Invoke The Lambda', {
    resource: myLambda,
    inputPath: '$.input',
    timeoutSeconds: 300,
});

// Add a retry policy
task.addRetry({
    intervalSeconds: 5,
    maxAttempts: 10
});

// Add an error handler
task.addCatch(errorHandlerState);

// Set the next state
task.next(nextState);
```

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
    timestampPath: '$.triggerTime',
});

// Set the next state
wait.next(startTheWork);
```

### Choice

A `Choice` state can take a differen path through the workflow based on the
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

## Activity

**Activities** represent work that is done on some non-Lambda worker pool. The
Step Functions workflow will submit work to this Activity, and a worker pool
that you run yourself, probably on EC2, will pull jobs from the Activity and
submit the results of individual jobs back.

You need the ARN to do so, so if you use Activities be sure to pass the Activity
ARN into your worker pool:

```ts
const activity = new stepfunctions.Activity(this, 'Activity');

// Read this Output from your application and use it to poll for work on
// the activity.
new cdk.Output(this, 'ActivityArn', { value: activity.activityArn });
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


## Future work

Contributions welcome:

- [ ] A single `LambdaTask` class that is both a `Lambda` and a `Task` in one
  might make for a nice API.
- [ ] Expression parser for Conditions.
- [ ] Simulate state machines in unit tests.
