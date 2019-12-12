## Amazon Lambda Destinations Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


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

Example with a SNS topic for sucessful invocations:

```ts
import lambda = require('@aws-cdk/aws-lambda');
import destinations = require('@aws-cdk/aws-lambda-destinations');
import sns = require('@aws-cdk/aws-sns');

const myTopic = new sns.Topic(this, 'Topic');

const myFn = new lambda.Function(this, 'Fn', {
  // other props
  onSuccess: new destinations.SnsDestionation(myTopic)
})
```

See also [Configuring Destinations for Asynchronous Invocation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-async-destinations).
