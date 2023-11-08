# Amazon EventBridge Scheduler Construct Library
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

[Amazon EventBridge Scheduler](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-scheduler/) is a feature from Amazon EventBridge
that allows you to create, run, and manage scheduled tasks at scale. With EventBridge Scheduler, you can schedule one-time or recurrently tens 
of millions of tasks across many AWS services without provisioning or managing underlying infrastructure.

This library contains integration classes for Amazon EventBridge Scheduler to call any
number of supported AWS Services. 

The following targets are supported:

1. `targets.LambdaInvoke`: [Invoke an AWS Lambda function](#invoke-a-lambda-function))
2. `targets.StepFunctionsStartExecution`: [Start an AWS Step Function](#start-an-aws-step-function)
3. `targets.CodeBuildStartBuild`: [Start a CodeBuild job](#start-a-codebuild-job)

## Invoke a Lambda function

Use the `LambdaInvoke` target to invoke a lambda function.

The code snippet below creates an event rule with a Lambda function as a target
called every hour by Event Bridge Scheduler with custom payload. You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html).

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const fn = new lambda.Function(this, 'MyFunc', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    handler: 'index.handler',
    code: lambda.Code.fromInline(`exports.handler = handler.toString()`),
});

const dlq = new sqs.Queue(this, "DLQ", {
    queueName: 'MyDLQ',
});

const target = new targets.LambdaInvoke(fn, {
    deadLetterQueue: dlq,
    maxEventAge: Duration.minutes(1),
    retryAttempts: 3,
    input: ScheduleTargetInput.fromObject({
        'payload': 'useful'
    }),
});

const schedule = new Schedule(this, 'Schedule', {
    schedule: ScheduleExpression.rate(Duration.hours(1)),
    target
});
```

## Start an AWS Step Function

Use the `StepFunctionsStartExecution` target to start a new execution on a StepFunction.

The code snippet below creates an event rule with a Step Function as a target
called every hour by Event Bridge Scheduler with a custom payload.

```ts
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const payload = {
  Name: "MyParameter",
  Value: '🌥️',
};

const putParameterStep = new tasks.CallAwsService(this, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    "Name.$": '$.Name',
    "Value.$": '$.Value',
    Type: 'String',
    Overwrite: true,
  },
});

const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(putParameterStep)
});

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.hours(1)),
  target: new targets.StepFunctionsStartExecution(stateMachine, {
    input: ScheduleTargetInput.fromObject(payload),
  }),
});
```

## Start a CodeBuild job

Use the `CodeBuildStartBuild` target to start a new build run on a CodeBuild project.

The code snippet below creates an event rule with a CodeBuild project as target which is
called every hour by Event Bridge Scheduler.

```ts
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

declare const project: codebuild.Project;

new Schedule(this, 'Schedule', {
  schedule: ScheduleExpression.rate(Duration.minutes(60)),
  target: new targets.CodeBuildStartBuild(project),
});
```
