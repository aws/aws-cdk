# Event Targets for Amazon EventBridge


This library contains integration classes to send Amazon EventBridge to any
number of supported AWS Services. Instances of these classes should be passed
to the `rule.addTarget()` method.

Currently supported are:

* [Start a CodeBuild build](#start-a-codebuild-build)
* [Start a CodePipeline pipeline](#start-a-codepipeline-pipeline)
* Run an ECS task
* [Invoke a Lambda function](#invoke-a-lambda-function)
* [Invoke a API Gateway REST API](#invoke-an-api-gateway-rest-api)
* Publish a message to an SNS topic
* Send a message to an SQS queue
* [Start a StepFunctions state machine](#start-a-stepfunctions-state-machine)
* [Queue a Batch job](#queue-a-batch-job)
* Make an AWS API call
* Put a record to a Kinesis stream
* [Log an event into a LogGroup](#log-an-event-into-a-loggroup)
* Put a record to a Kinesis Data Firehose stream
* [Put an event on an EventBridge bus](#put-an-event-on-an-eventbridge-bus)
* [Send an event to EventBridge API Destination](#invoke-an-api-destination)

See the README of the `@aws-cdk/aws-events` library for more information on
EventBridge.

## Event retry policy and using dead-letter queues

The Codebuild, CodePipeline, Lambda, StepFunctions, LogGroup, SQSQueue, SNSTopic and ECSTask targets support attaching a [dead letter queue and setting retry policies](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html). See the [lambda example](#invoke-a-lambda-function).
Use [escape hatches](https://docs.aws.amazon.com/cdk/latest/guide/cfn_layer.html) for the other target types.

## Invoke a Lambda function

Use the `LambdaFunction` target to invoke a lambda function.

The code snippet below creates an event rule with a Lambda function as a target
triggered for every events from `aws.ec2` source. You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html).

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

const fn = new lambda.Function(this, 'MyFunc', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = handler.toString()`),
});

const rule = new events.Rule(this, 'rule', {
  eventPattern: {
    source: ["aws.ec2"],
  },
});

const queue = new sqs.Queue(this, 'Queue');

rule.addTarget(new targets.LambdaFunction(fn, {
  deadLetterQueue: queue, // Optional: add a dead letter queue
  maxEventAge: cdk.Duration.hours(2), // Optional: set the maxEventAge retry policy
  retryAttempts: 2, // Optional: set the max number of retry attempts
}));
```

## Log an event into a LogGroup

Use the `LogGroup` target to log your events in a CloudWatch LogGroup.

For example, the following code snippet creates an event rule with a CloudWatch LogGroup as a target.
Every events sent from the `aws.ec2` source will be sent to the CloudWatch LogGroup.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const logGroup = new logs.LogGroup(this, 'MyLogGroup', {
  logGroupName: 'MyLogGroup',
});

const rule = new events.Rule(this, 'rule', {
  eventPattern: {
    source: ["aws.ec2"],
  },
});

rule.addTarget(new targets.CloudWatchLogGroup(logGroup));
```

A rule target input can also be specified to modify the event that is sent to the log group.
Unlike other event targets, CloudWatchLogs requires a specific input template format.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
declare const logGroup: logs.LogGroup;
declare const rule: events.Rule;

rule.addTarget(new targets.CloudWatchLogGroup(logGroup, {
  logEvent: targets.LogGroupTargetInput({
    timestamp: events.EventField.from('$.time'),
    message: events.EventField.from('$.detail-type'),
  }),
}));
```

If you want to use static values to overwrite the `message` make sure that you provide a `string`
value.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
declare const logGroup: logs.LogGroup;
declare const rule: events.Rule;

rule.addTarget(new targets.CloudWatchLogGroup(logGroup, {
  logEvent: targets.LogGroupTargetInput({
    message: JSON.stringify({
	  CustomField: 'CustomValue',
	}),
  }),
}));
```

## Start a CodeBuild build

Use the `CodeBuildProject` target to trigger a CodeBuild project.

The code snippet below creates a CodeCommit repository that triggers a CodeBuild project
on commit to the master branch. You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html).

```ts
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

const repo = new codecommit.Repository(this, 'MyRepo', {
  repositoryName: 'aws-cdk-codebuild-events',
});

const project = new codebuild.Project(this, 'MyProject', {
  source: codebuild.Source.codeCommit({ repository: repo }),
});

const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue');

// trigger a build when a commit is pushed to the repo
const onCommitRule = repo.onCommit('OnCommit', {
  target: new targets.CodeBuildProject(project, {
    deadLetterQueue: deadLetterQueue,
  }),
  branches: ['master'],
});
```

## Start a CodePipeline pipeline

Use the `CodePipeline` target to trigger a CodePipeline pipeline.

The code snippet below creates a CodePipeline pipeline that is triggered every hour

```ts
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';

const pipeline = new codepipeline.Pipeline(this, 'Pipeline');

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.expression('rate(1 hour)'),
});

rule.addTarget(new targets.CodePipeline(pipeline));
```

## Start a StepFunctions state machine

Use the `SfnStateMachine` target to trigger a State Machine.

The code snippet below creates a Simple StateMachine that is triggered every minute with a
dummy object as input.
You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html)
to the target.

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const dlq = new sqs.Queue(this, 'DeadLetterQueue');

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});
const stateMachine = new sfn.StateMachine(this, 'SM', {
  definition: new sfn.Wait(this, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })
});

rule.addTarget(new targets.SfnStateMachine(stateMachine, {
  input: events.RuleTargetInput.fromObject({ SomeParam: 'SomeValue' }),
  deadLetterQueue: dlq,
  role: role
}));
```

## Queue a Batch job

Use the `BatchJob` target to queue a Batch job.

The code snippet below creates a Simple JobQueue that is triggered every hour with a
dummy object as input.
You can optionally attach a
[dead letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html)
to the target.

```ts
import * as batch from 'aws-cdk-lib/aws-batch';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';

const jobQueue = new batch.JobQueue(this, 'MyQueue', {
  computeEnvironments: [
    {
      computeEnvironment: new batch.ComputeEnvironment(this, 'ComputeEnvironment', {
        managed: false,
      }),
      order: 1,
    },
  ],
});

const jobDefinition = new batch.JobDefinition(this, 'MyJob', {
  container: {
    image: ContainerImage.fromRegistry('test-repo'),
  },
});

const queue = new sqs.Queue(this, 'Queue');

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(new targets.BatchJob(
  jobQueue.jobQueueArn,
  jobQueue,
  jobDefinition.jobDefinitionArn,
  jobDefinition, {
    deadLetterQueue: queue,
    event: events.RuleTargetInput.fromObject({ SomeParam: 'SomeValue' }),
    retryAttempts: 2,
    maxEventAge: cdk.Duration.hours(2),
  },
));
```

## Invoke an API Gateway REST API

Use the `ApiGateway` target to trigger a REST API.

The code snippet below creates a Api Gateway REST API that is invoked every hour.

```ts
import * as api from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

const fn = new lambda.Function( this, 'MyFunc', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromInline( 'exports.handler = e => {}' ),
} );

const restApi = new api.LambdaRestApi( this, 'MyRestAPI', { handler: fn } );

const dlq = new sqs.Queue(this, 'DeadLetterQueue');

rule.addTarget(
  new targets.ApiGateway( restApi, {
    path: '/*/test',
    method: 'GET',
    stage:  'prod',
    pathParameterValues: ['path-value'],
    headerParameters: {
      Header1: 'header1',
    },
    queryStringParameters: {
      QueryParam1: 'query-param-1',
    },
    deadLetterQueue: dlq
  } ),
)
```

## Invoke an API Destination

Use the `targets.ApiDestination` target to trigger an external API. You need to
create an `events.Connection` and `events.ApiDestination` as well.

The code snippet below creates an external destination that is invoked every hour.

```ts
const connection = new events.Connection(this, 'Connection', {
  authorization: events.Authorization.apiKey('x-api-key', SecretValue.secretsManager('ApiSecretName')),
  description: 'Connection with API Key x-api-key',
});

const destination = new events.ApiDestination(this, 'Destination', {
  connection,
  endpoint: 'https://example.com',
  description: 'Calling example.com with API key x-api-key',
});

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  targets: [new targets.ApiDestination(destination)],
});
```

## Put an event on an EventBridge bus

Use the `EventBus` target to route event to a different EventBus.

The code snippet below creates the scheduled event rule that route events to an imported event bus.

```ts
const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.expression('rate(1 minute)'),
});

rule.addTarget(new targets.EventBus(
  events.EventBus.fromEventBusArn(
    this,
    'External',
    `arn:aws:events:eu-west-1:999999999999:event-bus/test-bus`,
  ),
));
```
