import { PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IQueue } from '@aws-cdk/aws-sqs';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnSubscription } from './sns.generated';
import { SubscriptionFilter } from './subscription-filter';
import { ITopic } from './topic-base';

/**
 * Options for creating a new subscription
 */
export interface SubscriptionOptions {
  /**
   * What type of subscription to add.
   */
  readonly protocol: SubscriptionProtocol;

  /**
   * The subscription endpoint.
   *
   * The meaning of this value depends on the value for 'protocol'.
   */
  readonly endpoint: string;

  /**
   * true if raw message delivery is enabled for the subscription. Raw messages are free of JSON formatting and can be
   * sent to HTTP/S and Amazon SQS endpoints. For more information, see GetSubscriptionAttributes in the Amazon Simple
   * Notification Service API Reference.
   *
   * @default false
   */
  readonly rawMessageDelivery?: boolean;

  /**
   * The filter policy.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicy?: SubscriptionFilterPolicy;

  /**
   * The filter policy scope.
   *
   * @default -  Filter applied through message attributes
   */
  readonly filterPolicyScope?: SubscriptionFilterPolicyScope;

  /**
   * The region where the topic resides, in the case of cross-region subscriptions
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
   * @default - the region where the CloudFormation stack is being deployed.
   */
  readonly region?: string;

  /**
   * Queue to be used as dead letter queue.
   * If not passed no dead letter queue is enabled.
   *
   * @default - No dead letter queue enabled.
   */
  readonly deadLetterQueue?: IQueue;

  /**
   * Arn of role allowing access to firehose delivery stream.
   * Required for a firehose subscription protocol.
   * @default - No subscription role is provided
   */
  readonly subscriptionRoleArn?: string;
}
/**
 * Properties for creating a new subscription
 */
export interface SubscriptionProps extends SubscriptionOptions {
  /**
   * The topic to subscribe to.
   */
  readonly topic: ITopic;
}

/**
 * A new subscription.
 *
 * Prefer to use the `ITopic.addSubscription()` methods to create instances of
 * this class.
 */
export class Subscription extends Resource {

  /**
   * The DLQ associated with this subscription if present.
   */
  public readonly deadLetterQueue?: IQueue;

  private readonly filterPolicy?: { [attribute: string]: any[] };

  constructor(scope: Construct, id: string, props: SubscriptionProps) {
    super(scope, id);

    if (props.rawMessageDelivery &&
      [
        SubscriptionProtocol.HTTP,
        SubscriptionProtocol.HTTPS,
        SubscriptionProtocol.SQS,
        SubscriptionProtocol.FIREHOSE,
      ]
        .indexOf(props.protocol) < 0) {
      throw new Error('Raw message delivery can only be enabled for HTTP, HTTPS, SQS, and Firehose subscriptions.');
    }

    if (props.filterPolicy) {
      if (Object.keys(props.filterPolicy).length > 5) {
        throw new Error('A filter policy can have a maximum of 5 attribute names.');
      }
      this.filterPolicy = this.buildFilterPolicy(props.filterPolicy);
    }

    if (props.protocol === SubscriptionProtocol.FIREHOSE && !props.subscriptionRoleArn) {
      throw new Error('Subscription role arn is required field for subscriptions with a firehose protocol.');
    }

    this.deadLetterQueue = this.buildDeadLetterQueue(props);
    new CfnSubscription(this, 'Resource', {
      endpoint: props.endpoint,
      protocol: props.protocol,
      topicArn: props.topic.topicArn,
      rawMessageDelivery: props.rawMessageDelivery,
      filterPolicy: this.filterPolicy,
      filterPolicyScope: props.filterPolicyScope,
      region: props.region,
      redrivePolicy: this.buildDeadLetterConfig(this.deadLetterQueue),
      subscriptionRoleArn: props.subscriptionRoleArn,
    });

  }

