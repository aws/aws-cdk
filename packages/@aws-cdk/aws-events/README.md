## AWS CloudWatch Events Construct Library

Amazon CloudWatch Events delivers a near real-time stream of system events that
describe changes in AWS resources. For example, an AWS CodePipeline emits the
[State
Change](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#codepipeline_event_type)
event when the pipeline changes it's state.

* __Events__: An event indicates a change in your AWS environment. AWS resources
  can generate events when their state changes. For example, Amazon EC2
  generates an event when the state of an EC2 instance changes from pending to
  running, and Amazon EC2 Auto Scaling generates events when it launches or
  terminates instances. AWS CloudTrail publishes events when you make API calls.
  You can generate custom application-level events and publish them to
  CloudWatch Events. You can also set up scheduled events that are generated on
  a periodic basis. For a list of services that generate events, and sample
  events from each service, see [CloudWatch Events Event Examples From Each
  Supported
  Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html).
* __Targets__: A target processes events. Targets can include Amazon EC2
  instances, AWS Lambda functions, Kinesis streams, Amazon ECS tasks, Step
  Functions state machines, Amazon SNS topics, Amazon SQS queues, and built-in
  targets. A target receives events in JSON format.
* __Rules__: A rule matches incoming events and routes them to targets for
  processing. A single rule can route to multiple targets, all of which are
  processed in parallel. Rules are not processed in a particular order. This
  enables different parts of an organization to look for and process the events
  that are of interest to them. A rule can customize the JSON sent to the
  target, by passing only certain parts or by overwriting it with a constant.

The `EventRule` construct defines a CloudWatch events rule which monitors an
event based on an [event
pattern](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html)
and invoke __event targets__ when the pattern is matched against a triggered
event. Event targets are objects that implement the `IEventTarget` interface.

Normally, you will use one of the `source.onXxx(name[, target[, options]]) ->
EventRule` methods on the event source to define an event rule associated with
the specific activity. You can targets either via props, or add targets using
`rule.addTarget`.

For example, to define an rule that triggers a CodeBuild project build when a
commit is pushed to the "master" branch of a CodeCommit repository:

```ts
const onCommitRule = repo.onCommit('OnCommitToMaster', project, 'master');
```

You can add additional targets, with optional [input
transformer](https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_InputTransformer.html)
using `eventRule.addTarget(target[, input])`. For example, we can add a SNS
topic target which formats a human-readable message for the commit.

For example, this adds an SNS topic as a target:

```ts
onCommitRule.addTarget(topic, {
    template: 'A commit was pushed to the repository <repo> on branch <branch>',
    pathsMap: {
        branch: '$.detail.referenceName',
        repo: '$.detail.repositoryName'
    }
});
```
