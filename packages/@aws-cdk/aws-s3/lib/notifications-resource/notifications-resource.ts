import cdk = require('@aws-cdk/cdk');
import { Bucket, EventType } from '../bucket';
import { BucketNotificationDestinationType, IBucketNotificationDestination } from '../notification-dest';
import { NotificationsResourceHandler } from './notifications-resource-handler';

interface NotificationsProps {
    /**
     * The bucket to manage notifications for.
     *
     * This cannot be a `BucketRef` because the bucket maintains the 1:1
     * relationship with this resource.
     */
    bucket: Bucket;
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
export class BucketNotifications extends cdk.Construct {
    private readonly lambdaNotifications = new Array<LambdaFunctionConfiguration>();
    private readonly queueNotifications = new Array<QueueConfiguration>();
    private readonly topicNotifications = new Array<TopicConfiguration>();
    private customResourceCreated = false;
    private readonly bucket: Bucket;

    constructor(parent: cdk.Construct, id: string, props: NotificationsProps) {
        super(parent, id);
        this.bucket = props.bucket;
    }

    /**
     * Adds a notification subscription for this bucket.
     * If this is the first notification, a BucketNotification resource is added to the stack.
     *
     * @param event The type of event
     * @param target The target construct
     * @param s3KeyFilters A set of S3 key filters
     */
    public addNotification(event: EventType, target: IBucketNotificationDestination, ...s3KeyFilters: string[]) {
        this.createResourceOnce();

        // resolve target. this also provides an opportunity for the target to e.g. update
        // policies to allow this notification to happen.
        const targetProps = target.asBucketNotificationDestination(this.bucket);
        const commonConfig: CommonConfiguration = {
            Events: [ event ],
            Filter: renderFilter(s3KeyFilters),
        };

        // based on the target type, add the the correct configurations array
        switch (targetProps.type) {
            case BucketNotificationDestinationType.Lambda:
                this.lambdaNotifications.push({ ...commonConfig, LambdaFunctionArn: targetProps.arn });
                break;

            case BucketNotificationDestinationType.Queue:
                this.queueNotifications.push({ ...commonConfig, QueueArn: targetProps.arn });
                break;

            case BucketNotificationDestinationType.Topic:
                this.topicNotifications.push({ ...commonConfig, TopicArn: targetProps.arn });
                break;

            default:
                throw new Error('Unsupported notification target type:' + BucketNotificationDestinationType[targetProps.type]);
        }
    }

    private renderNotificationConfiguration(): NotificationConfiguration {
        return {
            LambdaFunctionConfigurations: this.lambdaNotifications.length > 0 ? this.lambdaNotifications : undefined,
            QueueConfigurations: this.queueNotifications.length > 0 ? this.queueNotifications : undefined,
            TopicConfigurations: this.topicNotifications.length > 0 ? this.topicNotifications : undefined
        };
    }

    /**
     * Defines the bucket notifications resources in the stack only once.
     * This is called lazily as we add notifications, so that if notifications are not added,
     * there is no notifications resource.
     */
    private createResourceOnce() {
        if (this.customResourceCreated) {
            return;
        }

        const handlerArn = NotificationsResourceHandler.singleton(this);
        new cdk.Resource(this, 'Resource', {
            type: 'Custom::S3BucketNotifications',
            properties: {
                ServiceToken: handlerArn,
                BucketName: this.bucket.bucketName,
                NotificationConfiguration: new cdk.Token(() => this.renderNotificationConfiguration())
            }
        });

        this.customResourceCreated = true;
    }
}

function renderFilter(rules?: string[]): Filter | undefined {
    if (!rules || rules.length === 0) {
        return undefined;
    }

    const renderedRules = new Array<FilterRule>();

    for (const rule of rules) {
        if (rule.startsWith('*')) {
            renderedRules.push({ Name: 'suffix', Value: rule.substr(1) });
        } else if (rule.endsWith('*')) {
            renderedRules.push({ Name: 'prefix', Value: rule.substr(0, rule.length - 1) });
        } else {
            throw new Error('Rule must either have a "*" prefix or suffix to indicate the rule type: ' + rule);
        }
    }

    return {
        Key: {
            FilterRules: renderedRules
        }
    };
}

interface NotificationConfiguration {
    LambdaFunctionConfigurations?: LambdaFunctionConfiguration[];
    QueueConfigurations?: QueueConfiguration[];
    TopicConfigurations?: TopicConfiguration[];
}

interface CommonConfiguration {
    Id?: string;
    Events: EventType[];
    Filter?: Filter
}

interface LambdaFunctionConfiguration extends CommonConfiguration {
    LambdaFunctionArn: cdk.Arn;
}

interface QueueConfiguration extends CommonConfiguration {
    QueueArn: cdk.Arn;
}

interface TopicConfiguration extends CommonConfiguration {
    TopicArn: cdk.Arn;
}

interface FilterRule {
    Name: 'prefix' | 'suffix';
    Value: string;
}

interface Filter {
    Key: { FilterRules: FilterRule[] }
}
