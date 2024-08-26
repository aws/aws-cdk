import { Construct, IConstruct } from 'constructs';
import { NotificationsResourceHandler } from './notifications-resource-handler';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import { Bucket, IBucket, EventType, NotificationKeyFilter } from '../bucket';
import { BucketNotificationDestinationType, IBucketNotificationDestination } from '../destination';

interface NotificationsProps {
  /**
   * The bucket to manage notifications for.
   */
  bucket: IBucket;

  /**
   * The role to be used by the lambda handler
   */
  handlerRole?: iam.IRole;

  /**
   * Skips notification validation of Amazon SQS, Amazon SNS, and Lambda destinations.
   */
  skipDestinationValidation: boolean;
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
export class BucketNotifications extends Construct {
  private eventBridgeEnabled = false;
  private readonly lambdaNotifications = new Array<LambdaFunctionConfiguration>();
  private readonly queueNotifications = new Array<QueueConfiguration>();
  private readonly topicNotifications = new Array<TopicConfiguration>();
  private resource?: cdk.CfnResource;
  private readonly bucket: IBucket;
  private readonly handlerRole?: iam.IRole;
  private readonly skipDestinationValidation: boolean;

  constructor(scope: Construct, id: string, props: NotificationsProps) {
    super(scope, id);
    this.bucket = props.bucket;
    this.handlerRole = props.handlerRole;
    this.skipDestinationValidation = props.skipDestinationValidation;
  }

  /**
   * Adds a notification subscription for this bucket.
   * If this is the first notification, a BucketNotification resource is added to the stack.
   *
   * @param event The type of event
   * @param target The target construct
   * @param filters A set of S3 key filters
   */
  public addNotification(event: EventType, target: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    const resource = this.createResourceOnce();

    // resolve target. this also provides an opportunity for the target to e.g. update
    // policies to allow this notification to happen.
    const targetProps = target.bind(this, this.bucket);
    const commonConfig: CommonConfiguration = {
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
      case BucketNotificationDestinationType.LAMBDA:
        this.lambdaNotifications.push({ ...commonConfig, LambdaFunctionArn: targetProps.arn });
        break;

      case BucketNotificationDestinationType.QUEUE:
        this.queueNotifications.push({ ...commonConfig, QueueArn: targetProps.arn });
        break;

      case BucketNotificationDestinationType.TOPIC:
        this.topicNotifications.push({ ...commonConfig, TopicArn: targetProps.arn });
        break;

      default:
        throw new Error('Unsupported notification target type:' + BucketNotificationDestinationType[targetProps.type]);
    }
  }

  public enableEventBridgeNotification() {
    this.createResourceOnce();
    this.eventBridgeEnabled = true;
  }

  private renderNotificationConfiguration(): NotificationConfiguration {
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
  private createResourceOnce() {
    if (!this.resource) {
      const handler = NotificationsResourceHandler.singleton(this, {
        role: this.handlerRole,
      });

      let managed = this.bucket instanceof Bucket;

      // We should treat buckets as unmanaged because it will not remove notifications added somewhere else
      // Ading a feature flag to prevent it brings unexpected changes to customers
      // Put it here because we still need to create the permission if it's unmanaged bucket.
      if (cdk.FeatureFlags.of(this).isEnabled(cxapi.S3_KEEP_NOTIFICATION_IN_IMPORTED_BUCKET)) {
        managed = false;
      }

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
          SkipDestinationValidation: this.skipDestinationValidation,
        },
      });

      // Add dependency on bucket policy if it exists to avoid race conditions
      // S3 does not allow calling PutBucketPolicy and PutBucketNotification APIs at the same time
      // See https://github.com/aws/aws-cdk/issues/27600
      // Aspects are used here because bucket policy maybe added to construct after addition of notification resource.
      const bucket = this.bucket;
      const resource = this.resource;
      cdk.Aspects.of(this).add({
        visit(node: IConstruct) {
          if (node === resource && bucket.policy) {
            node.node.addDependency(bucket.policy);
          }
        },
      });
    }

    return this.resource;
  }
}

function renderFilters(filters?: NotificationKeyFilter[]): Filter | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  const renderedRules = new Array<FilterRule>();
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

interface NotificationConfiguration {
  EventBridgeConfiguration?: EventBridgeConfiguration;
  LambdaFunctionConfigurations?: LambdaFunctionConfiguration[];
  QueueConfigurations?: QueueConfiguration[];
  TopicConfigurations?: TopicConfiguration[];
}

interface CommonConfiguration {
  Id?: string;
  Events: EventType[];
  Filter?: Filter;
}

interface EventBridgeConfiguration { }

interface LambdaFunctionConfiguration extends CommonConfiguration {
  LambdaFunctionArn: string;
}

interface QueueConfiguration extends CommonConfiguration {
  QueueArn: string;
}

interface TopicConfiguration extends CommonConfiguration {
  TopicArn: string;
}

interface FilterRule {
  Name: 'prefix' | 'suffix';
  Value: string;
}

interface Filter {
  Key: { FilterRules: FilterRule[] };
}
