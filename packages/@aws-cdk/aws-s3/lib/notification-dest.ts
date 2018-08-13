import cdk = require('@aws-cdk/cdk');
import { Bucket } from './bucket';

/**
 * Implemented by constructs that can be used as bucket notification destinations.
 */
export interface IBucketNotificationDestination {
    /**
     * Registers this resource to receive notifications for the specified bucket.
     * @param bucket The bucket. Use the `path` of the bucket as a unique ID.
     */
    asBucketNotificationDestination(bucket: Bucket): BucketNotificationDestinationProps;
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
