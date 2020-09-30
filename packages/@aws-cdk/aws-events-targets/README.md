# Event Targets for Amazon EventBridge
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This library contains integration classes to send Amazon EventBridge to any
number of supported AWS Services. Instances of these classes should be passed
to the `rule.addTarget()` method.

Currently supported are:

* Start a CodeBuild build
* Start a CodePipeline pipeline
* Run an ECS task
* Invoke a Lambda function
* Publish a message to an SNS topic
* Send a message to an SQS queue
* Start a StepFunctions state machine
* Queue a Batch job
* Make an AWS API call
* Put a record to a Kinesis stream
* Invoke an API Gateway endpoint

See the README of the `@aws-cdk/aws-events` library for more information on
EventBridge.

## Invoke an API Gateway endpoint

Use API Gateway as a target for AWS EventBridge event rules:

```typescript
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

class ExampleStack extends Stack {
  constructor(scope: Construct, name: string, props?: StackProps) {
    super(scope, name, props);

    const exampleEventBridgeRule = new events.Rule(this, 'Rule', {
        description: 'Rule that will target API Gateway when event occurs',
        eventBus: events.EventBus.fromEventBusArn(
          this,
          'EventBus',
          Arn.format(
            {
              service: 'events',
              resource: 'event-bus',
              resourceName: 'ExampleEventBusName',
            },
            this,
          ),
        ),
        eventPattern: {
          source: ['ExampleSource'],
          detailType: ['ExampleDetailType'],
        },
    });

    exampleEventBridgeRule.addTarget(
      new targets.ApiGateway(apigateway.RestApi.fromRestApiId(this, 'RestApi', 'ExampleRestApi'), {
        path: '/v1/*',
        method: 'PUT',
        stage: 'prod',
        input: events.RuleTargetInput.fromObject({
          foo: events.EventField.fromPath('$.detail.bar'),
          timestamp: events.EventField.time,
        }),
        httpParameters: {
          pathParameterValues: ['$.detail.id'],
        },
      }),
    );
  }
}
```
