# Amazon EventBridge Pipes Enrichments Construct Library

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


EventBridge Pipes Enrichments let you create enrichments for an EventBridge Pipe.


For more details see the service documentation:

[Documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-enrichment.html)

## Pipe sources

Pipe enrichments are invoked prior to sending the events to a target of a EventBridge Pipe.

### Lambda function

A Lambda function can be used to enrich events of a pipe.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

declare const enrichmentFunction: lambda.Function;

const enrichment = new enrichments.LambdaEnrichment(enrichmentFunction);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SomeSource(sourceQueue),
  enrichment,
  target: new SomeTarget(targetQueue),
});
```

### Step Functions state machine

Step Functions state machine can be used to enrich events of a pipe.

**Note:** EventBridge Pipes only supports Express workflows invoked synchronously.

> Visit [Amazon EventBridge Pipes event enrichment](https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-enrichment.html) for more details.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

declare const enrichmentStateMachine: stepfunctions.StateMachine;

const enrichment = new enrichments.StepFunctionsEnrichment(enrichmentStateMachine);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SomeSource(sourceQueue),
  enrichment,
  target: new SomeTarget(targetQueue),
});
```

### API destination

API destination can be used to enrich events of a pipe.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

declare const apiDestination: events.ApiDestination;

const enrichment = new enrichments.ApiDestinationEnrichment(apiDestination);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SomeSource(sourceQueue),
  enrichment,
  target: new SomeTarget(targetQueue),
});
```

### API Gateway (REST API)

API Gateway can be used to enrich events of a pipe.
Pipes only supports API Gateway REST APIs. HTTP APIs are not supported.

```ts
declare const sourceQueue: sqs.Queue;
declare const targetQueue: sqs.Queue;

declare const restApi: apigateway.RestApi;

const enrichment = new enrichments.ApiGatewayEnrichment(restApi);

const pipe = new pipes.Pipe(this, 'Pipe', {
  source: new SomeSource(sourceQueue),
  enrichment,
  target: new SomeTarget(targetQueue),
});
```
