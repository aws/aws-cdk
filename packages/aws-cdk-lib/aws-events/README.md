# Amazon EventBridge Construct Library


Amazon EventBridge delivers a near real-time stream of system events that
describe changes in AWS resources. For example, an AWS CodePipeline emits the
[State
Change](https://docs.aws.amazon.com/eventbridge/latest/userguide/event-types.html#codepipeline-event-type)
event when the pipeline changes its state.

* __Events__: An event indicates a change in your AWS environment. AWS resources
  can generate events when their state changes. For example, Amazon EC2
  generates an event when the state of an EC2 instance changes from pending to
  running, and Amazon EC2 Auto Scaling generates events when it launches or
  terminates instances. AWS CloudTrail publishes events when you make API calls.
  You can generate custom application-level events and publish them to
  EventBridge. You can also set up scheduled events that are generated on
  a periodic basis. For a list of services that generate events, and sample
  events from each service, see [EventBridge Event Examples From Each
  Supported
  Service](https://docs.aws.amazon.com/eventbridge/latest/userguide/event-types.html).
* __Targets__: A target processes events. Targets can include Amazon EC2
  instances, AWS Lambda functions, Kinesis streams, Amazon ECS tasks, Step
  Functions state machines, Amazon SNS topics, Amazon SQS queues, Amazon CloudWatch LogGroups, and built-in
  targets. A target receives events in JSON format.
* __Rules__: A rule matches incoming events and routes them to targets for
  processing. A single rule can route to multiple targets, all of which are
  processed in parallel. Rules are not processed in a particular order. This
  enables different parts of an organization to look for and process the events
  that are of interest to them. A rule can customize the JSON sent to the
  target, by passing only certain parts or by overwriting it with a constant.
* __EventBuses__: An event bus can receive events from your own custom applications
  or it can receive events from applications and services created by AWS SaaS partners.
  See [Creating an Event Bus](https://docs.aws.amazon.com/eventbridge/latest/userguide/create-event-bus.html).

## Rule

The `Rule` construct defines an EventBridge rule which monitors an
event based on an [event
pattern](https://docs.aws.amazon.com/eventbridge/latest/userguide/filtering-examples-structure.html)
and invoke __event targets__ when the pattern is matched against a triggered
event. Event targets are objects that implement the `IRuleTarget` interface.

Normally, you will use one of the `source.onXxx(name[, target[, options]]) ->
Rule` methods on the event source to define an event rule associated with
the specific activity. You can targets either via props, or add targets using
`rule.addTarget`.

For example, to define an rule that triggers a CodeBuild project build when a
commit is pushed to the "master" branch of a CodeCommit repository:

```ts
declare const repo: codecommit.Repository;
declare const project: codebuild.Project;

const onCommitRule = repo.onCommit('OnCommit', {
  target: new targets.CodeBuildProject(project),
  branches: ['master']
});
```

You can add additional targets, with optional [input
transformer](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_InputTransformer.html)
using `eventRule.addTarget(target[, input])`. For example, we can add a SNS
topic target which formats a human-readable message for the commit.

For example, this adds an SNS topic as a target:

```ts
declare const onCommitRule: events.Rule;
declare const topic: sns.Topic;

onCommitRule.addTarget(new targets.SnsTopic(topic, {
  message: events.RuleTargetInput.fromText(
    `A commit was pushed to the repository ${codecommit.ReferenceEvent.repositoryName} on branch ${codecommit.ReferenceEvent.referenceName}`
  )
}));
```

Or using an Object:

```ts
declare const onCommitRule: events.Rule;
declare const topic: sns.Topic;

onCommitRule.addTarget(new targets.SnsTopic(topic, {
  message: events.RuleTargetInput.fromObject(
    {
      DataType: `custom_${events.EventField.fromPath('$.detail-type')}`
    }
  )
}));
```

### Role
You can specify an IAM Role:

```ts
declare const role: iam.IRole;

new events.Rule(this, 'MyRule', {
  schedule: events.Schedule.cron({ minute: '0', hour: '4' }),
  role,
});
```

**Note**: If you're setting an event bus in another account as the target and that account granted permission to your account through an organization instead of directly by the account ID, you must specify a RoleArn with proper permissions in the Target structure, instead of here in this parameter.

### Matchers

To define a pattern, use the `Match` class, which provides a number of factory methods to declare
different logical predicates. For example, to match all S3 events for objects larger than 1024
bytes, stored using one of the storage classes Glacier, Glacier IR or Deep Archive and coming from
any region other than the AWS GovCloud ones:

```ts
const rule = new events.Rule(this, 'rule', {
  eventPattern: {
    detail: {
      object: {
        // Matchers may appear at any level
        size: events.Match.greaterThan(1024),
      },

      // 'OR' condition
      'source-storage-class': events.Match.anyOf(
        events.Match.prefix('GLACIER'),
        events.Match.exactString('DEEP_ARCHIVE'),
      ),
    },

    // If you prefer, you can use a low level array of strings, as directly consumed by EventBridge
    source: ['aws.s3'],

    region: events.Match.anythingButPrefix('us-gov'),
  },
});
```

Matches can also be made case-insensitive, or make use of wildcard matches. For example, to match
object create events for buckets whose name starts with `raw-`, for objects with key matching
the pattern `path/to/object/*.txt` and the requester ends with `.AMAZONAWS.COM`:

```ts
const rule = new events.Rule(this, 'rule', {
  eventPattern: {
    detail: {
      bucket: {
        name: events.Match.prefixEqualsIgnoreCase('raw-'),
      },

      object: {
        key: events.Match.wildcard('path/to/object/*.txt'),
      },

      requester: events.Match.suffixEqualsIgnoreCase('.AMAZONAWS.COM'),
    },
    detailType: events.Match.equalsIgnoreCase('object created'),
  },
});
```

The "anything but" matchers allow you to specify multiple arguments. For example:

```ts
const rule = new events.Rule(this, 'rule', {
  eventPattern: {
    region: events.Match.anythingBut('us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'),

    detail: {
      bucket: {
        name: events.Match.anythingButPrefix('foo', 'bar', 'baz'),
      },

      object: {
        key: events.Match.anythingButSuffix('.gif', '.png', '.jpg'),
      },

      requester: events.Match.anythingButWildcard('*.amazonaws.com', '123456789012'),
    },
    detailType: events.Match.anythingButEqualsIgnoreCase('object created', 'object deleted'),
  },
});
```

## Scheduling

You can configure a Rule to run on a schedule (cron or rate).
Rate must be specified in minutes, hours or days.

The following example runs a task every day at 4am:

```ts fixture=basic
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { EcsTask } from 'aws-cdk-lib/aws-events-targets';
import { Cluster, TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Role } from 'aws-cdk-lib/aws-iam';

declare const cluster: Cluster;
declare const taskDefinition: TaskDefinition;
declare const role: Role;

const ecsTaskTarget = new EcsTask({ cluster, taskDefinition, role });

new Rule(this, 'ScheduleRule', {
 schedule: Schedule.cron({ minute: '0', hour: '4' }),
 targets: [ecsTaskTarget],
});
```

If you want to specify Fargate platform version, set `platformVersion` in EcsTask's props like the following example:

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
declare const role: iam.Role;

const platformVersion = ecs.FargatePlatformVersion.VERSION1_4;
const ecsTaskTarget = new targets.EcsTask({ cluster, taskDefinition, role, platformVersion });
```

## Event Targets

The `aws-cdk-lib/aws-events-targets` module includes classes that implement the `IRuleTarget`
interface for various AWS services.

See the README of the [`aws-cdk-lib/aws-events-targets`](https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-events-targets) module for more information on supported targets.

### Cross-account and cross-region targets

It's possible to have the source of the event and a target in separate AWS accounts and regions:

```ts nofixture
import { App, Stack } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const app = new App();

const account1 = '11111111111';
const account2 = '22222222222';

const stack1 = new Stack(app, 'Stack1', { env: { account: account1, region: 'us-west-1' } });
const repo = new codecommit.Repository(stack1, 'Repository', {
  repositoryName: 'myrepository',
});

const stack2 = new Stack(app, 'Stack2', { env: { account: account2, region: 'us-east-1' } });
const project = new codebuild.Project(stack2, 'Project', {
  // ...
});

repo.onCommit('OnCommit', {
  target: new targets.CodeBuildProject(project),
});
```

In this situation, the CDK will wire the 2 accounts together:

* It will generate a rule in the source stack with the event bus of the target account as the target
* It will generate a rule in the target stack, with the provided target
* It will generate a separate stack that gives the source account permissions to publish events
  to the event bus of the target account in the given region,
  and make sure its deployed before the source stack

For more information, see the
[AWS documentation on cross-account events](https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html).

## Archiving

It is possible to archive all or some events sent to an event bus. It is then possible to [replay these events](https://aws.amazon.com/blogs/aws/new-archive-and-replay-events-with-amazon-eventbridge/).

```ts
const bus = new events.EventBus(this, 'bus', {
  eventBusName: 'MyCustomEventBus',
  description: 'MyCustomEventBus',
});

bus.archive('MyArchive', {
  archiveName: 'MyCustomEventBusArchive',
  description: 'MyCustomerEventBus Archive',
  eventPattern: {
    account: [Stack.of(this).account],
  },
  retention: Duration.days(365),
});
```

## Dead-Letter Queue for EventBus

It is possible to configure a [Dead Letter Queue for an EventBus](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-event-delivery.html#eb-rule-dlq). This is useful when you want to capture events that could not be delivered to any of the targets.

To configure a Dead Letter Queue for an EventBus, you can use the `deadLetterQueue` property of the `EventBus` construct.

```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';

const dlq = new sqs.Queue(this, 'DLQ');

const bus = new events.EventBus(this, 'Bus', {
  deadLetterQueue: dlq,
});
```

## Granting PutEvents to an existing EventBus

To import an existing EventBus into your CDK application, use `EventBus.fromEventBusArn`, `EventBus.fromEventBusAttributes`
or `EventBus.fromEventBusName` factory method.

Then, you can use the `grantPutEventsTo` method to grant `event:PutEvents` to the eventBus.

```ts
declare const lambdaFunction: lambda.Function;

const eventBus = events.EventBus.fromEventBusArn(this, 'ImportedEventBus', 'arn:aws:events:us-east-1:111111111:event-bus/my-event-bus');

// now you can just call methods on the eventbus
eventBus.grantPutEventsTo(lambdaFunction);
```

## Use a customer managed key

To use a customer managed key for events on the event bus, use the `kmsKey` attribute.

```ts
import * as kms from 'aws-cdk-lib/aws-kms';

declare const kmsKey: kms.IKey;

new events.EventBus(this, 'Bus', {
  kmsKey,
});
```

To use a customer managed key for an archive, use the `kmsKey` attribute. 

Note: When you attach a customer managed key to either an EventBus or an Archive, a policy that allows EventBridge to interact with your resource will be added. 

```ts
import * as kms from 'aws-cdk-lib/aws-kms';
import { Archive, EventBus } from 'aws-cdk-lib/aws-events';

const stack = new Stack();

declare const kmsKey: kms.IKey;

const eventBus = new EventBus(stack, 'Bus');

const archive = new Archive(stack, 'Archive', {
  kmsKey: kmsKey,
  sourceEventBus: eventBus,
  eventPattern: {
    source: ['aws.ec2']
  },
});
```

To enable archives or schema discovery on an event bus, customers has the choice of using either an AWS owned key or a customer managed key.
For more information, see [KMS key options for event bus encryption](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-encryption-at-rest-key-options.html).

## Configuring logging

To configure logging for an Event Bus, leverage the LogConfig property. It allows different level of logging (NONE, INFO, TRACE, ERROR) and wether to include details or not.

```ts
import { EventBus, IncludeDetail, Level } from 'aws-cdk-lib/aws-events';

const bus =  new EventBus(this, 'Bus', {
      logConfig: {
        includeDetail: IncludeDetail.FULL,
        level: Level.TRACE,
      },
    });
```

See more [Specifying event bus log level](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus-logs.html#eb-event-bus-logs-level)
