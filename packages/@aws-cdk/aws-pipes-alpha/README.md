# Amazon EventBridge Pipes Construct Library

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


EventBridge Pipes let you create source to target connections between several
aws services. While transporting messages from a source to a target the messages
can be filtered, transformed and enriched.

![diagram of pipes](https://d1.awsstatic.com/product-marketing/EventBridge/Product-Page-Diagram_Amazon-EventBridge-Pipes.cd7961854be4432d63f6158ffd18271d6c9fa3ec.png)

For more details see the service

[Documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html)

[Cloudformation docs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html)

## Pipe

[EventBridge Pipes](https://aws.amazon.com/blogs/aws/new-create-point-to-point-integrations-between-event-producers-and-consumers-with-amazon-eventbridge-pipes/)
is a fully managed service that enables point-to-point integrations between
event producers and consumers. Pipes can be used to connect several AWS services
to each other, or to connect AWS services to external services.

A Pipe has a Source and a Target. The source events can be filtered and enriched
before reaching the target.

## Example

```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipes from '@aws-cdk/aws-pipes-alpha';
import * as sources from '@aws-cdk/aws-pipes-sources-alpha';
import * as targets from '@aws-cdk/aws-pipes-targets-alpha';

const sourceQueue = new sqs.Queue(stack, 'SourceQueue');
const targetQueue = new sqs.Queue(stack, 'TargetQueue');


const pipe = new Pipe(stack, 'Pipe', {
  source: new sources.Queue(sourceQueue),
  target: new targets.Queue(targetQueue),
});
```

## Source

A source is a AWS Service that needs to be polled. The following Sources are
possible:

- [Amazon DynamoDB stream](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html)
- [Amazon Kinesis stream](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kinesis.html)
- [Amazon MQ broker](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-mq.html)
- [Amazon MSK stream](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-msk.html)
- [Self managed Apache Kafka stream](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kafka.html)
- [Amazon SQS queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-sqs.html)



## Filter

A Filter can be used to filter the events from the source before they are
forwarded to the enrichment step. Multiple filter expressions are possible. If
one of the filter expressions matches the event is forwarded to the enrichment
or target step.

```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipes from '@aws-cdk/aws-pipes-alpha';
import * as sources from '@aws-cdk/aws-pipes-sources-alpha';
import * as targets from '@aws-cdk/aws-pipes-targets-alpha';

const sourceQueue = new sqs.Queue(stack, 'SourceQueue');
const targetQueue = new sqs.Queue(stack, 'TargetQueue');

const filter = new pipes.Filter(
  [
    pipes.FilterPattern.fromObject({
      body: {
        // only forward events with customerType B2B or B2C
        customerType: ['B2B', 'B2C'] 
      },
    })
  ]
)

const pipe = new Pipe(stack, 'Pipe', {
  source: new sources.Queue(sourceQueue),
  target: new targets.Queue(targetQueue),
  filters: [filter], 
});
```

## Input Transformation

For enrichments and targets the input event can be transformed. The transformation is applied for each item of the batch.
A transformation has access to the input event as well to some context information of the pipe itself like the name of the pipe.

### From object 

The input transformation can be created from an object. The object can contain static values, dynamic values or pipe variables.

```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipes from '@aws-cdk/aws-pipes-alpha';
import * as sources from '@aws-cdk/aws-pipes-sources-alpha';
import * as targets from '@aws-cdk/aws-pipes-targets-alpha';

const sourceQueue = new sqs.Queue(stack, 'SourceQueue');
const targetQueue = new sqs.Queue(stack, 'TargetQueue');

const pipe = new Pipe(stack, 'Pipe', {
  pipeName: 'MyPipe',
  source: new sources.Queue(sourceQueue),
  target: new targets.Queue(targetQueue, {
    inputTransformation: pipes.InputTransformation.fromObject({
      staticField: 'static value',
      dynamicField: pipes.DynamicInput.fromEventPath('$.body.payload'),
      pipeVariable: pipes.PipeVariable.pipeName(),
    }), 
  }),
});
```

The following example shows the input event and the result of the transformation.

```json
[
  {
    ...
    "body": "{\"payload\": \"Test message.\"}",
    ...
  }
]
```

```json
[
  {
    ...
    "staticField": "static value",
    "dynamicField": "Test message.",
    "pipeVariable": "MyPipe",
    ...
  }
]
```

If the transformation is applied to a target it might be converted to a string representation. E.g. the resulting SQS message body looks like this.

```json
[
  {
    ...
    "body": "{\"staticField\": \"static value\", \"dynamicField\": \"Test message.\", \"pipeVariable\": \"MyPipe\"}",
    ...
  }
]
```


### From event path

In cases where you want to forward only a part of the event to the target you can use the transformation event path.

> This only works for targets because the enrichment needs to have a valid json as input. 


```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipes from '@aws-cdk/aws-pipes-alpha';
import * as sources from '@aws-cdk/aws-pipes-sources-alpha';
import * as targets from '@aws-cdk/aws-pipes-targets-alpha';

const sourceQueue = new sqs.Queue(stack, 'SourceQueue');
const targetQueue = new sqs.Queue(stack, 'TargetQueue');

const pipe = new Pipe(stack, 'Pipe', {
  source: new sources.Queue(sourceQueue),
  target: new targets.Queue(targetQueue, {
    inputTransformation: InputTransformation.fromEventPath('$.body.payload'), 
  }),
});
```

This transformation extracts the body of the event.

So when the following batch of input events is processed by the pipe 

```json
 [
  {
    ...
    "body": "\"{\"payload\": \"Test message.\"}\"",
    ...
  }
]
```

it is converted into the following target payload.

```json
[
  {
    ...
    "body": "Test message."
    ...
  }
]
```

> The implicit payload parsing (e.g. SQS message body to JSON) only works if the input is the source payload. Implicit body parsing is not applied on enrichment results.

### From text

In cases where you want to forward a static text to the target or use your own formatted `inputTemplate` you can use the transformation from text.

```ts
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipes from '@aws-cdk/aws-pipes-alpha';
import * as sources from '@aws-cdk/aws-pipes-sources-alpha';
import * as targets from '@aws-cdk/aws-pipes-targets-alpha';

const sourceQueue = new sqs.Queue(stack, 'SourceQueue');
const targetQueue = new sqs.Queue(stack, 'TargetQueue');

const pipe = new Pipe(stack, 'Pipe', {
  source: new sources.Queue(sourceQueue),
  target: new targets.Queue(targetQueue, {
    inputTransformation: InputTransformation.fromText('My static text'), 
  }),
});
```

This transformation forwards the static text to the target.

```json
[
  {
    ...
    "body": "My static text"
    ...
  }
]
```



## Enrichment

In the enrichment step the (un)filtered payloads from the source can be used to
invoke one of the following services

- API destination
- Amazon API Gateway
- Lambda function
- Step Functions state machine
  - only express workflow


## Target

A Target is the end of the Pipe. After the payload from the source is pulled,
filtered and enriched it is forwarded to the target. For now the following
targets are supported:

- [API destination](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-api-destinations.html)
- [API Gateway](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-api-gateway-target.html)
- [Batch job queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html#pipes-targets-specifics-batch)
- [CloudWatch log group](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html#pipes-targets-specifics-cwl)
- [ECS task](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html#pipes-targets-specifics-ecs-task)
- Event bus in the same account and Region
- Firehose delivery stream
- Inspector assessment template
- Kinesis stream
- Lambda function (SYNC or ASYNC)
- Redshift cluster data API queries
- SageMaker Pipeline
- SNS topic
- SQS queue
- Step Functions state machine
  - Express workflows (ASYNC)
  - Standard workflows (SYNC or ASYNC)

The target event can be transformed before it is forwarded to the target using
the same input transformation as in the enrichment step.

