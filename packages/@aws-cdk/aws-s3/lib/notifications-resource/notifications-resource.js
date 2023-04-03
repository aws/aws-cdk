"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketNotifications = void 0;
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const notifications_resource_handler_1 = require("./notifications-resource-handler");
const bucket_1 = require("../bucket");
const destination_1 = require("../destination");
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
class BucketNotifications extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.eventBridgeEnabled = false;
        this.lambdaNotifications = new Array();
        this.queueNotifications = new Array();
        this.topicNotifications = new Array();
        this.bucket = props.bucket;
        this.handlerRole = props.handlerRole;
    }
    /**
     * Adds a notification subscription for this bucket.
     * If this is the first notification, a BucketNotification resource is added to the stack.
     *
     * @param event The type of event
     * @param target The target construct
     * @param filters A set of S3 key filters
     */
    addNotification(event, target, ...filters) {
        const resource = this.createResourceOnce();
        // resolve target. this also provides an opportunity for the target to e.g. update
        // policies to allow this notification to happen.
        const targetProps = target.bind(this, this.bucket);
        const commonConfig = {
            Events: [event],
            Filter: renderFilters(filters),
        };
        // if the target specifies any dependencies, add them to the custom resource.
        // for example, the SNS topic policy must be created /before/ the notification resource.
        // otherwise, S3 won't be able to confirm the subscription.
        if (targetProps.dependencies) {
            resource.node.addDependency(...targetProps.dependencies);
        }
        // based on the target type, add the the correct configurations array
        switch (targetProps.type) {
            case destination_1.BucketNotificationDestinationType.LAMBDA:
                this.lambdaNotifications.push({ ...commonConfig, LambdaFunctionArn: targetProps.arn });
                break;
            case destination_1.BucketNotificationDestinationType.QUEUE:
                this.queueNotifications.push({ ...commonConfig, QueueArn: targetProps.arn });
                break;
            case destination_1.BucketNotificationDestinationType.TOPIC:
                this.topicNotifications.push({ ...commonConfig, TopicArn: targetProps.arn });
                break;
            default:
                throw new Error('Unsupported notification target type:' + destination_1.BucketNotificationDestinationType[targetProps.type]);
        }
    }
    enableEventBridgeNotification() {
        this.createResourceOnce();
        this.eventBridgeEnabled = true;
    }
    renderNotificationConfiguration() {
        return {
            EventBridgeConfiguration: this.eventBridgeEnabled ? {} : undefined,
            LambdaFunctionConfigurations: this.lambdaNotifications.length > 0 ? this.lambdaNotifications : undefined,
            QueueConfigurations: this.queueNotifications.length > 0 ? this.queueNotifications : undefined,
            TopicConfigurations: this.topicNotifications.length > 0 ? this.topicNotifications : undefined,
        };
    }
    /**
     * Defines the bucket notifications resources in the stack only once.
     * This is called lazily as we add notifications, so that if notifications are not added,
     * there is no notifications resource.
     */
    createResourceOnce() {
        if (!this.resource) {
            const handler = notifications_resource_handler_1.NotificationsResourceHandler.singleton(this, {
                role: this.handlerRole,
            });
            const managed = this.bucket instanceof bucket_1.Bucket;
            if (!managed) {
                handler.addToRolePolicy(new iam.PolicyStatement({
                    actions: ['s3:GetBucketNotification'],
                    resources: ['*'],
                }));
            }
            this.resource = new cdk.CfnResource(this, 'Resource', {
                type: 'Custom::S3BucketNotifications',
                properties: {
                    ServiceToken: handler.functionArn,
                    BucketName: this.bucket.bucketName,
                    NotificationConfiguration: cdk.Lazy.any({ produce: () => this.renderNotificationConfiguration() }),
                    Managed: managed,
                },
            });
        }
        return this.resource;
    }
}
exports.BucketNotifications = BucketNotifications;
function renderFilters(filters) {
    if (!filters || filters.length === 0) {
        return undefined;
    }
    const renderedRules = new Array();
    let hasPrefix = false;
    let hasSuffix = false;
    for (const rule of filters) {
        if (!rule.suffix && !rule.prefix) {
            throw new Error('NotificationKeyFilter must specify `prefix` and/or `suffix`');
        }
        if (rule.suffix) {
            if (hasSuffix) {
                throw new Error('Cannot specify more than one suffix rule in a filter.');
            }
            renderedRules.push({ Name: 'suffix', Value: rule.suffix });
            hasSuffix = true;
        }
        if (rule.prefix) {
            if (hasPrefix) {
                throw new Error('Cannot specify more than one prefix rule in a filter.');
            }
            renderedRules.push({ Name: 'prefix', Value: rule.prefix });
            hasPrefix = true;
        }
    }
    return {
        Key: {
            FilterRules: renderedRules,
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9ucy1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbnMtcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQywyQ0FBdUM7QUFDdkMscUZBQWdGO0FBQ2hGLHNDQUE4RTtBQUM5RSxnREFBbUc7QUFjbkc7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBU2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQVRYLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUNsQix3QkFBbUIsR0FBRyxJQUFJLEtBQUssRUFBK0IsQ0FBQztRQUMvRCx1QkFBa0IsR0FBRyxJQUFJLEtBQUssRUFBc0IsQ0FBQztRQUNyRCx1QkFBa0IsR0FBRyxJQUFJLEtBQUssRUFBc0IsQ0FBQztRQU9wRSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0tBQ3RDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGVBQWUsQ0FBQyxLQUFnQixFQUFFLE1BQXNDLEVBQUUsR0FBRyxPQUFnQztRQUNsSCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUzQyxrRkFBa0Y7UUFDbEYsaURBQWlEO1FBQ2pELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxNQUFNLFlBQVksR0FBd0I7WUFDeEMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2YsTUFBTSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUM7U0FDL0IsQ0FBQztRQUVGLDZF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SUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDM0QsU0FBUyxHQUFHLElBQUksQ0FBQztTQUNsQjtLQUNGO0lBRUQsT0FBTztRQUNMLEdBQUcsRUFBRTtZQUNILFdBQVcsRUFBRSxhQUFhO1NBQzNCO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL25vdGlmaWNhdGlvbnMtcmVzb3VyY2UtaGFuZGxlcic7XG5pbXBvcnQgeyBCdWNrZXQsIElCdWNrZXQsIEV2ZW50VHlwZSwgTm90aWZpY2F0aW9uS2V5RmlsdGVyIH0gZnJvbSAnLi4vYnVja2V0JztcbmltcG9ydCB7IEJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uVHlwZSwgSUJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uIH0gZnJvbSAnLi4vZGVzdGluYXRpb24nO1xuXG5pbnRlcmZhY2UgTm90aWZpY2F0aW9uc1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBidWNrZXQgdG8gbWFuYWdlIG5vdGlmaWNhdGlvbnMgZm9yLlxuICAgKi9cbiAgYnVja2V0OiBJQnVja2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byBiZSB1c2VkIGJ5IHRoZSBsYW1iZGEgaGFuZGxlclxuICAgKi9cbiAgaGFuZGxlclJvbGU/OiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogQSBjdXN0b20gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdGhhdCB1cGRhdGVzIGJ1Y2tldCBub3RpZmljYXRpb25zIGZvciBhXG4gKiBidWNrZXQuIFRoZSByZWFzb24gd2UgbmVlZCBpdCBpcyBiZWNhdXNlIHRoZSBBV1M6OlMzOjpCdWNrZXQgbm90aWZpY2F0aW9uXG4gKiBjb25maWd1cmF0aW9uIGlzIGRlZmluZWQgb24gdGhlIGJ1Y2tldCBpdHNlbGYsIHdoaWNoIG1ha2VzIGl0IGltcG9zc2libGUgdG9cbiAqIHByb3Zpc2lvbiBub3RpZmljYXRpb25zIGF0IHRoZSBzYW1lIHRpbWUgYXMgdGhlIHRhcmdldCAoc2luY2VcbiAqIFB1dEJ1Y2tldE5vdGlmaWNhdGlvbnMgdmFsaWRhdGVzIHRoZSB0YXJnZXRzKS5cbiAqXG4gKiBTaW5jZSBvbmx5IGEgc2luZ2xlIEJ1Y2tldE5vdGlmaWNhdGlvbnMgcmVzb3VyY2UgaXMgYWxsb3dlZCBmb3IgZWFjaCBCdWNrZXQsXG4gKiB0aGlzIGNvbnN0cnVjdCBpcyBub3QgZXhwb3J0ZWQgaW4gdGhlIHB1YmxpYyBBUEkgb2YgdGhpcyBtb2R1bGUuIEluc3RlYWQsIGl0XG4gKiBpcyBjcmVhdGVkIGp1c3QtaW4tdGltZSBieSBgczMuQnVja2V0Lm9uRXZlbnRgLCBzbyBhIDE6MSByZWxhdGlvbnNoaXAgaXNcbiAqIGVuc3VyZWQuXG4gKlxuICogQHNlZVxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczMtYnVja2V0LW5vdGlmaWNhdGlvbmNvbmZpZy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBCdWNrZXROb3RpZmljYXRpb25zIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHJpdmF0ZSBldmVudEJyaWRnZUVuYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSByZWFkb25seSBsYW1iZGFOb3RpZmljYXRpb25zID0gbmV3IEFycmF5PExhbWJkYUZ1bmN0aW9uQ29uZmlndXJhdGlvbj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBxdWV1ZU5vdGlmaWNhdGlvbnMgPSBuZXcgQXJyYXk8UXVldWVDb25maWd1cmF0aW9uPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHRvcGljTm90aWZpY2F0aW9ucyA9IG5ldyBBcnJheTxUb3BpY0NvbmZpZ3VyYXRpb24+KCk7XG4gIHByaXZhdGUgcmVzb3VyY2U/OiBjZGsuQ2ZuUmVzb3VyY2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgYnVja2V0OiBJQnVja2V0O1xuICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJSb2xlPzogaWFtLklSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOb3RpZmljYXRpb25zUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMuYnVja2V0ID0gcHJvcHMuYnVja2V0O1xuICAgIHRoaXMuaGFuZGxlclJvbGUgPSBwcm9wcy5oYW5kbGVyUm9sZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbm90aWZpY2F0aW9uIHN1YnNjcmlwdGlvbiBmb3IgdGhpcyBidWNrZXQuXG4gICAqIElmIHRoaXMgaXMgdGhlIGZpcnN0IG5vdGlmaWNhdGlvbiwgYSBCdWNrZXROb3RpZmljYXRpb24gcmVzb3VyY2UgaXMgYWRkZWQgdG8gdGhlIHN0YWNrLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIHR5cGUgb2YgZXZlbnRcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gZmlsdGVycyBBIHNldCBvZiBTMyBrZXkgZmlsdGVyc1xuICAgKi9cbiAgcHVibGljIGFkZE5vdGlmaWNhdGlvbihldmVudDogRXZlbnRUeXBlLCB0YXJnZXQ6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IHRoaXMuY3JlYXRlUmVzb3VyY2VPbmNlKCk7XG5cbiAgICAvLyByZXNvbHZlIHRhcmdldC4gdGhpcyBhbHNvIHByb3ZpZGVzIGFuIG9wcG9ydHVuaXR5IGZvciB0aGUgdGFyZ2V0IHRvIGUuZy4gdXBkYXRlXG4gICAgLy8gcG9saWNpZXMgdG8gYWxsb3cgdGhpcyBub3RpZmljYXRpb24gdG8gaGFwcGVuLlxuICAgIGNvbnN0IHRhcmdldFByb3BzID0gdGFyZ2V0LmJpbmQodGhpcywgdGhpcy5idWNrZXQpO1xuICAgIGNvbnN0IGNvbW1vbkNvbmZpZzogQ29tbW9uQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIEV2ZW50czogW2V2ZW50XSxcbiAgICAgIEZpbHRlcjogcmVuZGVyRmlsdGVycyhmaWx0ZXJzKSxcbiAgICB9O1xuXG4gICAgLy8gaWYgdGhlIHRhcmdldCBzcGVjaWZpZXMgYW55IGRlcGVuZGVuY2llcywgYWRkIHRoZW0gdG8gdGhlIGN1c3RvbSByZXNvdXJjZS5cbiAgICAvLyBmb3IgZXhhbXBsZSwgdGhlIFNOUyB0b3BpYyBwb2xpY3kgbXVzdCBiZSBjcmVhdGVkIC9iZWZvcmUvIHRoZSBub3RpZmljYXRpb24gcmVzb3VyY2UuXG4gICAgLy8gb3RoZXJ3aXNlLCBTMyB3b24ndCBiZSBhYmxlIHRvIGNvbmZpcm0gdGhlIHN1YnNjcmlwdGlvbi5cbiAgICBpZiAodGFyZ2V0UHJvcHMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3koLi4udGFyZ2V0UHJvcHMuZGVwZW5kZW5jaWVzKTtcbiAgICB9XG5cbiAgICAvLyBiYXNlZCBvbiB0aGUgdGFyZ2V0IHR5cGUsIGFkZCB0aGUgdGhlIGNvcnJlY3QgY29uZmlndXJhdGlvbnMgYXJyYXlcbiAgICBzd2l0Y2ggKHRhcmdldFByb3BzLnR5cGUpIHtcbiAgICAgIGNhc2UgQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb25UeXBlLkxBTUJEQTpcbiAgICAgICAgdGhpcy5sYW1iZGFOb3RpZmljYXRpb25zLnB1c2goeyAuLi5jb21tb25Db25maWcsIExhbWJkYUZ1bmN0aW9uQXJuOiB0YXJnZXRQcm9wcy5hcm4gfSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uVHlwZS5RVUVVRTpcbiAgICAgICAgdGhpcy5xdWV1ZU5vdGlmaWNhdGlvbnMucHVzaCh7IC4uLmNvbW1vbkNvbmZpZywgUXVldWVBcm46IHRhcmdldFByb3BzLmFybiB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb25UeXBlLlRPUElDOlxuICAgICAgICB0aGlzLnRvcGljTm90aWZpY2F0aW9ucy5wdXNoKHsgLi4uY29tbW9uQ29uZmlnLCBUb3BpY0FybjogdGFyZ2V0UHJvcHMuYXJuIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBub3RpZmljYXRpb24gdGFyZ2V0IHR5cGU6JyArIEJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uVHlwZVt0YXJnZXRQcm9wcy50eXBlXSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGVuYWJsZUV2ZW50QnJpZGdlTm90aWZpY2F0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlUmVzb3VyY2VPbmNlKCk7XG4gICAgdGhpcy5ldmVudEJyaWRnZUVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RpZmljYXRpb25Db25maWd1cmF0aW9uKCk6IE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBFdmVudEJyaWRnZUNvbmZpZ3VyYXRpb246IHRoaXMuZXZlbnRCcmlkZ2VFbmFibGVkID8ge30gOiB1bmRlZmluZWQsXG4gICAgICBMYW1iZGFGdW5jdGlvbkNvbmZpZ3VyYXRpb25zOiB0aGlzLmxhbWJkYU5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCA/IHRoaXMubGFtYmRhTm90aWZpY2F0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICAgIFF1ZXVlQ29uZmlndXJhdGlvbnM6IHRoaXMucXVldWVOb3RpZmljYXRpb25zLmxlbmd0aCA+IDAgPyB0aGlzLnF1ZXVlTm90aWZpY2F0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICAgIFRvcGljQ29uZmlndXJhdGlvbnM6IHRoaXMudG9waWNOb3RpZmljYXRpb25zLmxlbmd0aCA+IDAgPyB0aGlzLnRvcGljTm90aWZpY2F0aW9ucyA6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIGJ1Y2tldCBub3RpZmljYXRpb25zIHJlc291cmNlcyBpbiB0aGUgc3RhY2sgb25seSBvbmNlLlxuICAgKiBUaGlzIGlzIGNhbGxlZCBsYXppbHkgYXMgd2UgYWRkIG5vdGlmaWNhdGlvbnMsIHNvIHRoYXQgaWYgbm90aWZpY2F0aW9ucyBhcmUgbm90IGFkZGVkLFxuICAgKiB0aGVyZSBpcyBubyBub3RpZmljYXRpb25zIHJlc291cmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVSZXNvdXJjZU9uY2UoKSB7XG4gICAgaWYgKCF0aGlzLnJlc291cmNlKSB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gTm90aWZpY2F0aW9uc1Jlc291cmNlSGFuZGxlci5zaW5nbGV0b24odGhpcywge1xuICAgICAgICByb2xlOiB0aGlzLmhhbmRsZXJSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hbmFnZWQgPSB0aGlzLmJ1Y2tldCBpbnN0YW5jZW9mIEJ1Y2tldDtcblxuICAgICAgaWYgKCFtYW5hZ2VkKSB7XG4gICAgICAgIGhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkdldEJ1Y2tldE5vdGlmaWNhdGlvbiddLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNvdXJjZSA9IG5ldyBjZGsuQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgICB0eXBlOiAnQ3VzdG9tOjpTM0J1Y2tldE5vdGlmaWNhdGlvbnMnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiBoYW5kbGVyLmZ1bmN0aW9uQXJuLFxuICAgICAgICAgIEJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgICAgTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbjogY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25Db25maWd1cmF0aW9uKCkgfSksXG4gICAgICAgICAgTWFuYWdlZDogbWFuYWdlZCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlc291cmNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckZpbHRlcnMoZmlsdGVycz86IE5vdGlmaWNhdGlvbktleUZpbHRlcltdKTogRmlsdGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFmaWx0ZXJzIHx8IGZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHJlbmRlcmVkUnVsZXMgPSBuZXcgQXJyYXk8RmlsdGVyUnVsZT4oKTtcbiAgbGV0IGhhc1ByZWZpeCA9IGZhbHNlO1xuICBsZXQgaGFzU3VmZml4ID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBydWxlIG9mIGZpbHRlcnMpIHtcbiAgICBpZiAoIXJ1bGUuc3VmZml4ICYmICFydWxlLnByZWZpeCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3RpZmljYXRpb25LZXlGaWx0ZXIgbXVzdCBzcGVjaWZ5IGBwcmVmaXhgIGFuZC9vciBgc3VmZml4YCcpO1xuICAgIH1cblxuICAgIGlmIChydWxlLnN1ZmZpeCkge1xuICAgICAgaWYgKGhhc1N1ZmZpeCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IG1vcmUgdGhhbiBvbmUgc3VmZml4IHJ1bGUgaW4gYSBmaWx0ZXIuJyk7XG4gICAgICB9XG4gICAgICByZW5kZXJlZFJ1bGVzLnB1c2goeyBOYW1lOiAnc3VmZml4JywgVmFsdWU6IHJ1bGUuc3VmZml4IH0pO1xuICAgICAgaGFzU3VmZml4ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocnVsZS5wcmVmaXgpIHtcbiAgICAgIGlmIChoYXNQcmVmaXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBtb3JlIHRoYW4gb25lIHByZWZpeCBydWxlIGluIGEgZmlsdGVyLicpO1xuICAgICAgfVxuICAgICAgcmVuZGVyZWRSdWxlcy5wdXNoKHsgTmFtZTogJ3ByZWZpeCcsIFZhbHVlOiBydWxlLnByZWZpeCB9KTtcbiAgICAgIGhhc1ByZWZpeCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBLZXk6IHtcbiAgICAgIEZpbHRlclJ1bGVzOiByZW5kZXJlZFJ1bGVzLFxuICAgIH0sXG4gIH07XG59XG5cbmludGVyZmFjZSBOb3RpZmljYXRpb25Db25maWd1cmF0aW9uIHtcbiAgRXZlbnRCcmlkZ2VDb25maWd1cmF0aW9uPzogRXZlbnRCcmlkZ2VDb25maWd1cmF0aW9uO1xuICBMYW1iZGFGdW5jdGlvbkNvbmZpZ3VyYXRpb25zPzogTGFtYmRhRnVuY3Rpb25Db25maWd1cmF0aW9uW107XG4gIFF1ZXVlQ29uZmlndXJhdGlvbnM/OiBRdWV1ZUNvbmZpZ3VyYXRpb25bXTtcbiAgVG9waWNDb25maWd1cmF0aW9ucz86IFRvcGljQ29uZmlndXJhdGlvbltdO1xufVxuXG5pbnRlcmZhY2UgQ29tbW9uQ29uZmlndXJhdGlvbiB7XG4gIElkPzogc3RyaW5nO1xuICBFdmVudHM6IEV2ZW50VHlwZVtdO1xuICBGaWx0ZXI/OiBGaWx0ZXJcbn1cblxuaW50ZXJmYWNlIEV2ZW50QnJpZGdlQ29uZmlndXJhdGlvbiB7IH1cblxuaW50ZXJmYWNlIExhbWJkYUZ1bmN0aW9uQ29uZmlndXJhdGlvbiBleHRlbmRzIENvbW1vbkNvbmZpZ3VyYXRpb24ge1xuICBMYW1iZGFGdW5jdGlvbkFybjogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUXVldWVDb25maWd1cmF0aW9uIGV4dGVuZHMgQ29tbW9uQ29uZmlndXJhdGlvbiB7XG4gIFF1ZXVlQXJuOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBUb3BpY0NvbmZpZ3VyYXRpb24gZXh0ZW5kcyBDb21tb25Db25maWd1cmF0aW9uIHtcbiAgVG9waWNBcm46IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEZpbHRlclJ1bGUge1xuICBOYW1lOiAncHJlZml4JyB8ICdzdWZmaXgnO1xuICBWYWx1ZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRmlsdGVyIHtcbiAgS2V5OiB7IEZpbHRlclJ1bGVzOiBGaWx0ZXJSdWxlW10gfVxufVxuIl19