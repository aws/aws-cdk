## S3 Bucket Notifications API

This module includes the API that constructs should implement in order to be
able to be used as destinations for bucket notifications.

To implement the `IBucketNotificationDestination`, a construct should implement
a method `asBucketNotificationDestination(bucketArn, bucketId)` which registers
this resource as a destination for bucket notifications _for the specified
bucket_ and returns the ARN of the destination and it's type.
