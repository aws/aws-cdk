# Amazon EventBridge Pipes Targets Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->


EventBridge Pipes Targets let you create a target for a EventBridge Pipe.

For more details see the service documentation:

[Documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html)

## Targets

Pipe targets are the end point of a EventBridge Pipe.

The following targets are supported:

1. `targets.SqsTarget`: [Send event source to a Queue](#amazon-sqs)
2. `targets.SfnStateMachine`: [Invoke a State Machine from an event source](#aws-step-functions-state-machine)
3. `targets.LambdaFunction`: [Send event source to a Lambda Function](#aws-lambda-function)
4. `targets.ApiDestinationTarget`: [Send event source to an EventBridge API Destination](#amazon-eventbridge-api-destination)

### Amazon SQS

A SQS message queue can be used as a target for a pipe. Messages will be pushed to the queue.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeTarget = new targets.SqsTarget(targetQueue);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

The target input can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

const pipeTarget = new targets.SqsTarget(targetQueue,
    {
      inputTransformation: pipes.InputTransformation.fromObject( 
        { 
            "SomeKey": pipes.DynamicInput.fromEventPath('$.body')
        })
    }
);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

### AWS Step Functions State Machine

A State Machine can be used as a target for a pipe. The State Machine will be invoked with the (enriched) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine,{});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

Specifying the Invocation Type when the target State Machine is invoked:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine,
    {
      invocationType: targets.StateMachineInvocationType.FIRE_AND_FORGET,
    }
);


const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

The input to the target State Machine can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetStateMachine: sfn.IStateMachine;

const pipeTarget = new targets.SfnStateMachine(targetStateMachine,
    {
      inputTransformation: pipes.InputTransformation.fromObject({ body: '<$.body>' }),
      invocationType: targets.StateMachineInvocationType.FIRE_AND_FORGET,
    }
);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

### AWS Lambda Function

A Lambda Function can be used as a target for a pipe. The Lambda Function will be invoked with the (enriched) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction,{});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

The target Lambda Function is invoked synchronously by default. You can also choose to invoke the Lambda Function asynchronously by setting `invocationType` property to `FIRE_AND_FORGET`.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction, {
  invocationType: targets.LambdaFunctionInvocationType.FIRE_AND_FORGET,
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

The input to the target Lambda Function can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const targetFunction: lambda.IFunction;

const pipeTarget = new targets.LambdaFunction(targetFunction, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SomeSource(sourceQueue),
    target: pipeTarget
});
```

### Amazon EventBridge API Destination

An EventBridge API destination can be used as a target for a pipe. 
The API destination will receive the (enriched/filtered) source payload.

```ts
declare const sourceQueue: sqs.Queue;
declare const dest: events.ApiDestination;

const apiTarget = new targets.ApiDestinationTarget(dest);

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```

The input to the target API destination can be transformed:

```ts
declare const sourceQueue: sqs.Queue;
declare const dest: events.ApiDestination;

const apiTarget = new targets.ApiDestinationTarget(dest, {
  inputTransformation: pipes.InputTransformation.fromObject({ body: "👀" }),
});

const pipe = new pipes.Pipe(this, 'Pipe', {
    source: new SqsSource(sourceQueue),
    target: apiTarget,
});
```
