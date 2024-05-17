# Event Targets for Amazon EventBridge

This library contains integration classes to send Amazon EventBridge to any
number of supported AWS Services. Instances of these classes should be passed
to the `rule.addTarget()` method.

Currently supported are:

- [Event Targets for Amazon EventBridge](#event-targets-for-amazon-eventbridge)
  - [Event retry policy and using dead-letter queues](#event-retry-policy-and-using-dead-letter-queues)
  - [Invoke a Lambda function](#invoke-a-lambda-function)
  - [Log an event into a LogGroup](#log-an-event-into-a-loggroup)
  - [Start a CodeBuild build](#start-a-codebuild-build)
  - [Start a CodePipeline pipeline](#start-a-codepipeline-pipeline)
  - [Start a StepFunctions state machine](#start-a-stepfunctions-state-machine)
  - [Queue a Batch job](#queue-a-batch-job)
  - [Invoke an API Gateway REST API](#invoke-an-api-gateway-rest-api)
  - [Invoke an API Destination](#invoke-an-api-destination)
  - [Invoke an AppSync GraphQL API](#invoke-an-appsync-graphql-api)
  - [Put an event on an EventBridge bus](#put-an-event-on-an-eventbridge-bus)
  - [Run an ECS Task](#run-an-ecs-task)
    - [Tagging Tasks](#tagging-tasks)
    - [Launch type for ECS Task](#launch-type-for-ecs-task)
    - [Assign public IP addresses to tasks](#assign-public-ip-addresses-to-tasks)
    - [Enable Amazon ECS Exec for ECS Task](#enable-amazon-ecs-exec-for-ecs-task)

See the README of the `aws-cdk-lib/aws-events` library for more information on
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
  runtime: lambda.Runtime.NODEJS_LATEST,
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
  maxEventAge: Duration.hours(2), // Optional: set the maxEventAge retry policy
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
  logEvent: targets.LogGroupTargetInput.fromObject({
    timestamp: events.EventField.fromPath('$.time'),
    message: events.EventField.fromPath('$.detail-type'),
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
  logEvent: targets.LogGroupTargetInput.fromObject({
    message: JSON.stringify({
      CustomField: 'CustomValue',
    }),
  }),
}));
```

The cloudwatch log event target will create an AWS custom resource internally which will default
to set `installLatestAwsSdk` to `true`. This may be problematic for CN partition deployment. To
workaround this issue, set `installLatestAwsSdk` to `false`.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
declare const logGroup: logs.LogGroup;
declare const rule: events.Rule;

rule.addTarget(new targets.CloudWatchLogGroup(logGroup, {
  installLatestAwsSdk: false,
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
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

const dlq = new sqs.Queue(this, 'DeadLetterQueue');

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});
const stateMachine = new sfn.StateMachine(this, 'SM', {
  definition: new sfn.Wait(this, 'Hello', { time: sfn.WaitTime.duration(Duration.seconds(10)) })
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
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as batch from 'aws-cdk-lib/aws-batch';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';

declare const vpc: ec2.Vpc;

const computeEnvironment = new batch.FargateComputeEnvironment(this, 'ComputeEnv', {
  vpc,
});

const jobQueue = new batch.JobQueue(this, 'JobQueue', {
  priority: 1,
  computeEnvironments: [
    {
      computeEnvironment,
      order: 1,
    },
  ],
});

const jobDefinition = new batch.EcsJobDefinition(this, 'MyJob', {
  container: new batch.EcsEc2ContainerDefinition(this, 'Container', {
    image: ecs.ContainerImage.fromRegistry('test-repo'),
    memory: cdk.Size.mebibytes(2048),
    cpu: 256,
  }),
});

const queue = new sqs.Queue(this, 'Queue');

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(Duration.hours(1)),
});

rule.addTarget(new targets.BatchJob(
  jobQueue.jobQueueArn,
  jobQueue,
  jobDefinition.jobDefinitionArn,
  jobDefinition,
  {
    deadLetterQueue: queue,
    event: events.RuleTargetInput.fromObject({ SomeParam: 'SomeValue' }),
    retryAttempts: 2,
    maxEventAge: Duration.hours(2),
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
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

const fn = new lambda.Function( this, 'MyFunc', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_LATEST,
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
  schedule: events.Schedule.rate(Duration.minutes(1)),
  targets: [new targets.ApiDestination(destination)],
});
```

You can also import an existing connection and destination
to create additional rules:

```ts
const connection = events.Connection.fromEventBusArn(
  this,
  'Connection',
  'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
  'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
);

const apiDestinationArn = 'arn:aws:events:us-east-1:123456789012:api-destination/DestinationName';
const destination = events.ApiDestination.fromApiDestinationAttributes(
  this,
  'Destination',
  { apiDestinationArn, connection },
);

const rule = new events.Rule(this, 'OtherRule', {
  schedule: events.Schedule.rate(Duration.minutes(10)),
  targets: [new targets.ApiDestination(destination)],
});
```

## Invoke an AppSync GraphQL API

Use the `AppSync` target to trigger an AppSync GraphQL API. You need to
create an `AppSync.GraphqlApi` configured with `AWS_IAM` authorization mode.

The code snippet below creates an AppSync GraphQL API target that is invoked every hour, calling the `publish` mutation.

```ts
import * as appsync from 'aws-cdk-lib/aws-appsync';

const api = new appsync.GraphqlApi(this, 'api', {
  name: 'api',
  definition: appsync.Definition.fromFile('schema.graphql'),
  authorizationConfig: {
    defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM }
  },
});

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(new targets.AppSync(api, {
  graphQLOperation: 'mutation Publish($message: String!){ publish(message: $message) { message } }',
  variables: events.RuleTargetInput.fromObject({
    message: 'hello world',
  }),
}));
```

You can pass an existing role with the proper permissions to be used for the target when the rule is triggered. The code snippet below uses an existing role and grants permissions to use the publish Mutation on the GraphQL API.

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const api = appsync.GraphqlApi.fromGraphqlApiAttributes(this, 'ImportedAPI', {
  graphqlApiId: '<api-id>',
  graphqlApiArn: '<api-arn>',
  graphQLEndpointArn: '<api-endpoint-arn>',
  visibility: appsync.Visibility.GLOBAL,
  modes: [appsync.AuthorizationType.IAM],
});

const rule = new events.Rule(this, 'Rule', { schedule: events.Schedule.rate(cdk.Duration.minutes(1)), });
const role = new iam.Role(this, 'Role', { assumedBy: new iam.ServicePrincipal('events.amazonaws.com') });

// allow EventBridge to use the `publish` mutation
api.grantMutation(role, 'publish');

rule.addTarget(new targets.AppSync(api, {
  graphQLOperation: 'mutation Publish($message: String!){ publish(message: $message) { message } }',
  variables: events.RuleTargetInput.fromObject({
    message: 'hello world',
  }),
  eventRole: role
}));
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

## Run an ECS Task

Use the `EcsTask` target to run an ECS Task.

The code snippet below creates a scheduled event rule that will run the task described in `taskDefinition` every hour.

### Tagging Tasks

By default, ECS tasks run from EventBridge targets will not have tags applied to
them. You can set the `propagateTags` field to propagate the tags set on the task
definition to the task initialized by the event trigger.

If you want to set tags independent of those applied to the TaskDefinition, you
can use the `tags` array. Both of these fields can be used together or separately
to set tags on the triggered task.

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

declare const cluster: ecs.ICluster;
declare const taskDefinition: ecs.TaskDefinition;

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(
  new targets.EcsTask({
    cluster: cluster,
    taskDefinition: taskDefinition,
    propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
    tags: [
      {
        key: 'my-tag',
        value: 'my-tag-value',
      },
    ],
  }),
);
```

### Launch type for ECS Task

By default, if `isEc2Compatible` for the `taskDefinition` is true, the EC2 type is used as
the launch type for the task, otherwise the FARGATE type.
If you want to override the default launch type, you can set the `launchType` property.

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

declare const cluster: ecs.ICluster;
declare const taskDefinition: ecs.TaskDefinition;

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  launchType: ecs.LaunchType.FARGATE,
}));
```

### Assign public IP addresses to tasks

You can set the `assignPublicIp` flag to assign public IP addresses to tasks.
If you want to detach the public IP address from the task, you have to set the flag `false`.
You can specify the flag `true` only when the launch type is set to FARGATE.

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

declare const cluster: ecs.ICluster;
declare const taskDefinition: ecs.TaskDefinition;

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(
  new targets.EcsTask({
    cluster,
    taskDefinition,
    assignPublicIp: true,
    subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
  }),
);
```

### Enable Amazon ECS Exec for ECS Task

If you use Amazon ECS Exec, you can run commands in or get a shell to a container running on an Amazon EC2 instance or on AWS Fargate.

```ts
import * as ecs from 'aws-cdk-lib/aws-ecs';

declare const cluster: ecs.ICluster;
declare const taskDefinition: ecs.TaskDefinition;

const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.rate(cdk.Duration.hours(1)),
});

rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  taskCount: 1,
  containerOverrides: [{
    containerName: 'TheContainer',
    command: ['echo', events.EventField.fromPath('$.detail.event')],
  }],
  enableExecuteCommand: true,
}));
```
