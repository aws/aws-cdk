## AWS Step Functions Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

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
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');

const submitLambda = new lambda.Function(this, 'SubmitLambda', { ... });
const getStatusLambda = new lambda.Function(this, 'CheckLambda', { ... });

const submitJob = new sfn.Task(this, 'Submit Job', {
    task: new tasks.InvokeFunction(submitLambda),
    // Put Lambda's result here in the execution's state object
    resultPath: '$.guid',
});

const waitX = new sfn.Wait(this, 'Wait X Seconds', {
    duration: sfn.WaitDuration.secondsPath('$.wait_time'),
});

const getStatus = new sfn.Task(this, 'Get Job Status', {
    task: new tasks.InvokeFunction(getStatusLambda),
    // Pass just the field named "guid" into the Lambda, put the
    // Lambda's result in a field called "status"
    inputPath: '$.guid',
    resultPath: '$.status',
});

const jobFailed = new sfn.Fail(this, 'Job Failed', {
    cause: 'AWS Batch Job Failed',
    error: 'DescribeJob returned FAILED',
});

const finalStatus = new sfn.Task(this, 'Get Final Job Status', {
    task: new tasks.InvokeFunction(getStatusLambda),
    // Use "guid" field as input, output of the Lambda becomes the
    // entire state machine output.
    inputPath: '$.guid',
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

A `Task` represents some work that needs to be done. The exact work to be
done is determine by a class that implements `IStepFunctionsTask`, a collection
of which can be found in the `@aws-cdk/aws-stepfunctions-tasks` package. A
couple of the tasks available are:

* `tasks.InvokeActivity` -- start an Activity (Activities represent a work
  queue that you poll on a compute fleet you manage yourself)
* `tasks.InvokeFunction` -- invoke a Lambda function with function ARN
* `tasks.RunLambdaTask` -- call Lambda as integrated service with magic ARN
* `tasks.PublishToTopic` -- publish a message to an SNS topic
* `tasks.SendToQueue` -- send a message to an SQS queue
* `tasks.RunEcsFargateTask`/`ecs.RunEcsEc2Task` -- run a container task,
  depending on the type of capacity.
* `tasks.SagemakerTrainTask` -- run a SageMaker training job
* `tasks.SagemakerTransformTask` -- run a SageMaker transform job
* `tasks.StartExecution` -- call StartExecution to a state machine of Step Functions
* `tasks.EvalTask` -- evaluate an expression referencing state paths

Except `tasks.InvokeActivity` and `tasks.InvokeFunction`, the [service integration
pattern](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html)
(`integrationPattern`) are supposed to be given as parameter when customers want
to call integrated services within a Task state. The default value is `FIRE_AND_FORGET`.

#### Task parameters from the state json

Many tasks take parameters. The values for those can either be supplied
directly in the workflow definition (by specifying their values), or at
runtime by passing a value obtained from the static functions on `Data`,
such as `Data.stringAt()`.

If so, the value is taken from the indicated location in the state JSON,
similar to (for example) `inputPath`.

#### Lambda example - InvokeFunction

```ts
const task = new sfn.Task(this, 'Invoke1', {
    task: new tasks.InvokeFunction(myLambda),
    inputPath: '$.input',
    timeout: Duration.minutes(5),
});

// Add a retry policy
task.addRetry({
    interval: Duration.seconds(5),
    maxAttempts: 10
});

// Add an error handler
task.addCatch(errorHandlerState);

// Set the next state
task.next(nextState);
```

#### Lambda example - RunLambdaTask

```ts
  const task = new sfn.Task(stack, 'Invoke2', {
    task: new tasks.RunLambdaTask(myLambda, {
      integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: {
        token: sfn.Context.taskToken
      }
    })
  });
```

#### SNS example

```ts
import sns = require('@aws-cdk/aws-sns');

// ...

const topic = new sns.Topic(this, 'Topic');

// Use a field from the execution data as message.
const task1 = new sfn.Task(this, 'Publish1', {
    task: new tasks.PublishToTopic(topic, {
        integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
        message: TaskInput.fromDataAt('$.state.message'),
    })
});

// Combine a field from the execution data with
// a literal object.
const task2 = new sfn.Task(this, 'Publish2', {
    task: new tasks.PublishToTopic(topic, {
        message: TaskInput.fromObject({
            field1: 'somedata',
            field2: Data.stringAt('$.field2'),
        })
    })
});
```

#### SQS example

```ts
import sqs = require('@aws-cdk/aws-sqs');

// ...

const queue = new sns.Queue(this, 'Queue');

// Use a field from the execution data as message.
const task1 = new sfn.Task(this, 'Send1', {
    task: new tasks.SendToQueue(queue, {
        messageBody: TaskInput.fromDataAt('$.message'),
        // Only for FIFO queues
        messageGroupId: '1234'
    })
});

// Combine a field from the execution data with
// a literal object.
const task2 = new sfn.Task(this, 'Send2', {
    task: new tasks.SendToQueue(queue, {
        messageBody: TaskInput.fromObject({
            field1: 'somedata',
            field2: Data.stringAt('$.field2'),
        }),
        // Only for FIFO queues
        messageGroupId: '1234'
    })
});
```

#### ECS example

```ts
import ecs = require('@aws-cdk/aws-ecs');

// See examples in ECS library for initialization of 'cluster' and 'taskDefinition'

const fargateTask = new ecs.RunEcsFargateTask({
  cluster,
  taskDefinition,
  containerOverrides: [
    {
      containerName: 'TheContainer',
      environment: [
        {
          name: 'CONTAINER_INPUT',
          value: Data.stringAt('$.valueFromStateData')
        }
      ]
    }
  ]
});

fargateTask.connections.allowToDefaultPort(rdsCluster, 'Read the database');

const task = new sfn.Task(this, 'CallFargate', {
    task: fargateTask
});
```

#### SageMaker Transform example

```ts
const transformJob = new tasks.SagemakerTransformTask(
    transformJobName: "MyTransformJob",
    modelName: "MyModelName",
    role,
    transformInput: {
        transformDataSource: {
            s3DataSource: {
                s3Uri: 's3://inputbucket/train',
                s3DataType: S3DataType.S3Prefix,
            }
        }
    },
    transformOutput: {
        s3OutputPath: 's3://outputbucket/TransformJobOutputPath',
    },
    transformResources: {
        instanceCount: 1,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
});

const task = new sfn.Task(this, 'Batch Inference', {
    task: transformJob
});
```

#### Step Functions example

```ts
// Define a state machine with one Pass state
const child = new sfn.StateMachine(stack, 'ChildStateMachine', {
    definition: sfn.Chain.start(new sfn.Pass(stack, 'PassState')),
});

// Include the state machine in a Task state with callback pattern
const task = new sfn.Task(stack, 'ChildTask', {
  task: new tasks.ExecuteStateMachine(child, {
    integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
    input: {
      token: sfn.Context.taskToken,
      foo: 'bar'
    },
    name: 'MyExecutionName'
  })
});

// Define a second state machine with the Task state above
new sfn.StateMachine(stack, 'ParentStateMachine', {
  definition: task
});
```

#### Eval example
Use the `EvalTask` to perform simple operations referencing state paths. The
`expression` referenced in the task will be evaluated in a Lambda function
(`eval()`). This allows to write less Lambda runtime code for simple operations.

Example: convert a wait time from milliseconds to seconds, concat this in a message and wait
```ts
const convertToSeconds = new sfn.Task(this, 'Convert to seconds', {
  task: new tasks.EvalTask({ expression: '$.waitMilliseconds / 1000' }),
  resultPath: '$.waitSeconds'
});

const createMessage = new sfn.Task(this, 'Create message', {
  task: new tasks.EvalTask({ expression: '`Now waiting ${$.waitSeconds} seconds...`'}),
  resultPath: '$.message'
});

const publishMessage = new sfn.Task(this, 'Publish message', {
  task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromDataAt('$.message'),
  }),
  resultPath: '$.sns'
});

const wait = new sfn.Wait(this, 'Wait', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds')
});

new sfn.StateMachine(this, 'StateMachine', {
  definition: convertToSeconds
    .next(createMessage)
    .next(publishMessage)
    .next(wait)
});
```

The `EvalTask` supports a `runtime` prop to specify the Lambda runtime to use
to evaluate the expression. Currently, the only runtime supported is
`lambda.Runtime.NODEJS_10_X`.


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


## Future work

Contributions welcome:

- [ ] A single `LambdaTask` class that is both a `Lambda` and a `Task` in one
  might make for a nice API.
- [ ] Expression parser for Conditions.
- [ ] Simulate state machines in unit tests.
