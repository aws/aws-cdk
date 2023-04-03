import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { IBucket, EventType, NotificationKeyFilter } from '../bucket';
import { IBucketNotificationDestination } from '../destination';
interface NotificationsProps {
    /**
     * The bucket to manage notifications for.
     */
    bucket: IBucket;
    /**
     * The role to be used by the lambda handler
     */
    handlerRole?: iam.IRole;
}
/**
 * A custom CloudFormation resource that updates bucket notifications for a
 * bucket. The reason we need it is because the AWS::S3::Bucket notification
 * configuration is defined on the bucket itself, which makes it impossible to
 * provision notifications at the same time as the target (since
 * PutBucketNotifications validates the targets).
 *
 * Since only a single BucketNotifications resource is allowed for each Bucket,
 * this construct is not exported in the public API of this module. Instead, it
 * is created just-in-time by `s3.Bucket.onEvent`, so a 1:1 relationship is
 * ensured.
 *
 * @see
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html
 */
export declare class BucketNotifications extends Construct {
    private eventBridgeEnabled;
    private readonly lambdaNotifications;
    private readonly queueNotifications;
    private readonly topicNotifications;
    private resource?;
    private readonly bucket;
    private readonly handlerRole?;
    constructor(scope: Construct, id: string, props: NotificationsProps);
    /**
     * Adds a notification subscription for this bucket.
     * If this is the first notification, a BucketNotification resource is added to the stack.
     *
     * @param event The type of event
     * @param target The target construct
     * @param filters A set of S3 key filters
     */
    addNotification(event: EventType, target: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    enableEventBridgeNotification(): void;
    private renderNotificationConfiguration;
    /**
     * Defines the bucket notifications resources in the stack only once.
     * This is called lazily as we add notifications, so that if notifications are not added,
     * there is no notifications resource.
     */
    private createResourceOnce;
}
export {};
