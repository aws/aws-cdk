# Amazon Lambda Destinations Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This library provides constructs for adding destinations to a Lambda function.
Destinations can be added by specifying the `onFailure` or `onSuccess` props when creating a function or alias.

## Destinations

The following destinations are supported

* Lambda function
* SQS queue
* SNS topic
* EventBridge event bus

Example with a SNS topic for successful invocations:

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as destinations from '@aws-cdk/aws-lambda-destinations';
import * as sns from '@aws-cdk/aws-sns';

const myTopic = new sns.Topic(this, 'Topic');

const myFn = new lambda.Function(this, 'Fn', {
  // other props
  onSuccess: new destinations.SnsDestination(myTopic)
})
```

See also [Configuring Destinations for Asynchronous Invocation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-async-destinations).

### Invocation record

When a lambda function is configured with a destination, an invocation record is created by the Lambda service
when the lambda function completes. The invocation record contains the details of the function, its context, and
the request and response payloads.

The following example shows the format of the invocation record for a successful invocation:

```json
{
	"version": "1.0",
	"timestamp": "2019-11-24T23:08:25.651Z",
	"requestContext": {
		"requestId": "c2a6f2ae-7dbb-4d22-8782-d0485c9877e2",
		"functionArn": "arn:aws:lambda:sa-east-1:123456789123:function:event-destinations:$LATEST",
		"condition": "Success",
		"approximateInvokeCount": 1
	},
	"requestPayload": {
		"Success": true
	},
	"responseContext": {
		"statusCode": 200,
		"executedVersion": "$LATEST"
	},
	"responsePayload": "<data returned by the function here>"
}
```

In case of failure, the record contains the reason and error object:

```json
{
    "version": "1.0",
    "timestamp": "2019-11-24T21:52:47.333Z",
    "requestContext": {
        "requestId": "8ea123e4-1db7-4aca-ad10-d9ca1234c1fd",
        "functionArn": "arn:aws:lambda:sa-east-1:123456678912:function:event-destinations:$LATEST",
        "condition": "RetriesExhausted",
        "approximateInvokeCount": 3
    },
    "requestPayload": {
        "Success": false
    },
    "responseContext": {
        "statusCode": 200,
        "executedVersion": "$LATEST",
        "functionError": "Handled"
    },
    "responsePayload": {
        "errorMessage": "Failure from event, Success = false, I am failing!",
        "errorType": "Error",
        "stackTrace": [ "exports.handler (/var/task/index.js:18:18)" ]
    }
}
```

#### Destination-specific JSON format

* For SNS/SQS (`SnsDestionation`/`SqsDestination`), the invocation record JSON is passed as the `Message` to the destination.
* For Lambda (`LambdaDestination`), the invocation record JSON is passed as the payload to the function.
* For EventBridge (`EventBridgeDestination`), the invocation record JSON is passed as the `detail` in the PutEvents call.
The value for the event field `source` is `lambda`, and the value for the event field `detail-type`
is either 'Lambda Function Invocation Result - Success' or 'Lambda Function Invocation Result – Failure',
depending on whether the lambda function invocation succeeded or failed. The event field `resource`
contains the function and destination ARNs. See [AWS Events](https://docs.aws.amazon.com/eventbridge/latest/userguide/aws-events.html)
for the different event fields.

### Auto-extract response payload with lambda destination

The `responseOnly` option of `LambdaDestination` allows to auto-extract the response payload from the
invocation record:

```ts
import * as lambda from '@aws-cdk/aws-lambda';
import * as destinations from '@aws-cdk/aws-lambda-destinations';

const destinationFn = new lambda.Function(this, 'Destination', {
  // props
});

const sourceFn = new lambda.Function(this, 'Source', {
  // other props
  onSuccess: new destinations.LambdaDestination(destinationFn, {
    responseOnly: true // auto-extract
  });
})
```

In the above example, `destinationFn` will be invoked with the payload returned by `sourceFn`
(`responsePayload` in the invocation record, not the full record).

When used with `onFailure`, the destination function is invoked with the error object returned
by the source function.

Using the `responseOnly` option allows to easily chain asynchronous Lambda functions without
having to deal with data extraction in the runtime code.
