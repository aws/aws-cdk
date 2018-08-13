import cdk = require('@aws-cdk/cdk');

/**
 * Implemented by constructs that can be used as bucket notification destinations.
 */
export interface IBucketNotificationDestination {
    /**
     * Registers this resource to receive notifications for the specified
     * bucket. This method will only be called once for each destination/bucket
     * pair and the result will be cached, so there is no need to implement
     * idempotency in each destination.
     * @param bucketArn The ARN of the bucket
     * @param bucketId A unique ID of this bucket in the stack
     */
    asBucketNotificationDestination(bucketArn: cdk.Arn, bucketId: string): BucketNotificationDestinationProps;
}

/**
 * Represents the properties of a notification destination.
 */
export interface BucketNotificationDestinationProps {
    /**
     * The notification type.
     */
    readonly type: BucketNotificationDestinationType;

    /**
     * The ARN of the destination (i.e. Lambda, SNS, SQS).
     */
    readonly arn: cdk.Arn;
}

/**
 * Supported types of notification destinations.
 */
export enum BucketNotificationDestinationType {
    Lambda,
    Queue,
    Topic
}
