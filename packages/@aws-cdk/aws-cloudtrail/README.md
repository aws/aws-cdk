## AWS CloudTrail Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Add a CloudTrail construct - for ease of setting up CloudTrail logging in your account

Example usage:

```ts
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';

const trail = new cloudtrail.Trail(this, 'CloudTrail');
```

You can instantiate the CloudTrail construct with no arguments - this will by default:

 * Create a new S3 Bucket and associated Policy that allows CloudTrail to write to it
 * Create a CloudTrail with the following configuration:
     * Logging Enabled
     * Log file validation enabled
     * Multi Region set to true
     * Global Service Events set to true
     * The created S3 bucket
     * CloudWatch Logging Disabled
     * No SNS configuartion
     * No tags
     * No fixed name

You can override any of these properties using the `CloudTrailProps` configuraiton object.

For example, to log to CloudWatch Logs

```ts

import * as cloudtrail from '@aws-cdk/aws-cloudtrail';

const trail = new cloudtrail.Trail(this, 'CloudTrail', {
  sendToCloudWatchLogs: true
});
```

This creates the same setup as above - but also logs events to a created CloudWatch Log stream.
By default, the created log group has a retention period of 365 Days, but this is also configurable
via the `cloudWatchLogsRetention` property. If you would like to specify the log group explicitly,
use the `cloudwatchLogGroup` property.

For using CloudTrail event selector to log specific S3 events,
you can use the `CloudTrailProps` configuration object.
Example:

```ts
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';

const trail = new cloudtrail.Trail(this, 'MyAmazingCloudTrail');

// Adds an event selector to the bucket magic-bucket.
// By default, this includes management events and all operations (Read + Write)
trail.logAllS3DataEvents();

// Adds an event selector to the bucket foo
trail.addS3EventSelector([{
  bucket: fooBucket // 'fooBucket' is of type s3.IBucket
}]);
```

For using CloudTrail event selector to log events about Lambda
functions, you can use `addLambdaEventSelector`.

```ts
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import * as lambda from '@aws-cdk/aws-lambda';

const trail = new cloudtrail.Trail(this, 'MyAmazingCloudTrail');
const lambdaFunction = new lambda.Function(stack, 'AnAmazingFunction', {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: "hello.handler",
  code: lambda.Code.fromAsset("lambda"),
});

// Add an event selector to log data events for all functions in the account.
trail.logAllLambdaDataEvents();

// Add an event selector to log data events for the provided Lambda functions.
trail.addLambdaEventSelector([lambdaFunction.functionArn]);
```

Using the `Trail.onEvent()` API, an EventBridge rule can be created that gets triggered for
every event logged in CloudTrail.
To only use the events that are of interest, either from a particular service, specific account or
time range, they can be filtered down using the APIs available in `aws-events`. The following code
filters events for S3 from a specific AWS account and triggers a lambda function. See [Events delivered via
CloudTrail](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#events-for-services-not-listed)
to learn more about the event structure for events from CloudTrail.

```ts
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import * as eventTargets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';

const myFunctionHandler = new lambda.Function(this, 'MyFunction', {
  code: lambda.Code.fromAsset('resource/myfunction');
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
});

const eventRule = Trail.onEvent(this, 'MyCloudWatchEvent', {
  target: new eventTargets.LambdaFunction(myFunctionHandler),
});

eventRule.addEventPattern({
  account: '123456789012',
  source: 'aws.s3',
});
```