  // FIRST OPTION DFS
  private buildFilterPolicy(filterPolicy: any, depth = 1, totalCombinationValues = [1]) {
    Object.entries(filterPolicy).forEach(([key, value]) => {
      if (value instanceof SubscriptionFilter) {
        filterPolicy[key] = value.conditions;
        totalCombinationValues[0] *= value.conditions.length * depth;
      } else {
        return { ...filterPolicy, ...this.buildFilterPolicy(value, depth + 1, totalCombinationValues) };
      }
    });
    if (totalCombinationValues[0] > 100) {
      throw new Error(`The total combination of values (${totalCombinationValues}) must not exceed 100.`);
    }
    return filterPolicy;
  };

  // SECOND OPTION BFS
  // private buildFilterPolicy(policyFilter: SubscriptionFilterPolicy) {
  //   const queue: any = [policyFilter];
  //   let totalCombinationValues = 1;
  //   let depth = 1;
  //   while (queue.length > 0) {
  //     const current = queue.shift();
  //     let levelSize = queue.length;
  //     while (levelSize > 0) {

  //       if (val instanceof SubscriptionFilter) {
  //         totalCombinationValues *= val.conditions.length * depth;
  //         current[key] = val.conditions;
  //       } else {
  //         queue.push(val);
  //       }
  //     }
  //     depth++;
  //   }
  //   if (totalCombinationValues > 100) {
  //     throw new Error(`The total combination of values (${totalCombinationValues}) must not exceed 100.`);
  //   }
  //   return policyFilter;
  // }

  private buildDeadLetterQueue(props: SubscriptionProps) {
    if (!props.deadLetterQueue) {
      return undefined;
    }

    const deadLetterQueue = props.deadLetterQueue;

    deadLetterQueue.addToResourcePolicy(new PolicyStatement({
      resources: [deadLetterQueue.queueArn],
      actions: ['sqs:SendMessage'],
      principals: [new ServicePrincipal('sns.amazonaws.com')],
      conditions: {
        ArnEquals: { 'aws:SourceArn': props.topic.topicArn },
      },
    }));

    return deadLetterQueue;
  }

  private buildDeadLetterConfig(deadLetterQueue?: IQueue) {
    if (deadLetterQueue) {
      return {
        deadLetterTargetArn: deadLetterQueue.queueArn,
      };
    } else {
      return undefined;
    }
  }
}

/**
 * The type of subscription, controlling the type of the endpoint parameter.
 */
export enum SubscriptionProtocol {
  /**
   * JSON-encoded message is POSTED to an HTTP url.
   */
  HTTP = 'http',

  /**
   * JSON-encoded message is POSTed to an HTTPS url.
   */
  HTTPS = 'https',

  /**
   * Notifications are sent via email.
   */
  EMAIL = 'email',

  /**
   * Notifications are JSON-encoded and sent via mail.
   */
  EMAIL_JSON = 'email-json',

  /**
   * Notification is delivered by SMS
   */
  SMS = 'sms',

  /**
   * Notifications are enqueued into an SQS queue.
   */
  SQS = 'sqs',

  /**
   * JSON-encoded notifications are sent to a mobile app endpoint.
   */
  APPLICATION = 'application',

  /**
   * Notifications trigger a Lambda function.
   */
  LAMBDA = 'lambda',

  /**
   * Notifications put records into a firehose delivery stream.
   */
  FIREHOSE = 'firehose'
}

/**
 * The filter policy that allows for nested subscription filter policies. This is accomplished via recursive types.
 */
export interface SubscriptionFilterPolicy {
  [attribute: string]: SubscriptionFilter | SubscriptionFilterPolicy;
}

/**
 * The type of subscription filter policy scope determining what field SNS messages should be filtered by.
 */
export enum SubscriptionFilterPolicyScope {
  /**
   * Filter is applied through the message body
   */
  MESSAGE_BODY = 'MessageBody',
  /**
   * Filter is applied through the message attributes
   */
  MESSAGE_ATTRIBUTES = 'MessageAttributes'
}
