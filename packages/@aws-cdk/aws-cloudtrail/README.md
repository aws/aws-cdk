## AWS CloudTrail Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Add a CloudTrail construct - for ease of setting up CloudTrail logging in your account

Example usage:

```ts
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

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

import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const trail = new cloudtrail.Trail(this, 'CloudTrail', {
  sendToCloudWatchLogs: true
});
```

This creates the same setup as above - but also logs events to a created CloudWatch Log stream.
By default, the created log group has a retention period of 365 Days, but this is also configurable.

For using CloudTrail event selector to log specific S3 events,
you can use the `CloudTrailProps` configuration object.
Example:

```ts
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const trail = new cloudtrail.Trail(this, 'MyAmazingCloudTrail');

// Adds an event selector to the bucket magic-bucket.
// By default, this includes management events and all operations (Read + Write)
trail.addS3EventSelector(["arn:aws:s3:::magic-bucket/"]);

// Adds an event selector to the bucket foo, with a specific configuration
trail.addS3EventSelector(["arn:aws:s3:::foo/"], {
  includeManagementEvents: false,
  readWriteType: ReadWriteType.ALL,
});
```
