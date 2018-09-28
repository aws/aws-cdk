import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import s3n = require('@aws-cdk/aws-s3-notifications');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { TopicPolicy } from './policy';
import { Subscription, SubscriptionProtocol } from './subscription';

/**
 * Either a new or imported Topic
 */
export abstract class TopicRef extends cdk.Construct implements events.IEventRuleTarget, cloudwatch.IAlarmAction, s3n.IBucketNotificationDestination {
  /**
   * Import a Topic defined elsewhere
   */
  public static import(parent: cdk.Construct, name: string, props: TopicRefProps): TopicRef {
    return new ImportedTopic(parent, name, props);
  }

  public abstract readonly topicArn: string;

  public abstract readonly topicName: string;

  /**
   * Controls automatic creation of policy objects.
   *
   * Set by subclasses.
   */
  protected abstract readonly autoCreatePolicy: boolean;

  private policy?: TopicPolicy;

  /** Buckets permitted to send notifications to this topic */
  private readonly notifyingBuckets = new Set<string>();

  /**
   * Indicates if the resource policy that allows CloudWatch events to publish
   * notifications to this topic have been added.
   */
  private eventRuleTargetPolicyAdded = false;

  /**
   * Export this Topic
   */
  public export(): TopicRefProps {
    return {
      topicArn: new cdk.Output(this, 'TopicArn', { value: this.topicArn }).makeImportValue().toString(),
      topicName: new cdk.Output(this, 'TopicName', { value: this.topicName }).makeImportValue().toString(),
    };
  }

  /**
   * Subscribe some endpoint to this topic
   */
  public subscribe(name: string, endpoint: string, protocol: SubscriptionProtocol) {
    new Subscription(this, name, {
      topic: this,
      endpoint,
      protocol
    });
  }

  /**
   * Defines a subscription from this SNS topic to an SQS queue.
   *
   * The queue resource policy will be updated to allow this SNS topic to send
   * messages to the queue.
   *
   * TODO: change to QueueRef.
   *
   * @param name The subscription name
   * @param queue The target queue
   */
  public subscribeQueue(queue: sqs.QueueRef) {
    const subscriptionName = queue.id + 'Subscription';
    if (this.tryFindChild(subscriptionName)) {
      throw new Error(`A subscription between the topic ${this.id} and the queue ${queue.id} already exists`);
    }

    // we use the queue name as the subscription's. there's no meaning to subscribing
    // the same queue twice on the same topic.
    const sub = new Subscription(this, subscriptionName, {
      topic: this,
      endpoint: queue.queueArn,
      protocol: SubscriptionProtocol.Sqs
    });

    // add a statement to the queue resource policy which allows this topic
    // to send messages to the queue.
    queue.addToResourcePolicy(new cdk.PolicyStatement()
      .addResource(queue.queueArn)
      .addAction('sqs:SendMessage')
      .addServicePrincipal('sns.amazonaws.com')
      .setCondition('ArnEquals', { 'aws:SourceArn': this.topicArn }));

    return sub;
  }

  /**
   * Defines a subscription from this SNS Topic to a Lambda function.
   *
   * The Lambda's resource policy will be updated to allow this topic to
   * invoke the function.
   *
   * @param name A name for the subscription
   * @param lambdaFunction The Lambda function to invoke
   */
  public subscribeLambda(lambdaFunction: lambda.FunctionRef) {
    const subscriptionName = lambdaFunction.id + 'Subscription';

    if (this.tryFindChild(subscriptionName)) {
      throw new Error(`A subscription between the topic ${this.id} and the lambda ${lambdaFunction.id} already exists`);
    }

    const sub = new Subscription(this, subscriptionName, {
      topic: this,
      endpoint: lambdaFunction.functionArn,
      protocol: SubscriptionProtocol.Lambda
    });

    lambdaFunction.addPermission(this.id, {
      sourceArn: this.topicArn,
      principal: new cdk.ServicePrincipal('sns.amazonaws.com'),
    });

    return sub;
  }

  /**
   * Defines a subscription from this SNS topic to an email address.
   *
   * @param name A name for the subscription
   * @param emailAddress The email address to use.
   * @param jsonFormat True if the email content should be in JSON format (default is false).
   */
  public subscribeEmail(name: string, emailAddress: string, options?: EmailSubscriptionOptions) {
    const protocol = (options && options.json ? SubscriptionProtocol.EmailJson : SubscriptionProtocol.Email);

    return new Subscription(this, name, {
      topic: this,
      endpoint: emailAddress,
      protocol
    });
  }

