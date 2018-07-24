## AWS CloudTrail Construct Library
Add a CloudTrail construct - for ease of setting up CloudTrail logging in your account

Example usage:

```ts
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const trail = new cloudtrail.CloudTrail(stack, 'CloudTrail');
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

import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const trail = new cloudtrail.CloudTrail(stack, 'CloudTrail', {
    sendToCloudWatchLogs: true
});
```

This creates the same setup as above - but also logs events to a created CloudWatch Log stream. By default, the created log group has a retention period of 365 Days, but this is also configurable.


For using CloudTrail event selector to log specific S3 events, you can use the `CloudTrailProps` configuration object

For example - this logs all ReadWriteEvents for the `magic-bucket` bucket:

```ts
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const trail = new cloudtrail.CloudTrail(stack, 'MyAmazingCloudTrail')

trail.addS3Filter("arn:aws:s3:::magic-bucket/"); // Adds an event selector to the bucket magic-bucket. By default, this includes management events and all operations (Read + Write)

const configuration = { includeManagementEvents = false, readWriteType = ReadWriteType.All };
trail.addS3Filter(["arn:aws:s3:::foo"], configuration ); // Adds an event selector to the bucket foo, with a specific configuration
});
```
