import cdk = require('@aws-cdk/cdk');
import { Bucket } from './bucket';

/**
 * Implemented by constructs that can be used as bucket notification targets.
 */
export interface INotificationDestination {
    /**
     * Registers this resource to receive notifications for the specified bucket.
     * @param bucket The bucket. Use the `path` of the bucket as a unique ID.
     */
    bucketNotificationDestination(bucket: Bucket): NotificationDestinationProps;
}

/**
 * Represents the properties of a notification target.
 */
export interface NotificationDestinationProps {
    /**
     * The notification type.
     */
    readonly type: NotificationDestinationType;

    /**
     * The ARN of the target.
     */
    readonly arn: cdk.Arn;
}

/**
 * Supported types of notificaiton targets.
 */
export enum NotificationDestinationType {
    Lambda,
    Queue,
    Topic
}