  /**
   * Defines a subscription from this SNS topic to an http:// or https:// URL.
   *
   * @param name A name for the subscription
   * @param url The URL to invoke
   */
  public subscribeUrl(name: string, url: string) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with either http:// or https://');
    }

    const protocol = url.startsWith('https:') ? SubscriptionProtocol.Https : SubscriptionProtocol.Http;

    return new Subscription(this, name, {
      topic: this,
      endpoint: url,
      protocol
    });
  }

  /**
   * Adds a statement to the IAM resource policy associated with this topic.
   *
   * If this topic was created in this stack (`new Topic`), a topic policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the topic is improted (`Topic.import`), then this is a no-op.
   */
  public addToResourcePolicy(statement: cdk.PolicyStatement) {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new TopicPolicy(this, 'Policy', { topics: [ this ] });
    }

    if (this.policy) {
      // statements must be unique, so we use the statement index.
      // potantially SIDs can change as a result of order change, but this should
      // not have an impact on the policy evaluation.
      // https://docs.aws.amazon.com/sns/latest/dg/AccessPolicyLanguage_SpecialInfo.html
      statement.describe(this.policy.document.statementCount.toString());
      this.policy.document.addStatement(statement);
    }
  }

  /**
   * Grant topic publishing permissions to the given identity
   */
  public grantPublish(identity?: iam.IIdentityResource) {
    if (!identity) {
      return;
    }

    identity.addToPolicy(new cdk.PolicyStatement()
      .addResource(this.topicArn)
      .addActions('sns:Publish'));
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SNS topic as a
   * result from a CloudWatch event.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sns-permissions
   */
  public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
    if (!this.eventRuleTargetPolicyAdded) {
      this.addToResourcePolicy(new cdk.PolicyStatement()
        .addAction('sns:Publish')
        .addPrincipal(new cdk.ServicePrincipal('events.amazonaws.com'))
        .addResource(this.topicArn));

      this.eventRuleTargetPolicyAdded = true;
    }

    return {
      id: this.id,
      arn: this.topicArn,
    };
  }

  public get alarmActionArn(): string {
    return this.topicArn;
  }

  /**
   * Construct a Metric object for the current topic for the given metric
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/SNS',
      dimensions: { TopicName: this.topicName },
      metricName,
      ...props
    });
  }

  /**
   * Metric for the size of messages published through this topic
   *
   * @default average over 5 minutes
   */
  public metricPublishSize(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('PublishSize', props);
  }

  /**
   * Metric for the number of messages published through this topic
   *
   * @default sum over 5 minutes
   */
  public metricNumberOfMessagesPublished(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('NumberOfMessagesPublished', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of messages that failed to publish through this topic
   *
   * @default sum over 5 minutes
   */
  public metricNumberOfMessagesFailed(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('NumberOfMessagesFailed', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of messages that were successfully delivered through this topic
   *
   * @default sum over 5 minutes
   */
  public metricNumberOfMessagesDelivered(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('NumberOfMessagesDelivered', { statistic: 'sum', ...props });
  }

  /**
   * Implements the IBucketNotificationDestination interface, allowing topics to be used
   * as bucket notification destinations.
   *
   * @param bucketArn The ARN of the bucket sending the notifications
   * @param bucketId A unique ID of the bucket
   */
  public asBucketNotificationDestination(bucketArn: string, bucketId: string): s3n.BucketNotificationDestinationProps {
    // allow this bucket to sns:publish to this topic (if it doesn't already have a permission)
    if (!this.notifyingBuckets.has(bucketId)) {

      this.addToResourcePolicy(new cdk.PolicyStatement()
        .addServicePrincipal('s3.amazonaws.com')
        .addAction('sns:Publish')
        .addResource(this.topicArn)
        .addCondition('ArnLike', { "aws:SourceArn": bucketArn }));

      this.notifyingBuckets.add(bucketId);
    }

    return {
      arn: this.topicArn,
      type: s3n.BucketNotificationDestinationType.Topic,
      dependencies: [ this.policy! ] // make sure the topic policy resource is created before the notification config
    };
  }
}

/**
 * An imported topic
 */
class ImportedTopic extends TopicRef {
  public readonly topicArn: string;
  public readonly topicName: string;

  protected autoCreatePolicy: boolean = false;

  constructor(parent: cdk.Construct, name: string, props: TopicRefProps) {
    super(parent, name);
    this.topicArn = props.topicArn;
    this.topicName = props.topicName;
  }
}

/**
 * Reference to an external topic.
 */
export interface TopicRefProps {
  topicArn: string;
  topicName: string;
}

/**
 * Options for email subscriptions.
 */
export interface EmailSubscriptionOptions {
  /**
   * Indicates if the full notification JSON should be sent to the email
   * address or just the message text.
   *
   * @default Message text (false)
   */
  json?: boolean
}
