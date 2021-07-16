## Integrations

Many AWS services offer “integrations” with other services. For example, AWS
CodePipeline has actions that can trigger AWS Lambda functions, ECS tasks,
CodeBuild projects and more. AWS Lambda can be triggered by a variety of event
sources, AWS CloudWatch event rules can trigger many types of targets, SNS can
publish to SQS and Lambda, etc, etc.

> See [aws-cdk#1743](https://github.com/awslabs/aws-cdk/issues/1743) for a
  discussion on the various design options.

AWS integrations normally have a single **central** service and a set of
**consumed** services. For example, AWS CodePipeline is the central service and
consumes multiple services that can be used as pipeline actions. AWS Lambda is
the central service and can be triggered by multiple event sources.

Integrations are an abstract concept, not necessarily a specific mechanism. For
example, each AWS Lambda event source is implemented in a different way (SNS,
Bucket notifications, CloudWatch events, etc), but conceptually, *some* users
like to think about AWS Lambda as the “center”. It is also completely legitimate
to have multiple ways to connect two services on AWS. To trigger an AWS Lambda
function from an SNS topic, you could either use the integration or the SNS APIs
directly.

Integrations should be modeled using an **interface** (i.e. **IEventSource**)
exported in the API of the central module (e.g. “aws-lambda”) and implemented by
classes in the integrations module (“aws-lambda-event-sources”)
[_awslint:integrations-interface_].

```ts
// aws-lambda
interface IEventSource {
  bind(fn: IFunction): void;
}
```

A method “addXxx” should be defined on the construct interface and adhere to the
following rules _[awslint:integrations-add-method]:_

* Should accept any object that implements the integrations interface
* Should not return anything (void)
* Implementation should call “bind” on the integration object

```ts
interface IFunction extends IResource {
  public addEventSource(eventSource: IEventSource) {
    eventSource.bind(this);
  }
}
```

An optional array prop should allow declaratively applying integrations (sugar
to calling “addXxx”):

```ts
interface FunctionProps {
  eventSources?: IEventSource[];
}
```

Lastly, to ease discoverability and maintain a sane dependency graphs, all
integrations for a certain service should be mastered in a single secondary
module named aws-*xxx*-*yyy* (where *xxx* is the service name and *yyy* is the
integration name). For example, **aws-s3-notifications**,
**aws-lambda-event-sources**, **aws-codepipeline-actions**. All implementations
of the integration interface should reside in a single module
_[awslint:integrations-in-single-module]_.

```ts
// aws-lambda-event-sources
class DynamoEventSource implements IEventSource {
  constructor(table: dynamodb.ITable, options?: DynamoEventSourceOptions) { ... }

  public bind(fn: IFunction) {
    // ...do your magic
  }
}
```

When integration classes define new constructs in **bind**, they should be aware
that they are adding into a scope they don't fully control. This means they
should find a way to ensure that construct IDs do not conflict. This is a
domain-specific problem.